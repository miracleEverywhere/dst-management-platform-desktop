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
            <v-list>
              <v-list-item
                  v-for="(item, index) in menuItems"
                  :key="index"
                  @click="handleMenuClick(item)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
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
            <v-dialog v-model="dialog" persistent max-width="600" @after-enter="initDialog">
              <template v-slot:activator="{ props: activatorProps }">
                <v-icon icon="ri-add-line" size="50" v-bind="activatorProps"></v-icon>
              </template>

              <v-card prepend-icon="mdi-account">
                <v-card-text>
                  <v-form fast-fail @submit.prevent>
                    <v-container max-width="500">
                      <v-row>
                        <v-col cols="12" sm="9">
                          <v-text-field v-model="addForm.ip" :rules="addFormRules.ip"
                                        label="IP" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field v-model.number="addForm.port" :rules="addFormRules.port"
                                        label="端口" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-text-field v-model="addForm.token" :rules="addFormRules.token"
                                        label="令牌" required type="password"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" class="mt-4">
                          <v-btn class="mt-2" type="submit" block @click="handleSubmit">提交</v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" style="margin-top: -20px">
                          <v-btn class="mt-2" block color="white" @click="dialog=false">取消</v-btn>
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
  {title: 'Option 1'},
  {title: 'Option 2'},
  {title: 'Option 3'},
])

const handleMenuClick = (item) => {
  console.log('Clicked:', item.title);
  // menu.value = false; // 关闭菜单
}

const dialog = ref(false)

const addForm = ref({
  ip: undefined,
  port: undefined,
  token: undefined,
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
      }
      return '请输入端口'
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

const handleSubmit = () => {
  globalStore.url = `http://${addForm.value.ip}:${addForm.value.port}/v1`
  globalStore.token = addForm.value.token
  configApi.baseInfo.get()
}

</script>

<style lang="scss" scoped>
</style>