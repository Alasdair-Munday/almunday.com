import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
test('production graph resolves titles, deduplicates links, excludes drafts and code', () => {
  const root = mkdtempSync(join(tmpdir(), 'modular-graph-'));
  try {
    mkdirSync(join(root, 'scripts'));
    mkdirSync(join(root, 'src/content/posts'), { recursive: true });
    mkdirSync(join(root, 'src/utils'), { recursive: true });
    copyFileSync('src/utils/note-maturity.mjs', join(root, 'src/utils/note-maturity.mjs'));
    writeFileSync(join(root, 'package.json'), '{"type":"module"}');
    writeFileSync(join(root, 'src/config.ts'), 'maxNodes: 100');
    copyFileSync('scripts/generate-graph-data.js', join(root, 'scripts/generate-graph-data.js'));
    const note = (slug, title, body, draft = false, maturity = '') => writeFileSync(join(root, `src/content/posts/${slug}.md`), `---\ntitle: ${title}\ndate: 2026-10-21\ndraft: ${draft}\n${maturity ? `maturity: ${maturity}\n` : ''}---\n${body}`);
    note('first', 'First', '[[Different title]] [[Different title]] `[[Private]]`\n\n```md\n[[Third]]\n```');
    note('second', 'Different title', '', false, 'growing');
    note('third', 'Third', '', false, 'seedling');
    note('private', 'Private', '', true);
    execFileSync(process.execPath, ['scripts/generate-graph-data.js', '--production'], { cwd: root });
    const data = JSON.parse(readFileSync(join(root, 'public/graph/graph-data.json')));
    assert.equal(data.nodes.length, 3);
    assert.deepEqual(data.nodes.map(node => node.maturity), ['established', 'growing', 'seedling']);
    assert.deepEqual(data.connections, [{ source: 'first', target: 'second', type: 'link' }]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
