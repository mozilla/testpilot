#!/bin/bash
set -ex
npm install
npm run build
npm test
