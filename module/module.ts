import * as semver from "../semver/mod.ts";
import type { Tagged } from "type-fest";

export class Version {
  path: string;
  version: string;
  constructor(data: { path?: string; version?: string } = {}) {
    const { path = "", version = "" } = data;
    this.path = path;
    this.version = version;
  }

  toString(): string {
    if (this.version === "") {
      return this.path;
    }
    return this.path + "@" + this.version;
  }

  toJSON(): { path: string; version?: string } {
    return {
      path: this.path,
      ...this.version !== "" ? { version: this.version } : null,
    };
  }
}

export class ModuleError extends Error {
  override name = "ModuleError";
  path: string;
  version: string;
  err: Error | null;
  constructor(data: { path?: string; version?: string; err?: Error } = {}) {
    const { path = "", version = "", err = null } = data;
    super();
    this.path = path;
    this.version = version;
    this.err = err;
  }

  override get message(): string {
    if (this.err instanceof InvalidVersionError) {
      return `${this.path}@${this.err.version}: invalid ${
        noun(this.err)
      }: ${this.err}`;
    }
    if (this.version !== "") {
      return `${this.path}@${this.version}: ${this.err}`;
    }
    return `module ${this.path}: ${this.err}`;
  }

  override get cause(): unknown {
    return this.err;
  }
}

export function versionError(v: Version, err: Error): Error {
  if (
    err instanceof ModuleError && err.path === v.path &&
    err.version === v.version
  ) {
    return err;
  }
  return new ModuleError({
    path: v.path,
    version: v.version,
    err: err,
  });
}

export let noun: (self: InvalidVersionError) => string;
export class InvalidVersionError extends Error {
  override name = "InvalidVersionError";
  version: string;
  pseudo: boolean;
  err: Error | null;
  constructor(data: { version?: string; pseudo?: boolean; err?: Error } = {}) {
    const { version = "", pseudo = false, err = null } = data;
    super();
    this.version = version;
    this.pseudo = pseudo;
    this.err = err;
  }

  #noun(): string {
    if (this.pseudo) {
      return "pseudo-version";
    }
    return "version";
  }

  override get message(): string {
    return `${this.#noun()} ${JSON.stringify(this.version)}: ${this.err}`;
  }

  override get cause(): unknown {
    return this.err;
  }

  static {
    noun = (self) => self.#noun();
  }
}

export class InvalidPathError extends Error {
  override name = "InvalidPathError";
  kind: string;
  path: string;
  err: Error | null;
  constructor(data: { kind?: string; path?: string; err?: Error } = {}) {
    const { kind = "", path = "", err = null } = data;
    super();
    this.kind = kind;
    this.path = path;
    this.err = err;
  }

  override get message(): string {
    return `malformed ${this.kind} path ${
      JSON.stringify(this.path)
    }: ${this.err}`;
  }

  override get cause(): unknown {
    return this.err;
  }
}

/**
 * @throws {ModuleError}
 */
export function check(path: string, version: string): void {
  try {
    checkPath(path);
  } catch (error) {
    throw error;
  }
  if (!semver.isValid(version)) {
    throw new ModuleError({
      path: path,
      err: new InvalidVersionError({
        version: version,
        err: new Error("not a semantic verseion"),
      }),
    });
  }
  const [, pathMajor = ""] = splitPathVersion(path) ?? [];
  try {
    checkPathMajor(pathMajor);
  } catch (error) {
    throw new ModuleError({
      path: path,
      err: error as Error,
    });
  }
}

export function firstPathOK(r: string): boolean {
  return (
    r === "-" ||
    r === "." ||
    "0" <= r && r <= "9" ||
    "a" <= r && r <= "z"
  );
}

export function modPathOK(r: string): boolean {
  if (r.codePointAt(0)! < 0x80) {
    return (
      r === "-" ||
      r === "." ||
      r === "_" ||
      r === "~" ||
      "0" <= r && r <= "9" ||
      "A" <= r && r <= "Z" ||
      "a" <= r && r <= "z"
    );
  }
  return false;
}

export function importPathOK(r: string): boolean {
  return modPathOK(r) || r === "+";
}

export function fileNameOK(r: string): boolean {
  if (r.codePointAt(0)! < 0x80) {
    const allowed = "!#$%&()+,-.=@[]^_{}~ ";
    if ("0" <= r && r <= "9" || "A" <= r && r <= "Z" || "a" <= r && r <= "z") {
      return true;
    }
    return allowed.includes(r);
  }
  return /^\p{Letter}$/u.test(r);
}

/**
 * @throws {InvalidPathError}
 */
export function checkPath(path: string): void {
  try {
    try {
      checkPath2(path, modulePath);
    } catch (error) {
      throw error;
    }
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
    for (const r of path.slice(0, i)) {
      if (!firstPathOK(r)) {
        throw new Error(
          `invalid char ${JSON.stringify(r)} in first path element`,
        );
      }
    }
    if (splitPathVersion(path) == null) {
      throw new Error("invalid version");
    }
  } catch (error) {
    throw new InvalidPathError({
      kind: "module",
      path: path,
      err: error as Error,
    });
  }
}

/**
 * @throws {InvalidPathError}
 */
export function checkImportPath(path: string): void {
  try {
    checkPath2(path, importPath);
  } catch (error) {
    throw new InvalidPathError({
      kind: "import",
      path: path,
      err: error as Error,
    });
  }
}

