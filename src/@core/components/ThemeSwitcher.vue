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

const theme = useTheme()

const {
  state: currentThemeName,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(props.themes.map(t => t.name), { initialValue: themeName })

const zhCurrentThemeNameMap = {
  light: '明亮',
  dark: '黑暗'
}

const changeTheme = async (event) => {
  const { clientX: x, clientY: y } = event;
  const { innerWidth, innerHeight } = window;
  // 计算结束半径
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
  // 定义主题切换逻辑
  const updateTheme = () => {
    const nextTheme = getNextThemeName();
    // globalTheme.name.value = nextTheme;
    theme.change(nextTheme)
    globalStore.theme = nextTheme;
    ElectronApi.store.set('theme', nextTheme);
  };
  // 启动视图过渡
  const transition = document.startViewTransition(updateTheme);
  // 等待过渡准备就绪
  await transition.ready;
  // 执行动画
  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]
    },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: "::view-transition-new(root)"
    }
  );
};

// Update icon if theme is changed from other sources
watch(() => globalTheme.name.value, val => {
  currentThemeName.value = val
})
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* 暗色主题时调整混合模式 */
.v-theme--dark::view-transition-old(root) {
  mix-blend-mode: lighten;
}
.v-theme--dark::view-transition-new(root) {
  mix-blend-mode: darken;
}

/* 亮色主题时调整混合模式 */
.v-theme--light::view-transition-old(root) {
  mix-blend-mode: darken;
}
.v-theme--light::view-transition-new(root) {
  mix-blend-mode: lighten;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 0px;
  background: none;
}

::-webkit-scrollbar-track {
  background: none;
  border: none;
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
}

.v-theme--dark ::-webkit-scrollbar-thumb {
  background-color: #28243d !important;
}

.v-theme--light ::-webkit-scrollbar-thumb {
  background-color: #f4f5fa !important;
}

/* 防止闪烁 */
::view-transition-group(root) {
  animation: none;
}

::view-transition-image-pair(root) {
  isolation: auto;
}
</style>
