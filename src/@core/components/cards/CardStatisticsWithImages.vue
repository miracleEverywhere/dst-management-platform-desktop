<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
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
  image: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
})

const isPositive = controlledComputed(() => props.change, () => Math.sign(props.change) === 1)
</script>

<template>
  <v-card class="overflow-visible">
    <div class="d-flex position-relative">
      <v-card-text>
        <h6 class="text-base font-weight-semibold mb-4">
          {{ props.title }}
        </h6>
        <div class="d-flex align-center flex-wrap mb-4">
          <h5 class="text-h5 font-weight-semibold me-2">
            {{ props.stats }}
          </h5>
          <span
            class="text-caption"
            :class="isPositive ? 'text-success' : 'text-error'"
          >
            {{ isPositive ? `+${props.change}` : props.change }}%
          </span>
        </div>

        <v-chip
          v-if="props.subtitle"
          size="small"
          :color="props.color"
        >
          {{ props.subtitle }}
        </v-chip>
      </v-card-text>

      <v-spacer />

      <div class="illustrator-img">
        <v-img
          v-if="props.image"
          :src="props.image"
          :width="110"
        />
      </div>
    </div>
  </v-card>
</template>

<style lang="scss">
.illustrator-img {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 5%;
}
</style>
