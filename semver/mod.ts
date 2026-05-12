/**
 * @module semver
 * 
 * Package semver implements comparison of semantic version strings.
 * In this package, semantic version strings must begin with a leading "v",
 * as in "v1.0.0".
 *
 * The general form of a semantic version string accepted by this package is
 *
 *     vMAJOR[.MINOR[.PATCH[-PRERELEASE][+BUILD]]]
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

export {
  build,
  ByVersion,
  canonical,
  compare,
  isValid,
  major,
  majorMinor,
  max,
  prerelease,
  sort,
} from "./semver.ts";
