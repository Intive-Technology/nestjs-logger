'use strict';

const loggerKafka = require('..');
const assert = require('assert').strict;

assert.strictEqual(loggerKafka(), 'Hello from loggerKafka');
console.info('loggerKafka tests passed');
