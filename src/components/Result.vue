<template>
  <v-container
    :height="props.height"
    style="overflow-y: auto"
  >
    <div
      class="d-flex flex-column align-center justify-center"
      :style="{height: (props.height-75)+'px'}"
    >
      <v-icon
        v-if="props.type==='success'"
        color="success"
        size="72"
        icon="ri-checkbox-circle-fill"
      />
      <v-icon
        v-if="props.type==='info'"
        color="info"
        size="72"
        icon="ri-information-2-fill"
      />
      <v-icon
        v-if="props.type==='warning'"
        color="warning"
        size="72"
        icon="ri-error-warning-fill"
      />
      <v-icon
        v-if="props.type==='error'"
        color="error"
        size="72"
        icon="ri-close-circle-fill"
      />
      <v-icon
        v-if="props.type===''"
        color="default"
        size="72"
        icon="ri-close-circle-fill"
      />
      <div
        style="font-size: 1.2rem; line-height: 1.5rem; letter-spacing: -0.015625em;text-align: center;"
        class="mt-2"
      >
        {{ props.title }}
      </div>
      <div
        style="font-size: 1rem; line-height: 1.5rem; letter-spacing: -0.015625em;text-align: center;"
        class="mt-4"
      >
        {{ props.subTitle }}
      </div>
      <slot />
    </div>
  </v-container>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'success',
  },
  title: {
    type: String,
    default: '',
  },
  subTitle: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: 300,
  },
})
</script>

