# Background helper: wait for Hub, then open the default browser (started from Start .bat).
param([int]$Port = 3000)

& (Join-Path $PSScriptRoot "wait-for-hub.ps1") -Port $Port
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Start-Process "http://localhost:$Port/"
