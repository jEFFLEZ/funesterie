$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'a11-local.ps1') stop @args
exit $LASTEXITCODE
