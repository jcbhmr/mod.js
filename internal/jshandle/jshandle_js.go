package jshandle

import (
	"sync"
	"sync/atomic"
	"syscall/js"

	"github.com/jcbhmr/mod.js/internal/xjs"
)

var currentID = atomic.Int32{}
var ids = sync.Pool{
	New: func() any {
		return currentID.Add(1)
	},
}
var values = sync.Map{}

func For(v any) js.Value {
	id := ids.Get().(int32)
	values.Store(id, v)
	return js.ValueOf(id)
}

func Value(h js.Value) any {
	v, _ := values.Load(h.Int())
	return v
}

func Release(h js.Value) {
	values.Delete(h.Int())
	ids.Put(h.Int())
}

func init() {
	xjs.Export("github.com/jcbhmr/mod.js/internal/jshandle.Release", js.FuncOf(func(this js.Value, args []js.Value) any {
		Release(args[0])
		return js.Undefined()
	}))
}
