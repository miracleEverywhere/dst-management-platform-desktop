<template>
  <div class="my-4">
    <v-radio-group
      v-model="modForm.modInOne"
      inline
      @update:model-value="handleModInOneChanged"
    >
      <template #prepend>
        <v-chip v-tooltip="t('game.base.step3.modInOne.tip')">
          {{ t('game.base.step3.modInOne.name') }}
        </v-chip>
      </template>
      <v-radio
        :label="t('game.base.step3.modInOne.enable')"
        :value="true"
        class="mr-4"
      />
      <v-radio
        :label="t('game.base.step3.modInOne.disable')"
        :value="false"
        class="mr-4"
      />
    </v-radio-group>
  </div>
  <div v-if="modForm.modInOne">
    <code-editor
      v-model="modForm.modData"
      :height="props.tabWindowHeight"
      :theme="props.theme === 'dark' ? 'lucario' : 'idea'"
      class="mt-4"
      mode="lua"
      style="width: 100%"
    />
  </div>
  <div v-else>
    <v-tabs v-model="worldTabName">
      <v-tab
        v-for="world in modForm.worlds"
        :value="world.name"
      >
        {{ world.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="worldTabName">
      <v-tabs-window-item
        v-for="world in modForm.worlds"
        :key="world.name"
        :value="world.name"
      >
        <code-editor
          v-model="world.modData"
          :height="props.tabWindowHeight-54"
          :theme="props.theme === 'dark' ? 'lucario' : 'idea'"
          class="mt-4"
          mode="lua"
          style="width: 100%"
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import CodeEditor from "@/components/CodeEditor.vue"
import { showSnackbar } from "@/utils/snackbar.js"
import luaparse from "luaparse"

const props = defineProps({
  worlds: {
    type: Array,
    default: () => ([]),
  },
  mod: {
    type: String,
    default: '',
  },
  modInOne: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: 'light',
  },
  tabWindowHeight: {
    type: Number,
    default: 600,
  },
})

onMounted(() => {
  modForm.value.modInOne = props.modInOne
  modForm.value.modData = props.mod
  modForm.value.worlds = props.worlds

  if (props.worlds.length !== 0) {
    worldTabName.value = modForm.value.worlds[0].name
  }
})

const { mobile } = useDisplay()
const { t } = useI18n()

const modForm = ref({
  modInOne: false,
  modData: '',
  worlds: [],
})

const handleModInOneChanged = () => {
  if (!modForm.value.modInOne) {
    worldTabName.value = modForm.value.worlds[0].name
  }
}

const worldTabName = ref('')

const validate = async () => {
  const returnData = {
    validate: false,
    formData: {},
  }

  if (modForm.value.modInOne) {
    try {
      luaparse.parse(modForm.value.modData)
    } catch (e) {
      showSnackbar(t('game.base.step3.modDataError'), 'error')

      return returnData
    }
  } else {
    for (let world of modForm.value.worlds) {
      try {
        luaparse.parse(world.modData)
      } catch (e) {
        showSnackbar(t('game.base.step3.modDataError'), 'error')

        return returnData
      }
    }
  }

  returnData.validate = true
  returnData.formData = modForm.value

  return returnData
}

defineExpose({
  validate,
})

watch(worldTabName, v => {
  if (!v) {
    worldTabName.value = modForm.value.worlds[0].name
  }
})
</script>

