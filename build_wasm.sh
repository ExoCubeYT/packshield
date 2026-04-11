#!/bin/bash
GOOS=js GOARCH=wasm go build -o public/main.wasm wasm/main.go
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" public/
