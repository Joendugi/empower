$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Provisioning a NEW Empower Supabase project (not the marketplace one)"
npx --yes supabase --version
npx --yes supabase projects list
if ($LASTEXITCODE -ne 0) {
  throw "supabase CLI is not logged in. Run: npx supabase login"
}

$orgJson = npx --yes supabase orgs list --output json
$orgs = $orgJson | ConvertFrom-Json
if (-not $orgs) { throw "No Supabase orgs available" }
$orgId = $orgs[0].id
Write-Host "Using org $orgId"

npx --yes supabase projects create empower --org-id $orgId --region eu-west-1 --db-password $env:POSTGRES_PASSWORD
if ($LASTEXITCODE -ne 0) {
  throw "Could not create project. Create 'empower' in the dashboard, then re-run with SUPABASE_DB_URL set."
}

npx --yes supabase link --project-ref (npx --yes supabase projects list --output json | ConvertFrom-Json | Where-Object { $_.name -eq "empower" } | Select-Object -First 1 -ExpandProperty id)
npx --yes supabase db push
Write-Host "db push finished. Copy the database URI into SUPABASE_DB_URL in apps/api/.env and .env.production."
