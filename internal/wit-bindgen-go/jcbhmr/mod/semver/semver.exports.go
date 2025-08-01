// Code generated by wit-bindgen-go. DO NOT EDIT.

package semver

import (
	"go.bytecodealliance.org/cm"
)

// Exports represents the caller-defined exports from "jcbhmr:mod/semver@0.26.0-rc1".
var Exports struct {
	// Build represents the caller-defined, exported function "build".
	//
	//	build: func(v: string) -> string
	Build func(v string) (result string)

	// Canonical represents the caller-defined, exported function "canonical".
	//
	//	canonical: func(v: string) -> string
	Canonical func(v string) (result string)

	// Compare represents the caller-defined, exported function "compare".
	//
	//	compare: func(v: string, w: string) -> s32
	Compare func(v string, w string) (result int32)

	// IsValid represents the caller-defined, exported function "is-valid".
	//
	//	is-valid: func(v: string) -> bool
	IsValid func(v string) (result bool)

	// Major represents the caller-defined, exported function "major".
	//
	//	major: func(v: string) -> string
	Major func(v string) (result string)

	// MajorMinor represents the caller-defined, exported function "major-minor".
	//
	//	major-minor: func(v: string) -> string
	MajorMinor func(v string) (result string)

	// Max represents the caller-defined, exported function "max".
	//
	//	max: func(v: string, w: string) -> string
	Max func(v string, w string) (result string)

	// Prerelease represents the caller-defined, exported function "prerelease".
	//
	//	prerelease: func(v: string) -> string
	Prerelease func(v string) (result string)

	// Sort represents the caller-defined, exported function "sort".
	//
	//	sort: func(%list: list<string>)
	Sort func(list cm.List[string])
}
