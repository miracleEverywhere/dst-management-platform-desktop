<template>
  <!-- 初始loading，在路由加载完成前显示 -->
  <div
    v-if="showInitialLoading"
    class="initial-loading"
  >
    <div class="loading-bg">
      <div class="loading-logo">
        <img
          src="/dmp.svg"
          alt="DMP"
          style="width: 100px; height: auto;"
        >
      </div>
      <div class="loading">
        <div class="effect-1 effects" />
        <div class="effect-2 effects" />
        <div class="effect-3 effects" />
      </div>
    </div>
  </div>

  <!-- 应用主内容 -->
  <v-app v-if="!showInitialLoading">
    <message />
    <readme-dialog />
    <router-view
      v-if="showRouter"
      :key="routerKey"
    />
  </v-app>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from "vue-i18n"
import { getBrowserLang } from "@/utils/tools.js"
import { useLocale } from "vuetify/framework"
import useGlobalStore from '@store/global'

const router = useRouter()
const route = useRoute()
const i18n = useI18n()
const globalStore = useGlobalStore()
const { current } = useLocale()

const showRouter = ref(true)
const routerKey = ref(0)

const refresh = async () => {
  // 1. 隐藏 router-view
  showRouter.value = false

  // 2. 等待 DOM 更新
  await nextTick()

  // 3. 改变 key（可选）
  routerKey.value += 1

  // 4. 再次等待 DOM 更新
  await nextTick()

  // 5. 重新显示 router-view
  showRouter.value = true
}

// 控制loading显示
const showInitialLoading = ref(true)

// 标记是否已经初始化完成
const isInitialized = ref(false)

// 标记路由是否就绪
let routerReady = false

// 标记是否已经开始路由切换
let routeChanged = false

// 初始化i18n
const initI18n = () => {
  let language
  if (globalStore.language === "") {
    language = getBrowserLang()
    i18n.locale.value = language
    globalStore.language = language
    current.value = language
  } else {
    i18n.locale.value = globalStore.language
    switch (globalStore.language) {
      case 'zh':
        current.value = 'zhHans'
        break
      case 'en':
        current.value = 'en'
        break
      default:
        current.value = 'zhHans'
    }
  }
}

// 隐藏loading的方法
const hideLoading = () => {
  if (showInitialLoading.value) {
    // 添加淡出效果
    setTimeout(() => {
      showInitialLoading.value = false
    }, 300)
  }
}

// 监听路由就绪
router.isReady().then(() => {
  routerReady = true

  // 如果i18n也初始化完成了，就隐藏loading
  if (isInitialized.value) {
    hideLoading()
  }
}).catch(err => {
  console.error('路由初始化失败:', err)
  routerReady = true
  isInitialized.value = true

  // 路由初始化失败也隐藏loading
  setTimeout(() => {
    hideLoading()
  }, 500)
})

// 监听路由变化
const removeAfterEach = router.afterEach((to, from) => {
  routeChanged = true

  // 路由切换后，如果还在显示loading，就隐藏它
  if (showInitialLoading.value && to.path !== from.path) {
    hideLoading()
  }
})

onMounted(() => {
  initI18n()
  isInitialized.value = true

  // 如果路由已经就绪，就隐藏loading
  if (routerReady) {
    hideLoading()
  }

  // 防抖：如果超过5秒还没隐藏loading，强制隐藏
  setTimeout(() => {
    if (showInitialLoading.value) {
      hideLoading()
    }
  }, 5000)
})

onBeforeUnmount(() => {
  removeAfterEach?.()
})
</script>

<style scoped>
/* 初始loading样式 */
.initial-loading {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--initial-loader-bg, #fff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem 0;
  margin: 0;
  overflow: hidden;
}

.loading-bg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 1rem 0;
}

.loading-logo {
  margin-bottom: 1rem;
}

.loading {
  position: relative;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: 50%;
  height: 55px;
  width: 55px;
}

.loading .effect-1,
.loading .effect-2,
.loading .effect-3 {
  position: absolute;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  border-left: 3px solid var(--initial-loader-color, #eee);
}

.loading .effect-1 {
  animation: rotate 1s ease infinite;
}

.loading .effect-2 {
  animation: rotate-opacity 1s ease infinite 0.1s;
}

.loading .effect-3 {
  animation: rotate-opacity 1s ease infinite 0.2s;
}

.loading .effects {
  transition: all 0.3s ease;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate-opacity {
  0% {
    opacity: 0.1;
    transform: rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: rotate(360deg);
  }
}
</style>
