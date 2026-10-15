import { writeFile } from 'fs/promises';

/**
 * Inserts `<script type="importmap">` at the top of <head> — it must precede
 * every module script for the browser to apply it.
 */
export async function addImportMap(htmlContent, filePath, importMap) {
  if (!Object.keys(importMap.imports ?? {}).length) return htmlContent;

  const tag = `<script type="importmap">${JSON.stringify(importMap)}</script>`;
  const headOpen = /<head[^>]*>/i;
  const modifiedHtml = headOpen.test(htmlContent)
    ? htmlContent.replace(headOpen, (match) => `${match}${tag}`)
    : tag + htmlContent;

  await writeFile(filePath, modifiedHtml, 'utf8');
  return modifiedHtml;
}
