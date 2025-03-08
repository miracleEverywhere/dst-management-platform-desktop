import ElectronApi from "@/utils/electronApi";
import {useTheme} from "vuetify";

export const initTheme = () => {
    const {
        name: themeName,
        global: globalTheme,
    } = useTheme()

    let theme = ElectronApi.store.get('theme')

    if (theme) {
        globalTheme.name.value = theme
    } else {
        ElectronApi.store.set('theme', 'light')
    }
}