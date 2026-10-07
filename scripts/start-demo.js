const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const host = '127.0.0.1';
const port = 4173;
const root = path.resolve(__dirname, '..');
const updatesRoot = path.join(root, 'updates');
const manifestPath = path.join(updatesRoot, 'version.json');

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

if (!fs.existsSync(manifestPath)) {
  console.error('Каталог updates/ не містить version.json. Спочатку підготуйте демо-оновлення.');
  process.exit(1);
}

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  const relativePath = pathname.replace(/^\/+/, '') || 'index.html';
  const targetPath = path.resolve(updatesRoot, relativePath);

  if (targetPath !== updatesRoot && !targetPath.startsWith(`${updatesRoot}${path.sep}`)) return null;
  return targetPath;
}

const server = http.createServer((request, response) => {
  let targetPath;
  try {
    targetPath = resolveRequestPath(request.url || '/');
  } catch {
    response.writeHead(400).end('Некоректний запит.');
    return;
  }

  if (!targetPath) {
    response.writeHead(403).end('Доступ заборонено.');
    return;
  }

  fs.stat(targetPath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404).end('Файл не знайдено.');
      return;
    }

    response.writeHead(200, {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': contentTypes.get(path.extname(targetPath)) || 'application/octet-stream',
    });
    fs.createReadStream(targetPath).pipe(response);
  });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Порт ${port} уже використовується. Зупиніть попередній процес демо.`);
  } else {
    console.error(`Не вдалося запустити сервер оновлень: ${error.message}`);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  const updateUrl = `http://${host}:${port}/`;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`Локальний сервер оновлень ${manifest.version}: ${updateUrl}`);

  const electronPath = require('electron');
  const electron = spawn(electronPath, ['.'], {
    cwd: root,
    env: {
      ...process.env,
      ELECTRON_ENV: 'local',
      ELECTRON_REMOTE_URL: updateUrl,
      ELECTRON_MANIFEST_URL: `${updateUrl}version.json`,
    },
    stdio: 'inherit',
  });

  electron.on('error', (error) => {
    console.error(`Не вдалося запустити Electron: ${error.message}`);
    server.close(() => process.exit(1));
  });

  electron.on('exit', (code) => {
    server.close(() => process.exit(code || 0));
  });
});

function stop() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
