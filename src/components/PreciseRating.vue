<template>
  <div class="precise-rating">
    <div class="rating-container">
      <div class="stars-background">
        <v-icon v-for="n in props.length" :key="`star-bg-${n}`" :color="props.backgroundColor" :size="props.size"
                icon="ri-star-fill"></v-icon>
      </div>
      <div :style="foregroundStyle" class="stars-foreground">
        <v-icon v-for="n in props.length" :key="`star-fg-${n}`" :color="props.color" :size="props.size"
                icon="ri-star-fill"></v-icon>
      </div>
    </div>
    <span v-if="props.showActualValue" class="actual-value">{{ actualValue }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: (value) => value >= 0
  },
  length: {
    type: Number,
    default: 5
  },
  size: {
    type: [Number, String],
    default: 'small'
  },
  color: {
    type: String,
    default: '#FFC107'
  },
  backgroundColor: {
    type: String,
    default: '#E0E0E0'
  },
  showActualValue: {
    type: Boolean,
    default: true
  }
})

const getActualSize = computed(() => {
  const numericSize = Number(props.size)
  if (!isNaN(numericSize)) {
    return numericSize
  }
  
  const sizeMap = {
    'x-small': 16,
    'small': 24,
    'default': 24,
    'medium': 28,
    'large': 32,
    'x-large': 36
  }
  return sizeMap[props.size] || 24
})

const actualValue = computed(() => {
  return Number(props.value).toFixed(1)
})

const foregroundStyle = computed(() => {
  const starSize = getActualSize.value
  const fillWidth = props.value * starSize

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${fillWidth}px`,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    display: 'flex'
  }
})
</script>

<style scoped>
.precise-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.rating-container {
  display: inline-block;
  position: relative;
}

.stars-background {
  display: flex;
}

.stars-foreground {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
}

.actual-value {
  font-size: 0.9em;
  color: rgba(0, 0, 0, 0.6);
}
</style>