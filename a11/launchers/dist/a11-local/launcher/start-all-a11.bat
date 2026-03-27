@echo off
setlocal
call "%~dp0a11-local.bat" start %*
set "EXIT_CODE=%ERRORLEVEL%"
endlocal & exit /b %EXIT_CODE%
