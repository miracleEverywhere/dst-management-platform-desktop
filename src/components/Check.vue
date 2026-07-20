<template>
  <template v-if="allChecksPassed">
    <slot />
  </template>
  <template v-else>
    <template v-if="failedCheck === 'game'">
      <result
        v-if="userStore.userInfo.role==='admin'"
        :title="t('global.noGame.title')"
        :sub-title="t('global.noGame.subTitle')"
        :height="calculateContainerSize()"
        type="error"
      >
        <v-btn
          to="/install"
          class="mt-4"
        >
          {{ t('global.noGame.button') }}
        </v-btn>
      </result>
      <result
        v-else
        :title="t('global.noGameNoAdmin.title')"
        :sub-title="t('global.noGameNoAdmin.subTitle')"
        :height="calculateContainerSize()"
        type="error"
      />
    </template>
    <template v-if="failedCheck === 'room'">
      <result
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        type="error"
        :height="calculateContainerSize()"
      >
        <v-btn
          to="/rooms"
          class="mt-4"
        >
          {{ t('global.noRoomSelected.button') }}
        </v-btn>
      </result>
    </template>
    <template v-if="failedCheck === 'plugin'">
      <result
        v-if="userStore.userInfo.role==='admin'"
        :title="t('global.noPlugin.title')"
        :sub-title="t('global.noPlugin.subTitle')"
        :height="calculateContainerSize()"
        type="error"
      >
        <v-btn
          to="/platform"
          class="mt-4"
        >
          {{ t('global.noPlugin.button') }}
        </v-btn>
      </result>
      <result
        v-else
        :title="t('global.noPluginNoAdmin.title')"
        :sub-title="t('global.noPluginNoAdmin.subTitle')"
        :height="calculateContainerSize()"
        type="error"
      />
    </template>
  </template>
</template>

<script setup>
/**
 * Check 组件 —— 页面前置条件检查
 *
 * 用于包裹需要特定前置条件的内容，所有检查通过后才渲染 slot 内容，
 * 任一检查失败则展示对应的错误提示引导用户操作。
 *
 * Props:
 *   category     必需，要检查的类别数组，可选值: 'game'(游戏是否安装) | 'room'(房间是否选择) | 'plugin'(插件是否启用)
 *   otherHeight  必需，页面中除容器外的其他元素高度之和，用于计算错误页占位高度
 *   pluginName   当 category 包含 'plugin' 时必需，插件名称，如 'tmi' / 'voice' / 'translate'
 *
 * 检查优先级: game > room > plugin（只展示第一个失败的检查）
 *
 * 使用示例:
 *   <check :category="['game', 'room', 'plugin']" :other-height="272" plugin-name="tmi">
 *     <!-- 所有检查通过后展示的内容 -->
 *     <YourContent />
 *   </check>
 */
import { debounce } from "@/utils/tools.js"
import useGlobalStore from "@store/global.js"
import useUserStore from "@store/user.js"
import { useI18n } from "vue-i18n"
import platformApi from "@/api/platform.js"

const props = defineProps({
  category: {
    type: Array,
    required: true,
    validator: value => {
      return Array.isArray(value) &&
        value.every(item => ['game', 'room', 'plugin'].includes(item))
    },
  },
  otherHeight: {
    type: Number,
    required: true,
  },
  pluginName: {
    type: String,

    // 如果需要校验，改为更灵活的方式
    validator: value => {
      // 如果没有传值，跳过校验（配合 required: false）
      if (!value) return true

      // 或者允许所有字符串，或者维护一个插件列表
      return ['tmi', 'chat', 'voice', 'translate'].includes(value)
    },
  },
})

const globalStore = useGlobalStore()
const userStore = useUserStore()
const { t } = useI18n()

const windowHeight = ref(window.innerHeight)
const windowWidth = ref(window.innerWidth)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  windowWidth.value = window.innerWidth
}, 200)

const calculateContainerSize = () => {
  const other = props.otherHeight

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const pluginStatus = ref(false)

// Evaluate checks in priority order: game > room > plugin
// Returns the first failed check name, or null if all pass
const failedCheck = computed(() => {
  if (props.category.includes('game') && globalStore.gameVersion.local === 0) {
    return 'game'
  }
  if (props.category.includes('room') && globalStore.room.id === 0) {
    return 'room'
  }
  if (props.category.includes('plugin') && !pluginStatus.value) {
    return 'plugin'
  }

  return null
})

const allChecksPassed = computed(() => failedCheck.value === null)

const getPluginStatus = async () => {
  if (!props.category.includes('plugin')) return

  // 确保 pluginName 存在
  if (!props.pluginName) {
    console.warn('pluginName is required when category includes "plugin"')

    return
  }

  try {
    const response = await platformApi.plugin.status.get({ name: props.pluginName })

    pluginStatus.value = response.data || false
  } catch (error) {
    console.error('Failed to get plugin status:', error)
    pluginStatus.value = false
  }
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)

  if (props.category.includes('plugin')) {
    await getPluginStatus()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
