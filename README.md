# mod.js

📦 `golang.org/x/mod` compiled to JS/WASM

## Installation

```sh
npm install mod@npm:@jcbhmr/mod
```

## Usage

- [gosumcheck](#gosumcheck)
- [modfile](#modfile
- [module](#module)
- [semver](#semver)
- [sumdb](#sumdb)
- [zip](#zip)

### `gosumcheck`

_CLI executable_

> Gosumcheck checks a go.sum file against a go.sum database server.
> 
> Usage:
> 
> ```
> gosumcheck [-h H] [-k key] [-u url] [-v] go.sum
> ```
> 
> The -h flag changes the tile height (default 8).
> 
> The -k flag changes the go.sum database server key.
> 
> The -u flag overrides the URL of the server (usually set from the key name).
> 
> The -v flag enables verbose output. In particular, it causes gosumcheck to report the URL and elapsed time for each server request.
> 
> WARNING! WARNING! WARNING!
> 
> Gosumcheck is meant as a proof of concept demo and should not be used in production scripts or continuous integration testing. It does not cache any downloaded information from run to run, making it expensive and also keeping it from detecting server misbehavior or successful HTTPS man-in-the-middle timeline forks.
> 
> To discourage misuse in automated settings, gosumcheck does not set any exit status to report whether any problems were found.

&mdash; [golang.org/x/mod/gosumcheck](https://pkg.go.dev/golang.org/x/mod@v0.26.0/gosumcheck)

The `gosumcheck` command is available as part of this npm package as a native JavaScript reimplementation of the native Go CLI tool. See [Why reimplement it in JavaScript?](#why-reimplement-it-in-javascript) for more info.

### `mod/modfile`

```js
import * as modfile from "mod/modfile";

```

```js
import * as modfile from "mod/modfile";
import * as module from "mod/module";
import * as semver from "mod/semver";
import * as sumdb from "mod/sumdb";
import * as zip from "mod/zip";

console.log(semver.build("v2.1.0+meta") === "+meta");
//=> true
```

## Development

### Why reimplement it in JavaScript?

**Because it's small enough to warrant it.**

The original Go implementation _could_ be embedded as a `GOOS=js` WASM blob but that would balloon the size of this package from a few KB to a few MB. That's not a good trade-off at that size. If the original golang.org/x/mod package were significantly larger and more complex such that it would be impractical to reimplement in JavaScript, then it would make sense to use the original Go implementation as a WASM blob and accept the size overhead.

In this case, the original Go implementation is small enough that it can be reimplemented in JavaScript without _too_ much effort. There's still a lot of effort in the literal line-by-line translation of the original Go code to JavaScript, but it's on the order of a few 10s of files instead of a few 100s of files.
