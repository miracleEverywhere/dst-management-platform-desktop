import http from "@/utils/axios.js";

export default {
    logValue: {
        url: `/logs/log_value`,
        get: async function (data) {
            return await http.get(this.url, data);
        }
    },
    install: {
        url: `/tools/install`,
        post: async function (data) {
            return await http.post(this.url, data);
        }
    },
    processLog: {
        url: `/logs/process_log`,
        post: async function (data) {
            return await http.post(this.url, data);
        }
    },
    historical: {
        logFile: {
            url: `/logs/historical/log_file`,
            get: async function (data) {
                return await http.get(this.url, data);
            }
        },
        log: {
            url: `/logs/historical/log`,
            get: async function (data) {
                return await http.get(this.url, data);
            }
        },
    },
    clean: {
        status: {
            url: `/logs/status`,
            get: async function (data) {
                return await http.get(this.url, data);
            }
        },
        clean: {
            url: `/logs/clean`,
            post: async function (data) {
                return await http.post(this.url, data);
            }
        }
    },
}
