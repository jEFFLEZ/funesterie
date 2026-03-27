param(
  [switch]$SkipUiBuild
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$launcherRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot '..\launchers'))
$launcherScript = Join-Path $launcherRoot 'a11-local.ps1'
$sourceRoot = Join-Path $launcherRoot 'dist\a11-local'
$targetRoot = Join-Path $projectRoot 'resources\a11-local'

if (-not (Test-Path $launcherScript)) {
  throw "Launcher source introuvable: $launcherScript"
}

$packageArgs = @(
  '-NoProfile',
  '-ExecutionPolicy', 'Bypass',
  '-File', $launcherScript,
  'package',
  '-Force'
)

if ($SkipUiBuild) {
  $packageArgs += '-SkipUiBuild'
}

& powershell.exe @packageArgs
if ($LASTEXITCODE -ne 0) {
  throw "Le packaging A11 local a echoue."
}

if (-not (Test-Path $sourceRoot)) {
  throw "Staging package introuvable apres packaging: $sourceRoot"
}

if (Test-Path $targetRoot) {
  Remove-Item -LiteralPath $targetRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null

$excludeRuntime = Join-Path $sourceRoot 'launcher\runtime'
$args = @($sourceRoot, $targetRoot, '/E', '/R:1', '/W:1', '/NFL', '/NDL', '/NJH', '/NJS', '/NP')
if (Test-Path $excludeRuntime) {
  $args += '/XD'
  $args += $excludeRuntime
}

& robocopy @args | Out-Null
$exitCode = $LASTEXITCODE
if ($exitCode -gt 7) {
  throw "robocopy a echoue pour la sync desktop (exit $exitCode)."
}

Write-Host "[A11 DESKTOP] resources pretes: $targetRoot"
