<template>
  <div style="display: flex; align-items: center; margin: 5px; width:215px">
    <v-img :src="getImageUrl(props.image)" fit="fill" style="width: 75px; height: 75px"/>
    <div style="width: 140px">
      <div class="fcc">
        <!--配置文件没有，平台有-->
        <template v-if="modelValue==='undefined'&&image!=='undefined.png'">
          <v-chip :color="modelValue===defaultModelValue?'primary':'warning'"
                  density="compact" append-icon="ri-question-fill">
            {{props.i18n.zh}}
          </v-chip>
        </template>
        <template v-else>
          <v-chip :color="modelValue===defaultModelValue?'primary':'warning'"
                  density="compact">
            {{props.i18n.zh}}
          </v-chip>
        </template>
      </div>
      <div class="fcc">

      </div>
      <div style="margin: 5px 0" class="fcc">
        <icon-btn icon="ri-arrow-left-s-line"
                  :disabled="leftClickDisabled||image==='undefined.png'||modelValue==='undefined'"
                  @click="leftClick"></icon-btn>
        <v-chip v-if="image==='undefined.png'||modelValue==='undefined'" color="error"
                label density="compact" style="margin: 0 5px;">
          未配置
        </v-chip>
        <v-chip v-else label density="compact" style="margin: 0 5px;">
          {{getDisplayTagValue()}}
        </v-chip>
        <icon-btn icon="ri-arrow-right-s-line"
                  :disabled="rightClickDisabled||image==='undefined.png'||modelValue==='undefined'"
                  @click="rightClick"></icon-btn>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ref, watch, onMounted} from "vue";
import {configsMap} from "@/views/settings/components/levelDataMap.js"

const props = defineProps({
  configs: {type: Array, default: ['undefined']},
  modelValue: {type: String, default: 'undefined'},
  image: {type: String, default: 'undefined.png'},
  i18n: {type: Object, default: {zh: '平台未识别', en: 'undefined'}},
  name: {type: String, default: 'undefined'},
  customConfigsValue: {type: Object, default: {}},
  defaultModelValue: {type: String, default: 'undefined'},
})

const emit = defineEmits(['changeModelValue']);

onMounted(() => {
  if (props.configs.length === 1) {
    leftClickDisabled.value = true
    rightClickDisabled.value = true
  }
  if (props.configs.length === 2) {
    const index = props.configs.indexOf(setting.value)
    if (index === 0) {
      leftClickDisabled.value = true
      rightClickDisabled.value = false
    } else if (index === (props.configs.length - 1)) {
      rightClickDisabled.value = true
      leftClickDisabled.value = false
    } else {
      leftClickDisabled.value = false
      rightClickDisabled.value = false
    }
  } else {
    const index = props.configs.indexOf(setting.value)
    if (index === 0) {
      leftClickDisabled.value = true
      rightClickDisabled.value = false
    } else if (index === (props.configs.length - 1)) {
      rightClickDisabled.value = true
      leftClickDisabled.value = false
    } else {
      leftClickDisabled.value = false
      rightClickDisabled.value = false
    }
  }
})

const language = ref('zh')

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

const getImageUrl = (file) => {
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

const handleSettingChange = () => {
  const emitData = {
    name: props.name,
    value: setting.value
  }
  emit('changeModelValue', emitData);
}


watch(() => setting.value, (newValue, oldValue) => {
  if (props.configs.length === 1) {
    leftClickDisabled.value = true
    rightClickDisabled.value = true
  } else {
    const index = props.configs.indexOf(setting.value)
    if (index === 0) {
      leftClickDisabled.value = true
      rightClickDisabled.value = false
    } else if (index === (props.configs.length - 1)) {
      rightClickDisabled.value = true
      leftClickDisabled.value = false
    } else {
      leftClickDisabled.value = false
      rightClickDisabled.value = false
    }
  }
  handleSettingChange()
}, {immediate: false})

</script>

<style scoped>
</style>
