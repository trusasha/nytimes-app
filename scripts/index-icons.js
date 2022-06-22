const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const prettierConfig = require('../.prettierrc.js');

const svgPath = path.join(__dirname, '../src/assets/svg');
const indexPath = path.join(svgPath, 'index.js');

/** @type {string[]} */
let filenames = [];
try {
  filenames = fs.readdirSync(svgPath).filter((filename) => filename !== 'index.js');
} catch {}

const toIconName = (filename = '') =>
  filename[0].toUpperCase() +
  filename.slice(1, -'.svg'.length).replace(/-(.)/g, (_, group1) => group1.toUpperCase()) +
  'Icon';

const importStr = filenames
  .map((filename) => `import ${toIconName(filename)} from './${filename}'`)
  .join(';');

const exportStr =
  'export {' + filenames.map((filename) => `  ${toIconName(filename)}`).join(',') + '}';

const dataStr = prettier.format(importStr + '\r\n\r\n' + exportStr, {
  ...prettierConfig,
  parser: 'babel',
});

fs.writeFileSync(indexPath, dataStr);

console.log('svg icons index generation done');
