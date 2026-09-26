$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$destDir = Join-Path $root "backups"
New-Item -ItemType Directory -Force -Path $destDir | Out-Null
$out = Join-Path $destDir "empower-$stamp.sql"

$envFile = Join-Path $root ".env.production"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^(SUPABASE_DB_URL|DATABASE_URL|POSTGRES_PASSWORD)=(.*)$') {
      Set-Item -Path "Env:$($matches[1])" -Value $matches[2]
    }
  }
}

if ($env:SUPABASE_DB_URL) {
  $url = $env:SUPABASE_DB_URL
} elseif ($env:DATABASE_URL) {
  $url = $env:DATABASE_URL -replace '\+asyncpg', ''
} else {
  throw "Set SUPABASE_DB_URL or DATABASE_URL"
}

Write-Host "Writing $out"
pg_dump $url | Set-Content -Path $out -Encoding utf8
Write-Host "backup ok"
