<template>
  <v-card class="mb-8">
    <v-card-title>
      <div class="fcb">
        <div v-if="!mobile">
          {{ t('game.player.statistics.lineChart.title') }}
        </div>
        <div v-if="mobile" />

        <div class="fcc">
          <v-number-input
            v-model="playerCountTimeRange"
            v-tooltip="t('game.player.statistics.lineChart.timeRangeTip')"
            density="compact"
            width="120"
            hide-details
            :min="1"
            :loading="getOnlineTimeLoading"
            class="mr-4"
          >
            <template #append-inner>
              <div>
                {{ t('platform.settings.form.playerInfoSaveTime.unit') }}
              </div>
            </template>
          </v-number-input>
          <v-btn
            :loading="getPlayerCountLoading"
            color="default"
            @click="getPlayerCountV2"
          >
            {{ t('platform.metrics.refresh') }}
          </v-btn>
        </div>
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
  <v-card class="mb-8">
    <v-card-title>
      <div class="fcb">
        <div v-if="!mobile">
          {{ t('game.player.statistics.pieChart.title') }}
        </div>
        <div v-if="mobile" />

        <div class="fcc">
          <v-btn
            :loading="getOnlineTimeLoading"
            color="default"
            @click="getOnlineTime"
          >
            {{ t('platform.metrics.refresh') }}
          </v-btn>
        </div>
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
  <v-card class="gantt-card">
    <v-card-title class="gantt-card-title">
      <div class="fcb">
        <div v-if="!mobile">
          {{ t('game.player.statistics.ganttChart.title') }}
        </div>
        <div v-if="mobile" />

        <div class="fcc">
          <v-number-input
            v-model="ganttTimeRange"
            v-tooltip="t('game.player.statistics.ganttChart.timeRangeTip')"
            density="compact"
            width="120"
            hide-details
            :min="1"
            :max="24 * 3650"
            :loading="getGanttLoading"
            class="mr-4"
          >
            <template #append-inner>
              <div>
                {{ t('platform.metrics.hour') }}
              </div>
            </template>
          </v-number-input>
          <v-btn
            :loading="getGanttLoading"
            color="default"
            @click="getGantt"
          >
            {{ t('platform.metrics.refresh') }}
          </v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="gantt-card-content">
      <sc-echarts
        ref="ganttChartRef"
        class="gantt-chart"
        :option="optionGantt"
        :height="ganttChartHeight"
        width="100%"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import * as echarts from 'echarts'
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import playerApi from "@/api/player.js"
import echartsTheme from "@/components/scEcharts/echarts-theme-T.js"
import { getDstRoleName, timestamp2time } from "@/utils/tools.js"

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()
const ganttColors = echartsTheme.color

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

const formatDuration = totalSeconds => {
  let remainingSeconds = Math.max(0, Number(totalSeconds) || 0)
  const durationParts = []

  const units = [
    [24 * 60 * 60, t('global.timeRunning.day')],
    [60 * 60, t('global.timeRunning.hour')],
    [60, t('global.timeRunning.minute')],
    [1, t('global.timeRunning.second')],
  ]

  for (const [unitSeconds, unitLabel] of units) {
    const value = Math.floor(remainingSeconds / unitSeconds)

    if (value > 0) {
      durationParts.push(`${value} ${unitLabel}`)
      remainingSeconds %= unitSeconds
    }
    if (durationParts.length === 2) break
  }

  return durationParts.join(' ') || `0 ${t('global.timeRunning.second')}`
}

const escapeHtml = value => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const formatAxisTime = timestamp => {
  const formattedTime = timestamp2time(timestamp)

  if (mobile.value && ganttAxisSpan.value <= 24 * 60 * 60 * 1000) {
    return formattedTime.slice(11, 16)
  }

  return `${formattedTime.slice(5, 10)}\n${formattedTime.slice(11, 16)}`
}

const renderGanttItem = (params, api) => {
  const categoryIndex = api.value(0)
  const start = api.coord([api.value(1), categoryIndex])
  const end = api.coord([api.value(2), categoryIndex])
  const barHeight = api.size([0, 1])[1] * 0.56

  const rectangle = echarts.graphic.clipRectByRect(
    {
      x: start[0],
      y: start[1] - barHeight / 2,
      width: Math.max(end[0] - start[0], 1),
      height: barHeight,
    },
    {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height,
    },
  )

  return rectangle && {
    type: 'rect',
    shape: {
      ...rectangle,
      r: Math.min(barHeight / 2, rectangle.width / 2),
    },
    style: api.style({
      fill: ganttColors[categoryIndex % ganttColors.length],
    }),
  }
}

const ganttChartRef = ref()
const ganttContinuousGap = 1000
const ganttPlayerCount = ref(0)
const ganttAxisSpan = ref(0)

const ganttChartHeight = computed(() => {
  if (!mobile.value) return '60vh'

  const visiblePlayers = Math.min(Math.max(ganttPlayerCount.value, 4), 7)

  return `${visiblePlayers * 44 + 116}px`
})

