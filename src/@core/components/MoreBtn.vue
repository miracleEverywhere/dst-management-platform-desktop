<script setup>
const props = defineProps({
  menuList: {
    type: Array,
    required: false,
  },
  itemProps: {
    type: Boolean,
    required: false,
  },
  iconSize: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <icon-btn>
    <v-icon
      :size="iconSize"
      icon="ri-more-2-line"
    />

    <v-menu
      v-if="props.menuList"
      activator="parent"
    >
      <v-list
        :items="props.menuList"
        :item-props="props.itemProps"
      />
    </v-menu>
  </icon-btn>
</template>
