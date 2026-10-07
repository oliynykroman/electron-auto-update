const test = require('node:test');
const assert = require('node:assert/strict');
const { compareVersions, normalizeVersion, validateHttpUrl } = require('../electron/update-utils');

test('порівнює семантичні версії', () => {
  assert.equal(compareVersions('1.0.0', '1.0.1'), -1);
  assert.equal(compareVersions('2.0.0', '1.9.9'), 1);
  assert.equal(compareVersions('1.4.2', '1.4.2'), 0);
});

test('відхиляє непідтримувані формати версій', () => {
  assert.throws(() => normalizeVersion('1.0'), /MAJOR\.MINOR\.PATCH/);
  assert.throws(() => normalizeVersion('latest'), /MAJOR\.MINOR\.PATCH/);
});

test('приймає лише HTTP-адреси сервера оновлень', () => {
  assert.equal(validateHttpUrl('https://example.com/version.json', 'manifest'), 'https://example.com/version.json');
  assert.throws(() => validateHttpUrl('file:///tmp/version.json', 'manifest'), /HTTP або HTTPS/);
});
