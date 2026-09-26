#!/bin/sh
set -eu
HOST="${PUBLIC_HOST:-empower.local}"
if [ -f /etc/nginx/certs/fullchain.pem ] && [ -f /etc/nginx/certs/privkey.pem ]; then
  cp /etc/nginx/tls.conf.template /etc/nginx/conf.d/default.conf
  sed -i "s/__PUBLIC_HOST__/${HOST}/g" /etc/nginx/conf.d/default.conf
fi
exec nginx -g "daemon off;"
