@echo off
setlocal
title Mobius Universe

pushd "%~dp0"
if errorlevel 1 (
    echo ERROR: Cannot open the project directory.
    pause
    exit /b 1
)

where node >nul 2>&1
if errorlevel 1 goto missing_node
where npm >nul 2>&1
if errorlevel 1 goto missing_node

if not exist "node_modules\.bin\vite.cmd" (
    echo Installing project dependencies...
    call npm ci
    if errorlevel 1 goto failed
)

echo Starting Mobius Universe...
echo Press Ctrl+C to stop the server.
call npm run dev -- --host 127.0.0.1 --open
if errorlevel 1 goto failed

popd
exit /b 0

:missing_node
echo ERROR: Install a supported Node.js LTS release with npm, then try again.

:failed
echo The project could not start. Review the error above.
pause
popd
exit /b 1
