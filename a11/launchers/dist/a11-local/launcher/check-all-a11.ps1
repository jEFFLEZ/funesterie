$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'a11-local.ps1') check @args
exit $LASTEXITCODE
