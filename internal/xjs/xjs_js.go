package xjs

import "syscall/js"

func BytesToJS(b []byte) js.Value {
	u8 := js.Global().Get("Uint8Array").New(len(b))
	js.CopyBytesToJS(u8, b)
	return u8
}

func BytesToGo(v js.Value) []byte {
	b := make([]byte, v.Get("byteLength").Int())
	js.CopyBytesToGo(b, v)
	return b
}

type Value struct{ js.Value }

func Import(specifier string, options ...any) js.Value {
	if len(options) == 0 {
		return js.Global().Get("_import").Invoke(specifier)
	} else if len(options) == 1 {
		return js.Global().Get("_import").Invoke(specifier, options[0])
	} else {
		panic("too many options")
	}
}

func ImportMeta() js.Value {
	return js.Global().Get("_importMeta")
}

func Export(name string, value any) {
	js.Global().Get("_exportsObject").Set(name, value)
}

func StartLib() {
	js.Global().Get("_exportsResolve").Invoke()
	select {}
}
