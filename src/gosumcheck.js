import { Go } from "./wasm_exec/index.js";
import fs from "node:fs"
import process from "node:process";
import path from "node:path"

const go = new Go();
go.importMeta = import.meta;
go.argv = [process.argv0, ...process.argv.slice(2)];
go.env = process.env;
go.exit = process.exit;
go.fs = fs;
go.process = process;
go.path = path;
const { instance } = await WebAssembly.instantiateStreaming(
   (async () => {
      const url = new URL("../dist/gosumcheck.wasm", import.meta.url);
      if (url.protocol === "file:" && ("process" in globalThis || "Deno" in globalThis)) {
         const { createReadStream } = await import("node:fs");
         const { Readable } = await import("node:stream");
         const { fileURLToPath } = await import("node:url");
         const n = createReadStream(fileURLToPath(url));
         const r = Readable.toWeb(n);
         return new Response(r, {
            headers: {
               "Content-Type": "application/wasm",
            }
         })
      } else {
         return fetch(url);
      }
   })(),
   go.importObject,
);
await go.run(instance);