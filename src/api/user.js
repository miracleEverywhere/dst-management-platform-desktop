import http from "@/utils/axios"

export default {
  register: {
    url: `/user/register`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
  login: {
    url: `/user/login`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
  base: {
    url: `/user/base`,
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
  menu: {
    url: `/user/menu`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  list: {
    url: `/user/list`,
    get: async function (data) {
      return await http.get(this.url, data)
    },
  },
  myself: {
    url: `/user/myself`,
    put: async function (data) {
      return await http.put(this.url, data)
    },
  },
}