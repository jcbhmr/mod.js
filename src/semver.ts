/**
 * @module
 *
 * Package semver implements comparison of semantic version strings.
 * In this package, semantic version strings must begin with a leading "v",
 * as in "v1.0.0".
 *
 * The general form of a semantic version string accepted by this package is
 *
 *	vMAJOR[.MINOR[.PATCH[-PRERELEASE][+BUILD]]]
 *
 * where square brackets indicate optional parts of the syntax;
 * MAJOR, MINOR, and PATCH are decimal integers without extra leading zeros;
 * PRERELEASE and BUILD are each a series of non-empty dot-separated identifiers
 * using only alphanumeric characters and hyphens; and
 * all-numeric PRERELEASE identifiers must not have leading zeros.
 *
 * This package follows Semantic Versioning 2.0.0 (see semver.org)
 * with two exceptions. First, it requires the "v" prefix. Second, it recognizes
 * vMAJOR and vMAJOR.MINOR (with no prerelease or build suffixes)
 * as shorthands for vMAJOR.0.0 and vMAJOR.MINOR.0.
 */

/**
 * parsed returns the parsed form of a semantic version string.
 */
interface Parsed {
  major: string;
  minor: string;
  patch: string;
  short: string;
  prerelease: string;
  build: string;
}

/**
 * isValid reports whether v is a valid semantic version string.
 */
export function isValid(v: string): boolean {
  const x = parse(v);
  return x != null;
}

/**
 * canonical returns the canonical formatting of the semantic version v.
 * It fills in any missing .MINOR or .PATCH and discards build metadata.
 * Two semantic versions compare equal only if their canonical formattings
 * are identical strings.
 * The canonical invalid semantic version is the empty string.
 */
export function canonical(v: string): string {
  const p = parse(v);
  if (p == null) {
    return "";
  }
  if (p.build !== "") {
    return v.slice(0, v.length - p.build.length);
  }
  if (p.short !== "") {
    return v + p.short;
  }
  return v;
}

/**
 * Major returns the major version prefix of the semantic version v.
 * For example, Major("v2.1.0") == "v2".
 * If v is an invalid semantic version string, Major returns the empty string.
 */
export function major(v: string): string {
  const pv = parse(v);
  if (pv == null) {
    return "";
  }
  return v.slice(0, 1 + pv.major.length);
}

/**
 * MajorMinor returns the major.minor version prefix of the semantic version v.
 * For example, MajorMinor("v2.1.0") == "v2.1".
 * If v is an invalid semantic version string, MajorMinor returns the empty string.
 */
export function majorMinor(v: string): string {
  const pv = parse(v);
  if (pv == null) {
    return "";
  }
  const i = 1 + pv.major.length;
  const j = i + 1 + pv.minor.length;
  if (j <= v.length && v[i] === "." && v.slice(i + 1, j) === pv.minor) {
    return v.slice(0, j);
  }
  return v.slice(0, i) + "." + pv.minor;
}

/**
 * Prerelease returns the prerelease suffix of the semantic version v.
 * For example, Prerelease("v2.1.0-pre+meta") == "-pre".
 * If v is an invalid semantic version string, Prerelease returns the empty string.
 */
export function prerelease(v: string): string {
  const pv = parse(v);
  if (pv == null) {
    return "";
  }
  return pv.prerelease;
}

/**
 * Build returns the build suffix of the semantic version v.
 * For example, Build("v2.1.0+meta") == "+meta".
 * If v is an invalid semantic version string, Build returns the empty string.
 */
export function build(v: string): string {
  const pv = parse(v);
  if (pv == null) {
    return "";
  }
  return pv.build;
}

/**
 * Compare returns an integer comparing two versions according to
 * semantic version precedence.
 * The result will be 0 if v == w, -1 if v < w, or +1 if v > w.
 *
 * An invalid semantic version string is considered less than a valid one.
 * All invalid semantic version strings compare equal to each other.
 */
export function compare(v: string, w: string): number {
  const pv = parse(v);
  const pw = parse(w);
  if (pv == null && pw == null) {
    return 0;
  }
  if (pv == null) {
    return -1;
  }
  if (pw == null) {
    return 1;
  }
  let c: number;
  if ((c = compareInt(pv.major, pw.major)) !== 0) {
    return c;
  }
  if ((c = compareInt(pv.minor, pw.minor)) !== 0) {
    return c;
  }
  if ((c = compareInt(pv.patch, pw.patch)) !== 0) {
    return c;
  }
  return comparePrerelease(pv.prerelease, pw.prerelease);
}

/**
 * Max canonicalizes its arguments and then returns the version string
 * that compares greater.
 *
 * @deprecated use {@link compare} instead. In most cases, returning a canonicalized
 * version is not expected or desired.
 */
export function max(v: string, w: string): string {
  v = canonical(v);
  w = canonical(w);
  if (compare(v, w) > 0) {
    return v;
  }
  return w;
}

/**
 * Sort sorts a list of semantic version strings using {@link compare} and falls back
 * to use string compare if both versions are considered equal.
 */
export function sort(list: string[]) {
  list.sort(compareVersion);
}

