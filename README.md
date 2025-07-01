# mod.js

📦 `golang.org/x/mod` compiled to JS/WASM

## Installation

```sh
npm install mod@npm:@jcbhmr/mod
```

## Usage

```js
import * as modfile from "mod/modfile";
import * as module from "mod/module";
import * as semver from "mod/semver";
import * as sumdb from "mod/sumdb";
import * as zip from "mod/zip";

console.log(semver.build("v2.1.0+meta") === "+meta");
//=> true
```
