param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$TauriArgs
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$cargoBin = Join-Path $env:USERPROFILE '.cargo\bin'
if (Test-Path $cargoBin) {
  $env:PATH = "$cargoBin;$env:PATH"
}

$tauriCli = Join-Path $projectRoot 'node_modules\.bin\tauri.cmd'
if (-not (Test-Path $tauriCli)) {
  throw "Tauri CLI introuvable. Lance d'abord 'npm install' dans $projectRoot."
}

if ($TauriArgs.Count -gt 0 -and $TauriArgs[0] -eq 'build') {
  & (Join-Path $PSScriptRoot 'sync-local-package.ps1')
}

& $tauriCli @TauriArgs
exit $LASTEXITCODE
