<template>
  <v-card>
    <v-card-title>
      <div class="card-header">
        {{ props.title }}
        <v-btn
          variant="text"
          color="error"
          prepend-icon="ri-prohibited-2-line"
          @click="emitDisable"
        >
          {{ t('game.mod.setting.disable') }}
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-container
          :height="props.height"
          style="overflow-y: auto"
        >
          <v-row>
            <v-col
              v-for="field in formFields"
              v-if="formFields.length!==0"
              :key="field.name"
              cols="12"
            >
              <!-- 字段标签和提示 -->
              <!--              <div class="d-flex align-center mb-4"> -->
              <!--                <v-tooltip location="top"> -->
              <!--                  <template v-slot:activator="{ props }"> -->
              <!--                    <v-label v-bind="props" class="text-h6"> -->
              <!--                      {{ field.label }} -->
              <!--                    </v-label> -->
              <!--                  </template> -->
              <!--                  <span>{{ field.hover || '暂无描述' }}</span> -->
              <!--                </v-tooltip> -->
              <!--              </div> -->

              <!-- 主选择器 - 始终显示 -->
              <v-select
                v-model="selectedOptions[field.name]"
                v-tooltip="field.hover"
                :items="field.options"
                item-title="description"
                item-value="data"
                :label="field.label"
                variant="outlined"
                @update:model-value="handleOptionChange(field.name, $event)"
              >
                <template #item="{ props, item }">
                  <v-list-item
                    v-tooltip="item.raw.hover"
                    v-bind="props"
                  >
                    <!--                    <v-tooltip location="top" v-if="item.raw.hover"> -->
                    <!--                      <template v-slot:activator="{ props: tooltipProps }"> -->
                    <!--                        <v-list-item-title v-bind="tooltipProps"> -->
                    <!--                          {{ item.raw.description }} -->
                    <!--                        </v-list-item-title> -->
                    <!--                      </template> -->
                    <!--                      <span>{{ item.raw.hover }}</span> -->
                    <!--                    </v-tooltip> -->
                    <!--                    <v-list-item-title v-else> -->
                    <!--                    <v-list-item-title> -->
                    <!--                      {{ item.raw.description }} -->
                    <!--                    </v-list-item-title> -->
                  </v-list-item>
                </template>
              </v-select>

              <!-- 数组类型输入框 - 只有当选择的选项是数组时才显示 -->
              <div
                v-if="isCurrentValueArray(field.name)"
                class="array-field mt-4"
              >
                <!--                <div class="text-caption text-medium-emphasis mb-2">数组内容：</div> -->
                <div
                  v-for="(item, index) in formData[field.name]"
                  :key="index"
                  class="d-flex align-center mb-2"
                >
                  <v-text-field
                    v-model="formData[field.name][index]"
                    :label="`${t('game.mod.setting.item')} ${index + 1}`"
                    variant="outlined"
                    @update:model-value="handleArrayChange(field.name, index, $event)"
                  />
                  <v-btn
                    icon="ri-close-line"
                    variant="text"
                    color="error"
                    class="ml-2"
                    @click="removeArrayItem(field.name, index)"
                  />
                </div>
                <v-btn
                  color="success"
                  prepend-icon="ri-add-line"
                  @click="addArrayItem(field.name)"
                >
                  {{ t('game.mod.setting.add') }}
                </v-btn>
              </div>

              <!-- 对象类型输入框 - 只有当选择的选项是对象时才显示 -->
              <div
                v-else-if="isCurrentValueObject(field.name)"
                class="object-field mt-4"
              >
                <!--                <div class="text-caption text-medium-emphasis mb-2">键值对内容：</div> -->
                <div
                  v-for="(value, key, index) in formData[field.name]"
                  :key="key"
                  class="d-flex align-center mb-2"
                >
                  <v-text-field
                    v-model="objectKeys[field.name][index]"
                    :label="t('game.mod.setting.key')"
                    variant="outlined"
                    class="mr-2"
                    @update:model-value="handleObjectKeyChange(field.name, key, index, $event)"
                  />
                  <v-text-field
                    v-model="formData[field.name][key]"
                    :label="t('game.mod.setting.value')"
                    variant="outlined"
                    class="mr-2"
                    :type="getInputType(value)"
                    @update:model-value="handleObjectValueChange(field.name, key, $event)"
                  />
                  <v-btn
                    icon="ri-close-line"
                    variant="text"
                    color="error"
                    @click="removeObjectItem(field.name, key)"
                  />
                </div>
                <v-btn
                  color="success"
                  prepend-icon="ri-add-line"
                  @click="addObjectItem(field.name)"
                >
                  {{ t('game.mod.setting.add') }}
                </v-btn>
              </div>
            </v-col>
            <v-col v-else>
              <result
                type="warning"
                :title="t('game.mod.setting.tip.noConfig')"
                :height="props.height-32"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import modApi from '@/api/mod.js'
