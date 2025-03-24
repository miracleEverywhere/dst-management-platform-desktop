<template>
  <div id="chart">
    <vue-apex-charts width="500" type="bar" :options="chartOptions" :series="series"></vue-apex-charts>
  </div>
</template>

<script setup>
import toolsApi from "@/api/tools"
import {timestamp2timeWithoutDate} from "@/utils/tools.js";
import VueApexCharts from 'apexcharts'

const timeRange = ref(30)

onMounted(() => {
  getMetrics(timeRange.value, false)
})

const chartOptions = ref({
  chart: {
    id: 'vuechart-example'
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
  }
},
)
const series = ref([{
  name: 'series-1',
  data: [30, 40, 35, 50, 49, 60, 70, 91]
}])


const getMetrics = (timeRange, tip) => {
  const reqForm = {
    timeRange: timeRange
  }
  toolsApi.metrics.get(reqForm).then(response => {
    // if (response.data) {
    //
    //   cpuOptions.value.series[0].data = []
    //   for (let i of response.data) {
    //     cpuOptions.value.series[0].data.push([i.timestamp, i.cpu.toFixed(2)])
    //   }
    //   a.value = true
    // }
  })
}
</script>

<style scoped>
</style>