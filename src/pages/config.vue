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
            href="https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free"
            target="_blank"
            rel="noopener noreferrer"
        >
          <VIcon icon="ri-github-fill" />
        </IconBtn>
        <NavbarThemeSwitcher class="me-2" />
      </div>
    </template>
    <div class="auth-wrapper d-flex align-center justify-center pa-4" style="margin-top: -15px">
      <v-row>
        <v-col v-for="config in configs" cols="12" sm="6">
          <config :config-item="config"/>
        </v-col>
        <v-col cols="12" sm="6">
          <config/>
        </v-col>
      </v-row>
    </div>
  </VerticalNavLayout>
  <v-btn @click="a">as</v-btn>

</template>

<script setup>
import config from '@/views/config/index.vue'
import VerticalNavLayout from "@layouts/components/VerticalNavLayout.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import logo from '@images/logo.svg?raw'
import {useTheme} from "vuetify";
import {onMounted} from "vue";
import useGlobalStore from "@/plugins/pinia/global";
import {initTheme} from "@/utils/tools";


onMounted(() => {
  initTheme()
})



const globalStore = useGlobalStore()

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

const configs = ref([
  {
    id: '',
    name: '三点几啦，饮咖先啦(来种田喝咖啡',
    type: 'both',
    ip: '8.137.107.46',
    port: 80,
    token: 'asdasd',
    remark: '阿里云',
  },
  {
    id: '',
    name: '建家档狂喜 (Man!!!! 怎么会有反鲜',
    type: 'master',
    ip: '162.14.116.81',
    port: 80,
    token: 'asdasdasfsdfsd',
    remark: '腾讯云',
  },
  {
    id: '',
    name: '建家档狂喜 (Man!!!! 怎么会有反鲜',
    type: 'cave',
    ip: '110.41.69.7',
    port: 80,
    token: 'asdasdasfsdfsd',
    remark: '腾讯云',
  },
  {
    id: '',
    name: '长期建家 半纯净 萌新大佬皆宜 1档',
    type: 'both',
    ip: '47.109.32.134',
    port: 80,
    token: 'asdasd',
    remark: '七牛云',
  },
])


</script>

<style scoped>
@use "@core/scss/template/pages/page-auth";
</style>