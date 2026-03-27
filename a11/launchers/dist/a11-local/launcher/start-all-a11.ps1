$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'a11-local.ps1') start @args
exit $LASTEXITCODE
