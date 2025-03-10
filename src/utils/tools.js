import ElectronApi from "@/utils/electronApi";
import {useTheme} from "vuetify";
import { v4 } from 'uuid';
import {DB_KEY} from "@/config";

export const initTheme = () => {
    const {
        name: themeName,
        global: globalTheme,
    } = useTheme()

    let theme = ElectronApi.store.get(DB_KEY.theme)

    if (theme) {
        globalTheme.name.value = theme
    } else {
        ElectronApi.store.set(DB_KEY.theme, 'light')
    }
}

export const uuid4 = () => {
    return v4()
}

export const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const validateIpv4 = (ip) => {
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (ipv4Pattern.test(ip)) {
        return true;
    } else {
        return '请输入正确的IP地址';
    }
}

export const truncateString = (str) => {
    if (str.length > 15) {
        return str.slice(0, 18) + '...';
    } else {
        return str;
    }
}