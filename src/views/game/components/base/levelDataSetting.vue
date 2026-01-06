<template>
  <div style="display: flex; align-items: center; margin: 5px; width:215px">
    <v-img
      :src="getImageUrl(props.image)"
      fit="fill"
      style="width: 75px; height: 75px"
    />
    <div style="width: 200px">
      <div class="fcc">
        <!-- 配置文件没有，平台有 -->
        <template v-if="modelValue==='undefined'&&image!=='undefined.png'">
          <v-chip
            v-tooltip="t('game.base.step2.itemUndefined')"
            color="error"
            density="compact"
            append-icon="ri-question-fill"
          >
            {{ getItemNameDisplay() }}
          </v-chip>
        </template>
        <template v-else>
          <v-chip
            :color="modelValue===defaultModelValue?'primary':'warning'"
            density="compact"
          >
            {{ getItemNameDisplay() }}
          </v-chip>
        </template>
      </div>
      <div class="fcc" />
      <div
        style="margin: 5px 0"
        class="fcc"
      >
        <v-btn
          icon="ri-arrow-left-s-line"
          variant="text"
          :disabled="leftClickDisabled||image==='undefined.png'||modelValue==='undefined'"
          @click="leftClick"
        />
        <v-chip
          v-if="image==='undefined.png'||modelValue==='undefined'"
          color="error"
          label
          density="compact"
          style="margin: 0 5px;"
        >
          Undefined
        </v-chip>
        <v-chip
          v-else
          label
          density="compact"
          style="margin: 0 5px;"
        >
          {{ getDisplayTagValue() }}
        </v-chip>
        <v-btn
          icon="ri-arrow-right-s-line"
          variant="text"
          :disabled="rightClickDisabled||image==='undefined.png'||modelValue==='undefined'"
          @click="rightClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"
import { configsMap } from "./levelDataMap.js"
import useGlobalStore from "@store/global.js"
import { useI18n } from "vue-i18n"

const props = defineProps({
  configs: { type: Array, default: ['undefined'] },
  modelValue: { type: String, default: 'undefined' },
  image: { type: String, default: 'undefined.png' },
  i18n: { type: Object, default: { zh: '平台未识别', en: 'undefined' } },
  name: { type: String, default: 'undefined' },
  customConfigsValue: { type: Object, default: {} },
  defaultModelValue: { type: String, default: 'undefined' },
})

const emit = defineEmits(['changeModelValue'])



const { t } = useI18n()
const globalStore = useGlobalStore()
const language = computed(() => globalStore.language)

const leftClickDisabled = ref(false)
const rightClickDisabled = ref(false)
const setting = ref(props.modelValue)

const leftClick = () => {
  const index = props.configs.indexOf(setting.value)

  setting.value = props.configs[index - 1]
}

const rightClick = () => {
  const index = props.configs.indexOf(setting.value)

  setting.value = props.configs[index + 1]
}

const getImageUrl = file => {
  return new URL(`./gameSettingImages/${file}`, import.meta.url).href
}

const getDisplayTagValue = () => {
  let tagValue
  if (Object.keys(props.customConfigsValue).length !== 0) {
    tagValue = props.customConfigsValue[setting.value]
  } else {
    tagValue = configsMap[setting.value]
  }
  try {
    // console.log(props)
    if (language.value === 'zh') {
      return tagValue['zh']
    } else {
      return tagValue['en']
    }
  } catch {
    if (language.value === 'zh') {
      return '未识别'
    } else {
      return 'Undefined'
    }
  }
}

const getItemNameDisplay = () => {
  try {
    if (language.value === 'zh') {
      return props.i18n.zh
    } else {
      return props.i18n.en
    }
  } catch {
    if (language.value === 'zh') {
      return '未识别'
    } else {
      return 'Undefined'
    }
  }
}

const handleSettingChange = () => {
  const emitData = {
    name: props.name,
    value: setting.value,
  }

  emit('changeModelValue', emitData)
}

const updateButtonState = () => {
  if (props.configs.length === 1) {
    leftClickDisabled.value = true
    rightClickDisabled.value = true
    
    return
  }

  const index = props.configs.indexOf(setting.value)

  leftClickDisabled.value = index === 0
  rightClickDisabled.value = index === (props.configs.length - 1)
}

// 在 onMounted 中调用
onMounted(() => {
  updateButtonState()
})

// 简化 watch
watch(() => setting.value, () => {
  updateButtonState()
  handleSettingChange()
})

// 监听 configs 的变化
watch(() => props.configs, () => {
  updateButtonState()
}, { deep: true })
</script>


