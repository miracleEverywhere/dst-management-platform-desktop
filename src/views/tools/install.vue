<template>
    <v-row>
        <v-col cols="12" lg="6">
            <v-card class="h-100">
                <template #title>
                    <div class="card-header">
                        <span class="font-weight-bold">系统信息</span>
                    </div>
                </template>
                <template #text>
                    <v-table density="compact" class="descriptions-table">
                        <tbody>
                            <tr>
                                <td class="text-grey font-weight-medium" width="120">架构</td>
                                <td>{{ osInfo.Architecture }}</td>
                            </tr>
                            <tr>
                                <td class="text-grey font-weight-medium">系统类型</td>
                                <td>{{ osInfo.OS }}</td>
                            </tr>
                            <tr>
                                <td class="text-grey font-weight-medium">系统名</td>
                                <td>{{ osInfo.Platform }}</td>
                            </tr>
                            <tr>
                                <td class="text-grey font-weight-medium">系统版本</td>
                                <td>{{ osInfo.PlatformVersion }}</td>
                            </tr>
                            <tr>
                                <td class="text-grey font-weight-medium">CPU</td>
                                <td>{{ osInfo.CPUModel }}</td>
                            </tr>
                            <tr>
                                <td class="text-grey font-weight-medium">核心数</td>
                                <td>{{ osInfo.CPUCores }}</td>
                            </tr>
                            <tr>
                                <td class="text-grey font-weight-medium">内存</td>
                                <td>{{ (osInfo.MemorySize / (1024 ** 3)).toFixed(2) }} GB</td>
                            </tr>
                            <tr>
                                <td class="text-grey font-weight-medium">运行时间</td>
                                <td>{{ osInfo.Uptime }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </template>
            </v-card>
        </v-col>
        <v-col cols="12" lg="6">
            <v-card class="h-100">
                <template #title>
                    <div class="card-header">
                        <span class="font-weight-bold">安装检查</span>
                    </div>
                </template>
                <template #text>
                    <div class="d-flex flex-column align-center pa-4">
                        <template
                            v-if="osInfo.Platform === 'ubuntu' || osInfo.Platform === 'centos' || osInfo.Platform === 'rocky'">
                            <v-icon color="success" size="64" icon="ri-checkbox-circle-fill" class="mb-4" />
                            <div class="text-h5 mb-2 font-weight-bold">检查通过</div>
                            <div class="text-subtitle-1 text-medium-emphasis mb-4">请点击下方按钮进行安装</div>
                            <v-btn color="#2992ff" :loading="installing" variant="tonal" @click="handleInstall">
                                安装
                            </v-btn>
                        </template>
                        <template v-else>
                            <v-icon color="warning" size="64" icon="ri-error-warning-fill" class="mb-4" />
                            <div class="text-h5 mb-2 font-weight-bold">检查不通过</div>
                            <div class="text-subtitle-1 text-medium-emphasis mb-4">检查未通过，可能出现安装失败</div>
                            <v-btn color="warning" variant="tonal" :loading="installing"
                                :disabled="osInfo.Platform === 'darwin'" @click="handleInstall" class="mb-2">
                                安装
                            </v-btn>
                            <div v-if="osInfo.Platform === 'darwin'" class="text-caption text-medium-emphasis">
                                MacOS用户请使用脚本进行安装
                            </div>
                        </template>
                    </div>
                </template>
            </v-card>
        </v-col>
        <v-col cols="24" lg="12">
            <v-alert border="top" variant="tonal" type="primary" icon="$info">
                如果安装完成后，首页无法获取饥荒版本，请手动执行manual_install.sh脚本，执行方法：cd && ./manual_install.sh
            </v-alert>
        </v-col>
        <v-col cols="24" lg="12" v-if="installing">
            <v-card>
                <v-card-item>
                    <div class="d-flex align-center justify-space-between">
                        <div class="text-h6 font-weight-bold">安装进度</div>
                        <v-chip color="warning" variant="tonal" label class="font-weight-regular">
                            安装过程中请勿刷新或关闭页面
                        </v-chip>
                    </div>
                </v-card-item>
                <v-card-text>
                    <v-progress-linear :model-value="percentage" color="success" height="15" striped>
                        <template v-slot:default="{ value }">
                            <strong>{{ Math.ceil(value) }}%</strong>
                        </template>
                    </v-progress-linear>
                    <div class="mt-3 text-medium-emphasis">
                        {{ installInfo?.zh || '' }}
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import toolsApi from "@/api/tools"
import { seconds2Time } from "@/utils/tools.js";
import { showSnackbar } from "@/utils/snackbar";

const osInfo = ref({})
const installing = ref(false)
const percentage = ref(0)
const installInfo = ref({})

// 获取系统信息
const getOSInfo = () => {
    toolsApi.osInfo.get().then(response => {
        osInfo.value = response.data
        osInfo.value.Uptime = seconds2Time(response.data.Uptime)
    })
}

// 安装
const handleInstall = () => {
    toolsApi.install.post().then(response => {
        showSnackbar(response.message, 'success')
        installing.value = true
        startRequests()
    })
}


let intervalId = null
const startRequests = () => {
    intervalId = setInterval(() => {
        handleGetStatus()
    }, 1000)
}
const cancelRequests = () => {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
}

const handleGetStatus = () => {
    toolsApi.installStatus.get().then(response => {
        const data = response.data
        percentage.value = data.process
        installInfo.value.zh = data.zh
        installInfo.value.en = data.en
        if (percentage.value === 100) {
            cancelRequests()
        } else if (percentage.value === 0) {
            cancelRequests()
        }
    })
}


onMounted(() => {
    getOSInfo()
})

onBeforeUnmount(() => {
    cancelRequests();
    window.removeEventListener('beforeunload', cancelRequests);
})
</script>

<style lang="scss" scoped>
.descriptions-table {
    border: 1px solid rgba(125, 125, 125, 0.12);

    /* 单元格样式 */
    :deep(td) {
        height: 40px !important;
        padding: 8px 12px !important;
        border-bottom: 1px solid rgba(125, 125, 125, 0.12) !important;
        font-weight: 500;
    }

    /* 标签列宽度和背景 */
    :deep(td:first-child) {
        width: 120px;
        background-color: rgb(245, 247, 250);
    }

    /* 值列样式 */
    :deep(td:last-child) {
        color: rgb(51, 51, 51);
    }
}
</style>