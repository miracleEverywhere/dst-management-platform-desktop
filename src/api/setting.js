import http from "@/utils/axios.js";


export default {
    room: {
        url: `/setting/room`,
        get: async function(data){
            return await http.get(this.url, data);
        },
    },
    multihost: {
        url: `/setting/room/multihost`,
        get: async function(data){
            return await http.get(this.url, data);
        },
        post: async function(data){
            return await http.post(this.url, data);
        },
    },
    save: {
        url: `/setting/room/save`,
        post: async function (data) {
            return await http.post(this.url, data);
        }
    },
    saveAndRestart: {
        url: `/setting/room/save_restart`,
        post: async function (data) {
            return await http.post(this.url, data);
        }
    },
    saveAndGenerate: {
        url: `/setting/room/save_generate`,
        post: async function (data) {
            return await http.post(this.url, data);
        }
    },
    player: {
        list: {
            url: `/setting/player/list`,
            get: async function(data){
                return await http.get(this.url, data);
            },
        },
        history: {
            url: `/setting/player/list/history`,
            get: async function(data){
                return await http.get(this.url, data);
            },
        },
        addAdmin: {
            url: `/setting/player/add/admin`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        deleteAdmin: {
            url: `/setting/player/delete/admin`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        addBlock: {
            url: `/setting/player/add/block`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        addBlockUpload: {
            url: `/setting/player/add/block/upload`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        deleteBlock: {
            url: `/setting/player/delete/block`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        addWhite: {
            url: `/setting/player/add/white`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        deleteWhite: {
            url: `/setting/player/delete/white`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        kick: {
            url: `/setting/player/kick`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
    },
    import: {
        upload: {
            url: `/setting/import/upload`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
    },
    mod: {
        settingFormat: {
            url: `/setting/mod/setting/format`,
            get: async function (data) {
                return await http.get(this.url, data);
            }
        },
        configOptions: {
            url: `/setting/mod/config_options`,
            get: async function (data) {
                return await http.get(this.url, data);
            }
        },
        download: {
            url: `/setting/mod/download`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        sync: {
            url: `/setting/mod/sync`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        delete: {
            url: `/setting/mod/delete`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        enable: {
            url: `/setting/mod/enable`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        disable: {
            url: `/setting/mod/disable`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        configChange: {
            url: `/setting/mod/config/change`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        macosExport: {
            url: `/setting/mod/export/macos`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        update: {
            url: `/setting/mod/update`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        addClintModsDisabled: {
            url: `/setting/mod/add/clint_mods_disabled`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
        deleteClintModsDisabled: {
            url: `/setting/mod/delete/clint_mods_disabled`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        },
    },
    system: {
        setting: {
            url: `/setting/system/setting`,
            get: async function (data) {
                return await http.get(this.url, data);
            },
            put: async function (data) {
                return await http.put(this.url, data);
            }
        }
    }

}
