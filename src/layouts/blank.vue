<template>
  <div
    class="layout-wrapper layout-blank"
    data-allow-mismatch
  >
    <router-view />
  </div>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
