import { Go } from "./wasm_exec/index.js"
import fs from "node:fs"
import process from "node:process";
import path from "node:path"

export const go = new Go();
go.importMeta = import.meta;
go.argv = [process.argv0, ...process.argv.slice(2)];
go.env = process.env;
go.exit = (code) => {
    throw Object.assign(new Error(`exit ${code}`), { exitCode: code });
};
go.fs = fs;
// TODO: getuid on Windows?
// @ts-ignore
go.process = process;
go.path = path;
export const { instance } = await WebAssembly.instantiateStreaming(
    (async () => {
        const url = new URL("../dist/mod.wasm", import.meta.url);
        if (url.protocol === "file:" && ("process" in globalThis || "Deno" in globalThis)) {
            const { createReadStream } = await import("node:fs");
            const { Readable } = await import("node:stream");
            const { fileURLToPath } = await import("node:url");
            const n = createReadStream(fileURLToPath(url));
            const r = Readable.toWeb(n) as ReadableStream<Uint8Array>;
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
export type Handle<T extends string = string> = number;
export const exports = await go.initLib(instance) as {
    "github.com/jcbhmr/mod.js/internal/jshandle.Release"(a: Handle): void;

    "get github.com/jcbhmr/mod.js/modfile.GoVersionRE"(): Handle<"golang.org/x/mod/internal/lazyregexp.(*Regexp)">;
    "get github.com/jcbhmr/mod.js/modfile.ToolchainRE"(): Handle<"golang.org/x/mod/internal/lazyregexp.(*Regexp)">;
    "github.com/jcbhmr/mod.js/modfile.AutoQuote"(a: string): string;
    "github.com/jcbhmr/mod.js/modfile.Format"(a: Handle<"golang.org/x/mod/modfile.(*FileSyntax)">): Uint8Array;
    "github.com/jcbhmr/mod.js/modfile.IsDirectoryPath"(a: string): boolean;
    "github.com/jcbhmr/mod.js/modfile.ModulePath"(a: Uint8Array): string;
    "github.com/jcbhmr/mod.js/modfile.MustQuote"(a: string): boolean;
    "new github.com/jcbhmr/mod.js/modfile.(*Comment)"(): Handle<"golang.org/x/mod/modfile.(*Comment)">;
    "get github.com/jcbhmr/mod.js/modfile.(*Comment).Start"(a: Handle<"golang.org/x/mod/modfile.(*Comment)">): Handle<"github.com/jcbhmr/mod.js/modfile.Position">;
    "set github.com/jcbhmr/mod.js/modfile.(*Comment).Start"(a: Handle<"golang.org/x/mod/modfile.(*Comment)">, b: Handle<"github.com/jcbhmr/mod.js/modfile.Position">): void;
    "get github.com/jcbhmr/mod.js/modfile.(*Comment).Token"(a: Handle<"golang.org/x/mod/modfile.(*Comment)">): string;
    "set github.com/jcbhmr/mod.js/modfile.(*Comment).Token"(a: Handle<"golang.org/x/mod/modfile.(*Comment)">, b: string): void;
    "get github.com/jcbhmr/mod.js/modfile.(*Comment).Suffix"(a: Handle<"golang.org/x/mod/modfile.(*Comment)">): boolean;
    "set github.com/jcbhmr/mod.js/modfile.(*Comment).Suffix"(a: Handle<"golang.org/x/mod/modfile.(*Comment)">, b: boolean): void;
}
export const fr = new FinalizationRegistry<Handle>(h => {
    exports["github.com/jcbhmr/mod.js/internal/jshandle.Release"](h);
})