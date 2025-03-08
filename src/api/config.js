import http from '@/utils/axios'


export default {
    baseInfo: {
        url: `/setting/room`,
        get: async function (data) {
            return await http.get(this.url, data);
        }
    },
    multiHost: {
        url: `/setting/room/multihost`,
        get: async function (data) {
            return await http.get(this.url, data);
        }
    }
}