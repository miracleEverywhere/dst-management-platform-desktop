import ElectronApi from "@/utils/electronApi";
import { useTheme } from "vuetify";
import { v4 } from "uuid";
import { DB_KEY } from "@/config";
import useGlobalStore from "@/plugins/pinia/global";

export const initTheme = () => {
    const { name: themeName, global: globalTheme } = useTheme();

    let theme = ElectronApi.store.get(DB_KEY.theme);
    const globalStore = useGlobalStore();

    if (theme) {
        globalTheme.name.value = theme;
        globalStore.theme = theme;
    } else {
        ElectronApi.store.set(DB_KEY.theme, "light");
    }
};

export const uuid4 = () => {
    return v4();
};

export const sleep = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const validateIpv4 = (ip) => {
    const ipv4Pattern =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (ipv4Pattern.test(ip)) {
        return true;
    } else {
        return "请输入正确的IP地址";
    }
};

export const truncateString = (str) => {
    if (str.length > 15) {
        return str.slice(0, 15) + "...";
    } else {
        return str;
    }
};

export const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const saveFile = (base64Data, fileName) => {
    // 解码 Base64 数据
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 创建 Blob 对象
    const blob = new Blob([byteArray], { type: "application/octet-stream" });

    // 适用于其他现代浏览器
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const createMdEditorValue = (value, lang, stat) => {
    return "```" + lang + " ::" + stat + "\n" + value;
};

export function seconds2Time(totalSeconds) {
    const years = Math.floor(totalSeconds / (365 * 24 * 60 * 60));
    totalSeconds %= 365 * 24 * 60 * 60;
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    totalSeconds %= 24 * 60 * 60;
    const hours = Math.floor(totalSeconds / (60 * 60));
    totalSeconds %= 60 * 60;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const timeParts = [];

    if (years > 0) timeParts.push(`${years}年`);
    if (days > 0) timeParts.push(`${days}天`);
    if (hours > 0) timeParts.push(`${hours}时`);
    if (minutes > 0) timeParts.push(`${minutes}分`);
    if (seconds > 0) timeParts.push(`${seconds}秒`);

    return timeParts.length > 0 ? timeParts.join(" ") : "0秒";
}

export const timestamp2time = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return (
        year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
    );
};


export const timestamp2timeWithoutDate = (timestamp) => {
    const date = new Date(timestamp);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return hours + ':' + minutes + ':' + seconds;
}