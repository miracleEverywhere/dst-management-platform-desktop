<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500px"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <!-- 标题区域 -->
      <v-card-title class="d-flex align-center">
        <span>{{ title }}</span>
      </v-card-title>

      <!-- 内容区域 -->
      <v-card-text class="pt-4">
        <v-alert
          v-if="content"
          :text="content"
          :type="type"
          variant="tonal"
        />
        <slot name="content">
          <!-- 插槽用于自定义内容 -->
        </slot>
      </v-card-text>

      <!-- 操作按钮区域 -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          v-if="props.cancelButton"
          variant="elevated"
          :color="cancelColor"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          variant="elevated"
          :loading="props.confirmLoading"
          :color="confirmColor"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'success',
    validator: value => ['success', 'warning', 'error', 'info'].includes(value),
  },
  title: {
    type: String,
    default: '确认操作',
  },
  content: {
    type: String,
    default: '您确定要执行此操作吗？',
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  cancelButton: {
    type: Boolean,
    default: true,
  },
  confirmText: {
    type: String,
    default: '确认',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmColor: {
    type: String,
    default: 'primary',
  },
  cancelColor: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// 根据类型计算图标和颜色
const typeConfig = computed(() => {
  const configs = {
    success: { icon: 'mdi-check-circle', color: 'success' },
    warning: { icon: 'mdi-alert-circle', color: 'warning' },
    error: { icon: 'mdi-close-circle', color: 'error' },
    info: { icon: 'mdi-information', color: 'info' },
  }
  
  return configs[props.type] || configs.info
})

const typeIcon = computed(() => typeConfig.value.icon)
const typeColor = computed(() => typeConfig.value.color)

// 处理确认
const handleConfirm = () => {
  emit('confirm')

  // emit('update:modelValue', false)
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.v-card-title {
  padding: 20px 24px 0;
}

.v-card-text {
  padding: 16px 24px 8px;
}

.v-card-actions {
  padding: 8px 24px 20px;
}
</style>
