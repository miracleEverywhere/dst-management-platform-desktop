<template>
    <v-row>
        <v-col cols="12" lg="12">
            <v-card class="h-100">
                <template #title>
                    <div class="card-header">
                        <div class="d-flex align-center gap-4">
                            <span class="font-weight-bold">玩家人数</span>
                            <v-select
                                v-model="selectedTimeRange"
                                :items="timeRanges"
                                density="compact"
                                variant="outlined"
                                hide-details
                                class="time-range-select"
                            />
                        </div>
                        <v-btn variant="outlined" size="small" @click="handleRefreshPlayer">刷新</v-btn>
                    </div>
                </template>
                <template #text>
                    <VueApexCharts 
                        type="area" 
                        height="350"
                        :options="chartOptions" 
                        :series="series"
                    />
                </template>
            </v-card>
        </v-col>
        <v-col cols="4" lg="4">
            <v-card class="h-100">
                <template #title>
                    <div class="card-header">
                        <span class="font-weight-bold">玩家统计</span>
                    </div>
                </template>
                <template #text>
                    <div class="d-flex align-center justify-space-between">
                        <span>最大玩家数</span>
                        <v-chip color="success" size="small" variant="tonal" label>天</v-chip>
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
                        <span class="font-weight-bold">对应时间</span>
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
                        <span class="font-weight-bold">数据量</span>
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
</template>

<script setup>
import toolsApi from "@/api/tools";
import { showSnackbar } from "@/utils/snackbar";
import { timestamp2time } from "@/utils/tools";
import VueApexCharts from "vue3-apexcharts"
import { ref, watch, onMounted } from 'vue';

// 时间范围选项
const timeRanges = [
    { title: '最近30分钟', value: 30 },
    { title: '最近1小时', value: 60 },
    { title: '最近3小时', value: 180 },
    { title: '最近6小时', value: 360 },
    { title: '最近12小时', value: 720 },
    { title: '最近24小时', value: 1440 }
];

const selectedTimeRange = ref(30); // 默认显示30分钟

const playerStatisticsResult = ref({
    num: -1,
    timestamp: 0,
    dataVolume: 0,
});

const series = ref([
    {
        name: '在线玩家',
        data: []
    }
]);

const chartOptions = ref({
    chart: {
        type: 'area',
        height: 350,
        zoom: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    markers: {
        size: 4,
        hover: {
            size: 6
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            stops: [0, 100]
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            datetimeUTC: false,  
            datetimeFormatter: {
                year: 'yyyy',
                month: 'MM/yyyy',
                day: 'dd/MM',
                hour: 'HH:mm'
            }
        }
    },
    yaxis: {
        min: 0,
        forceNiceScale: false,
        decimalsInFloat: 0,
        labels: {
            formatter: function(val) {
                return parseInt(val);
            }
        }
    },
    tooltip: {
        x: {
            format: 'yyyy-MM-dd HH:mm:ss'
        }
    }
});

// 根据时间范围过滤数据
const filterDataByTimeRange = (data, minutes) => {
    const now = Date.now();
    const rangeStart = now - (minutes * 60 * 1000); // 转换为毫秒
    return data.filter(item => {
        const itemTime = new Date(item.timestamp).getTime();
        return itemTime >= rangeStart && itemTime <= now;
    });
};

// 获取玩家统计信息
const getInfo = (refresh = false) => {
    toolsApi.statistics.get().then((response) => {
        // 清空旧数据
        series.value[0].data = [];
        
        // 根据选择的时间范围过滤数据
        const filteredData = filterDataByTimeRange(response.data, selectedTimeRange.value);
        
        // 处理数据
        const formattedData = filteredData.map(item => ({
            x: new Date(item.timestamp).getTime(),
            y: Math.random() * 5
        }));
        
        // 更新数据
        series.value[0].data = formattedData;
        
        // 更新统计信息
        for (let item of response.data) {
            if (item.num > playerStatisticsResult.value.num) {
                playerStatisticsResult.value = item;
            }
        }
        playerStatisticsResult.value.dataVolume = response.data.length;
        
        if (refresh) {
            showSnackbar("刷新成功", "success");
        }
    });
};

// 监听时间范围变化
watch(selectedTimeRange, () => {
    getInfo();
});

// 刷新玩家人数
const handleRefreshPlayer = () => {
    getInfo(true);
};

onMounted(() => {
    getInfo();
});
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
