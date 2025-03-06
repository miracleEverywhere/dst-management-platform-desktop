const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openDashboardWindow: () => ipcRenderer.send('open-dashboard-window'),
    openConfigWindow: () => ipcRenderer.send('open-config-window'),

    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
});