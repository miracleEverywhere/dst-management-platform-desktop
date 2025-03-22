<template>
  <VerticalNavLayout>
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <div class="d-flex" v-html="logo"/>
        <h1 class="font-weight-medium leading-normal text-xl text-uppercase ml-3">
          {{title}}
        </h1>
        <VSpacer />
        <IconBtn
            href="https://github.com/miracleEverywhere/dst-management-platform-desktop"
            target="_blank"
            rel="noopener noreferrer"
        >
          <VIcon icon="ri-github-fill" />
        </IconBtn>
        <NavbarThemeSwitcher class="me-2" />
      </div>
    </template>
    <div class="auth-wrapper d-flex align-center justify-center pa-4" style="margin-top: -15px">
      <v-row dense>
        <v-col v-for="configItem in configs" cols="12" sm="6">
          <config :config-item="configItem"/>
        </v-col>
        <v-col cols="12" sm="6">
          <config/>
        </v-col>
      </v-row>
    </div>
  </VerticalNavLayout>
</template>

<script setup>
import config from '@/views/config/components/configItem.vue'
import VerticalNavLayout from "@layouts/components/VerticalNavLayout.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import logo from '@images/logo.svg?raw'
import {useTheme} from "vuetify";
import {onMounted} from "vue";
import useGlobalStore from "@/plugins/pinia/global";
import {initTheme} from "@/utils/tools";
import ElectronApi from "@/utils/electronApi";
import {DB_KEY} from "@/config";


onMounted(() => {
  initTheme()
  initConfigs()
  // ElectronApi.store.clear()
})


const globalStore = useGlobalStore()
const configs = ref([])

const {
  name: themeName,
  global: globalTheme,
} = useTheme()

const themes = [
  {
    name: 'light',
    icon: 'ri-sun-line',
  },
  {
    name: 'dark',
    icon: 'ri-moon-clear-line',
  },
]
const title = import.meta.env.VITE_TITLE

const initConfigs = () => {
  const dbConfigs = ElectronApi.store.get(DB_KEY.configs) || []
  if (dbConfigs.length === 0) {
    ElectronApi.store.set(DB_KEY.configs, [])
  } else {
    configs.value = dbConfigs
  }
}



</script>

<style scoped>
@use "@core/scss/template/pages/page-auth";
</style>