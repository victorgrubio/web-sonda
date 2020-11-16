#!/bin/bash
export NUXT_HOST=0.0.0.0
export NUXT_PORT=$NUXT_PORT
export APP_ENV="prod"
API_PORT=$API_PORT nuxt start
