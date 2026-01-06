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
    <v-card>
      123
    </v-card>
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
import {useTheme} from "vuetify";
import useGlobalStore from "@/plugins/store/global";

const globalStore = useGlobalStore()


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

