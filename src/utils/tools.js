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