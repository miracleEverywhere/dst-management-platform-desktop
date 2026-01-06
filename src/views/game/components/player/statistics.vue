<template>
  <v-card class="mb-8">
    <v-card-title>
      <div class="card-header">
        <span>
          {{ t('game.player.statistics.lineChart.title') }}
        </span>
        <v-btn
          :loading="getPlayerCountLoading"
          color="default"
          @click="getPlayerCount"
        >
          {{ t('platform.metrics.refresh') }}
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <sc-echarts
        ref="playerChartRef"
        :option="option"
        height="50vh"
      />
    </v-card-text>
  </v-card>
  <v-card>
    <v-card-title>
      <div class="card-header">
        <span>
          {{ t('game.player.statistics.pieChart.title') }}
        </span>
        <v-btn
          :loading="getOnlineTimeLoading"
          color="default"
          @click="getOnlineTime"
        >
          {{ t('platform.metrics.refresh') }}
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <sc-echarts
        ref="pieChartRef"
        :option="optionPie"
        height="75vh"
        width="75vw"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import playerApi from "@/api/player.js"
import { timestamp2time } from "@/utils/tools.js"

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const playerChartRef = ref()

const option = ref({
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
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
    },
  ],
})

const pieChartRef = ref()

const optionPie = ref({
  tooltip: {
    trigger: 'item',
    formatter: `{b}: {c}${t('game.player.statistics.pieChart.unit')}`,
  },
  legend: {
    top: '5%',
    left: 'center',
  },
  series: [
    {
      name: 'Top-10',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
})

const getPlayerCountLoading = ref(false)

const getPlayerCount = () => {
  getPlayerCountLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  playerApi.statistics.playerCount.get(reqForm).then(response => {
    if (response.data != null) {
      option.value.xAxis.data = []
      option.value.series[0].data = []
      for (let item of response.data) {
        option.value.xAxis.data.push(timestamp2time(item.timestamp))
        option.value.series[0].data.push(item?.playerInfo?.length || 0)
      }
    }
  }).finally(() => {
    getPlayerCountLoading.value = false
  })
}

const getOnlineTimeLoading = ref(false)

const getOnlineTime = () => {
  getOnlineTimeLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  playerApi.statistics.onlineTime.get(reqForm).then(response => {
    if (response.data != null) {
      optionPie.value.series[0].data = Object.entries(response.data)
        .sort((a, b) => b[1] - a[1])  // 按值降序排序
        .slice(0, 10)                 // 只取前10项
        .map(([name, value]) => ({    // 转换为目标格式
          value: (value/(8*60)).toFixed(0),
          name: name,
        }))
      pieChartRef.value.redraw(optionPie.value)
    }
  }).finally(() => {
    getOnlineTimeLoading.value = false
  })
}

onMounted(() => {
  getPlayerCount()
  getOnlineTime()
})
</script>


