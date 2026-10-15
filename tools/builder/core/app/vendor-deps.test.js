import fs from 'fs';
import os from 'os';
import path from 'path';
import { buildImportMap, copyVendorDependencies } from './vendor-deps.js';

function write(file, content = '') {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof content === 'string' ? content : JSON.stringify(content));
}

describe('vendor-deps', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'nutin-vendor-'));
    write(path.join(root, 'package.json'), { dependencies: { 'pkg-a': '^1.0.0', 'pkg-b': '^1.0.0' } });

    const a = path.join(root, 'node_modules', 'pkg-a');
    write(path.join(a, 'package.json'), {
      exports: {
        './package.json': './package.json',
        './styles.css': './dist/styles.css',
        './core': { types: './dist/core/index.d.ts', import: './dist/core/index.js' },
        './widgets/*': { import: './dist/widgets/*/define.js' },
        './widgets/*/element': { import: './dist/widgets/*/*.element.js' },
        './helpers/*': './dist/helpers/*.js',
      },
    });
    write(path.join(a, 'dist/core/index.js'));
    write(path.join(a, 'dist/widgets/modal/define.js'));
    write(path.join(a, 'dist/widgets/modal/modal.element.js'));
    write(path.join(a, 'dist/widgets/core/shared.js')); // no define.js: not an entry
    write(path.join(a, 'dist/helpers/focus.js'));
    write(path.join(a, 'node_modules/nested/index.js'));

    const b = path.join(root, 'node_modules', 'pkg-b');
    write(path.join(b, 'package.json'), { module: 'esm/index.js' });
    write(path.join(b, 'esm/index.js'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('maps exact subpaths and expands directory and file patterns to existing files only', () => {
    expect(buildImportMap(root)).toEqual({
      imports: {
        'pkg-a/core': '/vendor/pkg-a/dist/core/index.js',
        'pkg-a/widgets/modal': '/vendor/pkg-a/dist/widgets/modal/define.js',
        'pkg-a/widgets/modal/element': '/vendor/pkg-a/dist/widgets/modal/modal.element.js',
        'pkg-a/helpers/focus': '/vendor/pkg-a/dist/helpers/focus.js',
        'pkg-b': '/vendor/pkg-b/esm/index.js',
      },
    });
  });

  it('copies each runtime dependency to vendor/, without its own node_modules', async () => {
    const dest = path.join(root, 'out');

    await copyVendorDependencies(dest, root);

    expect(fs.existsSync(path.join(dest, 'vendor/pkg-a/dist/widgets/modal/define.js'))).toBe(true);
    expect(fs.existsSync(path.join(dest, 'vendor/pkg-b/esm/index.js'))).toBe(true);
    expect(fs.existsSync(path.join(dest, 'vendor/pkg-a/node_modules'))).toBe(false);
  });
});
