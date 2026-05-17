@echo off
title Agent Skills Hub
cd /d "%~dp0"

echo.
echo  Agent Skills Hub - Starting...
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo  Node.js is not installed.
    echo  Please install from https://nodejs.org/ then run this file again.
    echo.
    pause
    exit /b 1
)

echo  Checking for a previous instance...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop-hub.ps1"
echo.

if not exist "node_modules\" (
    echo  First run: installing dependencies ^(one time only^)...
    call npm install
    if errorlevel 1 (
        echo  Install failed. Check your internet connection.
        pause
        exit /b 1
    )
)

if not exist "src\lib\dialog\bin\pick-folder-win.exe" (
    echo  Building Windows folder picker ^(one time^)...
    call npm run build:picker
    if errorlevel 1 (
        echo  Folder picker build failed. Browse may not work until you run: npm run build:picker
    )
)

echo  Opening in your browser...
start "" "http://localhost:3000"

echo  Keep this window open while using the app.
echo  Press Ctrl+C to stop.
echo.

call npm run dev

pause
