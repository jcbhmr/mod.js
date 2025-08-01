// Code generated by wit-bindgen-go. DO NOT EDIT.

package module

import (
	"go.bytecodealliance.org/cm"
)

// Exports represents the caller-defined exports from "jcbhmr:mod/module@0.26.0-rc1".
var Exports struct {
	// InvalidPathError represents the caller-defined exports for resource "jcbhmr:mod/module@0.26.0-rc1#invalid-path-error".
	InvalidPathError struct {
		// Destructor represents the caller-defined, exported destructor for resource "invalid-path-error".
		//
		// Resource destructor.
		Destructor func(self cm.Rep)

		// Constructor represents the caller-defined, exported constructor for resource "invalid-path-error".
		//
		//	constructor()
		Constructor func() (result InvalidPathError)

		// Err represents the caller-defined, exported method "err".
		//
		//	err: func() -> option<string>
		Err func(self cm.Rep) (result cm.Option[string])

		// Error represents the caller-defined, exported method "error".
		//
		//	error: func() -> string
		Error func(self cm.Rep) (result string)

		// Kind represents the caller-defined, exported method "kind".
		//
		//	kind: func() -> string
		Kind func(self cm.Rep) (result string)

		// Path represents the caller-defined, exported method "path".
		//
		//	path: func() -> string
		Path func(self cm.Rep) (result string)

		// SetKind represents the caller-defined, exported method "set-kind".
		//
		//	set-kind: func(v: string)
		SetKind func(self cm.Rep, v string)

		// SetPath represents the caller-defined, exported method "set-path".
		//
		//	set-path: func(v: string)
		SetPath func(self cm.Rep, v string)

		// Unwrap represents the caller-defined, exported method "unwrap".
		//
		//	unwrap: func() -> option<string>
		Unwrap func(self cm.Rep) (result cm.Option[string])
	}

	// InvalidVersionError represents the caller-defined exports for resource "jcbhmr:mod/module@0.26.0-rc1#invalid-version-error".
	InvalidVersionError struct {
		// Destructor represents the caller-defined, exported destructor for resource "invalid-version-error".
		//
		// Resource destructor.
		Destructor func(self cm.Rep)

		// ExportConstructor represents the caller-defined, exported constructor for resource "invalid-version-error".
		//
		//	constructor()
		ExportConstructor func() (result InvalidVersionError)

		// Err represents the caller-defined, exported method "err".
		//
		//	err: func() -> option<string>
		Err func(self cm.Rep) (result cm.Option[string])

		// Error represents the caller-defined, exported method "error".
		//
		//	error: func() -> string
		Error func(self cm.Rep) (result string)

		// Pseudo represents the caller-defined, exported method "pseudo".
		//
		//	pseudo: func() -> bool
		Pseudo func(self cm.Rep) (result bool)

		// SetPseudo represents the caller-defined, exported method "set-pseudo".
		//
		//	set-pseudo: func(v: bool)
		SetPseudo func(self cm.Rep, v bool)

		// SetVersion represents the caller-defined, exported method "set-version".
		//
		//	set-version: func(v: string)
		SetVersion func(self cm.Rep, v string)

		// Unwrap represents the caller-defined, exported method "unwrap".
		//
		//	unwrap: func() -> option<string>
		Unwrap func(self cm.Rep) (result cm.Option[string])

		// Version represents the caller-defined, exported method "version".
		//
		//	version: func() -> string
		Version func(self cm.Rep) (result string)
	}

	// ModuleError represents the caller-defined exports for resource "jcbhmr:mod/module@0.26.0-rc1#module-error".
	ModuleError struct {
		// Destructor represents the caller-defined, exported destructor for resource "module-error".
		//
		// Resource destructor.
		Destructor func(self cm.Rep)

		// ExportConstructor_ represents the caller-defined, exported constructor for resource "module-error".
		//
		//	constructor()
		ExportConstructor_ func() (result ModuleError)

		// Err represents the caller-defined, exported method "err".
		//
		//	err: func() -> option<string>
		Err func(self cm.Rep) (result cm.Option[string])

		// Error represents the caller-defined, exported method "error".
		//
		//	error: func() -> string
		Error func(self cm.Rep) (result string)

		// Path represents the caller-defined, exported method "path".
		//
		//	path: func() -> string
		Path func(self cm.Rep) (result string)

		// SetPath represents the caller-defined, exported method "set-path".
		//
		//	set-path: func(v: string)
		SetPath func(self cm.Rep, v string)

		// SetVersion represents the caller-defined, exported method "set-version".
		//
		//	set-version: func(v: string)
		SetVersion func(self cm.Rep, v string)

		// Unwrap represents the caller-defined, exported method "unwrap".
		//
		//	unwrap: func() -> option<string>
		Unwrap func(self cm.Rep) (result cm.Option[string])

		// Version represents the caller-defined, exported method "version".
		//
		//	version: func() -> string
		Version func(self cm.Rep) (result string)
	}

	// PseudoVersionTimestampFormat represents the caller-defined, exported function "pseudo-version-timestamp-format".
	//
	//	pseudo-version-timestamp-format: func() -> string
	PseudoVersionTimestampFormat func() (result string)

	// CanonicalVersion represents the caller-defined, exported function "canonical-version".
	//
	//	canonical-version: func(v: string) -> string
	CanonicalVersion func(v string) (result string)

	// Check represents the caller-defined, exported function "check".
	//
	//	check: func(path: string, version: string) -> result<_, error>
	Check func(path string, version string) (result cm.Result[Error, struct{}, Error])

	// CheckFilePath represents the caller-defined, exported function "check-file-path".
	//
	//	check-file-path: func(path: string) -> result<_, error>
	CheckFilePath func(path string) (result cm.Result[Error, struct{}, Error])

	// CheckImportPath represents the caller-defined, exported function "check-import-path".
	//
	//	check-import-path: func(path: string) -> result<_, error>
	CheckImportPath func(path string) (result cm.Result[Error, struct{}, Error])

	// CheckPath represents the caller-defined, exported function "check-path".
	//
	//	check-path: func(path: string) -> result<_, error>
	CheckPath func(path string) (result cm.Result[Error, struct{}, Error])

	// CheckPathMajor represents the caller-defined, exported function "check-path-major".
	//
	//	check-path-major: func(v: string, path-major: string) -> result<_, error>
	CheckPathMajor func(v string, pathMajor string) (result cm.Result[Error, struct{}, Error])

	// EscapePath represents the caller-defined, exported function "escape-path".
	//
	//	escape-path: func(path: string) -> result<string, error>
	EscapePath func(path string) (result cm.Result[string, string, Error])

	// EscapeVersion represents the caller-defined, exported function "escape-version".
	//
	//	escape-version: func(v: string) -> result<string, error>
	EscapeVersion func(v string) (result cm.Result[string, string, Error])

	// IsPseudoVersion represents the caller-defined, exported function "is-pseudo-version".
	//
	//	is-pseudo-version: func(v: string) -> bool
	IsPseudoVersion func(v string) (result bool)

	// IsZeroPseudoVersion represents the caller-defined, exported function "is-zero-pseudo-version".
	//
	//	is-zero-pseudo-version: func(v: string) -> bool
	IsZeroPseudoVersion func(v string) (result bool)

	// MatchPathMajor represents the caller-defined, exported function "match-path-major".
	//
	//	match-path-major: func(v: string, path-major: string) -> bool
	MatchPathMajor func(v string, pathMajor string) (result bool)

	// MatchPrefixPatterns represents the caller-defined, exported function "match-prefix-patterns".
	//
	//	match-prefix-patterns: func(globs: string, target: string) -> bool
	MatchPrefixPatterns func(globs string, target string) (result bool)

	// PathMajorPrefix represents the caller-defined, exported function "path-major-prefix".
	//
	//	path-major-prefix: func(path-major: string) -> string
	PathMajorPrefix func(pathMajor string) (result string)

	// PseudoVersion represents the caller-defined, exported function "pseudo-version".
	//
	//	pseudo-version: func(major: string, older: string, t: string, rev: string) -> string
	PseudoVersion func(major string, older string, t string, rev string) (result string)

	// PseudoVersionBase represents the caller-defined, exported function "pseudo-version-base".
	//
	//	pseudo-version-base: func(v: string) -> result<string, error>
	PseudoVersionBase func(v string) (result cm.Result[string, string, Error])

	// PseudoVersionRev represents the caller-defined, exported function "pseudo-version-rev".
	//
	//	pseudo-version-rev: func(v: string) -> result<string, error>
	PseudoVersionRev func(v string) (result cm.Result[string, string, Error])

	// PseudoVersionTime represents the caller-defined, exported function "pseudo-version-time".
	//
	//	pseudo-version-time: func(v: string) -> result<string, error>
	PseudoVersionTime func(v string) (result cm.Result[string, string, Error])

	// Sort represents the caller-defined, exported function "sort".
	//
	//	sort: func(%list: list<version>)
	Sort func(list cm.List[Version])

	// SplitPathVersion represents the caller-defined, exported function "split-path-version".
	//
	//	split-path-version: func(path: string) -> option<tuple<string, string>>
	SplitPathVersion func(path string) (result cm.Option[[2]string])

	// UnescapePath represents the caller-defined, exported function "unescape-path".
	//
	//	unescape-path: func(escaped: string) -> result<string, error>
	UnescapePath func(escaped string) (result cm.Result[string, string, Error])

	// UnescapeVersion represents the caller-defined, exported function "unescape-version".
	//
	//	unescape-version: func(escaped: string) -> result<string, error>
	UnescapeVersion func(escaped string) (result cm.Result[string, string, Error])

	// VersionError represents the caller-defined, exported function "version-error".
	//
	//	version-error: func(v: version, err: string) -> string
	VersionError func(v Version, err string) (result string)

	// ZeroPseudoVersion represents the caller-defined, exported function "zero-pseudo-version".
	//
	//	zero-pseudo-version: func(major: string) -> string
	ZeroPseudoVersion func(major string) (result string)

	// VersionString represents the caller-defined, exported function "version-string".
	//
	//	version-string: func(v: version) -> string
	VersionString func(v Version) (result string)
}
