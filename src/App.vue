<template>
  <v-app>
    <message />
    <router-view />
  </v-app>
</template>

<script setup>
import useGlobalStore from '@store/global'
import { useI18n } from "vue-i18n"
import { getBrowserLang } from "@/utils/tools.js"
import { useLocale } from "vuetify/framework"
import ElectronApi from "@/utils/electronApi";
import {DB_KEY} from "@/config";
import {useTheme} from "vuetify";


const i18n = useI18n()
const globalStore = useGlobalStore()
const { current } = useLocale()



const initI18n = () => {
  let language
  if (globalStore.language === "") {
    language = ElectronApi.store.get(DB_KEY.language)
    i18n.locale.value = language
    globalStore.language = language
    current.value = language
  } else {
    i18n.locale.value = globalStore.language
    switch (globalStore.language) {
    case 'zh':
      current.value = 'zhHans'
      break
    case 'en':
      current.value = 'en'
      break
    default:
      current.value = 'zhHans'
    }
  }
}

const initTheme = () => {
  // const {name: themeName, global: globalTheme} = useTheme();
  const theme = useTheme()
  let dbTheme = ElectronApi.store.get(DB_KEY.theme);
  const globalStore = useGlobalStore();

  if (dbTheme) {
    // globalTheme.name.value = theme;
    theme.change(dbTheme)
    globalStore.theme = dbTheme;
  } else {
    ElectronApi.store.set(DB_KEY.theme, "light");
  }
}

onMounted(() => {
  initI18n()
  initTheme()
})
</script>
