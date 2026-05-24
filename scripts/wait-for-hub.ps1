# Poll until the Hub responds on the expected port (used after starting next dev).
param(
    [int]$Port = 3000,
    [int]$TimeoutSec = 120
)

$ErrorActionPreference = "SilentlyContinue"
$url = "http://localhost:$Port/"
$deadline = (Get-Date).AddSeconds($TimeoutSec)

Write-Host "  Waiting for Hub at $url ..."

while ((Get-Date) -lt $deadline) {
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
        if ($r.StatusCode -eq 200 -and $r.Content -match "Agent Skills Hub") {
            Write-Host "  Hub is ready."
            exit 0
        }
    } catch {
        # still starting
    }
    Start-Sleep -Milliseconds 600
}

Write-Host "  Timed out after ${TimeoutSec}s — is port $Port blocked by another app?"
exit 1
