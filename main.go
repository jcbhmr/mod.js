//go:generate wkg wit fetch
//go:generate wkg wit build --output wit/package.wasm
//go:generate go tool wit-bindgen-go generate --world mod --out internal/wit-bindgen-go wit/package.wasm

package main

func main() {}
