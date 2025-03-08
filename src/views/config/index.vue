<template>
  <v-card style="width: 500px; min-height: 259px;">
    <template v-if="props.configItem.name">
      <v-card-item>
        <v-card-title>
          {{ props.configItem.name }}
        </v-card-title>
        <v-card-subtitle>
          {{ props.configItem.remark }}
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
                http://{{ props.configItem.ip }}:{{ props.configItem.port }}
              </v-chip>
              <div style="margin-top: 10px">
                <v-chip v-if="props.configItem.type==='master'||props.configItem.type==='both'"
                        color="primary" style="margin-right: 5px">地面
                </v-chip>
                <v-chip v-if="props.configItem.type==='cave'||props.configItem.type==='both'"
                        color="success">洞穴
                </v-chip>
              </div>

            </div>
          </v-col>
          <v-col cols="12" sm="5">
            <v-progress-circular :size="60" :width="5" color="primary" model-value="55">
              CPU
            </v-progress-circular>
            <v-progress-circular :size="60" :width="5" color="warning" model-value="72" style="margin-left: 20px">
              内存
            </v-progress-circular>
          </v-col>
        </v-row>

        <VBtn block style="margin-top: 25px" @click="handleGotoDashboard">
          进入
        </VBtn>
      </v-card-text>
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
            <v-dialog v-model="dialog" max-width="600" persistent @after-enter="initDialog">
              <template v-slot:activator="{ props: activatorProps }">
                <v-icon icon="ri-add-line" size="50" v-bind="activatorProps"></v-icon>
              </template>

              <v-card prepend-icon="mdi-account">
                <v-card-text>
                  <v-form ref="addFormRef" fast-fail @submit.prevent="handleSubmit">
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
                          <v-btn block class="mt-2" type="submit">提交</v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" style="margin-top: -20px">
                          <v-btn block class="mt-2" color="white"
                                 @click="dialog=false" :loading="loading"
                          >取消</v-btn>
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
import configApi from '@/api/config'
import {uuid4} from "@/utils/tools";
import {DB_KEY} from "@/config";
import {showSnackbar} from '@/utils/snackbar';


const globalStore = useGlobalStore()

const props = defineProps({
  configItem: {
    type: Object,
    default: {
      name: undefined,
      type: undefined, // 1 master; 2 cave; 3 both;
      ip: undefined,
      port: undefined,
      token: undefined,
    }
  }
})

const loading = ref(false)

const roomInfo = ref({
  name: undefined,
  cpu: undefined,
  mem: undefined,
})

const handleGotoDashboard = () => {
  globalStore.setConfigInfo(props.configItem)
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
  console.log('Clicked:', index);
}

const dialog = ref(false)

const addFormRef = ref()
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
      return '请输入IP'
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

const initDialog = () => {
  addForm.value = {
    ip: undefined,
    port: undefined,
    token: undefined,
  }
}

const handleSubmit = async (event) => {
  loading.value = true
  const results = await event
  if (!results.valid) {
    loading.value = false
    return
  }
  globalStore.url = `http://${addForm.value.ip}:${addForm.value.port}/v1`
  globalStore.token = addForm.value.token
  const newConfig = {
    id: uuid4(),
    name: undefined,
    type: undefined, // 1 master; 2 cave; 3 both;
    ip: addForm.value.ip,
    port: addForm.value.port,
    token: addForm.value.token,
    remark: addForm.value.remark
  }
  configApi.baseInfo.get().then(baseInfoResponse => {
    if (baseInfoResponse.data.base.name) {
      newConfig.name = baseInfoResponse.data.base.name
      configApi.multiHost.get().then(multiHostResponse => {
        if (multiHostResponse.data) {
          if (baseInfoResponse.data.ground) {
            newConfig.type = 'master'
          } else if (baseInfoResponse.data.cave) {
            newConfig.type = 'cave'
          } else {
            newConfig.type = 'none'
          }
        } else {
          newConfig.type = 'both'
        }

        ElectronApi.store.append(DB_KEY.configs, newConfig)
        showSnackbar('新建成功', 'success')
        dialog.value = false
        location.reload()
      })
    } else {
      newConfig.name = "未发现存档"
      newConfig.type = 'none'
      ElectronApi.store.append(DB_KEY.configs, newConfig)
      showSnackbar('新建成功', 'success')
      dialog.value = false
      location.reload()
    }
  }).finally(() => {
    loading.value = false
  })

}

</script>

<style lang="scss" scoped>
</style>