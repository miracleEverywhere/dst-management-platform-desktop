
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