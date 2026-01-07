<template>
  <v-card style="min-height: 260px">
    <template v-if="dmp.id!==undefined">
      <v-card-item>
        <v-card-title>
          {{ dmp.ip }}
        </v-card-title>
        <v-card-subtitle>
          {{ dmp.remark }}
        </v-card-subtitle>
        <template #append>
          <v-menu
            v-model="menu"
            location="bottom end"
          >
            <template #activator="{ props }">
              <v-btn
                color="primary"
                icon
                v-bind="props"
              >
                <v-icon icon="ri-more-2-fill" />
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
              />
            </v-list>
          </v-menu>
        </template>
      </v-card-item>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            sm="7"
          >
            <div>
              <v-chip
                color="success"
                label
                variant="outlined"
              >
                <v-icon
                  icon="ri-global-line"
                  start
                />
                http://{{ dmp.ip }}:{{ dmp.port }}
              </v-chip>
              <div style="margin-top: 10px">
                <v-chip label color="info" prepend-icon="ri-instance-line">
                  房间数 {{overviewData.roomCount}}
                </v-chip>
                <v-chip label color="info" prepend-icon="ri-gamepad-line" class="ml-2">
                  世界数 {{overviewData.worldCount}}
                </v-chip>
              </div>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="5"
          >
            <v-progress-circular
              :model-value="sysInfo.cpu.toFixed(1)"
              :indeterminate="getCpuMemStatusLoading"
              :size="60"
              :width="5"
              :color="getProgressColor(sysInfo.cpu)"
              rounded
            >
              CPU
            </v-progress-circular>
            <v-progress-circular
              :model-value="sysInfo.memory.toFixed(1)"
              :indeterminate="getCpuMemStatusLoading"
              :size="60"
              :width="5"
              :color="getProgressColor(sysInfo.memory)"
              rounded
              style="margin-left: 20px"
            >
              内存
            </v-progress-circular>
          </v-col>
        </v-row>
        <v-btn
          block
          style="margin-top: 25px"
          @click="handleGotoDashboard"
        >
          进入
        </v-btn>
      </v-card-text>
      <v-dialog
        v-model="dialogEdit"
        width="auto"
      >
        <v-card title="编辑">
          <v-card-text>
            <v-form
              fast-fail
              @submit.prevent="handleUpdate"
            >
              <v-container max-width="500">
                <v-row>
                  <v-col
                    cols="12"
                    sm="9"
                  >
                    <v-text-field
                      v-model="addForm.ip"
                      :rules="addFormRules.ip"
                      label="IP"
                      required
                      clearable
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="3"
                  >
                    <v-text-field
                      v-model.number="addForm.port"
                      :rules="addFormRules.port"
                      label="端口"
                      required
                      clearable
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                  >
                    <v-text-field
                      v-model="addForm.token"
                      :rules="addFormRules.token"
                      label="令牌"
                      required
                      type="password"
                      clearable
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                  >
                    <v-text-field
                      v-model="addForm.remark"
                      label="备注"
                      clearable
                    />
                  </v-col>
                  <v-col
                    class="mt-4"
                    cols="12"
                    sm="12"
                  >
                    <v-btn
                      block
                      class="mt-2"
                      type="submit"
                      :loading="loading"
                    >
                      提交
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    style="margin-top: -20px"
                  >
                    <v-btn
                      block
                      class="mt-2"
                      color="white"
                      @click="dialogEdit=false"
                    >
                      取消
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <template v-else>
      <v-card-title>
        点击新建
      </v-card-title>
      <v-card-text>
        <v-card variant="tonal">
          <div
            class="cc"
            style="min-height: 169px;"
          >
            <v-icon
              icon="ri-add-line"
              size="50"
              @click="dialog=true"
            />
            <v-dialog
              v-model="dialog"
              width="45%"
              persistent
              @after-enter="initDialog(false)"
            >
              <v-card title="新建">
                <v-card-text>
                  <!-- 删除这里的 "123" 文本节点 -->
                  <v-form
                    fast-fail
                    @submit.prevent="handleAdd"
                  >
                    <v-container max-width="500">
                      <!-- 添加 container 保持一致性 -->
                      <v-row>
                        <v-col
                          cols="12"
                          sm="9"
                        >
                          <v-text-field
                            v-model="addForm.ip"
                            :rules="addFormRules.ip"
                            label="IP/域名"
                            required
                            clearable
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                        >
                          <v-text-field
                            v-model.number="addForm.port"
                            :rules="addFormRules.port"
                            label="端口"
                            required
                            clearable
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          sm="12"
                        >
                          <v-text-field
                            v-model="addForm.token"
                            :rules="addFormRules.token"
                            label="令牌"
                            required
                            type="password"
                            clearable
                          >
                            <v-tooltip
                              activator="parent"
                              open-delay="0"
                              scroll-strategy="close"
                            >
                              请前往网页版饥荒管理平台，点击 工具-令牌 进行创建
                            </v-tooltip>
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="12"
                        >
                          <v-text-field
                            v-model="addForm.remark"
                            label="备注"
                            clearable
                          />
                        </v-col>
                        <v-col
                          class="mt-4"
                          cols="12"
                          sm="12"
                        >
                          <v-btn
                            block
                            class="mt-2"
                            type="submit"
                            :loading="loading"
                          >
                            提交
                          </v-btn>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="12"
                          style="margin-top: -20px"
                        >
                          <v-btn
                            block
                            class="mt-2"
                            color="white"
                            @click="dialog=false"
                          >
                            取消
                          </v-btn>
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
import { generateUUID, parseJwt } from "@/utils/tools"
import { showSnackbar } from "@/utils/snackbar"
import useGlobalStore from "@store/global"
import useUserStore from "@store/user"
import ElectronApi from "@/utils/electronApi"
import { DB_KEY } from "@/config"
import { sleep } from "@antfu/utils"
import dashboardApi from "@/api/dashboard.js"
import platformApi from "@/api/platform";

