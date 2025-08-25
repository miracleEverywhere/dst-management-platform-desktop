const {contextBridge, ipcRenderer} = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
  openDashboardWindow: () => ipcRenderer.send('open-dashboard-window'),
  openConfigWindow: () => ipcRenderer.send('open-config-window'),
  reloadWindow: () => ipcRenderer.send('reload-window'),

  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),

  setStoreValue: (key, value) => ipcRenderer.send('setStore', key, value),
  deleteStoreValue: (key) => ipcRenderer.send('deleteStore', key),
  getStoreValue: (key) => {
    return ipcRenderer.sendSync('getStore', key)
  },
  clearStoreValue: () => {
    return ipcRenderer.sendSync('clearStore')
  },

  onNavigate: (callback) => {
    ipcRenderer.on('force-navigate', (event, path) => callback(path))
  },

  downloadFile: async (url, fileName) => {
    try {
      // 可选：让用户选择保存位置
      const { filePath } = await ipcRenderer.invoke('show-save-dialog', {
        title: '保存文件',
        defaultPath: fileName
      });

      if (!filePath) return; // 用户取消了

      // 开始下载
      ipcRenderer.send('download-started', { url, filePath });

      // 等待下载完成
      const result = await ipcRenderer.invoke('download-file', {
        url: url,
        fileName: filePath
      });

      console.log('文件已保存到:', result.filePath);
      alert('下载完成!');

    } catch (error) {
      console.error('下载失败:', error);
      alert(`下载失败: ${error.error || error.message}`);
    }
  }

});