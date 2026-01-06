<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      {{ new Date().getFullYear() }}
      Made With
      <v-icon
        icon="ri-heart-line"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      By <a
        href="https://github.com/miracleEverywhere"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >miracleEverywhere</a>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a
        href="https://github.com/miracleEverywhere/pal-management-platform-api?tab=MIT-1-ov-file"
        target="noopener noreferrer"
      >MIT</a>
      <a
        href="https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/documentation/"
        target="noopener noreferrer"
      >文档</a>
      <a
        href="https://themeselection.com/support/"
        target="noopener noreferrer"
      >欢迎加群</a>
    </span>
  </div>
</template>