const props = defineProps({
  dmp: {
    type: Object,
    default: () => ({
      id: undefined,
      ip: undefined,
      port: undefined,
      token: undefined,
      remark: undefined,
    }),
  },
})

const globalStore = useGlobalStore()
const userStore = useUserStore()

const dmp = computed(() => {
  return {
    ...props.dmp,
  }
})

const loading = ref(false)
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
      if (value) return true
      
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

const initDialog = edit => {
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
      ip: dmp.value.ip,
      port: dmp.value.port,
      token: dmp.value.token,
      remark: dmp.value.remark,
    }
  }
}

const handleAdd = async event => {
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

  globalStore.entry.inEntry = true
  globalStore.entry.ip = addForm.value.ip
  globalStore.entry.port = addForm.value.port
  userStore.token = addForm.value.ip

  const newConfig = {
    id: generateUUID(),
    ip: addForm.value.ip,
    port: addForm.value.port,
    token: addForm.value.token,
    remark: addForm.value.remark,
  }

  ElectronApi.store.append(DB_KEY.dmps, newConfig)
  showSnackbar('新建成功', 'success')
  dialog.value = false
  loading.value = false
  await sleep(2000)
  location.reload()
}

const handleUpdate = async event => {
  loading.value = true

  const results = await event
  if (!results.valid) {
    loading.value = false
    
    return
  }
  globalStore.entry.inEntry = true
  globalStore.entry.ip = addForm.value.ip
  globalStore.entry.port = addForm.value.port
  useUserStore.token = addForm.value.ip

  const newConfig = {
    id: dmp.value.id,
    ip: addForm.value.ip,
    port: addForm.value.port,
    token: addForm.value.token,
    remark: addForm.value.remark,
  }

  const dbValue = ElectronApi.store.get(DB_KEY.dmps)

  // 1. 找到目标对象的索引
  const targetIndex = dbValue.findIndex(item => item.id === newConfig.id)

  if (targetIndex !== -1) {
    // 2. 直接修改数组中对应索引的对象
    dbValue[targetIndex] = { ...dbValue[targetIndex], ...newConfig }
    console.log(dbValue)
  }
  ElectronApi.store.set(DB_KEY.dmps, dbValue)
  showSnackbar('更新成功', 'success')
  dialogEdit.value = false
  await sleep(2000)
  location.reload()
  loading.value = false
}

const handleDelete = async () => {
  const dbValue = ElectronApi.store.get(DB_KEY.dmps)
  const targetIndex = dbValue.findIndex(item => item.id === dmp.value.id)

  if (targetIndex !== -1) {
    // 2. 使用 splice 方法删除目标对象
    dbValue.splice(targetIndex, 1) // 从 targetIndex 开始删除 1 个元素
    ElectronApi.store.set(DB_KEY.dmps, dbValue)
    showSnackbar('删除成功', 'success')
    await sleep(2000)
    location.reload()
  } else {
    showSnackbar('删除失败', 'error')
  }
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

const handleMenuClick = index => {
  // 0 刷新；1 编辑；2 删除
  if (index === 0) {
    initDialog(true)
    handleUpdate({ valid: true })
  }
  if (index === 1) {
    initDialog(true)
    dialogEdit.value = true
  }
  if (index === 2) {
    handleDelete()
  }
}

const handleGotoDashboard = () => {
  needContinue.value = false

  globalStore.entry.ip = dmp.value.ip
  globalStore.entry.port = dmp.value.port
  globalStore.entry.token = dmp.value.token
  globalStore.entry.inEntry = false

  userStore.userInfo.role = 'admin'

  ElectronApi.window.dashboard()
}

const getProgressColor = n => {
  if (n >= 0 && n < 25) {
    return 'success'
  }
  if (n >= 25 && n < 50) {
    return 'info'
  }
  if (n >= 50 && n < 75) {
    return 'warning'
  }
  if (n >= 75) {
    return 'error'
  }

  return 'primary'
}

const sysInfo = ref({
  cpu: -1,
  memory: -1,
})
const needContinue = ref(true)

const getCpuMemStatusLoading = ref(true)

const getCpuMemStatus = () => {
  globalStore.entry.ip = dmp.value.ip
  globalStore.entry.port = dmp.value.port
  globalStore.entry.token = dmp.value.token
  dashboardApi.info.sys.get().then(response => {
    sysInfo.value = response.data
    getCpuMemStatusLoading.value = false
  }).catch(() => {
    needContinue.value = false
  })
}

const overviewData = ref({
  runningTime: undefined,
  memory: undefined,
  roomCount: 0,
  worldCount: 0,
  userCount: undefined,
  uidCount: undefined,
  maxCpu: undefined,
  maxMemory: undefined,
  maxNetUp: undefined,
  maxNetDown: undefined,
})

const getRoomBasic = () => {
  globalStore.entry.ip = dmp.value.ip
  globalStore.entry.port = dmp.value.port
  globalStore.entry.token = dmp.value.token
  platformApi.overview.get().then(response => {
    overviewData.value = response.data
  })
}

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    if (needContinue.value) {
      getCpuMemStatus()
      getRoomBasic()
    }
  }, 5000)
}
const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  globalStore.entry.inEntry = true
  startRequests()
})


onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})
</script>

