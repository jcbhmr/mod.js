import * as semver from "./semver.ts";

export class Version {
  path: string = "";
  version: string = "";

  toJSON() {
    return {
      path: this.path,
      ...(this.version ? { version: this.version } : null),
    };
  }

  toString() {
    if (this.version === "") {
      return this.path;
    }
    return this.path + "@" + this.version;
  }
}

export class ModuleError extends Error {
  name = "ModuleError";
  path: string = "";
  version: string = "";
  err: any;
  constructor() {
    super();
  }

  get message() {
    if (this.err instanceof InvalidVersionError) {
      return `${this.path}@${
        this.err.version
      }: invalid ${invalidVersionErrorNoun(this.err)}: ${this.err}`;
    }
    if (this.version !== "") {
      return `${this.path}@${this.version}: ${this.err}`;
    }
    return `module ${this.path}: ${this.err}`;
  }

  get cause() {
    return this.err;
  }
}

export function versionError(v: Version, err: unknown): Error {
  if (
    err instanceof ModuleError &&
    err.path === v.path &&
    err.version === v.version
  ) {
    return err;
  }
  return Object.assign(new ModuleError(), {
    path: v.path,
    version: v.version,
    err,
  });
}

let invalidVersionErrorNoun: (err: InvalidVersionError) => string;
export class InvalidVersionError extends Error {
  name = "InvalidVersionError";
  version: string = "";
  pseudo: boolean = false;
  err: any;
  constructor() {
    super();
  }

  #noun(): string {
    if (this.pseudo) {
      return "pseudo-version";
    }
    return "version";
  }

  static {
    invalidVersionErrorNoun = (err: InvalidVersionError) => err.#noun();
  }

  get message() {
    return `${this.#noun()} ${JSON.stringify(this.version)} invalid: ${
      this.err
    }`;
  }

  get cause() {
    return this.err;
  }
}

export class InvalidPathError extends Error {
  name = "InvalidPathError";
  kind: string = "";
  path: string = "";
  err: any;
  constructor() {
    super();
  }

  get message() {
    return `malformed ${this.kind} path ${JSON.stringify(this.path)}: ${
      this.err
    }`;
  }

  get cause() {
    return this.err;
  }
}

export function check(path: string, version: string) {
  checkPath(path);
  if (!semver.isValid(version)) {
    return Object.assign(new ModuleError(), {
      path,
      err: Object.assign(new InvalidVersionError(), {
        version,
        err: new Error("not a semantic version"),
      }),
    });
  }
  const [, pathMajor] = splitPathVersion(path) ?? [, ""];
  try {
    checkPathMajor(version, pathMajor);
  } catch (err) {
    throw Object.assign(new ModuleError(), { path, err });
  }
}

function firstPathOK(r: number): boolean {
  return (
    r === "-".codePointAt(0) ||
    r === ".".codePointAt(0) ||
    ("0".codePointAt(0) <= r && r <= "9".codePointAt(0)) ||
    ("a".codePointAt(0) <= r && r <= "z".codePointAt(0))
  );
}

function modPathOK(r: number): boolean {
  if (r < 0x80) {
    return (
      r === "-".codePointAt(0) ||
      r === ".".codePointAt(0) ||
      r === "_".codePointAt(0) ||
      r === "~".codePointAt(0) ||
      ("0".codePointAt(0) <= r && r <= "9".codePointAt(0)) ||
      ("A".codePointAt(0) <= r && r <= "Z".codePointAt(0)) ||
      ("a".codePointAt(0) <= r && r <= "z".codePointAt(0))
    );
  }
  return false;
}

function importPathOK(r: number): boolean {
  return modPathOK(r) || r === "+".codePointAt(0);
}

function fileNameOK(r: number): boolean {
  if (r < 0x80) {
    const allowed = "!#$%&()+,-.=@[]^_{}~ ";
    if (
      ("0".codePointAt(0) <= r && r <= "9".codePointAt(0)) ||
      ("A".codePointAt(0) <= r && r <= "Z".codePointAt(0)) ||
      ("a".codePointAt(0) <= r && r <= "z".codePointAt(0))
    ) {
      return true;
    }
    return allowed.includes(String.fromCodePoint(r));
  }
  return /\p{L}/u.test(String.fromCodePoint(r));
}

