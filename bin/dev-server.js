#!/usr/bin/env node
const { DevServer } = require(__dirname + '/../frontend/lib/dev-server');
const { PORT = 8000, STATIC_ROOT = 'frontend/build' } = process.env;
DevServer({ PORT, STATIC_ROOT });
