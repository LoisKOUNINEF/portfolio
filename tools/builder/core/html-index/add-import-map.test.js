import fs from 'fs';
import os from 'os';
import path from 'path';
import { addImportMap } from './add-import-map.js';

describe('addImportMap', () => {
  let tmpDir;
  let filePath;
  const importMap = { imports: { 'pkg/a': '/vendor/pkg/a.js' } };
  const tag = `<script type="importmap">${JSON.stringify(importMap)}</script>`;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nutin-import-map-'));
    filePath = path.join(tmpDir, 'index.html');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('inserts the import map right after <head>, ahead of any module script', async () => {
    const html = '<html><head><title>T</title></head><body><script type="module" src="/app/main.js"></script></body></html>';

    const result = await addImportMap(html, filePath, importMap);

    expect(result).toBe(`<html><head>${tag}<title>T</title></head><body><script type="module" src="/app/main.js"></script></body></html>`);
    expect(fs.readFileSync(filePath, 'utf8')).toBe(result);
  });

  it('prepends the import map when there is no <head>', async () => {
    const result = await addImportMap('<html></html>', filePath, importMap);

    expect(result).toBe(`${tag}<html></html>`);
  });

  it('leaves the html untouched when there is nothing to map', async () => {
    const html = '<html><head></head></html>';

    const result = await addImportMap(html, filePath, { imports: {} });

    expect(result).toBe(html);
    expect(fs.existsSync(filePath)).toBe(false);
  });
});
