package main

import (
	_ "github.com/jcbhmr/mod.js/internal/jshandle"
	"github.com/jcbhmr/mod.js/internal/xjs"
	_ "github.com/jcbhmr/mod.js/modfile"
	// _ "github.com/jcbhmr/mod.js/module"
	// _ "github.com/jcbhmr/mod.js/semver"
	// _ "github.com/jcbhmr/mod.js/sumdb"
	// _ "github.com/jcbhmr/mod.js/sumdb/dirhash"
	// _ "github.com/jcbhmr/mod.js/sumdb/note"
	// _ "github.com/jcbhmr/mod.js/sumdb/storage"
	// _ "github.com/jcbhmr/mod.js/sumdb/tlog"
	// _ "github.com/jcbhmr/mod.js/sumdb/zip"
)

func main() {
	xjs.StartLib()
}
