<template>
  <v-tabs v-model="tab" @update:model-value="handleTabClick">
    <v-tab value="statistics">
      玩家人数
    </v-tab>
    <v-tab value="gantt">
      详细信息
    </v-tab>
    <v-tab value="pie">
      玩家时长
    </v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab" class="mt-4">
    <v-tabs-window-item value="statistics">
      <v-row>
        <v-col cols="12" lg="12">
          <v-card height="600">
            <v-card-title>
              <div class="d-flex justify-space-between align-center">
                <span>玩家人数</span>
                <v-btn @click="handleRefreshPlayer">刷新</v-btn>
              </div>
            </v-card-title>
            <v-card-text>
              <sc-echarts ref="playerChartRef" :option="option" height="500px"></sc-echarts>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4" lg="4">
          <v-card class="h-100">
            <template #title>
              <div class="card-header">
                <span>玩家统计</span>
              </div>
            </template>
            <template #text>
              <div class="d-flex align-center justify-space-between">
                <span>最大玩家数</span>
                <v-chip color="success" label size="small" variant="tonal">天</v-chip>
              </div>
              <div class="text-h4">
                {{ playerStatisticsResult.num }}
              </div>
            </template>
          </v-card>
        </v-col>
        <v-col cols="4" lg="4">
          <v-card class="h-100">
            <template #title>
              <div class="card-header">
                <span>对应时间</span>
              </div>
            </template>
            <template #text>
              <div class="flex justify-between">
                <span>时间</span>
              </div>
              <div class="text-h4">
                {{ timestamp2time(playerStatisticsResult.timestamp) }}
              </div>
            </template>
          </v-card>
        </v-col>
        <v-col cols="4" lg="4">
          <v-card class="h-100">
            <template #title>
              <div class="card-header">
                <span>数据量</span>
              </div>
            </template>
            <template #text>
              <div class="flex justify-between">
                <span>统计量</span>
              </div>
              <div class="text-h4">
                {{ playerStatisticsResult.dataVolume }}
              </div>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-tabs-window-item>
    <v-tabs-window-item value="gantt">
      <v-row>
        <v-col cols="12" lg="12">
          <v-card height="700">
            <v-card-title>
              <div class="d-flex justify-space-between align-center">
                <span>详细信息</span>
                <v-btn @click="handleRefreshPlayer">刷新</v-btn>
              </div>
            </v-card-title>
            <v-card-text>
              <div style="display: flex width: fit-content padding-bottom: 30px">
                <g-gantt-chart
                  :chart-end="lastTime"
                  :chart-start="firstTime"
                  bar-end="myEndDate"
                  bar-start="myBeginDate"
                  :color-scheme="theme.name.value==='dark'?'dark':'sky'"
                  precision="hour"
                  width="3900px"
                >
                  <g-gantt-row v-for="row in ganttRows" :bars="row.barList" :label="row.nickname" highlight-on-hover/>
                </g-gantt-chart>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-tabs-window-item>
    <v-tabs-window-item value="pie">
      <v-row>
        <v-col cols="12" lg="12">
          <v-card height="700">
            <v-card-title>
              <div class="d-flex justify-space-between align-center">
                <span>玩家时长</span>
                <v-btn @click="handleRefreshPlayer">刷新</v-btn>
              </div>
            </v-card-title>
            <v-card-text>
              <sc-echarts ref="pieChartRef" :option="optionPie" height="75vh" width="75vw"></sc-echarts>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import toolsApi from "@/api/tools"
import {showSnackbar} from "@/utils/snackbar"
import {timestamp2time, sleep} from "@/utils/tools"
import ScEcharts from "@/components/scEcharts/index.vue"
import {onMounted, ref} from 'vue'
import {useTheme} from "vuetify"
import useGlobalStore from "@/plugins/pinia/global"


onMounted(() => {
  getInfo()
})

const globalStore = useGlobalStore()
const theme = useTheme()

const tab = ref('statistics')
const handleTabClick = async () => {
  await sleep(10)
  option.value.xAxis.data = []
  option.value.series[0].data = []
  await getInfo()
  playerChartRef.value.redraw(option.value)
}

const playerStatisticsResult = ref({
  num: -1,
  timestamp: 0,
  dataVolume: 0,
})



const playerChartRef = ref()
const option = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          //线性渐变
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(1, 255, 255, 0.8)', // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(1, 255, 255,0)', // 100% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      },
    }
  ]
})

const pieChartRef = ref()
const optionPie = ref({
  tooltip: {
    trigger: 'item',
    formatter: `{b}: {c}天`
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Top-10',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
})

// 根据时间范围过滤数据
const formatTimeToGantt = (ts) => {
  const date = new Date(ts)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，补0
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const getInfo = (refresh = false) => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster
  }
  toolsApi.statistics.get(reqForm).then(response => {
    for (let item of response.data.stats) {
      option.value.xAxis.data.push(timestamp2time(item.timestamp))
      option.value.series[0].data.push(item.num)
      if (item.num > playerStatisticsResult.value.num) {
        playerStatisticsResult.value = item
      }
    }
    playerStatisticsResult.value.dataVolume = response.data.stats.length

    let first = response.data.stats[0].timestamp
    let last = response.data.stats[response.data.stats.length - 1].timestamp
    firstTime.value = formatTimeToGantt(parseInt(first) - 3600000)
    lastTime.value = formatTimeToGantt(parseInt(last) + 3600000)
    ganttRows.value = []

    for (const key in response.data.gantt) {
      let barList = []
      for (let arr of response.data.gantt[key]) {
        barList.push({
          myBeginDate: arr.beginDate,
          myEndDate: arr.endDate,
          ganttBarConfig: {
            id: arr.id,
            label: arr.label,
            immobile: true,
            style: {
              background: '#409effaa',
              color: 'white',
              borderRadius: '5px'
            }
          }
        })
      }
      ganttRows.value.push({
        nickname: key,
        barList: barList
      })
    }

    if (response.data.pie != null) {
      optionPie.value.series[0].data = Object.entries(response.data.pie)
        .sort((a, b) => b[1] - a[1])  // 按值降序排序
        .slice(0, 10)                 // 只取前10项
        .map(([name, value]) => ({    // 转换为目标格式
          value: (value/(8*60)).toFixed(0),
          name: name
        }))
      pieChartRef.value.redraw(optionPie.value)
    }

    if (refresh) {
      showSnackbar('刷新成功')
    }
  })
}

const firstTime = ref('')
const lastTime = ref('')
const ganttRows = ref([])

// 刷新玩家人数
const handleRefreshPlayer = () => {
  option.value.xAxis.data = []
  option.value.series[0].data = []
  getInfo(true)
  playerChartRef.value.redraw(option.value)
}



</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-range-select {
  width: 150px;
}

.gap-4 {
  gap: 1rem;
}
</style>
