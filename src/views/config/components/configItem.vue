<template>
  <v-card style="width: 500px; min-height: 259px;">
    <template v-if="configItem.ip">
      <v-card-item>
        <v-card-title>
          {{ configItem.ip }}
        </v-card-title>
        <v-card-subtitle>
          {{ configItem.remark }}
        </v-card-subtitle>
        <template v-slot:append>
          <v-menu v-model="menu" location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" icon v-bind="props">
                <v-icon icon="ri-more-2-fill"></v-icon>
              </v-btn>
            </template>
            <v-list density="comfortable">
              <v-list-item
                  v-for="(item, index) in menuItems"
                  :key="index"
                  :base-color="item.color"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  @click="handleMenuClick(index)"
              >
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-card-item>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="7">
            <div>
              <v-chip color="success" label variant="outlined">
                <v-icon icon="ri-global-line" start></v-icon>
                http://{{ configItem.ip }}:{{ configItem.port }}
              </v-chip>
              <div style="margin-top: 10px">

                <v-chip v-if="clustersStat.cluster!==-1" color="primary" style="margin-right: 5px">
                  <v-icon icon="ri-apps-fill"/>
                  集群 {{clustersStat.cluster}} 个
                </v-chip>
                <v-chip v-else color="warning" style="margin-right: 5px">
                  <v-icon icon="ri-apps-2-fill"/>
                  获取中
                </v-chip>
                <v-chip v-if="clustersStat.world!==-1" color="success">
                  <v-icon icon="ri-earth-fill"/>
                  世界 {{clustersStat.world}} 个
                </v-chip>
                <v-chip v-else color="warning">
                  <v-icon icon="ri-earth-fill"/>
                  获取中
                </v-chip>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="5">
            <v-progress-circular :size="60" :width="5" color="primary"
                                 :indeterminate="sysInfo.cpu===-1"
                                 :model-value="sysInfo.cpu">
              CPU
            </v-progress-circular>
            <v-progress-circular :size="60" :width="5" color="warning"
                                 :indeterminate="sysInfo.memory===-1"
                                 :model-value="sysInfo.memory" style="margin-left: 20px">
              内存
            </v-progress-circular>
          </v-col>
        </v-row>
        <VBtn block
              style="margin-top: 25px" @click="handleGotoDashboard">
          进入
        </VBtn>
      </v-card-text>
      <v-dialog
          v-model="dialogEdit"
          width="auto"
      >
        <v-card title="编辑">
          <v-card-text>
            <v-form fast-fail @submit.prevent="handleUpdate">
              <v-container max-width="500">
                <v-row>
                  <v-col cols="12" sm="9">
                    <v-text-field v-model="addForm.ip" :rules="addFormRules.ip"
                                  label="IP" required clearable></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-text-field v-model.number="addForm.port" :rules="addFormRules.port"
                                  label="端口" required clearable></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="addForm.token" :rules="addFormRules.token"
                                  label="令牌" required type="password" clearable></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="addForm.remark" label="备注" clearable></v-text-field>
                  </v-col>
                  <v-col class="mt-4" cols="12" sm="12">
                    <v-btn block class="mt-2" type="submit" :loading="loading">提交</v-btn>
                  </v-col>
                  <v-col cols="12" sm="12" style="margin-top: -20px">
                    <v-btn block class="mt-2" color="white" @click="dialogEdit=false">取消</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>

          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <template v-else>
      <v-card-item>
        <v-card-title>
          点击新建
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-card variant="tonal">
          <div class="cc" style="min-height: 169px;">
            <v-dialog v-model="dialog" max-width="600" persistent @after-enter="initDialog(false)">
              <template v-slot:activator="{ props: activatorProps }">
                <v-icon icon="ri-add-line" size="50" v-bind="activatorProps"></v-icon>
              </template>
              <v-card title="新建">
                <v-card-text>
                  <v-form fast-fail @submit.prevent="handleAdd">
                    <v-container max-width="500">
                      <v-row>
                        <v-col cols="12" sm="9">
                          <v-text-field v-model="addForm.ip" :rules="addFormRules.ip"
                                        label="IP/域名" required clearable></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field v-model.number="addForm.port" :rules="addFormRules.port"
                                        label="端口" required clearable></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-text-field v-model="addForm.token" :rules="addFormRules.token"
                                        label="令牌" required type="password" clearable>
                            <v-tooltip activator="parent" open-delay="0" scroll-strategy="close">
                              请前往网页版饥荒管理平台，点击 工具-令牌 进行创建
                            </v-tooltip>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-text-field v-model="addForm.remark" label="备注" clearable></v-text-field>
                        </v-col>
                        <v-col class="mt-4" cols="12" sm="12">
                          <v-btn block class="mt-2" type="submit" :loading="loading">提交</v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" style="margin-top: -20px">
                          <v-btn block class="mt-2" color="white" @click="dialog=false">取消</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </v-card>
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import ElectronApi from "@/utils/electronApi"
import useGlobalStore from '@/plugins/pinia/global'
import useConfigStore from '@/plugins/pinia/config'
import settingApi from '@/api/setting'
import {parseJwt, sleep, uuid4, validateIpv4} from "@/utils/tools";
import {DB_KEY} from "@/config";
import {showSnackbar} from '@/utils/snackbar';
import homeApi from "@/api/home"