function compareVersion(a: string, b: string): number {
  const cmp = compare(a, b);
  if (cmp !== 0) {
    return cmp;
  }
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function parse(v: string): Parsed | null {
  if (v === "" || v[0] !== "v") {
    return null;
  }

  const p: Parsed = {
    major: "",
    minor: "",
    patch: "",
    short: "",
    prerelease: "",
    build: "",
  };

  const r1 = parseInt(v.slice(1));
  if (r1 == null) {
    return null;
  }
  p.major = r1[0];
  v = r1[1];
  if (v === "") {
    p.minor = "0";
    p.patch = "0";
    p.short = ".0.0";
    return p;
  }
  if (v[0] !== ".") {
    return null;
  }

  const r2 = parseInt(v.slice(1));
  if (r2 == null) {
    return null;
  }
  p.minor = r2[0];
  v = r2[1];
  if (v === "") {
    p.patch = "0";
    p.short = ".0";
    return p;
  }
  if (v[0] !== ".") {
    return null;
  }

  const r3 = parseInt(v.slice(1));
  if (r3 == null) {
    return null;
  }
  p.patch = r3[0];
  v = r3[1];
  if (v.length > 0 && v[0] === "-") {
    const r4 = parsePrerelease(v);
    if (r4 == null) {
      return null;
    }
    p.prerelease = r4[0];
    v = r4[1];
  }
  if (v.length > 0 && v[0] === "+") {
    const r5 = parseBuild(v);
    if (r5 == null) {
      return null;
    }
    p.build = r5[0];
    v = r5[1];
  }
  if (v !== "") {
    return null;
  }
  return p;
}

function parseInt(v: string): [string, string] | null {
  if (v === "") {
    return null;
  }
  if (v[0] < "0" || "9" < v[0]) {
    return null;
  }
  let i = 1;
  while (i < v.length && "0" <= v[i] && v[i] <= "9") {
    i++;
  }
  if (v[0] === "0" && i !== 1) {
    return null;
  }
  return [v.slice(0, i), v.slice(i)];
}

function parsePrerelease(v: string): [string, string] | null {
  if (v === "" || v[0] !== "-") {
    return null;
  }
  let i = 1;
  let start = 1;
  while (i < v.length && v[i] !== "+") {
    if (!isIdentChar(v[i]) && v[i] !== ".") {
      return null;
    }
    if (v[i] === ".") {
      if (start === i || isBadNum(v.slice(start, i))) {
        return null;
      }
      start = i + 1;
    }
    i++;
  }
  if (start === i || isBadNum(v.slice(start, i))) {
    return null;
  }
  return [v.slice(0, i), v.slice(i)];
}

function parseBuild(v: string): [string, string] | null {
  if (v === "" || v[0] !== "+") {
    return null;
  }
  let i = 1;
  let start = 1;
  while (i < v.length) {
    if (!isIdentChar(v[i]) && v[i] !== ".") {
      return null;
    }
    if (v[i] === ".") {
      if (start === i) {
        return null;
      }
      start = i + 1;
    }
    i++;
  }
  if (start === i) {
    return null;
  }
  return [v.slice(0, i), v.slice(i)];
}

function isIdentChar(c: string): boolean {
  if (c.length !== 1) {
    throw new TypeError("isIdentChar expects a single character string");
  }
  return (
    ("A" <= c && c <= "Z") ||
    ("a" <= c && c <= "z") ||
    ("0" <= c && c <= "9") ||
    c === "-"
  );
}

function isBadNum(v: string): boolean {
  let i = 0;
  while (i < v.length && "0" <= v[i] && v[i] <= "9") {
    i++;
  }
  return i === v.length && i > 1 && v[0] === "0";
}

function isNum(v: string): boolean {
  let i = 0;
  while (i < v.length && "0" <= v[i] && v[i] <= "9") {
    i++;
  }
  return i === v.length;
}

function compareInt(x: string, y: string): number {
  if (x === y) {
    return 0;
  }
  if (x.length < y.length) {
    return -1;
  }
  if (x.length > y.length) {
    return 1;
  }
  if (x < y) {
    return -1;
  } else {
    return 1;
  }
}

function comparePrerelease(x: string, y: string): number {
  if (x === y) {
    return 0;
  }
  if (x === "") {
    return 1;
  }
  if (y === "") {
    return -1;
  }
  while (x !== "" && y !== "") {
    x = x.slice(1);
    y = y.slice(1);
    let dx: string;
    let dy: string;
    ({ 0: dx, 1: x } = nextIdent(x));
    ({ 0: dy, 1: y } = nextIdent(y));
    if (dx !== dy) {
      const ix = isNum(dx);
      const iy = isNum(dy);
      if (ix !== iy) {
        if (ix) {
          return -1;
        } else {
          return 1;
        }
      }
      if (ix) {
        if (dx.length < dy.length) {
          return -1;
        }
        if (dx.length > dy.length) {
          return 1;
        }
      }
      if (dx < dy) {
        return -1;
      } else {
        return 1;
      }
    }
  }
  if (x === "") {
    return -1;
  } else {
    return 1;
  }
}

function nextIdent(x: string): [string, string] {
  let i = 0;
  while (i < x.length && x[i] !== ".") {
    i++;
  }
  return [x.slice(0, i), x.slice(i)];
}
