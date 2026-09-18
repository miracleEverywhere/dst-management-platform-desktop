<template>
  <div class="custom-setting-row">
    <div class="custom-setting-key">
      {{ item.name }}
    </div>
    <div class="custom-setting-value">
      <v-text-field
        v-if="item.type === 'string'"
        v-model="setting"
        density="compact"
        hide-details
        variant="outlined"
        @change="emitChange()"
      />
      <v-text-field
        v-else-if="item.type === 'number'"
        v-model="setting"
        density="compact"
        hide-details
        type="number"
        variant="outlined"
        @change="emitChange()"
      />
      <v-switch
        v-else-if="item.type === 'boolean'"
        v-model="setting"
        :label="setting
          ? 'true'
          : 'false'"
        color="primary"
        density="compact"
        hide-details
        @update:model-value="emitChange"
      />
      <v-textarea
        v-else
        :model-value="item.raw"
        auto-grow
        density="compact"
        hide-details
        max-rows="6"
        disabled
        rows="2"
        variant="outlined"
      />

      <div
        v-if="item.type === 'complex'"
        class="text-caption text-medium-emphasis mt-2"
      >
        {{ t('game.base.step2.customOverrides.readOnly') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['changeValue'])

const { t } = useI18n()
const setting = ref(props.item.value)

const emitChange = value => {
  emit('changeValue', {
    name: props.item.name,
    type: props.item.type,
    value: value === undefined ? setting.value : value,
  })
}

watch(() => props.item.value, value => {
  setting.value = value
})
</script>

<style scoped>
.custom-setting-row {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(220px, 2fr);
  gap: 16px;
  align-items: center;
  padding: 10px 12px;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.custom-setting-key {
  overflow-wrap: anywhere;
  font-size: 0.875rem;
}

@media (max-width: 600px) {
  .custom-setting-row {
    display: block;
    border-top: 0;
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }

  .custom-setting-row:last-child {
    border-bottom: 0;
  }

  .custom-setting-key {
    margin-bottom: 8px;
  }
}
</style>
