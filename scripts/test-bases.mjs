import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseDocument } from 'yaml';

function baseFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.obsidian') return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? baseFiles(path) : entry.name.endsWith('.base') ? [path] : [];
  });
}

for (const path of baseFiles('src/content')) {
  test(`Obsidian Base parses with unique keys: ${path}`, () => {
    const document = parseDocument(readFileSync(path, 'utf8'), { uniqueKeys: true });
    assert.deepEqual(document.errors.map(error => error.message), []);
    assert.ok(Array.isArray(document.toJS().views), 'Base must define its views');
  });
}

test('duplicate property keys are rejected', () => {
  const document = parseDocument('properties:\n  note.date: {}\n  note.date: {}\n', { uniqueKeys: true });
  assert.ok(document.errors.some(error => error.code === 'DUPLICATE_KEY'));
});
