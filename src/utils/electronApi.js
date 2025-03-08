
export default class ElectronApi {
    electronAPI;
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
        }
    }
}