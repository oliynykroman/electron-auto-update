const fs = require('node:fs');
const path = require('node:path');

const supported = new Set(['local', 'development', 'staging', 'production']);
const environment = process.argv[2] || 'development';

if (!supported.has(environment)) {
  console.error(`Непідтримуване середовище: ${environment}`);
  process.exit(1);
}

const configPath = path.join(__dirname, '..', 'electron-env.json');
const existing = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const next = {
  ...existing,
  environment,
};

fs.writeFileSync(configPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Середовище Electron змінено на ${environment}.`);
