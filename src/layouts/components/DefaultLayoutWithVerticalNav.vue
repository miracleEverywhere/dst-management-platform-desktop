<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
            class="ms-n3 d-lg-none"
            @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="ri-menu-line" />
        </IconBtn>

        <!-- 👉 Search -->
        <div
            class="d-flex align-center"
            style="user-select: none;"
        >
          <span class="d-none d-md-flex align-center text-disabled">
            <v-icon icon="ri-bookmark-3-line"></v-icon>
            <span class="me-3 ml-1">{{globalStore.name}}</span>
          </span>
        </div>

        <VSpacer />

        <IconBtn
            href="https://github.com/miracleEverywhere/dst-management-platform-desktop"
            target="_blank"
            rel="noopener noreferrer"
        >
          <VIcon icon="ri-github-fill" />
        </IconBtn>

<!--        <IconBtn>-->
<!--          <VIcon icon="ri-notification-line" />-->
<!--        </IconBtn>-->

        <NavbarThemeSwitcher class="me-2" />

        <IconBtn>
          <VIcon icon="ri-shut-down-line" @click="handleOut" />
        </IconBtn>

<!--        <UserProfile />-->
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <RouterLink
          to="/"
          class="app-logo app-title-wrapper"
      >
        <!-- eslint-disable vue/no-v-html -->
        <div
            class="d-flex"
            v-html="logo"
        />
        <!-- eslint-enable -->

        <h1 class="font-weight-medium leading-normal text-xl text-uppercase">
          {{title}}
        </h1>
      </RouterLink>

      <IconBtn
          class="d-block d-lg-none"
          @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="ri-close-line" />
      </IconBtn>
    </template>

    <template #vertical-nav-content>
      <NavItems />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
<!--    <template #footer>-->
<!--      <Footer />-->
<!--    </template>-->
  </VerticalNavLayout>
</template>

<script setup>
import NavItems from '@/layouts/components/NavItems.vue'
import logo from '@images/logo.svg?raw'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'

// Components
// import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
// import UserProfile from '@/layouts/components/UserProfile.vue'
import useGlobalStore from "@/plugins/pinia/global";
import ElectronApi from "@/utils/electronApi";

const globalStore = useGlobalStore()

const title = import.meta.env.VITE_TITLE

const handleOut = () => {
  globalStore.clearStore()
  ElectronApi.window.config()
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
