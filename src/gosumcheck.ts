#!/usr/bin/env node
import { parseArgs } from "node:util";
import process from "node:process";
import assert from "node:assert/strict";
import { $ } from "execa";
import { readFile } from "node:fs/promises";
import * as sumdb from "./sumdb/index.ts";

function usage() {
  console.error("usage: gosumcheck [-h H] [-k key] [-u url] [-v] go.sum...");
  process.exit(1);
}

let height: number;
let vkey: string;
let url: string;
let vflag: boolean;

let args: string[];
function parse() {
  try {
    const { values, positionals } = parseArgs({
      options: {
        h: {
          type: "string",
          short: "h",
          default: (8).toString(),
          description: "tile height",
        },
        k: {
          type: "string",
          short: "k",
          default:
            "sum.golang.org+033de0ae+Ac4zctda0e5eza+HJyk9SxEdh+s3Ux18htTTAD8OuAn8",
          description: "key",
        },
        u: {
          type: "string",
          short: "u",
          default: "",
          description: "url to server (overriding name)",
        },
        v: {
          type: "boolean",
          short: "v",
          default: false,
          description: "enable verbose output",
        },
      },
    });
    height = Number.parseInt(values.h, 10);
    assert(Number.isSafeInteger(height), `${values.h} is not a safe integer`);
    vkey = values.k;
    url = values.u;
    vflag = values.v;
    args = positionals;
  } catch (error) {
    console.error(`${error}`);
    usage();
  }
}

async function checkGoSum(client: any, name: string, data: Uint8Array) {
  let lines = new TextDecoder().decode(data).split("\n");
  if (lines[lines.length - 1] !== "") {
    console.error("error: missing final newline");
    return;
  }
  lines = lines.slice(0, -1);

  const errs = new Array<string>(lines.length).fill("");
  await Promise.all(
    lines.map(async (line, i) => {
      const f = line.split(/\s+/g);
      if (f.length !== 3) {
        errs[i] = "invalid number of fields";
        return;
      }

      let dbLines: string[];
      try {
        dbLines = await client.lookup(f[0], f[1]);
      } catch (error) {
        if (error === sumdb.errGONOSUMDB) {
          errs[i] = `${f[0]}@${f[1]}: ${error}`;
        } else {
          errs[i] = `${error}`;
        }
        return;
      }
      const hashAlgPrefix =
        f[0] + " " + f[1] + " " + f[2].slice(0, f[2].indexOf(":") + 1);
      for (const dbLine of dbLines) {
        if (dbLine === line) {
          return;
        }
        if (dbLine.startsWith(hashAlgPrefix)) {
          errs[
            i
          ] = `${f[0]}@${f[1]} hash mismatch: have ${line}, want ${dbLine}`;
          return;
        }
      }
      errs[i] = `${f[0]}@${
        f[1]
      } hash algorithm mismatch: have ${line}, want one of:\n\t${dbLines.join(
        "\n\t"
      )}`;
    })
  );

  for (const [i, err] of errs.entries()) {
    if (err !== "") {
      console.log("%s:%d: %s\n", name, i + 1, err);
    }
  }
}

class ClientOps {
  async readConfig(file: string): Promise<Uint8Array> {
    if (file === "key") {
      return new TextEncoder().encode(vkey);
    }
    if (file.endsWith("/latest")) {
      return new Uint8Array();
    }
    throw new Error(`unknown config ${file}`);
  }

  async writeConfig(
    file: string,
    old: Uint8Array,
    new_: Uint8Array
  ): Promise<void> {}

  async readCache(file: string): Promise<Uint8Array> {
    throw new Error("no cache");
  }

  async writeCache(file: string, data: Uint8Array): Promise<void> {}

  log(msg: string) {
    console.error(msg);
  }

  securityError(msg: string) {
    console.error(msg);
    process.exit(1);
  }

  async readRemote(path: string): Promise<Uint8Array> {
    let name = vkey;
    {
      const i = name.indexOf("+");
      if (i >= 0) {
        name = name.slice(0, i);
      }
    }
    const start = performance.now();
    let target = "https://" + name + path;
    if (url !== "") {
      target = url + path;
    }
    const response = await fetch(target);
    if (response.status !== 200) {
      throw new Error(`GET ${target}: ${response.status}`);
    }
    const data = await new Response(limitReader(response.body ?? new ReadableStream(), 1 << 20)).bytes();
    if (vflag) {
        console.error("%.3fs %s", (performance.now() - start) / 1000, target);
    }
    return data;
  }
}

function limitReader(readable: ReadableStream<Uint8Array>, limit: number): ReadableStream<Uint8Array> {
    let n = 0;
    let reader: ReadableStreamDefaultReader<Uint8Array>;
    return new ReadableStream({
        start(controller) {
            reader = readable.getReader();
        },
        async pull(controller) {
            if (n >= limit) {
                controller.close();
                await reader.cancel();
                return;
            }
            const { done, value } = await reader.read();
            if (done) {
                controller.close();
                await reader.cancel();
                return;
            }
            if (n + value.length > limit) {
                controller.enqueue(value.slice(0, limit - n));
            } else {
                controller.enqueue(value);
            }
            n += value.length;
            if (n >= limit) {
                controller.close();
                await reader.cancel();
            }
        },
        async cancel() {
            await reader.cancel();
        }
    })
}

// main

parse();
if (args.length < 1) {
  usage();
}

const client = sumdb.newClient(new ClientOps());

let env = process.env.GONOSUMDB ?? "";
if (env === "") {
  const result = await $({ reject: false, all: true })`go env GONOSUMDB`;
  if (result.failed || result.exitCode) {
    console.error("go env GONOSUMDB: %s\n%s", result, result.all);
    process.exit(1);
  }
  env = result.stdout.trim();
}
client.setGONOSUMDB(env);

for (const arg of args) {
  let data: Uint8Array;
  try {
    const buffer = await readFile(arg);
    data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
  await checkGoSum(client, arg, data);
}
