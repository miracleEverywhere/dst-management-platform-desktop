const { contextBridge, ipcRenderer } = require('electron')



contextBridge.exposeInMainWorld('electronAPI', {
    openDashboardWindow: () => ipcRenderer.send('open-dashboard-window'),
    openConfigWindow: () => ipcRenderer.send('open-config-window'),

    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),

    setStoreValue: (key, value) => ipcRenderer.send('setStore', key, value),
    deleteStoreValue: (key) => ipcRenderer.send('deleteStore', key),
    getStoreValue: (key) => {
        return ipcRenderer.sendSync('getStore', key)
    },
});