<template>
  <IconBtn @click="changeTheme">
    <VIcon :icon="props.themes[currentThemeIndex].icon" />
    <VTooltip
        activator="parent"
        open-delay="1000"
        scroll-strategy="close"
    >
      <span class="text-capitalize">{{ zhCurrentThemeNameMap[currentThemeName] }}</span>
    </VTooltip>
  </IconBtn>
</template>

<script setup>
import { useTheme } from 'vuetify'
import useGlobalStore from "@/plugins/pinia/global";
import ElectronApi from "@/utils/electronApi";


const globalStore = useGlobalStore()

const props = defineProps({
  themes: {
    type: Array,
    required: true,
  },
})

const {
  name: themeName,
  global: globalTheme,
} = useTheme()

const {
  state: currentThemeName,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(props.themes.map(t => t.name), { initialValue: themeName })

const zhCurrentThemeNameMap = {
  light: '明亮',
  dark: '黑暗'
}

const changeTheme = () => {
  globalTheme.name.value = getNextThemeName()
  ElectronApi.store.set('theme', globalTheme.name.value)
}

// Update icon if theme is changed from other sources
watch(() => globalTheme.name.value, val => {
  currentThemeName.value = val
})
</script>
