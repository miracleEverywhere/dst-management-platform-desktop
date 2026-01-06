<template>
  <div class="header">
    <div class="fcc">
      <nav-header />
    </div>
    <div class="fcc">
      <github />
      <document />
      <lang-select />
      <navbar-theme-switcher />
    </div>
  </div>
  <div>
    <v-row dense>
      <v-col v-for="dmp in dmps" cols="12" sm="6">
        <dmp :dmp="dmp"/>
      </v-col>
      <v-col cols="12" sm="6">
        <dmp/>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import NavHeader from "@/layouts/components/NavHeader.vue"
import Github from "@/layouts/components/GitHub.vue"
import LangSelect from "@/layouts/components/LangSelect.vue"
import Document from "@/layouts/components/Document.vue"
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue"
import ElectronApi from "@/utils/electronApi";
import {DB_KEY} from "@/config";
import useGlobalStore from "@/plugins/store/global";
import Dmp from "@/views/entry/components/dmp.vue";

const globalStore = useGlobalStore()

const dmps = ref([])

const getDmps = () => {
  const dbConfigs = ElectronApi.store.get(DB_KEY.dmps) || []
  if (dbConfigs.length === 0) {
    ElectronApi.store.set(DB_KEY.dmps, [])
  } else {
    dmps.value = dbConfigs
  }
}

onMounted(() => {
  // ElectronApi.store.clear()
  getDmps()
})


</script>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth";
.header {
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

