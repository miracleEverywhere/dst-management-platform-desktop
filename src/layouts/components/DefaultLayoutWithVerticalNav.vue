<template>
  <VerticalNavLayout>
    <!-- 👉 navbar 顶部一长条-->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 小屏幕菜单按钮 -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="ri-menu-line"/>
        </IconBtn>

        <div
          class="d-flex align-center"
          style="user-select: none;"
        >
          <span class="d-none d-md-flex align-center text-disabled">
            <v-icon icon="ri-bookmark-3-line"></v-icon>
            <span class="me-3 ml-1">{{ globalStore.name }}</span>
          </span>
        </div>

        <VSpacer/>

        <IconBtn
          href="https://github.com/miracleEverywhere/dst-management-platform-desktop"
          rel="noopener noreferrer"
          target="_blank"
        >
          <VIcon icon="ri-github-fill"/>
        </IconBtn>

        <NavbarThemeSwitcher class="me-2"/>

        <IconBtn :disabled="needDisabled()" >
          <v-tooltip activator="parent" open-delay="1000" scroll-strategy="close">
            重新载入应用
          </v-tooltip>
          <VIcon icon="ri-refresh-line" @click="handleReload"/>
        </IconBtn>

        <IconBtn>
          <v-tooltip activator="parent" open-delay="1000" scroll-strategy="close">
            退出当前存档，返回存档选择界面
          </v-tooltip>
          <VIcon icon="ri-logout-box-r-line" @click="handleOut"/>
        </IconBtn>
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <RouterLink
        class="app-logo app-title-wrapper"
        to="/"
      >
        <!-- LOGO -->
        <div
          class="d-flex"
          v-html="logo"
        />
        <!-- 标题 -->
        <h1 class="font-weight-medium leading-normal text-xl text-uppercase">
          {{ title }}
        </h1>
      </RouterLink>
      <!-- 标题右边的关闭按钮 -->
      <IconBtn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="ri-close-line"/>
      </IconBtn>
    </template>

    <template #vertical-nav-content>
      <NavItems/>
    </template>
    <slot/>
  </VerticalNavLayout>
</template>

<script setup>
import NavItems from '@/layouts/components/NavItems.vue'
import logo from '@images/logo.svg?raw'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import useGlobalStore from "@/plugins/pinia/global";
import useConfigStore from '@/plugins/pinia/config'
import ElectronApi from "@/utils/electronApi";

const router = useRouter()
const globalStore = useGlobalStore()
const configStore = useConfigStore()

const title = import.meta.env.VITE_TITLE

const handleOut = () => {
  configStore.inConfig = true
  globalStore.clearStore()
  ElectronApi.window.config()
}

const handleReload = () => {
  ElectronApi.window.reload()
}

const needDisabled = () => {
  if (router.currentRoute.value.fullPath === '/tools/statistics') {
    return true
  }
  if (router.currentRoute.value.fullPath === '/tools/metrics') {
    return true
  }

  return false
}
</script>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}
</style>