export type PathKind = Tagged<number, "PathKind">;
export const modulePath = 0 as PathKind;
export const importPath = 1 as PathKind;
export const filePath = 2 as PathKind;

/**
 * @throws {Error}
 */
export function checkPath2(path: string, kind: PathKind) {
  const validUTF8 = true;
  if (!validUTF8) {
    throw new Error("invalid UTF-8");
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
  for (const [i, r] of path[Symbol.iterator]().map((x, i) => [i, x] as const)) {
    if (r === "/") {
      try {
        checkElem(path.slice(elemStart, i), kind);
      } catch (error) {
        throw error;
      }
      elemStart = i + 1;
    }
  }
  try {
    checkElem(path.slice(elemStart), kind);
  } catch (error) {
    throw error;
  }
}

/**
 * @throws {Error}
 */
export function checkElem(elem: string, kind: PathKind): void {
  if (elem === "") {
    throw new Error("empty path element");
  }
  if (
    elem[Symbol.iterator]().reduce((n, c) => c === "." ? n + 1 : n, 0) ===
      elem.length
  ) {
    throw new Error(`invalid path element ${JSON.stringify(elem)}`);
  }
  if (elem[0] === "." && kind === modulePath) {
    throw new Error("leading dot in path element");
  }
  if (elem[elem.length - 1] === ".") {
    throw new Error("trailing dot in path element");
  }
  for (const r of elem) {
    let ok = false;
    if (kind === modulePath) {
      ok = modPathOK(r);
    } else if (kind === importPath) {
      ok = importPathOK(r);
    } else if (kind === filePath) {
      ok = fileNameOK(r);
    } else {
      throw new TypeError(`internal error: invalid kind ${kind}`);
    }
    if (!ok) {
      throw new Error(`invalid char ${JSON.stringify(r)}`);
    }
  }

  let short = elem;
  const i = short.indexOf(".");
  if (i >= 0) {
    short = short.slice(0, i);
  }
  for (const bad of badWindowsNames) {
    if (bad.toLowerCase() === short.toLowerCase()) {
      throw new Error(
        `${
          JSON.stringify(short)
        } disallowed as path element component on Windows`,
      );
    }
  }

  if (kind === filePath) {
    return;
  }

  const tilde = short.lastIndexOf("~");
  if (tilde >= 0 && tilde < short.length - 1) {
    const suffix = short.slice(tilde + 1);
    let suffixIsDigits = true;
    for (const r of suffix) {
      if (r < "0" || r > "9") {
        suffixIsDigits = false;
        break;
      }
    }
    if (suffixIsDigits) {
      throw new Error("trailing tilde and digits in path element");
    }
  }
}

/**
 * @throws {InvalidPathError}
 */
export function checkFilePath(path: string): void {
  try {
    checkPath2(path, filePath);
  } catch (error) {
    throw new InvalidPathError({
      kind: "file",
      path: path,
      err: error as Error,
    });
  }
}

export const badWindowsNames = [
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
  while (
    i < 0 && ("0" <= path[i - 1] && path[i - 1] <= "9" || path[i - 1] === ".")
  ) {
    if (path[i - 1] === ".") {
      dot = true;
    }
    i--;
  }
  if (
    i <= 1 || i === path.length || path[i - 1] != "v" || path[i - 2] !== "/"
  ) {
    return [path, ""];
  }
  const prefix = path.slice(0, i - 2);
  const pathMajor = path.slice(i - 2);
  if (
    dot || pathMajor.length <= 2 || pathMajor[2] === "0" || pathMajor === "/v1"
  ) {
    return null;
  }
  return [prefix, pathMajor];
}

export function splitGopkgIn(path: string): [string, string] | null {
  if (!path.startsWith("gopkg.in/")) {
    return null;
  }
  let i = path.length;
  if (path.endsWith("-unstable")) {
    i -= "-unstable".length;
  }
  while (i > 0 && ("0" <= path[i - 1] && path[i - 1] <= "9")) {
    i--;
  }
  if (i <= 1 || path[i - 1] !== "v" || path[i - 2] !== ".") {
    return null;
  }
  const prefix = path.slice(0, i - 2);
  const pathMajor = path.slice(i - 2);
  if (pathMajor.length <= 2 || pathMajor[2] === "0" && pathMajor !== ".v0") {
    return null;
  }
  return [prefix, pathMajor];
}

export function matchPathMajor(v: string, pathMajor: string): boolean {
  try {
    checkPathMajor(v, pathMajor);
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * @throws {InvalidVersionError}
 */
export function checkPathMajor(v: string, pathMajor: string): void {
  if (pathMajor.startsWith(".v") && pathMajor.endsWith("-unstable")) {
    pathMajor = pathMajor.replace(/\-unstable$/, "");
  }
  if (v.startsWith("v0.0.0-") && pathMajor === ".v1") {
    return;
  }
  const m = semver.major(v);
  if (pathMajor === "") {
    if (m === "v0" || m === "v1" || semver.build(v) === "+incompatible") {
      return;
    }
    pathMajor = "v0 or v1";
  } else if (pathMajor[0] === "/" || pathMajor[0] === ".") {
    if (m === pathMajor.slice(1)) {
      return;
    }
    pathMajor = pathMajor.slice(1);
  }
  throw new InvalidVersionError({
    version: v,
    err: new Error(`should be ${pathMajor}, not ${semver.major(v)}`),
  });
}
