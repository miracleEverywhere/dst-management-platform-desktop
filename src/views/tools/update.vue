<template>
  <v-card height="870">
    <template #title>
      <div class="card-header">
        <span class="font-weight-bold">定时更新</span>
      </div>
    </template>
    <template #text>
      <v-card-text>
        <v-container height="700" style="overflow-y: auto">
          <v-row>
            <v-col cols="12">
              <v-alert color="warning" density="compact">
                定时更新和定时备份的时间不能相同，否则会覆盖其中一个任务的执行
              </v-alert>
            </v-col>
            <v-col class="d-flex" cols="12">
              <div class="d-flex align-center" style="width: 100%">
                <span>将在每天</span>
                <div style="width: 120px; margin: 0 8px">
                  <v-menu v-model="timeMenu" :close-on-content-click="false" offset-y
                          transition="scale-transition">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-model="checkTime" :loading="loadingTime" density="compact" label="检查时间"
                                    readonly v-bind="props"></v-text-field>
                    </template>
                    <v-time-picker v-model="checkTime" format="24hr" scrollable
                                   title="选择时间" use-seconds @update:model-value="handleUpdate">
                    </v-time-picker>
                  </v-menu>
                </div>
                <span>检查是否有更新，如果有，则进行更新，如果没有，则会重启服务器更新模组。</span>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="d-flex align-center">
                <span>此功能当前为</span>
                <v-switch v-model="checkEnable" :label="checkEnable ? '开启' : '关闭'" :loading="loadingEnable"
                          class="ml-4 mr-4" inset @change="handleUpdate"></v-switch>
                <span>状态。</span>
              </div>
            </v-col>
            <v-col class="d-flex align-center" cols="12">
              <span>当前版本为:</span>
              <v-chip :color="localVersion === serverVersion ? 'success' : 'warning'" class="ma-2" label
                      text-color="white">
                {{ localVersion }}
              </v-chip>
              <span>最新版本为:</span>
              <v-chip class="ma-2" color="primary" label text-color="white">
                {{ serverVersion }}
              </v-chip>
              <span v-if="localVersion === serverVersion">,无需更新。</span>
              <span v-if="localVersion !== serverVersion">,需要更新。</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import toolsApi from "@/api/tools";
import {VTimePicker} from "vuetify/labs/VTimePicker";
import useGlobalStore from "@/plugins/pinia/global";
import {showSnackbar} from "@/utils/snackbar";

const globalStore = useGlobalStore()

const checkTime = ref(0);
const checkEnable = ref(false);
const localVersion = ref(0);
const serverVersion = ref(0);
const loadingTime = ref(false);
const timeMenu = ref(false);
const loadingEnable = ref(false);

const isDark = computed(() => globalStore.theme)

// 获取信息
const getInfo = () => {
  toolsApi.update.get().then((response) => {
    checkTime.value = response.data.updateSetting.time;
    checkEnable.value = response.data.updateSetting.enable;
    localVersion.value = response.data.version.local;
    serverVersion.value = response.data.version.server;
  });
};

// 更新检查时间
const handleUpdate = () => {
  if (!checkTime.value) {
    showSnackbar('时间不能为空', 'error')
    return
  }
  loadingTime.value = true
  loadingEnable.value = true
  const updateForm = {
    time: checkTime.value,
    enable: checkEnable.value
  }
  toolsApi.update.put(updateForm).then((response) => {
    showSnackbar(response.message, 'success')
  }).finally(() => {
    loadingTime.value = false
    loadingEnable.value = false
  })
};

onMounted(() => {
  getInfo();
});
</script>

<style lang="scss" scoped></style>
