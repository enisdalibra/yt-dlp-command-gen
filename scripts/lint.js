// Dependency-free lint: syntax-checks every source JS file and verifies the
// committed build artifacts (root index.html + dist/index.html) are fresh.
// The repo intentionally commits build output, so a stale artifact is a
// review-blocking bug just like a failing test.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT_DIR = path.join(__dirname, '..');
const SCAN_DIRS = ['src', 'scripts', 'test'];
const ARTIFACTS = ['index.html', path.join('dist', 'index.html')];

function listJsFiles(baseDir) {
  const out = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.js')) out.push(full);
    }
  })(baseDir);
  return out;
}

function main() {
  let failed = false;

  for (const dir of SCAN_DIRS) {
    for (const file of listJsFiles(path.join(ROOT_DIR, dir))) {
      try {
        execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
        console.log(`ok syntax ${path.relative(ROOT_DIR, file)}`);
      } catch (e) {
        failed = true;
        console.error(`FAIL syntax ${path.relative(ROOT_DIR, file)}`);
        console.error(e.stderr.toString());
      }
    }
  }

  const before = new Map(ARTIFACTS.map(f => [f, fs.readFileSync(path.join(ROOT_DIR, f), 'utf8')]));
  execFileSync(process.execPath, [path.join(__dirname, 'build.js')], { stdio: 'inherit' });
  for (const artifact of ARTIFACTS) {
    const after = fs.readFileSync(path.join(ROOT_DIR, artifact), 'utf8');
    if (before.get(artifact) !== after) {
      failed = true;
      console.error(`FAIL stale build artifact: ${artifact} differs from the committed copy. Run "npm run build" and commit the result.`);
    } else {
      console.log(`ok fresh ${artifact}`);
    }
  }

  if (failed) process.exit(1);
}

main();
