<template>
  <div style="display: flex; align-items: center; margin: 5px; width:215px">
    <v-img :src="getImageUrl(props.image)" fit="fill" style="width: 75px; height: 75px"/>
    <div style="width: 140px">
      <div class="fcc">
        <v-chip size="large" :color="modelValue===defaultModelValue?'primary':'warning'"
                density="compact"
        >
          {{props.i18n.zh}}
        </v-chip>
      </div>
      <div style="margin: 5px 0" class="fcc">
        <icon-btn icon="ri-arrow-left-s-line" :disabled="leftClickDisabled" @click="leftClick"></icon-btn>
        <v-chip label density="compact" style="margin: 0 5px;">
          {{getDisplayTagValue()}}
        </v-chip>
        <icon-btn icon="ri-arrow-right-s-line" :disabled="rightClickDisabled" @click="rightClick"></icon-btn>
      </div>
    </div>

  </div>
</template>

<script setup>
import {computed, ref, watch, defineEmits, onMounted} from "vue";
import {configsMap, overrides} from "@/views/settings/components/levelDataMap.js"

const props = defineProps({
  configs: {type: Array, default: []},
  modelValue: {type: String, default: 'default'},
  image: {type: String, default: ''},
  i18n: {type: Object, default: {zh: '', en: ''}},
  name: {type: String, default: ''},
  customConfigsValue: {type: Object, default: {}},
  defaultModelValue: {type: String, default: 'default'},
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
  // console.log(props.name)
  if (language.value === 'zh') {
    try {
      return tagValue.zh
    } catch {
      console.log(props)
    }
  } else {
    return tagValue.en
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
