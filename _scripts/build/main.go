package main

import (
	"log"
	"os"
	"os/exec"
)

func main() {
	cmd := exec.Command("tinygo", "build", "-target=wasip2", "-o", ".out/mod.wasm", "--wit-package", "wit/package.wasm", "--wit-world", "mod", ".")
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	log.Printf("$ %v", cmd)
	err := cmd.Run()
	if err != nil {
		log.Fatal(err)
	}
}
