#!/bin/bash
set -ex

npm ci
cd addon && npm ci