const mergeContinuousGanttItems = items => {
  const itemsByPlayer = new Map()

  for (const item of items) {
    const playerKey = item.uid || item.nickname

    if (!playerKey) continue

    if (!itemsByPlayer.has(playerKey)) {
      itemsByPlayer.set(playerKey, [])
    }
    itemsByPlayer.get(playerKey).push(item)
  }

  const mergedItems = []

  for (const playerItems of itemsByPlayer.values()) {
    playerItems.sort((a, b) => a.startTime - b.startTime)

    const mergedPlayerItems = []

    for (const item of playerItems) {
      const lastItem = mergedPlayerItems.at(-1)

      const isContinuous = lastItem
        && item.startTime - lastItem.endTime <= ganttContinuousGap

      if (!isContinuous) {
        mergedPlayerItems.push({ ...item })
        continue
      }

      lastItem.endTime = Math.max(lastItem.endTime, item.endTime)
      lastItem.duration = Math.floor((lastItem.endTime - lastItem.startTime) / 1000)
      lastItem.nickname = item.nickname || lastItem.nickname
      lastItem.prefab = item.prefab || lastItem.prefab
    }

    mergedItems.push(...mergedPlayerItems)
  }

  return mergedItems.sort((a, b) => a.startTime - b.startTime)
}

const optionGantt = ref({
  animation: false,
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove|click',
    confine: true,
    formatter: params => {
      const [, startTime, endTime, duration, uid, nickname, prefab] = params.value
      const playerName = nickname || uid || '-'
      const characterName = getDstRoleName(prefab, globalStore.language) || prefab || '-'

      return [
        `<strong>${escapeHtml(playerName)}</strong>`,
        `${escapeHtml(t('game.player.statistics.ganttChart.uid'))}: ${escapeHtml(uid || '-')}`,
        `${escapeHtml(t('game.player.statistics.ganttChart.character'))}: ${escapeHtml(characterName)}`,
        `${escapeHtml(t('game.player.statistics.ganttChart.startTime'))}: ${timestamp2time(startTime)}`,
        `${escapeHtml(t('game.player.statistics.ganttChart.endTime'))}: ${timestamp2time(endTime)}`,
        `${escapeHtml(t('game.player.statistics.ganttChart.duration'))}: ${escapeHtml(formatDuration(duration))}`,
      ].join('<br>')
    },
  },
  grid: {
    top: 24,
    right: 52,
    bottom: 72,
    left: mobile.value ? 112 : 180,
  },
  xAxis: {
    type: 'time',
    min: Date.now() - 24 * 60 * 60 * 1000,
    max: Date.now(),
    axisLabel: {
      formatter: formatAxisTime,
      hideOverlap: true,
    },
    splitLine: {
      show: true,
    },
  },
  yAxis: {
    type: 'category',
    inverse: true,
    data: [],
    axisLabel: {
      overflow: 'truncate',
      width: mobile.value ? 82 : 150,
    },
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      filterMode: 'weakFilter',
    },
    {
      type: 'slider',
      xAxisIndex: 0,
      filterMode: 'weakFilter',
      height: 18,
      bottom: 18,
    },
    {
      type: 'inside',
      yAxisIndex: 0,
      filterMode: 'weakFilter',
      zoomOnMouseWheel: false,
      moveOnMouseWheel: true,
    },
    {
      type: 'slider',
      yAxisIndex: 0,
      filterMode: 'weakFilter',
      right: 12,
      width: 14,
    },
  ],
  graphic: [
    {
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: t('global.noData'),
        fill: '#8C57FF',
        fontSize: 14,
      },
    },
  ],
  series: [
    {
      type: 'custom',
      renderItem: renderGanttItem,
      encode: {
        x: [1, 2],
        y: 0,
      },
      data: [],
    },
  ],
})

const applyGanttResponsiveOptions = () => {
  const visiblePlayerCount = Math.min(Math.max(ganttPlayerCount.value, 1), mobile.value ? 7 : 12)

  optionGantt.value.grid = mobile.value
    ? {
      top: 16,
      right: 44,
      bottom: 58,
      left: 12,
    }
    : {
      top: 24,
      right: 52,
      bottom: 72,
      left: 64,
    }
  optionGantt.value.xAxis.splitNumber = mobile.value ? 3 : 6
  optionGantt.value.xAxis.axisLabel.fontSize = mobile.value ? 10 : 12
  optionGantt.value.xAxis.axisLabel.margin = mobile.value ? 8 : 10
  optionGantt.value.tooltip.triggerOn = mobile.value ? 'click' : 'mousemove|click'
  optionGantt.value.yAxis.axisLabel.show = !mobile.value
  optionGantt.value.yAxis.axisLabel.width = mobile.value ? 58 : 150
  optionGantt.value.yAxis.axisLabel.fontSize = mobile.value ? 11 : 12
  optionGantt.value.yAxis.axisTick = {
    show: !mobile.value,
  }
  optionGantt.value.yAxis.axisLine = {
    show: !mobile.value,
  }
  optionGantt.value.dataZoom[1].height = mobile.value ? 14 : 18
  optionGantt.value.dataZoom[1].bottom = mobile.value ? 12 : 18
  optionGantt.value.dataZoom[2].startValue = 0
  optionGantt.value.dataZoom[2].endValue = visiblePlayerCount - 1
  optionGantt.value.dataZoom[3].show = true
  optionGantt.value.dataZoom[3].right = mobile.value ? 6 : 12
  optionGantt.value.dataZoom[3].width = mobile.value ? 18 : 14
}