onMounted(() => {
  configStore.inConfig = true
  getClusters()
  startRequests()
})


const globalStore = useGlobalStore()
const configStore = useConfigStore()

const props = defineProps({
  configItem: {
    type: Object,
    default: () => ({
      id: undefined,
      ip: undefined,
      port: undefined,
      token: undefined,
      remark: undefined,
    })
  }
})

const configItem = computed(() => {
  return {
    ...props.configItem
  }
})

const loading = ref(false)

const clustersStat = ref({
  cluster: -1,
  world: -1
})
const getClusters = () => {
  configStore.url = `http://${configItem.value.ip}:${configItem.value.port}/v1`
  configStore.token = configItem.value.token
  settingApi.clusters.get().then(response => {
    let clusterNum = 0
    let worldNum = 0
    for (let cluster of response.data) {
      clusterNum ++
      if (cluster.worlds !== null) {
        for (let world of cluster.worlds) {
          worldNum ++
        }
      }
    }
    clustersStat.value.cluster = clusterNum
    clustersStat.value.world = worldNum
  })
}

const handleGotoDashboard = () => {
  globalStore.setConfigInfo(configItem.value)
  globalStore.inDashboard = true
  configStore.inConfig = false
  needContinue.value = false
  ElectronApi.window.dashboard()
}

const menu = ref(false)
const menuItems = ref([
  {
    title: '刷 新',
    color: 'info',
    icon: 'ri-refresh-line',
  },
  {
    title: '编 辑',
    color: 'primary',
    icon: 'ri-edit-2-line',
  },
  {
    title: '删 除',
    color: 'error',
    icon: 'ri-delete-bin-line',
  },
])

const handleMenuClick = (index) => {
  // 0 刷新；1 编辑；2 删除
  if (index === 0) {
    initDialog(true)
    handleUpdate({valid: true})
  }
  if (index === 1) {
    initDialog(true)
    dialogEdit.value = true
  }
  if (index === 2) {
    handleDelete()
  }
}

const dialog = ref(false)
const dialogEdit = ref(false)

const addForm = ref({
  ip: undefined,
  port: undefined,
  token: undefined,
  remark: undefined,
})
const addFormRules = {
  ip: [
    value => {
      if (value) {
        if (/^\d/.test(value)) {
          return validateIpv4(value)
        } else {
          if (/.+\..+/.test(value)) {
            return true
          } else {
            return '请输入正确的域名'
          }
        }
      }
      return '请输入IP/域名'
    },
  ],
  port: [
    value => {
      if (value) {
        if (typeof value !== 'number' || isNaN(value)) {
          return '请输入数字'
        }
        // 检查是否为整数
        if (!Number.isInteger(value)) {
          return '请输入整数'
        }
        // 检查端口号范围
        if (value >= 0 && value <= 65535) {
          return true
        } else {
          return '端口范围：1-65535'
        }
      } else {
        return '请输入端口'
      }
    },
  ],
  token: [
    value => {
      if (value) return true
      return '请输入令牌'
    },
  ],
}

