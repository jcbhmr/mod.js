package main

import (
	"errors"
	"time"

	modulewasm "github.com/jcbhmr/mod-wasm/internal/wit-bindgen-go/jcbhmr/mod/module"
	"go.bytecodealliance.org/cm"
	"golang.org/x/mod/module"
)

func init() {
	modulewasm.Exports.PseudoVersionTimestampFormat = func() (result string) {
		return module.PseudoVersionTimestampFormat
	}

	modulewasm.Exports.CanonicalVersion = module.CanonicalVersion
	modulewasm.Exports.Check = func(path, version string) (result cm.Result[string, struct{}, string]) {
		err := module.CheckPath(path)
		if err != nil {
			result.SetErr(err.Error())
		}
		return
	}
	modulewasm.Exports.CheckFilePath = func(path string) (result cm.Result[string, struct{}, string]) {
		err := module.CheckFilePath(path)
		if err != nil {
			result.SetErr(err.Error())
		}
		return
	}
	modulewasm.Exports.CheckImportPath = func(path string) (result cm.Result[string, struct{}, string]) {
		err := module.CheckImportPath(path)
		if err != nil {
			result.SetErr(err.Error())
		}
		return
	}
	modulewasm.Exports.CheckPath = func(path string) (result cm.Result[string, struct{}, string]) {
		err := module.CheckPath(path)
		if err != nil {
			result.SetErr(err.Error())
		}
		return
	}
	modulewasm.Exports.CheckPathMajor = func(v, pathMajor string) (result cm.Result[string, struct{}, string]) {
		err := module.CheckPathMajor(v, pathMajor)
		if err != nil {
			result.SetErr(err.Error())
		}
		return
	}
	modulewasm.Exports.EscapePath = func(path string) (result cm.Result[string, string, string]) {
		x, err := module.EscapePath(path)
		if err != nil {
			result.SetErr(err.Error())
		} else {
			result.SetOK(x)
		}
		return
	}
	modulewasm.Exports.EscapeVersion = func(v string) (result cm.Result[string, string, string]) {
		x, err := module.EscapeVersion(v)
		if err != nil {
			result.SetErr(err.Error())
		} else {
			result.SetOK(x)
		}
		return
	}
	modulewasm.Exports.IsPseudoVersion = module.IsPseudoVersion
	modulewasm.Exports.IsZeroPseudoVersion = module.IsZeroPseudoVersion
	modulewasm.Exports.MatchPathMajor = module.MatchPathMajor
	modulewasm.Exports.PseudoVersion = func(major, older, t, rev string) (result string) {
		t2, err := time.Parse(time.RFC3339Nano, t)
		if err != nil {
			panic(err)
		}
		return module.PseudoVersion(major, older, t2, rev)
	}
	modulewasm.Exports.PseudoVersionBase = func(v string) (result cm.Result[string, string, string]) {
		x, err := module.PseudoVersionBase(v)
		if err != nil {
			result.SetErr(err.Error())
		} else {
			result.SetOK(x)
		}
		return
	}
	modulewasm.Exports.PseudoVersionRev = func(v string) (result cm.Result[string, string, string]) {
		x, err := module.PseudoVersionRev(v)
		if err != nil {
			result.SetErr(err.Error())
		} else {
			result.SetOK(x)
		}
		return
	}
	modulewasm.Exports.PseudoVersionTime = func(v string) (result cm.Result[string, string, string]) {
		x, err := module.PseudoVersionTime(v)
		if err != nil {
			result.SetErr(err.Error())
		} else {
			result.SetOK(x.Format(time.RFC3339Nano))
		}
		return
	}
	modulewasm.Exports.Sort = func(list cm.List[modulewasm.Version]) {
		list1 := list.Slice()
		list2 := make([]module.Version, len(list1))
		for i := range list2 {
			list2[i] = module.Version{
				Path:    list1[i].Path,
				Version: list1[i].Version,
			}
		}
		module.Sort(list2)
		for i := range list1 {
			list1[i] = modulewasm.Version{
				Path:    list2[i].Path,
				Version: list2[i].Version,
			}
		}
	}
	modulewasm.Exports.SplitPathVersion = func(path string) (result cm.Option[[2]string]) {
		x, y, ok := module.SplitPathVersion(path)
		if ok {
			result = cm.Some([2]string{x, y})
		}
		return
	}
	modulewasm.Exports.UnescapePath = func(escaped string) (result cm.Result[string, string, string]) {
		x, err := module.UnescapePath(escaped)
		if err != nil {
			result.SetErr(err.Error())
		} else {
			result.SetOK(x)
		}
		return
	}
	modulewasm.Exports.UnescapeVersion = func(escaped string) (result cm.Result[string, string, string]) {
		x, err := module.UnescapeVersion(escaped)
		if err != nil {
			result.SetErr(err.Error())
		} else {
			result.SetOK(x)
		}
		return
	}
	modulewasm.Exports.VersionError = func(v modulewasm.Version, err string) (result string) {
		v2 := module.Version{
			Path:    v.Path,
			Version: v.Version,
		}
		err2 := errors.New(err)
		return module.VersionError(v2, err2).Error()
	}
	modulewasm.Exports.ZeroPseudoVersion = module.ZeroPseudoVersion

	invalidPathErrors := map[cm.Rep]*module.InvalidPathError{}
	invalidPathErrorsLastID := cm.Rep(0)
	modulewasm.Exports.InvalidPathError.Constructor = func() (result modulewasm.InvalidPathError) {
		id := cm.Rep(invalidPathErrorsLastID + 1)
		invalidPathErrorsLastID = id
		invalidPathErrors[id] = &module.InvalidPathError{}
		return modulewasm.InvalidPathErrorResourceNew(id)
	}
	modulewasm.Exports.InvalidPathError.Destructor = func(self cm.Rep) {
		delete(invalidPathErrors, self)
	}
	modulewasm.Exports.InvalidPathError.Kind = func(self cm.Rep) (result string) {
		return invalidPathErrors[self].Kind
	}
	modulewasm.Exports.InvalidPathError.SetKind = func(self cm.Rep, v string) {
		invalidPathErrors[self].Kind = v
	}
	modulewasm.Exports.InvalidPathError.Path = func(self cm.Rep) (result string) {
		return invalidPathErrors[self].Path
	}
	modulewasm.Exports.InvalidPathError.SetPath = func(self cm.Rep, v string) {
		invalidPathErrors[self].Path = v
	}
	modulewasm.Exports.InvalidPathError.Err = func(self cm.Rep) (result cm.Option[string]) {
		o := invalidPathErrors[self]
		if o.Err != nil {
			result = cm.Some(o.Err.Error())
		}
		return
	}
	modulewasm.Exports.InvalidPathError.Error = func(self cm.Rep) (result string) {
		return invalidPathErrors[self].Error()
	}
	modulewasm.Exports.InvalidPathError.Unwrap = func(self cm.Rep) (result cm.Option[string]) {
		x := invalidPathErrors[self].Unwrap()
		if x != nil {
			result = cm.Some(x.Error())
		}
		return
	}
	invalidVersionErrors := map[cm.Rep]*module.InvalidVersionError{}
	invalidVersionErrorsLastID := cm.Rep(0)
	modulewasm.Exports.InvalidVersionError.ExportConstructor = func() (result modulewasm.InvalidVersionError) {
		id := cm.Rep(invalidVersionErrorsLastID + 1)
		invalidVersionErrorsLastID = id
		invalidVersionErrors[id] = &module.InvalidVersionError{}
		return modulewasm.InvalidVersionErrorResourceNew(id)
	}
	modulewasm.Exports.InvalidVersionError.Destructor = func(self cm.Rep) {
		delete(invalidVersionErrors, self)
	}
	modulewasm.Exports.InvalidVersionError.Pseudo = func(self cm.Rep) (result bool) {
		return invalidVersionErrors[self].Pseudo
	}
	modulewasm.Exports.InvalidVersionError.SetPseudo = func(self cm.Rep, v bool) {
		invalidVersionErrors[self].Pseudo = v
	}
	modulewasm.Exports.InvalidVersionError.Version = func(self cm.Rep) (result string) {
		return invalidVersionErrors[self].Version
	}
	modulewasm.Exports.InvalidVersionError.SetVersion = func(self cm.Rep, v string) {
		invalidVersionErrors[self].Version = v
	}
	modulewasm.Exports.InvalidVersionError.Err = func(self cm.Rep) (result cm.Option[string]) {
		o := invalidVersionErrors[self]
		if o.Err != nil {
			result = cm.Some(o.Err.Error())
		}
		return
	}
	modulewasm.Exports.InvalidVersionError.Error = func(self cm.Rep) (result string) {
		return invalidVersionErrors[self].Error()
	}
	modulewasm.Exports.InvalidVersionError.Unwrap = func(self cm.Rep) (result cm.Option[string]) {
		x := invalidVersionErrors[self].Unwrap()
		if x != nil {
			result = cm.Some(x.Error())
		}
		return
	}
	moduleErrors := map[cm.Rep]*module.ModuleError{}
	moduleErrorsLastID := cm.Rep(0)
	modulewasm.Exports.ModuleError.ExportConstructor_ = func() (result modulewasm.ModuleError) {
		id := cm.Rep(moduleErrorsLastID + 1)
		moduleErrorsLastID = id
		moduleErrors[id] = &module.ModuleError{}
		return modulewasm.ModuleErrorResourceNew(id)
	}
	modulewasm.Exports.ModuleError.Destructor = func(self cm.Rep) {
		delete(moduleErrors, self)
	}
	modulewasm.Exports.ModuleError.Path = func(self cm.Rep) (result string) {
		return moduleErrors[self].Path
	}
	modulewasm.Exports.ModuleError.SetPath = func(self cm.Rep, v string) {
		moduleErrors[self].Path = v
	}
	modulewasm.Exports.ModuleError.Version = func(self cm.Rep) (result string) {
		return moduleErrors[self].Version
	}
	modulewasm.Exports.ModuleError.SetVersion = func(self cm.Rep, v string) {
		moduleErrors[self].Version = v
	}
	modulewasm.Exports.ModuleError.Err = func(self cm.Rep) (result cm.Option[string]) {
		o := moduleErrors[self]
		if o.Err != nil {
			result = cm.Some(o.Err.Error())
		}
		return
	}
	modulewasm.Exports.ModuleError.Error = func(self cm.Rep) (result string) {
		return moduleErrors[self].Error()
	}
	modulewasm.Exports.ModuleError.Unwrap = func(self cm.Rep) (result cm.Option[string]) {
		x := moduleErrors[self].Unwrap()
		if x != nil {
			result = cm.Some(x.Error())
		}
		return
	}
	modulewasm.Exports.VersionString = func(v modulewasm.Version) (result string) {
		v2 := module.Version{
			Path:   v.Path,
			Version: v.Version,
		}
		return v2.String()
	}
}
