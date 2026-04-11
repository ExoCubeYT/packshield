$ErrorActionPreference = "Stop"

if (!(Test-Path -Path "public")) {
    New-Item -ItemType Directory -Path "public" | Out-Null
}

$goExe = "go"
if (-not (Get-Command go -ErrorAction SilentlyContinue)) {
    if (Test-Path 'C:\Program Files\Go\bin\go.exe') {
        $goExe = 'C:\Program Files\Go\bin\go.exe'
    } elseif (Test-Path 'C:\Program Files (x86)\Go\bin\go.exe') {
        $goExe = 'C:\Program Files (x86)\Go\bin\go.exe'
    }
}

$Env:GOOS = "js"
$Env:GOARCH = "wasm"
& $goExe build -o public/main.wasm wasm/main.go

$GoRoot = (& $goExe env GOROOT).Trim()
$WasmExecPath1 = Join-Path $GoRoot "misc\wasm\wasm_exec.js"
$WasmExecPath2 = Join-Path $GoRoot "lib\wasm\wasm_exec.js"

if (Test-Path $WasmExecPath2) {
    Copy-Item $WasmExecPath2 -Destination "public\wasm_exec.js" -Force
    Write-Host "Build complete! wasm outputs in public/"
} elseif (Test-Path $WasmExecPath1) {
    Copy-Item $WasmExecPath1 -Destination "public\wasm_exec.js" -Force
    Write-Host "Build complete! wasm outputs in public/"
} else {
    Write-Error "Could not find wasm_exec.js in expected Go directories"
}
