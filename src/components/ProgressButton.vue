<template>
  <v-btn
    v-bind="$attrs"
    :color="color"
    :disabled="downloading || disabled"
    class="download-btn"
    @click="onClick"
  >
    <template
      v-if="$slots.prepend"
      #prepend
    >
      <slot name="prepend" />
    </template>
    <template
      v-if="$slots.append"
      #append
    >
      <slot name="append" />
    </template>

    <span
      class="download-btn__label"
      :class="{ 'is-hidden': downloading }"
    >
      <slot />
    </span>

    <template v-if="downloading">
      <span
        class="progress-track"
        :style="{ background: lighterColor }"
      />
      <span
        class="progress-fill"
        :style="{ width: progress + '%', background: baseColor }"
      />
      <span class="progress-text">
        {{ progress }}%
      </span>
    </template>
  </v-btn>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useTheme } from 'vuetify'

const props = defineProps({
  color: {
    type: String,
    default: 'success',
  },
  colorMix: {
    type: Number,
    default: 50,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['start', 'end', 'click'])

defineOptions({ inheritAttrs: false })

const theme = useTheme()

const progress = defineModel('progress', { default: 0 })

const downloading = computed(() => progress.value > 0)

const baseColor = computed(() => {
  const raw = props.color

  return theme.current.value.colors[raw] ?? raw
})

const lighterColor = computed(
  () => `color-mix(in srgb, ${baseColor.value} ${props.colorMix}%, white)`,
)

function onClick(e) {
  emit('start')
  emit('click', e)
}

watch(progress, value => {
  if (value >= 100) emit('end')
})
</script>

<style scoped>
.download-btn {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.download-btn :deep(.v-btn__prepend),
.download-btn :deep(.v-btn__append) {
  position: relative;
  z-index: 1;
}

.progress-track {
  position: absolute;
  inset: 0;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  transition: width 0.3s ease;
}

.download-btn__label.is-hidden {
  visibility: hidden;
}

.progress-text {
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
</style>