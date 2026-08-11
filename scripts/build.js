const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const templatePath = path.join(SRC_DIR, 'index.template.html');
const stylePath = path.join(SRC_DIR, 'styles.css');
const scriptPath = path.join(SRC_DIR, 'app.js');
const rootOutputPath = path.join(ROOT_DIR, 'index.html');
const distOutputPath = path.join(DIST_DIR, 'index.html');

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8').trimEnd();
}

function buildHtml() {
  const template = readUtf8(templatePath);
  const styles = readUtf8(stylePath);
  const script = readUtf8(scriptPath);
  const styleTagPattern = /<link rel="stylesheet" href="styles\.css" data-build-inline="style" \/>/;
  const scriptTagPattern = /<script src="app\.js" data-build-inline="script"><\/script>/;

  if (!styleTagPattern.test(template)) {
    throw new Error('Could not find stylesheet inline marker.');
  }
  if (!scriptTagPattern.test(template)) {
    throw new Error('Could not find script inline marker.');
  }

  return `${template
    .replace(styleTagPattern, `<style>\n${styles.replace(/^/gm, '    ')}\n  </style>`)
    .replace(scriptTagPattern, `<script>\n${script}\n</script>`)}\n`;
}

function main() {
  const html = buildHtml();
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(rootOutputPath, html);
  fs.writeFileSync(distOutputPath, html);
  console.log(`Built ${path.relative(ROOT_DIR, rootOutputPath)} and ${path.relative(ROOT_DIR, distOutputPath)}`);
}

main();
