<template>

  <v-card>
    <template #title>
      <div class="card-header d-flex align-center justify-space-between">
        <span class="font-weight-bold">系统信息</span>
        <div class="d-flex align-center">
          <v-select v-model="timeRange" :items="selectOptions" item-title="label" item-value="value" density="compact"
            @update:model-value="getMetrics"></v-select>
          <v-btn class="ms-4" @click="getMetrics(timeRange, true)">刷新</v-btn>
        </div>
      </div>
    </template>
    <template #text>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <VueApexCharts type="area" height="350" :options="cpuOption" :series="cpuOption.series" />
          </v-col>
          <v-col cols="12">
            <VueApexCharts type="area" height="350" :options="memoryOption" :series="memoryOption.series" />
          </v-col>
          <v-col cols="12">
            <VueApexCharts type="area" height="350" :options="netUplinkOption" :series="netUplinkOption.series" />
          </v-col>
          <v-col cols="12">
            <VueApexCharts type="area" height="350" :options="netDownlinkOption" :series="netDownlinkOption.series" />
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import toolsApi from "@/api/tools"
import VueApexCharts from 'vue3-apexcharts'
import { showSnackbar } from "@/utils/snackbar";

const timeRange = ref(30)

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


const cpuOption = ref({
  chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false,
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    colors: ['#409EFF']  // CPU蓝色
  },
  markers: {
    size: 0
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: '#409EFF',
          opacity: 0.7
        },
        {
          offset: 100,
          color: '#409EFF',
          opacity: 0.1
        }
      ]
    },
  },
  title: {
    text: 'CPU 使用率',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 600
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MM',
        day: 'dd',
        hour: 'HH:mm'
      },
      datetimeUTC: false,
      format: 'HH:mm'
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val.toFixed(2) + '%'
      }
    }
  },
  tooltip: {
    x: {
      format: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  series: [{
    name: 'CPU Usage',
    data: []
  }]
})

const memoryOption = ref({
  chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false,
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    colors: ['#67C23A']  // 内存绿色
  },
  markers: {
    size: 0
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: '#67C23A',
          opacity: 0.7
        },
        {
          offset: 100,
          color: '#67C23A',
          opacity: 0.1
        }
      ]
    },
  },
  title: {
    text: '内存使用率',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 600
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MM',
        day: 'dd',
        hour: 'HH:mm'
      },
      datetimeUTC: false,
      format: 'HH:mm'
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val.toFixed(2) + '%'
      }
    }
  },
  tooltip: {
    x: {
      format: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  series: [{
    name: 'Memory Usage',
    data: []
  }]
})

const netUplinkOption = ref({
  chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false,
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    colors: ['#E6A23C']  // 上行黄色
  },
  markers: {
    size: 0
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: '#E6A23C',
          opacity: 0.7
        },
        {
          offset: 100,
          color: '#E6A23C',
          opacity: 0.1
        }
      ]
    },
  },
  title: {
    text: '网络上行',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 600
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MM',
        day: 'dd',
        hour: 'HH:mm'
      },
      datetimeUTC: false,
      format: 'HH:mm'
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val.toFixed(2) + ' KiB/s'
      }
    }
  },
  tooltip: {
    x: {
      format: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  series: [{
    name: 'Network Upload',
    data: []
  }]
})

const netDownlinkOption = ref({
  chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false,
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    colors: ['#F56C6C']  // 下行红色
  },
  markers: {
    size: 0
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: '#F56C6C',
          opacity: 0.7
        },
        {
          offset: 100,
          color: '#F56C6C',
          opacity: 0.1
        }
      ]
    },
  },
  title: {
    text: '网络下行',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 600
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MM',
        day: 'dd',
        hour: 'HH:mm'
      },
      datetimeUTC: false,
      format: 'HH:mm'
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val.toFixed(2) + ' KiB/s'
      }
    }
  },
  tooltip: {
    x: {
      format: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  series: [{
    name: 'Network Download',
    data: []
  }]
})

const getMetrics = (timeRange, tip) => {
  const reqForm = {
    timeRange: timeRange
  }
  toolsApi.metrics.get(reqForm).then(response => {
    cpuOption.value.series[0].data = []
    memoryOption.value.series[0].data = []
    netUplinkOption.value.series[0].data = []
    netDownlinkOption.value.series[0].data = []
    for (let i of response.data) {
      cpuOption.value.series[0].data.push([i.timestamp, i.cpu])
      memoryOption.value.series[0].data.push([i.timestamp, i.memory])
      netUplinkOption.value.series[0].data.push([i.timestamp, i.netUplink])
      netDownlinkOption.value.series[0].data.push([i.timestamp, i.netDownlink])
    }
    if (tip) {
      showSnackbar('刷新成功', 'success')
    }
  })
}

onMounted(() => {
  getMetrics(timeRange.value, false)
})

</script>

<style scoped></style>