# Build pick-folder-win.exe (IFileOpenDialog) using Windows csc.exe — no Go/SDK required.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "src\lib\dialog\picker\FolderPicker.cs"
$outDir = Join-Path $root "src\lib\dialog\bin"
$outExe = Join-Path $outDir "pick-folder-win.exe"

$csc64 = "${env:WINDIR}\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$csc32 = "${env:WINDIR}\Microsoft.NET\Framework\v4.0.30319\csc.exe"
$csc = if (Test-Path $csc64) { $csc64 } elseif (Test-Path $csc32) { $csc32 } else { $null }
if (-not $csc) {
    Write-Error "csc.exe not found. Install .NET Framework 4.x developer pack or build on Windows."
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$framework = Split-Path -Parent $csc
$winForms = Join-Path $framework "System.Windows.Forms.dll"
& $csc /nologo /target:winexe /platform:anycpu /optimize+ /reference:$winForms /out:$outExe $src
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Built $outExe"
