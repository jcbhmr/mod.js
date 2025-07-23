import * as note from "./note.ts";
import * as tlog from "./tlog.ts";

/**
 * A ClientOps provides the external operations
 * (file caching, HTTP fetches, and so on) needed by the [Client].
 * The methods must be safe for concurrent use by multiple goroutines.
 */
export interface ClientOps {
    /**
     * ReadRemote reads and returns the content served at the given path
	 * on the remote database server. The path begins with "/lookup" or "/tile/",
	 * and there is no need to parse the path in any way.
	 * It is the implementation's responsibility to turn that path into a full URL
	 * and make the HTTP request. ReadRemote should return an error for
	 * any non-200 HTTP response status.
     */
    readRemote(path: string): Uint8Array | PromiseLike<Uint8Array>;

    // TODO: Doc
    readConfig(file: string): Uint8Array | PromiseLike<Uint8Array>;

    // TODO: Doc
    writeConfig(file: string, old: Uint8Array, new_: Uint8Array): void | PromiseLike<void>;

    // TODO: Doc
    readCache(file: string): Uint8Array | PromiseLike<Uint8Array>;

    // TODO: Doc
    writeCache(file: string, data: Uint8Array): void | PromiseLike<void>;

    // TODO: Doc
    log(msg: string): void;

    securityError(msg: string): void;
}

export const errWriteConflict = new Error("write conflict");

export const errSecurity = new Error("security error: misbehaving server");

let setOps: (c: Client, ops: ClientOps) => void;
export class Client {
    #ops: ClientOps | null = null;
    static {
        setOps = (c: Client, ops: ClientOps) => {
            c.#ops = ops;
        }
    }
    
    #didLookup: boolean = false;
    
    #initOnce: 0 | 1 | 2 = 0;
    #initErr: any | null = null;
    #name: string = "";
    #verifiers: note.Verifiers;
    #tileReader: tileReader;
    #tileHeight: number = 0;
    #nosumdb: string = "";

    #record: Map<any, any> | null = null;
    #tileCache: Map<any, any> | null = null;

    #latestMu: boolean = false;
    #latest: tlog.Tree;
    #latestMsg: Uint8Array | null = null;

    #tileSavedMu: boolean = false;
    #tileSaved: Map<tlog.Tile, boolean> | null = null;

    async #init() {
        if (this.#initOnce === 0) {
            this.#initOnce = 1;
            await this.#initWork();
            this.#initOnce = 2;
        }
        if (this.#initErr != null) {
            throw this.#initErr;
        }
    }

    async #initWork() {
        using _defer1 = {
            [Symbol.dispose]: ()=> {
                if (this.#initErr != null) {
                    this.#initErr = new Error(`initializing sumdb.Client: ${this.#initErr}`)
                }
            }
        }

        this.#tileReader.c = this;
        if (this.#tileHeight === 0) {
            this.#tileHeight = 8;
        }
        this.#tileSaved = new Map<tlog.Tile, boolean>();

        let vkey: Uint8Array;
        try {
            vkey = await this.#ops.readConfig("key");
        } catch (err) {
            this.#initErr = err;
            return;
        }

        let verifier: note.Verifier;
        try {
            verifier = note.newVerifier(new TextDecoder().decode(vkey).trim());
        } catch (err) {
            this.#initErr = err;
            return;
        }
    }
}

export function newClient(ops: ClientOps): Client {
    const c = new Client();
    setOps(c, ops);
    return c;
}
