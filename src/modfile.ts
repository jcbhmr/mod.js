import { exports, fr, type Handle } from "./mod.ts";

export function autoQuote(a: string): string {
    return exports["github.com/jcbhmr/mod.js/modfile.AutoQuote"](a);
}

export function format(a: Handle<"golang.org/x/mod/modfile.(*FileSyntax)">): Uint8Array {
    return exports["github.com/jcbhmr/mod.js/modfile.Format"](a);
}

export function isDirectoryPath(a: string): boolean {
    return exports["github.com/jcbhmr/mod.js/modfile.IsDirectoryPath"](a);
}

export function modulePath(a: Uint8Array): string {
    return exports["github.com/jcbhmr/mod.js/modfile.ModulePath"](a);
}

export function mustQuote(a: string): boolean {
    return exports["github.com/jcbhmr/mod.js/modfile.MustQuote"](a);
}

export class Comment {
    #handle: Handle<"golang.org/x/mod/modfile.(*Comment)">;
    constructor(fields: Partial<{
        start: Handle<"github.com/jcbhmr/mod.js/modfile.Position">,
        token: string,
        suffix: boolean,
    }> = {}) {
        this.#handle = exports["new github.com/jcbhmr/mod.js/modfile.(*Comment)"]();
        fr.register(this, this.#handle);
        if (fields.start !== undefined) {
            this.start = fields.start;
        }
        if (fields.token !== undefined) {
            this.token = fields.token;
        }
        if (fields.suffix !== undefined) {
            this.suffix = fields.suffix;
        }
    }
    get start(): Handle<"github.com/jcbhmr/mod.js/modfile.Position"> {
        return exports["get github.com/jcbhmr/mod.js/modfile.(*Comment).Start"](this.#handle);
    }
    set start(a: Handle<"github.com/jcbhmr/mod.js/modfile.Position">) {
        exports["set github.com/jcbhmr/mod.js/modfile.(*Comment).Start"](this.#handle, a);
    }
    get token(): string {
        return exports["get github.com/jcbhmr/mod.js/modfile.(*Comment).Token"](this.#handle);
    }
    set token(a: string) {
        exports["set github.com/jcbhmr/mod.js/modfile.(*Comment).Token"](this.#handle, a);
    }
    get suffix(): boolean {
        return exports["get github.com/jcbhmr/mod.js/modfile.(*Comment).Suffix"](this.#handle);
    }
    set suffix(a: boolean) {
        exports["set github.com/jcbhmr/mod.js/modfile.(*Comment).Suffix"](this.#handle, a);
    }
}
