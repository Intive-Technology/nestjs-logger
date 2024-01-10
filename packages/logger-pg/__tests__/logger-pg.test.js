'use strict';

const loggerPg = require('..');
const assert = require('assert').strict;

assert.strictEqual(loggerPg(), 'Hello from loggerPg');
console.info('loggerPg tests passed');
