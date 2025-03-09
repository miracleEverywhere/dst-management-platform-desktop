import http from "@/utils/axios.js";

export default {
    roomInfo: {
        url: `/home/room_info`,
        get: async function (data) {
            return await http.get(this.url, data);
        }
    },
    sysInfo: {
        url: `/home/sys_info`,
        get: async function (data) {
            return await http.get(this.url, data);
        }
    },
    exec: {
        url: `/home/exec`,
        post: async function(data){
            return await http.post(this.url, data);
        }
    },
    interface: {
        announce: {
            url: `/home/announce`,
            post: async function(data){
                return await http.post(this.url, data);
            }
        },
        console: {
            url: `/home/console`,
            post: async function(data){
                return await http.post(this.url, data);
            }
        }
    },
}