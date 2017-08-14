#!/bin/bash
set -ex
npm start &
STATIC_SERVER_PID=$!
