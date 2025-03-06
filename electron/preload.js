const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openMainWindow: () => ipcRenderer.send('open-main-window'),
    openConfigWindow: () => ipcRenderer.send('open-config-window'),

    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
});