<template>
  <v-card>
    <v-card-title>
      <div class="card-header d-flex align-center justify-space-between">
        <span class="font-weight-bold">系统信息</span>
        <div class="d-flex align-center">
          <v-select v-model="timeRange" :items="selectOptions" item-title="label" item-value="value" density="compact"
                    @update:model-value="getMetrics"></v-select>
          <v-btn class="ms-4" @click="getMetrics(timeRange, true)">刷新</v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <sc-echarts ref="cpuChartRef" :option="cpuOption" height="25vh"></sc-echarts>
      <sc-echarts ref="memoryChartRef" :option="memoryOption" height="25vh" style="margin-top: 20px"></sc-echarts>
      <sc-echarts ref="netUplinkChartRef" :option="netUplinkOption" height="25vh" style="margin-top: 20px"></sc-echarts>
      <sc-echarts ref="netDownlinkChartRef" :option="netDownlinkOption" height="25vh" style="margin-top: 20px"></sc-echarts>
    </v-card-text>
  </v-card>
</template>

<script setup>
import toolsApi from "@/api/tools"
import useGlobalStore from "@/plugins/pinia/global";
import ScEcharts from "@/components/scEcharts/index.vue";
import {timestamp2timeWithoutDate} from "@/utils/tools.js";
import {showSnackbar} from "@/utils/snackbar";


const globalStore = useGlobalStore();
const timeRange = ref(30)

onMounted(() => {
  getMetrics(timeRange.value, false)
})

const selectOptions = [
  {
    label: '30分钟',
    value: 30
  },
  {
    label: '60分钟',
    value: 60
  },
  {
    label: '3小时',
    value: 180
  },
  {
    label: '6小时',
    value: 360
  },
]

const getMetrics = (timeRange, tip) => {
  const reqForm = {
    timeRange: timeRange
  }
  toolsApi.metrics.get(reqForm).then(response => {
    cpuOption.value.xAxis.data = []
    memoryOption.value.xAxis.data = []
    netUplinkOption.value.xAxis.data = []
    netDownlinkOption.value.xAxis.data = []
    cpuOption.value.series[0].data = []
    memoryOption.value.series[0].data = []
    netUplinkOption.value.series[0].data = []
    netDownlinkOption.value.series[0].data = []
    for (let i of response.data) {
      cpuOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      memoryOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      netUplinkOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))
      netDownlinkOption.value.xAxis.data.push(timestamp2timeWithoutDate(i.timestamp))

      cpuOption.value.series[0].data.push(i.cpu.toFixed(2))
      memoryOption.value.series[0].data.push(i.memory.toFixed(2))
      netUplinkOption.value.series[0].data.push(i.netUplink.toFixed(2))
      netDownlinkOption.value.series[0].data.push(i.netDownlink.toFixed(2))
    }
    if (tip) {
      showSnackbar('刷新成功')
    }
  })
}

const cpuChartRef = ref()
const memoryChartRef = ref()
const netUplinkChartRef = ref()
const netDownlinkChartRef = ref()

const cpuOption = ref({
  title: {
    text: 'CPU',
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%'
    }
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
            color: '#409EFF' // 改变折线颜色
          }
        }
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
    }
  ]
})

const memoryOption = ref({
  title: {
    text: 'Memory',
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%'
    }
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
            color: '#67C23A' // 改变折线颜色
          }
        }
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
    }
  ]
})

const netUplinkOption = ref({
  title: {
    text: 'Net ↑',
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} KiB/s'
    }
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
            color: '#E6A23C' // 改变折线颜色
          }
        }
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
    }
  ]
})

const netDownlinkOption = ref({
  title: {
    text: 'Net ↓',
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} KiB/s'
    }
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
            color: '#F56C6C' // 改变折线颜色
          }
        }
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
    }
  ]
})

</script>

<style scoped></style>