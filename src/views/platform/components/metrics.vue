<template>
  <v-card class="mb-4">
    <v-card-title class="mt-2">
      <div class="card-header">
        <div>
          {{ t('platform.metrics.title') }}
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
            :label="t('platform.metrics.timeRange')"
            @update:model-value="getMetrics(timeRange)"
          />
          <v-btn
            v-if="!mobile"
            :loading="loading"
            color="default"
            class="ml-2"
            @click="getMetrics(timeRange)"
          >
            {{ t('platform.metrics.refresh') }}
          </v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="mt-4">
      <sc-echarts
        ref="cpuChartRef"
        :option="cpuOption"
        height="30vh"
        class="mb-4"
      />
      <sc-echarts
        ref="memoryChartRef"
        :option="memoryOption"
        height="30vh"
        class="mb-4"
      />
      <sc-echarts
        ref="diskChartRef"
        :option="diskOption"
        height="30vh"
        class="mb-4"
      />
      <sc-echarts
        ref="netUplinkChartRef"
        :option="netUplinkOption"
        height="30vh"
        class="mb-4"
      />
      <sc-echarts
        ref="netDownlinkChartRef"
        :option="netDownlinkOption"
        height="30vh"
        class="mb-4"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import platformApi from "@/api/platform.js"
import { timestamp2timeWithoutDate } from "@/utils/tools.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"


const timeRange = ref(1)
const { mobile } = useDisplay()
const { t } = useI18n()

const selectOptions = [
  {
    label: '1 ' + t('platform.metrics.hour'),
    value: 1,
  },
  {
    label: '3 ' + t('platform.metrics.hour'),
    value: 3,
  },
  {
    label: '6 ' + t('platform.metrics.hour'),
    value: 6,
  },
  {
    label: '12 ' + t('platform.metrics.hour'),
    value: 12,
  },
  {
    label: '24 ' + t('platform.metrics.hour'),
    value: 24,
  },
]

const cpuChartRef = ref()
const memoryChartRef = ref()
const diskChartRef = ref()
const netUplinkChartRef = ref()
const netDownlinkChartRef = ref()


const cpuOption = ref({
  title: {
    text: 'CPU',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%',
    },
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#409EFF', // 改变折线点的颜色
          lineStyle: {
            color: '#409EFF', // 改变折线颜色
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
            offset: 0, color: '#409EFF', // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    },
  ],
})

const memoryOption = ref({
  title: {
    text: 'Memory',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%',
    },
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#67C23A', // 改变折线点的颜色
          lineStyle: {
            color: '#67C23A', // 改变折线颜色
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
            offset: 0, color: '#67C23A', // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    },
  ],
})

const diskOption = ref({
  title: {
    text: 'Disk',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%',
    },
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#8C57FF', // 改变折线点的颜色
          lineStyle: {
            color: '#8C57FF', // 改变折线颜色
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
            offset: 0, color: '#8C57FF', // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    },
  ],
})

const netUplinkOption = ref({
  title: {
    text: 'Net ↑',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} KB/s',
    },
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#E6A23C', // 改变折线点的颜色
          lineStyle: {
            color: '#E6A23C', // 改变折线颜色
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
            offset: 0, color: '#E6A23C', // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    },
  ],
})

const netDownlinkOption = ref({
  title: {
    text: 'Net ↓',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} KB/s',
    },
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#F56C6C', // 改变折线点的颜色
          lineStyle: {
            color: '#F56C6C', // 改变折线颜色
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
            offset: 0, color: '#F56C6C', // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff00', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    },
  ],
})

const loading = ref(false)

const getMetrics = timeRange => {
  const reqForm = {
    timeRange: timeRange,
  }

  loading.value = true
  platformApi.metrics.get(reqForm).then(response => {
    cpuOption.value.xAxis.data = []
    memoryOption.value.xAxis.data = []
    diskOption.value.xAxis.data = []
    netUplinkOption.value.xAxis.data = []
    netDownlinkOption.value.xAxis.data = []
    cpuOption.value.series[0].data = []
    memoryOption.value.series[0].data = []
    diskOption.value.series[0].data = []
    netUplinkOption.value.series[0].data = []
    netDownlinkOption.value.series[0].data = []
    for (let i of response.data) {
      cpuOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      memoryOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      diskOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      netUplinkOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      netDownlinkOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))

      cpuOption.value.series[0].data.push(i.cpu.toFixed(2))
      memoryOption.value.series[0].data.push(i.memory.toFixed(2))
      diskOption.value.series[0].data.push(i.disk.toFixed(2))
      netUplinkOption.value.series[0].data.push(i.netUplink.toFixed(2))
      netDownlinkOption.value.series[0].data.push(i.netDownlink.toFixed(2))
    }
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  getMetrics(timeRange.value)
})
</script>

