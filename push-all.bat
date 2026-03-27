@echo off
setlocal
pwsh -NoLogo -NoProfile -ExecutionPolicy Bypass -File "D:\funesterie\push-all.ps1" %*
set EXITCODE=%ERRORLEVEL%
if not "%EXITCODE%"=="0" (
  echo.
  echo Le push global a echoue. Code=%EXITCODE%
  pause
  exit /b %EXITCODE%
)
echo.
pause
