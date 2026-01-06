import http from "@/utils/axios"

export default {
  base: {
    url: `/room`,
    get: async function(data){
      return await http.get(this.url, data)
    },
    post: async function(data){
      return await http.post(this.url, data)
    },
    put: async function(data){
      return await http.put(this.url, data)
    },
    delete: async function(data){
      return await http.delete(this.url, data)
    },
  },
  list: {
    url: `/room/list`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  factor: {
    url: `/room/factor`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  basic: {
    url: `/room/basic`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  worlds: {
    url: `/room/worlds`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  upload: {
    url: `/room/upload`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
  activate: {
    url: `/room/activate`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
  deactivate: {
    url: `/room/deactivate`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
}