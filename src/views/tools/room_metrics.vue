<template>
  <check
    :category="['game', 'room']"
    :other-height="150"
  >
    <v-card>
      <v-card-title class="mt-2">
        <div class="card-header">
          <div>
            {{ t('tools.roomMetrics.title') }}
          </div>
          <div
            :style="mobile?{width: '50%'}:{width: '20%'}"
            class="fcc"
          >
            <v-select
              v-model="timeRange"
              :items="selectOptions"
              :loading="loading"
              density="compact"
              item-title="label"
              :label="t('tools.roomMetrics.timeRange')"
              @update:model-value="getMetrics(timeRange)"
            />
            <v-btn
              v-if="!mobile"
              :loading="loading"
              color="default"
              class="ml-2"
              @click="getMetrics(timeRange)"
            >
              {{ t('tools.roomMetrics.refresh') }}
            </v-btn>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="mt-4">
        <template v-if="worlds.length > 0">
          <v-tabs
            v-model="activeWorldID"
            align-tabs="start"
            color="primary"
            show-arrows
          >
            <v-tab
              v-for="world in worlds"
              :key="world.worldID"
              :value="world.worldID"
            >
              {{ world.worldName }}
            </v-tab>
          </v-tabs>
          <!-- 只渲染当前选中的世界，避免隐藏容器中初始化图表 -->
          <v-alert
            v-if="currentMetrics.length === 0"
            :title="t('tools.roomMetrics.noData.title')"
            :text="t('tools.roomMetrics.noData.text')"
            type="info"
            variant="tonal"
            class="mt-4"
          />
          <template v-else>
            <sc-echarts
              :option="cpuOption"
              height="30vh"
              class="mt-4"
            />
            <sc-echarts
              :option="memoryOption"
              height="30vh"
              class="mt-4"
            />
            <sc-echarts
              :option="memSizeOption"
              height="30vh"
              class="mt-4"
            />
            <sc-echarts
              :option="diskOption"
              height="30vh"
              class="mt-4"
            />
          </template>
        </template>
        <result
          v-else
          type="info"
          :title="t('tools.roomMetrics.empty.title')"
          :sub-title="t('tools.roomMetrics.empty.subTitle')"
          :height="300"
        />
      </v-card-text>
    </v-card>
  </check>
</template>

<script setup>
import roomApi from "@/api/room.js"
import useGlobalStore from "@store/global.js"
import { formatBytes, timestamp2timeWithoutDate } from "@/utils/tools.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"


const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const timeRange = ref(1)
const loading = ref(false)

const selectOptions = [
  {
    label: '1 ' + t('tools.roomMetrics.hour'),
    value: 1,
  },
  {
    label: '3 ' + t('tools.roomMetrics.hour'),
    value: 3,
  },
  {
    label: '6 ' + t('tools.roomMetrics.hour'),
    value: 6,
  },
  {
    label: '12 ' + t('tools.roomMetrics.hour'),
    value: 12,
  },
  {
    label: '24 ' + t('tools.roomMetrics.hour'),
    value: 24,
  },
]

// 后端返回： [{ worldID, worldName, metrics: [{ timestamp, cpu, memory, memSize, disk }] }]
const worlds = ref([])
const activeWorldID = ref(0)

const currentWorld = computed(() => worlds.value.find(world => world.worldID === activeWorldID.value))
const currentMetrics = computed(() => currentWorld.value?.metrics || [])
const timestamps = computed(() => currentMetrics.value.map(item => timestamp2timeWithoutDate(item.timestamp)))

// 折线图通用配置，data 为单值数组，tooltipFormatter/axisFormatter 负责单位格式化
const buildOption = ({ title, data, color, tooltipFormatter, axisFormatter }) => ({
  title: {
    text: title,
  },
  tooltip: {
    trigger: 'axis',
    formatter: params => (params.length > 0 ? tooltipFormatter(params[0].value) : ''),
  },
  grid: {
    left: 70,
    right: 30,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: timestamps.value,
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: axisFormatter,
    },
  },
  series: [
    {
      data: data,
      type: 'line',
      smooth: true,
      showSymbol: false,
      itemStyle: {
        normal: {
          color: color, // 改变折线点的颜色
          lineStyle: {
            color: color, // 改变折线颜色
          },
        },
      },
      areaStyle: {
        color: {
          //线性渐变
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: color, // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    },
  ],
})

const cpuOption = computed(() => buildOption({
  title: 'CPU',
  data: currentMetrics.value.map(item => item.cpu),
  color: '#409EFF',
  tooltipFormatter: value => `${Number(value).toFixed(2)} %`,
  axisFormatter: '{value}%',
}))

const memoryOption = computed(() => buildOption({
  title: t('tools.roomMetrics.memory'),
  data: currentMetrics.value.map(item => item.memory),
  color: '#67C23A',
  tooltipFormatter: value => `${Number(value).toFixed(2)} %`,
  axisFormatter: '{value}%',
}))

const memSizeOption = computed(() => buildOption({
  title: t('tools.roomMetrics.memSize'),
  data: currentMetrics.value.map(item => item.memSize),
  color: '#8C57FF',
  tooltipFormatter: value => `${Number(value).toFixed(2)} MB`,
  axisFormatter: '{value} MB',
}))

// 坐标轴刻度可能是小数或 0，formatBytes 只适用于 1 字节以上的整数
const formatDiskSize = bytes => (Number.isFinite(bytes) && bytes >= 1 ? formatBytes(bytes) : '0 B')

const diskOption = computed(() => buildOption({
  title: t('tools.roomMetrics.disk'),
  data: currentMetrics.value.map(item => item.disk),
  color: '#E6A23C',
  tooltipFormatter: value => formatDiskSize(value),
  axisFormatter: value => formatDiskSize(value),
}))

const getMetrics = range => {
  if (globalStore.room.id === 0) return

  loading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    timeRange: range,
  }

  roomApi.metrics.get(reqForm).then(response => {
    worlds.value = response.data || []

    // 世界被删除或首次加载时，切换到第一个世界
    const exist = worlds.value.some(world => world.worldID === activeWorldID.value)
    if (!exist) {
      activeWorldID.value = worlds.value.length > 0 ? worlds.value[0].worldID : 0
    }
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  getMetrics(timeRange.value)
})
</script>
