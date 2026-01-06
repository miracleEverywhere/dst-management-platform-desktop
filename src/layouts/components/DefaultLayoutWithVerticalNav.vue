<template>
  <vertical-nav-layout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <v-btn
          icon="ri-menu-line"
          variant="text"
          color="default"
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        />

        <header-main />

        <v-spacer />

        <github v-if="!mobile" />

        <document v-if="!mobile" />

        <lang-select />

        <navbar-theme-switcher class="me-2" />

        <user-profile />
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <router-link
        to="/"
        class="app-logo app-title-wrapper"
      >
        <nav-header />
      </router-link>

      <v-btn
        icon="ri-close-line"
        color="default"
        variant="text"
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      />
    </template>

    <template #vertical-nav-content>
      <nav-items />
    </template>
    <slot />
  </vertical-nav-layout>
</template>

<script setup>
import NavItems from '@/layouts/components/NavItems.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import LangSelect from '@/layouts/components/LangSelect.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import Github from "@/layouts/components/GitHub.vue"
import Document from "@/layouts/components/Document.vue"
import NavHeader from "@/layouts/components/NavHeader.vue"
import HeaderMain from "@/layouts/components/headerMain.vue"
import { useDisplay } from "vuetify/framework"

const { mobile } = useDisplay()
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

.vertical-nav-content {
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