import { showSnackbar } from "@/utils/snackbar.js"
import { useI18n } from "vue-i18n"


const props = defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => ([]),
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  height: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: "",
  },
  roomID: {
    type: Number,
    default: 0,
  },
  worldID: {
    type: Number,
    default: 0,
  },
  modID: {
    type: Number,
    default: 0,
  },
})

// 发射变化事件
const emit = defineEmits(['change', 'disableRefresh'])
const { t } = useI18n()

// 响应式数据
const selectedOptions = reactive({}) // 存储当前选择的选项值
const formData = reactive({}) // 存储复杂类型的数据（数组、对象）
const objectKeys = reactive({}) // 存储对象的键映射

// 计算属性
const formFields = computed(() => props.fields)

// 类型判断函数 - 判断当前选择的值类型
const isCurrentValueArray = fieldName => {
  return Array.isArray(selectedOptions[fieldName])
}

const isCurrentValueObject = fieldName => {
  const value = selectedOptions[fieldName]
  
  return value && typeof value === 'object' && !Array.isArray(value)
}

const isCurrentValueSimple = fieldName => {
  const value = selectedOptions[fieldName]
  
  return typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
}

const getValueType = fieldName => {
  const value = selectedOptions[fieldName]
  if (Array.isArray(value)) return '数组'
  if (value && typeof value === 'object') return '对象'
  
  return typeof value
}

const showValueTypeHint = fieldName => {
  const value = selectedOptions[fieldName]
  
  return Array.isArray(value) || (value && typeof value === 'object')
}

const getInputType = value => {
  if (typeof value === 'number') return 'number'
  
  return 'text'
}

// 初始化表单数据
const initializeFormData = () => {
  if (Object.keys(props.initialData).length === 0) {
    if (!formFields.value) {
      formFields.value = []
    }

    formFields.value.forEach(field => {
      // 设置默认选择的选项
      const defaultValue = field.default

      selectedOptions[field.name] = defaultValue

      // 初始化复杂类型的数据结构
      if (Array.isArray(defaultValue)) {
        formData[field.name] = [...defaultValue]
        objectKeys[field.name] = []
      } else if (defaultValue && typeof defaultValue === 'object') {
        formData[field.name] = { ...defaultValue }
        objectKeys[field.name] = Object.keys(formData[field.name])
      } else {
        formData[field.name] = defaultValue
      }
    })
  } else {
    Object.entries(props.initialData).forEach(([key, value]) => {
      // console.log(key, value)
      selectedOptions[key] = value

      // 初始化复杂类型的数据结构
      if (Array.isArray(value)) {
        formData[key] = [...value]
        objectKeys[key] = []
      } else if (value && typeof value === 'object') {
        formData[key] = { ...value }
        objectKeys[key] = Object.keys(formData[key])
      } else {
        formData[key] = value
      }
    })
  }
}

