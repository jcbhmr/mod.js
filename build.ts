#!/usr/bin/env node
import { $ } from "execa";
import { mkdir, rm } from "node:fs/promises";

interface GoEnv {
  AR: string
  CC: string
  CGO_CFLAGS: string
  CGO_CPPFLAGS: string
  CGO_CXXFLAGS: string
  CGO_ENABLED: string
  CGO_FFLAGS: string
  CGO_LDFLAGS: string
  CXX: string
  GCCGO: string
  GO111MODULE: string
  GOAMD64: string
  GOARCH: string
  GOAUTH: string
  GOBIN: string
  GOCACHE: string
  GOCACHEPROG: string
  GODEBUG: string
  GOENV: string
  GOEXE: string
  GOEXPERIMENT: string
  GOFIPS140: string
  GOFLAGS: string
  GOGCCFLAGS: string
  GOHOSTARCH: string
  GOHOSTOS: string
  GOINSECURE: string
  GOMOD: string
  GOMODCACHE: string
  GONOPROXY: string
  GONOSUMDB: string
  GOOS: string
  GOPATH: string
  GOPRIVATE: string
  GOPROXY: string
  GOROOT: string
  GOSUMDB: string
  GOTELEMETRY: string
  GOTELEMETRYDIR: string
  GOTMPDIR: string
  GOTOOLCHAIN: string
  GOTOOLDIR: string
  GOVCS: string
  GOVERSION: string
  GOWORK: string
  PKG_CONFIG: string
}

const goEnv = await (async () => {
    const { stdout } = await $({ verbose: "short" })`go env -json`;
    // TODO: Use Zod to ensure it really is a GoEnv?
    return JSON.parse(stdout) as GoEnv;
})();

console.log("Go root: %o", goEnv.GOROOT);

await mkdir("./out", { recursive: true });

await rm("./out/semver.wasm", { recursive: true, force: true });
await $({ verbose: "short", env: { GOOS: "js", GOARCH: "wasm", } })`go build -o ./out/semver.wasm ./semver`;

await $({ verbose: "short" })`tsc --noCheck`
