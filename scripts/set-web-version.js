const fs = require('node:fs');
const path = require('node:path');

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Використання: node scripts/set-web-version.js MAJOR.MINOR.PATCH');
  process.exit(1);
}

const root = path.join(__dirname, '..');
for (const filename of ['environment.ts', 'environment.local.ts', 'environment.staging.ts', 'environment.prod.ts']) {
  const environmentPath = path.join(root, 'src', 'environments', filename);
  const content = fs.readFileSync(environmentPath, 'utf8');
  fs.writeFileSync(environmentPath, content.replace(/appVersion: '[^']+'/, `appVersion: '${version}'`));
}

const manifestPath = path.join(root, 'src', 'version.json');
fs.writeFileSync(manifestPath, `${JSON.stringify({ version }, null, 2)}\n`);
console.log(`Версію вебінтерфейсу змінено на ${version}.`);
