@echo off
setlocal
call "%~dp0a11-local.bat" check %*
set "EXIT_CODE=%ERRORLEVEL%"
endlocal & exit /b %EXIT_CODE%
