import http from '@/utils/axios'


export default {
  clusters: {
    url: `/setting/clusters`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    all: {
      url: `/setting/clusters/all`,
      get: async function(data){
        return await http.get(this.url, data);
      },
    },
  },
}