<template>
  <div
    ref="scEcharts"
    :style="{height:height, width:width}"
  />
</template>

<script>
import * as echarts from 'echarts'
import T from './echarts-theme-T.js'

echarts.registerTheme('T', T)

const unwarp = obj => obj && (obj.__v_raw || obj.valueOf() || obj)

export default {
  ...echarts,
  name: "ScEcharts",
  props: {
    height: { type: String, default: "100%" },
    width: { type: String, default: "100%" },
    nodata: { type: Boolean, default: false },
    option: { type: Object, default: () => {} },
  },
  data() {
    return {
      isActivat: false,
      myChart: null,
    }
  },
  computed: {
    myOptions: function() {
      return this.option || {}
    },
  },
  watch: {
    option: {
      deep: true,
      handler (v) {
        unwarp(this.myChart).setOption(v)
      },
    },
  },
  activated(){
    if(!this.isActivat){
      this.$nextTick(() => {
        this.myChart.resize()
      })
    }
  },
  deactivated(){
    this.isActivat = false
  },
  mounted(){
    this.isActivat = true
    this.$nextTick(() => {
      this.draw()
    })
  },
  methods: {
    draw(){
      var myChart = echarts.init(this.$refs.scEcharts, 'T', { renderer: 'svg' })
      myChart.setOption(this.myOptions)
      this.myChart = myChart
      window.addEventListener('resize', () => myChart.resize())
    },
    redraw(option) {
      this.myChart.dispose()
      var myChart = echarts.init(this.$refs.scEcharts, 'T', { renderer: 'svg' })
      myChart.setOption(option)
      this.myChart = myChart
      window.addEventListener('resize', () => myChart.resize())
    },
    setOption(option) {
      this.myChart.setOption(option)
    },
  },
}
</script>
