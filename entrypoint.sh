#!/bin/sh
set -e
# Copy built public assets to shared volume so Nginx can serve them (same files as this image)
cp -r /app/.output/public/. /var/frontend-public/
exec node /app/.output/server/index.mjs
