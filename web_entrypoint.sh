#!/bin/bash

# Ports defined by environment variable

export NUXT_HOST=0.0.0.0
export NUXT_PORT=$NUXT_PORT
echo "API_PORT=${API_PORT}"
echo "API_PORT=${API_PORT}" > /usr/src/nuxt-app/.env
echo "APP_ENV=prod" >> /usr/src/nuxt-app/.env
npm run build
npm start
