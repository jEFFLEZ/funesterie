$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'a11-local.ps1') status @args
exit $LASTEXITCODE
