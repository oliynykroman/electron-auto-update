const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Використання: node scripts/prepare-demo-update.js MAJOR.MINOR.PATCH');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const versionFiles = [
  'src/environments/environment.ts',
  'src/environments/environment.local.ts',
  'src/environments/environment.staging.ts',
  'src/environments/environment.prod.ts',
  'src/version.json',
];
const originals = new Map(
  versionFiles.map((filename) => [filename, fs.readFileSync(path.join(root, filename), 'utf8')]),
);

function setTemporaryVersion() {
  for (const filename of versionFiles.slice(0, -1)) {
    const filePath = path.join(root, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(filePath, content.replace(/appVersion: '[^']+'/, `appVersion: '${version}'`));
  }
  fs.writeFileSync(path.join(root, 'src', 'version.json'), `${JSON.stringify({ version }, null, 2)}\n`);
}

function restoreSourceVersion() {
  for (const [filename, content] of originals) {
    fs.writeFileSync(path.join(root, filename), content);
  }
}

setTemporaryVersion();

try {
  const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(
    executable,
    ['ng', 'build', '--configuration', 'production', '--output-path', 'updates'],
    { cwd: root, encoding: 'utf8', stdio: 'inherit' },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status || 1;
  else {
    fs.writeFileSync(path.join(root, 'updates', '.nojekyll'), '');
    console.log(`Оновлення ${version} підготовлено в каталозі updates/.`);
  }
} finally {
  restoreSourceVersion();
}
