const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('updateDemo', {
  getRuntimeInfo: () => ipcRenderer.invoke('runtime-info'),
  checkForUpdate: (currentVersion) => ipcRenderer.invoke('check-for-update', currentVersion),
  reloadInterface: () => ipcRenderer.invoke('reload-interface'),
});