const getPlayerCountLoading = ref(false)
const playerCountTimeRange = ref(1)

// const getPlayerCount = () => {
//   getPlayerCountLoading.value = true
//
//   const reqForm = {
//     roomID: globalStore.room.id,
//     timeRange: playerCountTimeRange.value * 24 * 60 * 60,
//   }
//
//   playerApi.statistics.playerCount.get(reqForm).then(response => {
//     if (response.data != null) {
//       option.value.xAxis.data = []
//       option.value.series[0].data = []
//       for (let item of response.data) {
//         option.value.xAxis.data.push(timestamp2time(item.timestamp))
//         option.value.series[0].data.push(item?.playerInfo?.length || 0)
//       }
//     }
//   }).finally(() => {
//     getPlayerCountLoading.value = false
//   })
// }

const getPlayerCountV2 = () => {
  getPlayerCountLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    timeRange: playerCountTimeRange.value * 24 * 60 * 60,
  }

  playerApi.statistics.playerCountV2.get(reqForm).then(response => {
    if (response.data != null) {
      option.value.xAxis.data = []
      option.value.series[0].data = []
      for (let item of response.data) {
        option.value.xAxis.data.push(timestamp2time(item.timestamp))
        option.value.series[0].data.push(item?.count || 0)
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

const getGanttLoading = ref(false)
const ganttTimeRange = ref(6)

const getGantt = () => {
  getGanttLoading.value = true

  const timeRange = Math.min(Math.max(Number(ganttTimeRange.value) || 1, 1), 24 * 3650)
  const requestTime = Date.now()

  const reqForm = {
    roomID: globalStore.room.id,
    timeRange: timeRange,
  }

  ganttTimeRange.value = timeRange

  playerApi.gantt.get(reqForm).then(async response => {
    const ganttItems = mergeContinuousGanttItems(response.data || [])
    const playerMap = new Map()

    for (const item of ganttItems) {
      const playerKey = item.uid || item.nickname

      if (playerKey && !playerMap.has(playerKey)) {
        playerMap.set(playerKey, {
          nickname: item.nickname,
          uid: item.uid,
        })
      }
    }

    const players = Array.from(playerMap.values())

    ganttPlayerCount.value = players.length

    const playerIndexes = new Map(
      Array.from(playerMap.keys()).map((playerKey, index) => [playerKey, index]),
    )

    const duplicateNames = players.reduce((nameCounts, player) => {
      const name = player.nickname || player.uid

      nameCounts.set(name, (nameCounts.get(name) || 0) + 1)

      return nameCounts
    }, new Map())

    optionGantt.value.yAxis.data = players.map(player => {
      const name = player.nickname || player.uid

      return duplicateNames.get(name) > 1 && player.uid
        ? `${name} (${player.uid})`
        : name
    })
    optionGantt.value.series[0].data = ganttItems.map(item => [
      playerIndexes.get(item.uid || item.nickname),
      item.startTime,
      item.endTime,
      item.duration,
      item.uid,
      item.nickname,
      item.prefab,
    ])

    const startTimes = ganttItems.map(item => item.startTime)
    const endTimes = ganttItems.map(item => item.endTime)

    const minimumTime = ganttItems.length > 0
      ? Math.min(...startTimes)
      : requestTime - timeRange * 60 * 60 * 1000

    const maximumTime = ganttItems.length > 0
      ? Math.max(...endTimes)
      : requestTime

    ganttAxisSpan.value = maximumTime - minimumTime
    optionGantt.value.xAxis.min = minimumTime
    optionGantt.value.xAxis.max = maximumTime
    optionGantt.value.graphic[0].invisible = ganttItems.length > 0
    applyGanttResponsiveOptions()
    await nextTick()
    ganttChartRef.value.redraw(optionGantt.value)
  }).finally(() => {
    getGanttLoading.value = false
  })
}

onMounted(() => {
  getPlayerCountV2()
  getOnlineTime()
  getGantt()
})

watch(mobile, () => {
  applyGanttResponsiveOptions()
  nextTick(() => ganttChartRef.value?.redraw(optionGantt.value))
})
</script>

<style scoped>
.gantt-card,
.gantt-card-content,
.gantt-chart {
  min-inline-size: 0;
  inline-size: 100%;
}

.gantt-card-content {
  overflow: hidden;
}

@media (max-width: 600px) {
  .gantt-card-title {
    padding-inline: 12px;
  }

  .gantt-card-content {
    padding: 8px 8px 12px;
  }
}
</style>
