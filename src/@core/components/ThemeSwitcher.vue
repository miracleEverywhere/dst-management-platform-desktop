<template>
  <v-btn
    v-tooltip="t('global.'+globalStore.theme)"
    :icon="props.themes[currentThemeIndex].icon"
    color="default"
    variant="text"
    @click="changeTheme"
  />
</template>

<script setup>
import { useTheme } from 'vuetify'
import useGlobalStore from "@store/global"
import { useI18n } from "vue-i18n"
import ElectronApi from "@/utils/electronApi"
import { DB_KEY } from "@/config"

const props = defineProps({
  themes: {
    type: Array,
    required: true,
  },
})

const globalStore = useGlobalStore()
const { t } = useI18n()

const {
  name: themeName,
  global: globalTheme,
} = useTheme()

const theme = useTheme()

const {
  state: currentThemeName,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(props.themes.map(t => t.name), { initialValue: globalStore.theme })

onMounted(() => {
  if (globalStore.theme === "") {
    globalStore.theme = theme.global.name.value
    ElectronApi.store.set(DB_KEY.theme, theme.global.name.value)
    ElectronApi.window.themeChange(theme.global.name.value)
  } else {
    theme.change(globalStore.theme)
    document.documentElement.className = globalStore.theme
    ElectronApi.window.themeChange(globalStore.theme)
  }
})

const changeTheme = async event => {
  // 定义主题切换逻辑
  const updateTheme = () => {
    const nextTheme = getNextThemeName()

    theme.change(nextTheme)
    globalStore.theme = nextTheme
    ElectronApi.store.set(DB_KEY.theme, nextTheme)
    document.documentElement.className = nextTheme
    ElectronApi.window.themeChange(nextTheme)
  }

  // 启动视图过渡
  if (!document.startViewTransition) {
    updateTheme()
    
    return
  }

  const transition = document.startViewTransition(updateTheme)

  await transition.ready

  // 执行淡入淡出动画
  document.documentElement.animate(
    {
      opacity: [0, 1],
    },
    {
      duration: 300,
      easing: "ease-in-out",
      pseudoElement: "::view-transition-new(root)",
    },
  )

  // 同时为旧视图添加淡出动画
  document.documentElement.animate(
    {
      opacity: [1, 0],
    },
    {
      duration: 300,
      easing: "ease-in-out",
      pseudoElement: "::view-transition-old(root)",
    },
  )
}

watch(() => theme.global.name.value, val => {
  currentThemeName.value = val
})
</script>

<style>
/* 确保视图过渡容器覆盖整个屏幕 */
::view-transition-old(root),
::view-transition-new(root) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
}
</style>