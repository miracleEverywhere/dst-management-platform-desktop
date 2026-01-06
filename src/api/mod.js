import http from "@/utils/axios"

export default {
  download: {
    url: `/mod/download`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
  search: {
    url: `/mod/search`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  downloaded: {
    url: `/mod/downloaded`,
    get: async function(data){
      return await http.get(this.url, data)
    },
  },
  add: {
    enable: {
      url: `/mod/add/enable`,
      post: async function(data){
        return await http.post(this.url, data)
      },
    },
  },
  setting: {
    modConfigStruct: {
      url: `/mod/setting/mod_config_struct`,
      get: async function(data){
        return await http.get(this.url, data)
      },
    },
    modConfigValue: {
      url: `/mod/setting/mod_config_value`,
      get: async function(data){
        return await http.get(this.url, data)
      },
      put: async function(data){
        return await http.put(this.url, data)
      },
    },
    enabledMods: {
      url: `/mod/setting/enabled`,
      get: async function(data){
        return await http.get(this.url, data)
      },
    },
    disableMod: {
      url: `/mod/setting/disable`,
      post: async function(data){
        return await http.post(this.url, data)
      },
    },
  },
  delete: {
    url: `/mod/delete`,
    post: async function(data){
      return await http.post(this.url, data)
    },
  },
}
