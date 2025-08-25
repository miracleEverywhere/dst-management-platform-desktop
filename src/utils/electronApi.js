export default class ElectronApi {
  static store = {
    get(key) {
      return window.electronAPI.getStoreValue(key)
    },
    set(key, value) {
      window.electronAPI.setStoreValue(key, value)
    },
    delete(key) {
      window.electronAPI.deleteStoreValue(key)
    },
    append(key, value) {
      let dbValue = window.electronAPI.getStoreValue(key)
      dbValue.push(value)
      this.set(key, dbValue)
    },
    clear() {
      window.electronAPI.clearStoreValue()
    }
  }
  static window = {
    dashboard() {
      window.electronAPI.openDashboardWindow()
    },
    config() {
      window.electronAPI.openConfigWindow()
    },
    reload() {
      window.electronAPI.reloadWindow()
    },
  }
  static download = {
    file(url, name) {
      window.electronAPI.downloadFile(url, name)
    }
  }
  electronAPI;
}