const initDialog = (edit) => {
  loading.value = false
  if (!edit) {
    addForm.value = {
      ip: undefined,
      port: undefined,
      token: undefined,
      remark: undefined,
    }
  } else {
    addForm.value = {
      ip: configItem.value.ip,
      port: configItem.value.port,
      token: configItem.value.token,
      remark: configItem.value.remark,
    }
  }

}

const handleAdd = async (event) => {
  loading.value = true
  const results = await event
  if (!results.valid) {
    loading.value = false
    return
  }

  const parsedToken = parseJwt(addForm.value.token)
  if (parsedToken === null) {
    showSnackbar('令牌解析失败，请输入正确的令牌', 'error')
    loading.value = false
    return
  }

  const role = parsedToken.payload.role
  if (role !== 'admin') {
    showSnackbar('仅支持管理员创建的令牌', 'error')
    loading.value = false
    return
  }

  configStore.inConfig = true
  configStore.url = `http://${addForm.value.ip}:${addForm.value.port}/v1`
  configStore.token = addForm.value.token
  const newConfig = {
    id: uuid4(),
    ip: addForm.value.ip,
    port: addForm.value.port,
    token: addForm.value.token,
    remark: addForm.value.remark
  }
  ElectronApi.store.append(DB_KEY.configs, newConfig)
  showSnackbar('新建成功', 'success')
  dialog.value = false
  loading.value = false
  await sleep(2000)
  location.reload()
  needContinue.value = true
}
const handleUpdate = async (event) => {
  loading.value = true
  const results = await event
  if (!results.valid) {
    loading.value = false
    return
  }
  configStore.url = `http://${addForm.value.ip}:${addForm.value.port}/v1`
  configStore.token = addForm.value.token
  const newConfig = {
    id: configItem.value.id,
    ip: addForm.value.ip,
    port: addForm.value.port,
    token: addForm.value.token,
    remark: addForm.value.remark
  }
  const dbValue = ElectronApi.store.get(DB_KEY.configs)
  // 1. 找到目标对象的索引
  const targetIndex = dbValue.findIndex(item => item.id === newConfig.id);
  console.log(dbValue)
  if (targetIndex !== -1) {
    // 2. 直接修改数组中对应索引的对象
    dbValue[targetIndex] = {...dbValue[targetIndex], ...newConfig}
    console.log(dbValue)
  }
  ElectronApi.store.set(DB_KEY.configs, dbValue)
  showSnackbar('更新成功', 'success')
  dialogEdit.value = false
  await sleep(2000)
  location.reload()
  loading.value = false
  needContinue.value = true
}

const handleDelete = async () => {
  const dbValue = ElectronApi.store.get(DB_KEY.configs)
  const targetIndex = dbValue.findIndex(item => item.id === configItem.value.id);

  if (targetIndex !== -1) {
    // 2. 使用 splice 方法删除目标对象
    dbValue.splice(targetIndex, 1); // 从 targetIndex 开始删除 1 个元素
    ElectronApi.store.set(DB_KEY.configs, dbValue)
    showSnackbar('删除成功', 'success')
    await sleep(2000)
    location.reload()
  } else {
    showSnackbar('删除成功', 'error')
  }
}

const sysInfo = ref({
  cpu: -1,
  memory: -1,
})
const needContinue = ref(true)
const getCpuMemStatus = () => {
  configStore.url = `http://${configItem.value.ip}:${configItem.value.port}/v1`
  configStore.token = configItem.value.token
  homeApi.sysInfo.get().then(response => {
    sysInfo.value = response.data
  }).catch(() => {
    needContinue.value = false
  })
}

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    if (needContinue.value) {
      getCpuMemStatus()
    }
  }, 2000)
}
const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})

</script>

<style lang="scss" scoped>
</style>