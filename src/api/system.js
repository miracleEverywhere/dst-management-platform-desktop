import http from "@/utils/axios.js";


export default {
  login: {
    url: `/login`,
    post: async function(data){
      return await http.post(this.url, data);
    }
  },
  menu: {
    url: `/menu`,
    get: async function(data){
      return await http.get(this.url, data);
    },
  },
  userInfo: {
    url: `/userinfo`,
    get: async function(data){
      return await http.get(this.url, data);
    },
  },
  updatePassword: {
    url: `/update/password`,
    post: async function(data){
      return await http.post(this.url, data);
    }
  },
  userList: {
    url: `/user/list`,
    get: async function(data){
      return await http.get(this.url, data);
    },
  },
  user: {
    url: `/user`,
    post: async function(data){
      return await http.post(this.url, data);
    },
    put: async function(data){
      return await http.put(this.url, data);
    },
    delete: async function(data){
      return await http.delete(this.url, data);
    },
  },
  register: {
    url: `/register`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    post: async function(data){
      return await http.post(this.url, data);
    },
  },
  announcedID: {
    url: `/announce_id`,
    get: async function(data){
      return await http.get(this.url, data);
    },
    post: async function(data){
      return await http.post(this.url, data);
    },
  },
}