$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$hostName = if ($env:PUBLIC_HOST) { $env:PUBLIC_HOST } else { "empower.local" }
$certs = Join-Path $root "certs"
New-Item -ItemType Directory -Force -Path $certs | Out-Null
$cfg = Join-Path $certs "openssl.cnf"
@"
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = $hostName

[v3_req]
subjectAltName = @alt_names
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alt_names]
DNS.1 = $hostName
DNS.2 = localhost
IP.1 = 127.0.0.1
"@ | Set-Content -Path $cfg -Encoding ascii

openssl req -x509 -nodes -days 825 -newkey rsa:2048 `
  -keyout (Join-Path $certs "privkey.pem") `
  -out (Join-Path $certs "fullchain.pem") `
  -config $cfg

Write-Host "wrote certs/fullchain.pem and certs/privkey.pem for $hostName"
