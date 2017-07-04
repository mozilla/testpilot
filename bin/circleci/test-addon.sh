#!/bin/bash
set -ex
cd addon/
npm run lint
npm run test
