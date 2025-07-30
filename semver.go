package main

import (
	semverwasm "github.com/jcbhmr/mod-wasm/internal/wit-bindgen-go/jcbhmr/mod/semver"
	"go.bytecodealliance.org/cm"
	semver "golang.org/x/mod/semver"
)

func init() {
	semverwasm.Exports.Build = semver.Build
	semverwasm.Exports.Canonical = semver.Canonical
	semverwasm.Exports.Compare = func(v, w string) (result int32) {
		return int32(semver.Compare(v, w))
	}
	semverwasm.Exports.IsValid = semver.IsValid
	semverwasm.Exports.Major = semver.Major
	semverwasm.Exports.MajorMinor = semver.MajorMinor
	semverwasm.Exports.Max = semver.Max
	semverwasm.Exports.Prerelease = semver.Prerelease
	semverwasm.Exports.Sort = func(list cm.List[string]) {
		semver.Sort(list.Slice())
	}
}