// 选项变化处理
const handleOptionChange = (fieldName, newValue) => {
  selectedOptions[fieldName] = newValue

  // 根据新值的类型初始化formData
  if (Array.isArray(newValue)) {
    formData[fieldName] = newValue.length > 0 ? [...newValue] : []
    objectKeys[fieldName] = []
  } else if (newValue && typeof newValue === 'object') {
    formData[fieldName] = { ...newValue }
    objectKeys[fieldName] = Object.keys(formData[fieldName])
  } else {
    formData[fieldName] = newValue
  }

  emitChange(fieldName, newValue)
}

// 数组操作
const handleArrayChange = (fieldName, index, value) => {
  formData[fieldName][index] = value

  // 更新selectedOptions以保持同步
  selectedOptions[fieldName] = [...formData[fieldName]]
  emitChange(fieldName, selectedOptions[fieldName])
}

const addArrayItem = fieldName => {
  if (!formData[fieldName]) {
    formData[fieldName] = []
  }
  formData[fieldName].push('')
  selectedOptions[fieldName] = [...formData[fieldName]]
  emitChange(fieldName, selectedOptions[fieldName])
}

const removeArrayItem = (fieldName, index) => {
  formData[fieldName].splice(index, 1)
  selectedOptions[fieldName] = [...formData[fieldName]]
  emitChange(fieldName, selectedOptions[fieldName])
}

// 对象操作
const handleObjectKeyChange = (fieldName, oldKey, index, newKey) => {
  if (oldKey === newKey || !newKey) return

  const currentData = { ...formData[fieldName] }
  const value = currentData[oldKey]

  // 删除旧的键
  delete currentData[oldKey]

  // 添加新的键
  currentData[newKey] = value

  formData[fieldName] = currentData
  objectKeys[fieldName][index] = newKey
  selectedOptions[fieldName] = { ...currentData }

  emitChange(fieldName, selectedOptions[fieldName])
}

const handleObjectValueChange = (fieldName, key, value) => {
  // 转换数字类型
  if (!isNaN(value) && value !== '') {
    formData[fieldName][key] = Number(value)
  } else {
    formData[fieldName][key] = value
  }
  selectedOptions[fieldName] = { ...formData[fieldName] }
  emitChange(fieldName, selectedOptions[fieldName])
}

const addObjectItem = fieldName => {
  if (!formData[fieldName]) {
    formData[fieldName] = {}
    objectKeys[fieldName] = []
  }

  const newKey = `key${Object.keys(formData[fieldName]).length + 1}`

  formData[fieldName][newKey] = ''
  objectKeys[fieldName].push(newKey)
  selectedOptions[fieldName] = { ...formData[fieldName] }

  emitChange(fieldName, selectedOptions[fieldName])
}

const removeObjectItem = (fieldName, key) => {
  delete formData[fieldName][key]

  const keyIndex = objectKeys[fieldName].indexOf(key)
  if (keyIndex > -1) {
    objectKeys[fieldName].splice(keyIndex, 1)
  }
  selectedOptions[fieldName] = { ...formData[fieldName] }
  emitChange(fieldName, selectedOptions[fieldName])
}

const emitChange = (fieldName, value) => {
  emit('change', {
    field: fieldName,
    value: value,
    formData: { ...selectedOptions },
  })
}

const emitDisable = () => {
  const reqForm = {
    roomID: props.roomID,
    id: props.modID,
  }

  modApi.setting.disableMod.post(reqForm).then(response => {
    showSnackbar(response.message)
    emit('disableRefresh')
  })
}

// 获取表单数据的方法
const getFormData = () => {
  return { ...selectedOptions }
}

// 暴露方法给父组件
defineExpose({
  getFormData,
})

// 生命周期
onMounted(() => {
  initializeFormData()
})
</script>

<style scoped>
.array-field,
.object-field {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
}

.array-field .v-btn,
.object-field .v-btn {
  margin-top: 8px;
}
</style>