// Pseudo-versions
//
// Code authors are expected to tag the revisions they want users to use,
// including prereleases. However, not all authors tag versions at all,
// and not all commits a user might want to try will have tags.
// A pseudo-version is a version with a special form that allows us to
// address an untagged commit and order that version with respect to
// other versions we might encounter.
//
// A pseudo-version takes one of the general forms:
//
//	(1) vX.0.0-yyyymmddhhmmss-abcdef123456
//	(2) vX.Y.(Z+1)-0.yyyymmddhhmmss-abcdef123456
//	(3) vX.Y.(Z+1)-0.yyyymmddhhmmss-abcdef123456+incompatible
//	(4) vX.Y.Z-pre.0.yyyymmddhhmmss-abcdef123456
//	(5) vX.Y.Z-pre.0.yyyymmddhhmmss-abcdef123456+incompatible
//
// If there is no recently tagged version with the right major version vX,
// then form (1) is used, creating a space of pseudo-versions at the bottom
// of the vX version range, less than any tagged version, including the unlikely v0.0.0.
//
// If the most recent tagged version before the target commit is vX.Y.Z or vX.Y.Z+incompatible,
// then the pseudo-version uses form (2) or (3), making it a prerelease for the next
// possible semantic version after vX.Y.Z. The leading 0 segment in the prerelease string
// ensures that the pseudo-version compares less than possible future explicit prereleases
// like vX.Y.(Z+1)-rc1 or vX.Y.(Z+1)-1.
//
// If the most recent tagged version before the target commit is vX.Y.Z-pre or vX.Y.Z-pre+incompatible,
// then the pseudo-version uses form (4) or (5), making it a slightly later prerelease.

import * as semver from "../semver/mod.ts";

// var pseudoVersionRE = lazyregexp.New(`^v[0-9]+\.(0\.0-|\d+\.\d+-([^+]*\.)?0\.)\d{14}-[A-Za-z0-9]+(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$`)
export const pseudoVersionRE =
  /^v[0-9]+\.(0\.0-|\d+\.\d+-([^+]*\.)?0\.)\d{14}-[A-Za-z0-9]+(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;

// const PseudoVersionTimestampFormat = "20060102150405"
export function pseudoVersionTimestampFormat(t: Temporal.Instant): string {
  const u = t.toZonedDateTimeISO("UTC");
  if (!(0 <= u.year && u.year <= 9999)) {
    throw new RangeError(`${t} year not in range [0-9999]`);
  }
  const year4 = u.year.toString().padStart(4, "0");
  const day2 = u.day.toString().padStart(2, "0");
  const hour2 = u.hour.toString().padStart(2, "0");
  const minute2 = u.minute.toString().padStart(2, "0");
  const second2 = u.second.toString().padStart(2, "0");
  return `${year4}${day2}${hour2}${minute2}${second2}`;
}

/**
 * pseudoVersion returns a pseudo-version for the given major version ("v1")
 * preexisting older tagged version ("" or "v1.2.3" or "v1.2.3-pre"), revision time,
 * and revision identifier (usually a 12-byte commit hash prefix).
 */
export function pseudoVersion(
  major: string,
  older: string,
  t: Temporal.Instant,
  rev: string,
): string {
  if (major === "") {
    major = "v0";
  }
  const segment = `${pseudoVersionTimestampFormat(t)}-${rev}`;
  const build = semver.build(older);
  older = semver.canonical(older);
  if (older === "") {
    return `${major}.0.0-${segment}`;
  }
  if (semver.prerelease(older) !== "") {
    return `${older}.0.${segment}${build}`;
  }

  const i = older.lastIndexOf(".") + 1;
  const v = older.slice(0, i);
  const patch = older.slice(i);

  return `${v}${incDecimal(patch)}-0.${segment}${build}`;
}
export function zeroPseudoVersion(major: string): string {}
