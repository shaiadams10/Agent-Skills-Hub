# Agent Skills Hub — Windows install helper (npm deps + verify folder picker).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Install Node 20+ LTS from https://nodejs.org/ then run this script again."
}

$v = (node -v) -replace '^v', ''
$major = [int]($v.Split('.')[0])
if ($major -lt 20) {
    Write-Error "Node.js 20+ required (found $(node -v))."
}

Write-Host "Installing npm dependencies..."
& npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$picker = Join-Path $root "src\lib\dialog\bin\pick-folder-win.exe"
if (-not (Test-Path $picker)) {
    Write-Host "Building folder picker..."
    & npm run build:picker
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host ""
Write-Host "Install complete. Start the app with:"
Write-Host "  Start Agent Skills Hub.bat"
Write-Host "  or: npm run dev"
Write-Host ""