export function checkPath(path: string) {
  try {
    checkPath2(path, modulePath);

    let i = path.indexOf("/");
    if (i < 0) {
      i = path.length;
    }
    if (i === 0) {
      throw new Error("leading slash");
    }
    if (!path.slice(0, i).includes(".")) {
      throw new Error("missing dot in first path element");
    }
    if (path[0] === "-") {
      throw new Error("leading dash in first path element");
    }
    for (const rString of path.slice(0, i)) {
      const r = rString.codePointAt(0);
      if (!firstPathOK(r)) {
        throw new Error(
          `invalid char ${JSON.stringify(
            String.fromCodePoint(r)
          )} in first path element`
        );
      }
    }
    if (splitPathVersion(path) == null) {
      throw new Error("invalid version");
    }
  } catch (err) {
    throw Object.assign(new InvalidPathError(), {
      kind: "module",
      path,
      err,
    });
  }
}

export function checkImportPath(path: string) {
  try {
    checkPath2(path, importPath);
  } catch (err) {
    throw Object.assign(new InvalidPathError(), {
      kind: "import",
      path,
      err,
    });
  }
}

type PathKind = number;
const modulePath: PathKind = 0;
const importPath: PathKind = 1;
const filePath: PathKind = 2;

function checkPath2(path: string, kind: PathKind) {
  if (!path.isWellFormed()) {
    throw new Error("path is not well-formed");
  }
  if (path === "") {
    throw new Error("empty string");
  }
  if (path[0] === "-" && kind !== filePath) {
    throw new Error("leading dash");
  }
  if (path.includes("//")) {
    throw new Error("double slash");
  }
  if (path[path.length - 1] === "/") {
    throw new Error("trailing slash");
  }
  let elemStart = 0;
  for (const [i, rString] of [...path].entries()) {
    const r = rString.codePointAt(0);
    if (r === "/".codePointAt(0)) {
      checkElem(path.slice(elemStart, i), kind);
    }
    elemStart = i + 1;
  }
  checkElem(path.slice(elemStart), kind);
}

function checkElem(elem: string, kind: PathKind) {
  if (elem === "") {
    throw new Error("empty path element");
  }
  if ([...elem].reduce((acc, r) => acc + +(r === "."), 0) === elem.length) {
    throw new Error(`invalid path element ${JSON.stringify(elem)}`);
  }
  if (elem[0] === "." && kind === modulePath) {
    throw new Error("leading dot in path element");
  }
  if (elem[elem.length - 1] === ".") {
    throw new Error("trailing dot in path element");
  }
  for (const rString of elem) {
    const r = rString.codePointAt(0);
    let ok = false;
    switch (kind) {
      case modulePath:
        ok = modPathOK(r);
        break;
      case importPath:
        ok = importPathOK(r);
        break;
      case filePath:
        ok = fileNameOK(r);
        break;
      default:
        throw new Error(`internal error: invalid kind ${JSON.stringify(kind)}`);
    }
    if (!ok) {
      throw new Error(
        `invalid char ${JSON.stringify(String.fromCodePoint(r))}`
      );
    }
  }

  let short = elem;
  {
    const i = short.indexOf(".");
    if (i >= 0) {
      short = short.slice(0, i);
    }
  }
  for (const bad of badWindowsNames) {
    if (bad.toUpperCase() === short.toUpperCase()) {
      throw new Error(
        `${JSON.stringify(
          short
        )} disallowed as path element component on Windows`
      );
    }
  }

  if (kind === filePath) {
    return;
  }

  {
    const tilde = short.lastIndexOf("~");
    if (tilde >= 0 && tilde < short.length - 1) {
      const suffix = short.slice(tilde + 1);
      let suffixIsDigits = true;
      for (const rString of suffix) {
        const r = rString.codePointAt(0);
        if (r < "0".codePointAt(0) || r > "9".codePointAt(0)) {
          suffixIsDigits = false;
          break;
        }
      }
      if (suffixIsDigits) {
        throw new Error("trailing tilde and digits in path element");
      }
    }
  }
}

export function checkFilePath(path: string) {
  try {
    checkPath2(path, filePath);
  } catch (err) {
    throw Object.assign(new InvalidPathError(), {
      kind: "file",
      path,
      err,
    });
  }
}

const badWindowsNames = [
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9",
];

export function splitPathVersion(path: string): [string, string] | null {
  if (path.startsWith("gopkg.in/")) {
    return splitGopkgIn(path);
  }

  let i = path.length;
  let dot = false;
  while (i > 0 && ("0".codePointAt(0) <= path.codePointAt(i - 1) && path.codePointAt(i - 1) <= "9".codePointAt(0) || path.codePointAt(i - 1) === ".".codePointAt(0))) {
    if (path.codePointAt(i - 1) === ".".codePointAt(0)) {
      dot = true;
    }
    i--;
  }
  if (i <= 1 || i === path.length || path.codePointAt(i - 1) !== "v".codePointAt(0) || path.codePointAt(i - 2) !== "/".codePointAt(0)) {
    return [path, ""];
  }
  const prefix = path.slice(0, i - 2);
  const version = path.slice(i - 2);
}
