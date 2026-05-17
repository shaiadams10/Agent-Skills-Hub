# Stop stale Agent Skills Hub dev server and folder-picker processes before a fresh start.
$ErrorActionPreference = "SilentlyContinue"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$pickerExe = Join-Path $root "src\lib\dialog\bin\pick-folder-win.exe"

foreach ($p in Get-Process -Name "pick-folder-win") {
    try {
        if ($p.Path -and (Resolve-Path $p.Path).Path -eq (Resolve-Path $pickerExe).Path) {
            Write-Host "  Stopping stale folder picker (PID $($p.Id))..."
            Stop-Process -Id $p.Id -Force
        }
    } catch { }
}

$escapedRoot = [regex]::Escape($root)
$stopped = @()

Get-CimInstance Win32_Process -Filter "Name='node.exe'" | ForEach-Object {
    $cmd = $_.CommandLine
    if (-not $cmd) { return }
    if ($cmd -notmatch $escapedRoot) { return }
    if ($cmd -notmatch "next(\.cmd)?(\s+)?dev") { return }
    $pid = $_.ProcessId
    if ($stopped -contains $pid) { return }
    Write-Host "  Stopping previous dev server (PID $pid)..."
    Stop-Process -Id $pid -Force
    $stopped += $pid
}

# Port 3000 may still be held briefly by a child; retry once
Start-Sleep -Milliseconds 400
Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
    $pid = $_.OwningProcess
    if ($stopped -contains $pid) { return }
    $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$pid" -ErrorAction SilentlyContinue
    if ($proc.CommandLine -and $proc.CommandLine -match $escapedRoot) {
        Write-Host "  Stopping process still listening on :3000 (PID $pid)..."
        Stop-Process -Id $pid -Force
        $stopped += $pid
    }
}

if ($stopped.Count -eq 0) {
    Write-Host "  No previous hub instance found."
}
