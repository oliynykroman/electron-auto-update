const { app, BrowserWindow, dialog, ipcMain, session } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { compareVersions, validateHttpUrl } = require('./update-utils');

const DEFAULT_CONFIG = {
  environment: 'development',
  remoteUrl: 'https://updates.example.invalid/electron-update-demo/',
  manifestUrl: 'https://updates.example.invalid/electron-update-demo/version.json',
};

function readRuntimeConfig() {
  const configPath = app.isPackaged
    ? path.join(process.resourcesPath, 'electron-env.json')
    : path.join(__dirname, '..', 'electron-env.json');

  let fileConfig = {};
  try {
    fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.warn(`Не вдалося прочитати ${configPath}: ${error.message}`);
  }

  const config = {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    environment: process.env.ELECTRON_ENV || fileConfig.environment || DEFAULT_CONFIG.environment,
    remoteUrl: process.env.ELECTRON_REMOTE_URL || fileConfig.remoteUrl || DEFAULT_CONFIG.remoteUrl,
    manifestUrl: process.env.ELECTRON_MANIFEST_URL || fileConfig.manifestUrl || DEFAULT_CONFIG.manifestUrl,
  };

  config.useRemote = ['staging', 'production'].includes(config.environment);
  if (config.useRemote) {
    config.remoteUrl = validateHttpUrl(config.remoteUrl, 'remoteUrl');
  }
  config.manifestUrl = validateHttpUrl(config.manifestUrl, 'manifestUrl');

  return config;
}

const runtimeConfig = readRuntimeConfig();

async function loadInterface(window) {
  if (runtimeConfig.useRemote) {
    await session.defaultSession.clearCache();
    const remoteUrl = new URL(runtimeConfig.remoteUrl);
    remoteUrl.searchParams.set('desktop-shell', app.getVersion());
    remoteUrl.searchParams.set('cache-bust', Date.now().toString());
    await window.loadURL(remoteUrl.toString());
    return;
  }

  await window.loadFile(path.join(__dirname, '..', 'dist', 'electron-update-demo', 'index.html'));
}

function createWindow() {
  const window = new BrowserWindow({
    width: 760,
    height: 520,
    minWidth: 640,
    minHeight: 440,
    title: 'Центр оновлення',
    autoHideMenuBar: true,
    backgroundColor: '#f5f7fb',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, targetUrl) => {
    try {
      const allowedUrl = runtimeConfig.useRemote
        ? new URL(runtimeConfig.remoteUrl).origin
        : 'file://';
      const targetOrigin = targetUrl.startsWith('file:') ? 'file://' : new URL(targetUrl).origin;
      if (targetOrigin !== allowedUrl) event.preventDefault();
    } catch {
      event.preventDefault();
    }
  });

  loadInterface(window).catch((error) => {
    console.error(error);
    dialog.showErrorBox(
      'Не вдалося завантажити інтерфейс',
      'Перевірте адресу сервера та підключення до мережі.',
    );
  });
}

app.whenReady().then(() => {
  ipcMain.handle('runtime-info', () => ({
    shellVersion: app.getVersion(),
    environment: runtimeConfig.environment,
    source: runtimeConfig.useRemote ? 'remote' : 'local',
  }));

  ipcMain.handle('check-for-update', async (_event, currentVersion) => {
    compareVersions(currentVersion, currentVersion);

    let response;
    try {
      response = await fetch(runtimeConfig.manifestUrl, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new Error('Не вдалося з’єднатися із сервером оновлень.');
    }
    if (!response.ok) {
      throw new Error(`Сервер оновлень повернув код HTTP ${response.status}.`);
    }

    const manifest = await response.json();
    if (!manifest || typeof manifest.version !== 'string') {
      throw new Error('Маніфест оновлення не містить номера версії.');
    }

    return {
      currentVersion,
      latestVersion: manifest.version,
      updateAvailable: compareVersions(currentVersion, manifest.version) < 0,
    };
  });

  ipcMain.handle('reload-interface', async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) await loadInterface(window);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
