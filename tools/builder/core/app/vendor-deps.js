import fs from 'fs';
import path from 'path';

/*
Dev builds serve tsc output unbundled, so the browser has to resolve bare imports
(`import 'a11y-elements/overlays/modal'`) itself. Every runtime `dependencies` entry
in package.json is copied to <build>/vendor/<name>/ and exposed through an import map
built from the package's `exports` (subpath patterns are expanded against the files
actually shipped). Prod doesn't need any of this: esbuild bundles bare imports.
Dependencies must ship browser-ready ESM.
*/

export const VENDOR_DIR = 'vendor';

const IMPORT_CONDITIONS = ['browser', 'import', 'module', 'default'];

export function getRuntimeDependencies(root = process.cwd()) {
  const pkg = readJson(path.join(root, 'package.json'));
  return Object.keys(pkg.dependencies ?? {});
}

export function getPackageDir(name, root = process.cwd()) {
  return path.join(root, 'node_modules', name);
}

export async function copyVendorDependencies(destRoot, root = process.cwd()) {
  for (const name of getRuntimeDependencies(root)) {
    const src = getPackageDir(name, root);
    if (!fs.existsSync(src)) throw new Error(`Dependency "${name}" is not installed — run npm install.`);
    await fs.promises.cp(src, path.join(destRoot, VENDOR_DIR, name), {
      recursive: true,
      filter: (file) => !path.relative(src, file).split(path.sep).includes('node_modules'),
    });
  }
}

export function buildImportMap(root = process.cwd()) {
  const imports = {};
  for (const name of getRuntimeDependencies(root)) {
    Object.assign(imports, packageImports(name, getPackageDir(name, root)));
  }
  return { imports };
}

function packageImports(name, pkgDir) {
  const pkg = readJson(path.join(pkgDir, 'package.json'));
  const url = (target) => `/${VENDOR_DIR}/${name}/${target.replace(/^\.\//, '')}`;
  const imports = {};

  if (!pkg.exports) {
    const entry = pkg.module ?? pkg.main ?? 'index.js';
    imports[name] = url(entry);
    return imports;
  }

  const exportsMap = typeof pkg.exports === 'string' || isConditions(pkg.exports)
    ? { '.': pkg.exports }
    : pkg.exports;

  for (const [subpath, value] of Object.entries(exportsMap)) {
    const target = resolveTarget(value);
    if (!target || !target.endsWith('.js')) continue;
    const specifier = subpath === '.' ? name : `${name}/${subpath.replace(/^\.\//, '')}`;

    if (!subpath.includes('*')) {
      imports[specifier] = url(target);
      continue;
    }
    for (const match of expandPattern(pkgDir, target)) {
      imports[specifier.replaceAll('*', match)] = url(target.replaceAll('*', match));
    }
  }
  return imports;
}

function resolveTarget(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return null;
  for (const condition of IMPORT_CONDITIONS) {
    if (condition in value) return resolveTarget(value[condition]);
  }
  return null;
}

function isConditions(obj) {
  return typeof obj === 'object' && Object.keys(obj).every(key => !key.startsWith('.'));
}

// Node substitutes the same string for every '*' in a pattern: list the entries of the
// directory holding the first '*', derive candidate matches from the rest of that path
// segment (`*/define.js` → directory names, `*.js` → file names minus `.js`), and keep
// those whose full target exists.
function expandPattern(pkgDir, target) {
  const starIndex = target.indexOf('*');
  const baseDir = path.join(pkgDir, target.slice(0, target.lastIndexOf('/', starIndex) + 1));
  const segmentPrefix = target.slice(target.lastIndexOf('/', starIndex) + 1, starIndex);
  const rest = target.slice(starIndex + 1);
  const segmentSuffix = rest.includes('/') ? rest.slice(0, rest.indexOf('/')) : rest;
  if (!fs.existsSync(baseDir)) return [];

  return fs.readdirSync(baseDir)
    .filter(entry => entry.startsWith(segmentPrefix) && entry.endsWith(segmentSuffix))
    .map(entry => entry.slice(segmentPrefix.length, entry.length - segmentSuffix.length))
    .filter(match => match && fs.existsSync(path.join(pkgDir, target.replaceAll('*', match))));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
