package modfile

import (
	"syscall/js"

	"github.com/jcbhmr/mod.js/internal/jshandle"
	"github.com/jcbhmr/mod.js/internal/xjs"
	"golang.org/x/mod/modfile"
)

func init() {
	xjs.Export("get github.com/jcbhmr/mod.js/modfile.GoVersionRE", js.FuncOf(func(this js.Value, args []js.Value) any {
		return jshandle.For(modfile.GoVersionRE)
	}))
	xjs.Export("get github.com/jcbhmr/mod.js/modfile.ToolchainRE", js.FuncOf(func(this js.Value, args []js.Value) any {
		return jshandle.For(modfile.ToolchainRE)
	}))
	xjs.Export("github.com/jcbhmr/mod.js/modfile.AutoQuote", js.FuncOf(func(this js.Value, args []js.Value) any {
		return modfile.AutoQuote(args[0].String())
	}))
	xjs.Export("github.com/jcbhmr/mod.js/modfile.Format", js.FuncOf(func(this js.Value, args []js.Value) any {
		return xjs.BytesToJS(modfile.Format(jshandle.Value(args[0]).(*modfile.FileSyntax)))
	}))
	xjs.Export("github.com/jcbhmr/mod.js/modfile.IsDirectoryPath", js.FuncOf(func(this js.Value, args []js.Value) any {
		return modfile.IsDirectoryPath(args[0].String())
	}))
	xjs.Export("github.com/jcbhmr/mod.js/modfile.ModulePath", js.FuncOf(func(this js.Value, args []js.Value) any {
		return modfile.ModulePath(xjs.BytesToGo(args[0]))
	}))
	xjs.Export("github.com/jcbhmr/mod.js/modfile.MustQuote", js.FuncOf(func(this js.Value, args []js.Value) any {
		return modfile.MustQuote(args[0].String())
	}))
	xjs.Export("new github.com/jcbhmr/mod.js/modfile.(*Comment)", js.FuncOf(func(this js.Value, args []js.Value) any {
		return jshandle.For(new(modfile.Comment))
	}))
	xjs.Export("get github.com/jcbhmr/mod.js/modfile.(*Comment).Start", js.FuncOf(func(this js.Value, args []js.Value) any {
		return jshandle.For(jshandle.Value(args[0]).(*modfile.Comment).Start)
	}))
	xjs.Export("set github.com/jcbhmr/mod.js/modfile.(*Comment).Start", js.FuncOf(func(this js.Value, args []js.Value) any {
		jshandle.Value(args[0]).(*modfile.Comment).Start = jshandle.Value(args[1]).(modfile.Position)
		return js.Undefined()
	}))
	xjs.Export("get github.com/jcbhmr/mod.js/modfile.(*Comment).Token", js.FuncOf(func(this js.Value, args []js.Value) any {
		return jshandle.Value(args[0]).(*modfile.Comment).Token
	}))
	xjs.Export("set github.com/jcbhmr/mod.js/modfile.(*Comment).Token", js.FuncOf(func(this js.Value, args []js.Value) any {
		jshandle.Value(args[0]).(*modfile.Comment).Token = args[1].String()
		return js.Undefined()
	}))
	xjs.Export("get github.com/jcbhmr/mod.js/modfile.(*Comment).Suffix", js.FuncOf(func(this js.Value, args []js.Value) any {
		return jshandle.Value(args[0]).(*modfile.Comment).Suffix
	}))
	xjs.Export("set github.com/jcbhmr/mod.js/modfile.(*Comment).Suffix", js.FuncOf(func(this js.Value, args []js.Value) any {
		jshandle.Value(args[0]).(*modfile.Comment).Suffix = args[1].Bool()
		return js.Undefined()
	}))
}
