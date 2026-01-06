<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
  icon: {
    type: String,
    required: true,
  },
  stats: {
    type: String,
    required: true,
  },
  change: {
    type: Number,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})

const isPositive = computed(() => Math.sign(props.change) === 1)

const moreList = [
  {
    title: 'Share',
    value: 'Share',
  },
  {
    title: 'Refresh',
    value: 'Refresh',
  },
  {
    title: 'Update',
    value: 'Update',
  },
]
</script>

<template>
  <v-card>
    <v-card-text class="d-flex align-center">
      <v-avatar
        v-if="props.icon"
        size="40"
        :color="props.color"
        class="elevation-2"
      >
        <v-icon
          :icon="props.icon"
          size="24"
        />
      </v-avatar>

      <v-spacer />

      <more-btn
        class="me-n3 mt-n1"
        :menu-list="moreList"
      />
    </v-card-text>

    <v-card-text>
      <h6 class="text-h6 mb-1">
        {{ props.title }}
      </h6>

      <div
        v-if="props.change"
        class="d-flex align-center mb-1 flex-wrap"
      >
        <h4 class="text-h4 me-2">
          {{ props.stats }}
        </h4>
        <div
          :class="isPositive ? 'text-success' : 'text-error'"
          class="text-body-1"
        >
          {{ isPositive ? `+${props.change}` : props.change }}%
        </div>
      </div>
      <div class="text-body-2">
        {{ props.subtitle }}
      </div>
    </v-card-text>
  </v-card>
</template>
