@echo off
setlocal
cd /d "%~dp0"

set "BUNDLED_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%BUNDLED_NODE%" (
  set "NODE_RUN=%BUNDLED_NODE%"
) else (
  set "NODE_RUN=node"
)

echo.
echo  DEBUG SPRINT dang khoi dong...
echo  Mo trinh duyet tai: http://localhost:3000
echo  Nhan Ctrl+C de dung game.
echo.

"%NODE_RUN%" "node_modules\vinext\dist\cli.js" dev
pause
