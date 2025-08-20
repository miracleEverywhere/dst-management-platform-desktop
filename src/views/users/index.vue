<template>
  <v-card>
    <v-card-title>
      <div class="d-flex align-center justify-space-between">
        <span>用户管理</span>
        <v-btn color="success" @click="openCreateDialog">创建</v-btn>
      </div>
    </v-card-title>
    <v-card-text class="mt-4">
      <v-sheet border rounded>
        <v-data-table :items="userList" :loading="getUserListLoading" :headers="headers">
          <template #loading>
            <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
          </template>

          <template #item.role="{item}">
            <v-chip v-if="item.role === 'admin'" label color="info">{{item.role}}</v-chip>
            <v-chip v-else label>{{item.role}}</v-chip>
          </template>
          <template #item.disabled="{item}">
            <v-chip v-if="item.disabled" label color="error">禁用</v-chip>
            <v-chip v-else label color="success">启用</v-chip>
          </template>
          <template #item.clusterCreationProhibited="{item}">
            <v-chip v-if="item.disabled" label color="error">无</v-chip>
            <v-chip v-else label color="success">有</v-chip>
          </template>
          <template #item.maxWorldsPerCluster="{item}">
            <v-chip v-if="item.role==='admin'" label color="info">不限制</v-chip>
            <v-chip v-else label color="info">{{item.maxWorldsPerCluster}}</v-chip>
          </template>
          <template #item.actions="{item}">
            <v-btn variant="text" color="info" class="mr-2" @click="openUpdateDialog(item)">修改</v-btn>
            <v-dialog max-width="40%">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn variant="text" :disabled="item.role==='admin'" color="error" v-bind="activatorProps">
                  删除
                </v-btn>
              </template>
              <template #default="{isActive}">
                <v-card>
                  <v-card-title>
                    请确认
                  </v-card-title>
                  <v-card-text>
                    <v-alert prominent variant="text" type="info" :color="colors.grey.darken1" class="mt-4">
                      是否执行 删除 操作？
                    </v-alert>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="isActive.value = false">取消</v-btn>
                    <v-btn @click="handleDeleteUser(item)" :loading="deleteUserLoading">确定</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>

        </v-data-table>
      </v-sheet>
    </v-card-text>
  </v-card>

  <v-dialog v-model="userDialogVisible" persistent width="60%">
    <v-card>
      <v-card-title>
        <span v-if="dialogCreate">用户创建</span>
        <span v-else>用户修改</span>
      </v-card-title>
      <v-card-text>
        <div class="d-flex justify-center">
          <v-form style="width: 90%" fast-fail @submit.prevent="handleUser">
            <v-text-field v-if="dialogCreate" v-model="userDialogForm.username" label="用户名" :rules="rules.require" clearable class="mt-8"/>
            <v-text-field v-model="userDialogForm.nickname" label="用户昵称" :rules="rules.require" clearable class="mt-8"/>
            <v-text-field
              v-if="dialogCreate"
              v-model="userDialogForm.password"
              :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
              :type="isPasswordVisible ? 'text' : 'password'"
              :rules="rules.require"
              autocomplete="password"
              label="密码"
              class="mt-8"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
            />
            <v-select v-model="userDialogForm.clusterPermission"
                      :disabled="userDialogForm.role==='admin'"
                      :items="globalStore.dstClusters===null?[]:globalStore.dstClusters"
                      chips multiple
                      label="集群权限"
                      placeholder="请选择集群权限"
                      class="mt-8"
                      item-title="clusterDisplayName"
                      item-value="clusterName">

            </v-select>
            <v-slider v-model="userDialogForm.maxWorldsPerCluster" :max="64" :min="0" hide-details
                      :disabled="userDialogForm.role==='admin'"
                      step="1" style="margin-left: -1px" class="mt-8 align-center">
              <template #label>
                <span>世界数量限制</span>
              </template>
              <template v-slot:append>
                <v-chip label>
                  {{ userDialogForm.maxWorldsPerCluster }}
                </v-chip>
              </template>
            </v-slider>
            <v-row class="mt-8">
              <v-col>
                <v-switch v-model="userDialogForm.disabled" :true-value="false" :false-value="true">
                  <template #label>
                    <span class="mr-2">账号状态:</span>
                    <v-chip v-if="userDialogForm.disabled" label color="error" density="compact">禁用</v-chip>
                    <v-chip v-else label color="success" density="compact">启用</v-chip>
                  </template>
                </v-switch>
              </v-col>
              <v-col>
                <v-switch v-model="userDialogForm.role" v-tooltip:top="'管理员集群权限、世界数量、集群创建不受限制'"
                          true-value="admin" false-value="Non-admin">
                  <template #label>
                    <span class="mr-2">管理员:</span>
                    <v-chip v-if="userDialogForm.role==='admin'" label color="success" density="compact">是</v-chip>
                    <v-chip v-else label color="error" density="compact">否</v-chip>
                  </template>
                </v-switch>
              </v-col>
              <v-col>
                <v-switch v-model="userDialogForm.clusterCreationProhibited" :disabled="userDialogForm.role==='admin'"
                          :true-value="false" :false-value="true">
                  <template #label>
                    <span class="mr-2">集群创建权限:</span>
                    <v-chip v-if="userDialogForm.clusterCreationProhibited" label color="error" density="compact">不可创建</v-chip>
                    <v-chip v-else label color="success" density="compact">可创建</v-chip>
                  </template>
                </v-switch>
              </v-col>
            </v-row>

            <div class="d-flex justify-end mt-16">
              <v-btn @click="userDialogVisible=false" :disabled="dialogSubmitLoading" class="mr-4" color="grey">取消</v-btn>
              <v-btn type="submit" :loading="dialogSubmitLoading">提交</v-btn>
            </div>
          </v-form>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import useGlobalStore from "@/plugins/pinia/global";
import systemApi from "@/api/system";
import {deepCopy, SHA512} from "@/utils/tools.js";
import {showSnackbar} from "@/utils/snackbar";
import colors from "vuetify/util/colors";


onMounted(() => {
  handleGetUserList()
})

const globalStore = useGlobalStore();

const userList = ref([])
const getUserListLoading = ref(false)
const handleGetUserList = () => {
  getUserListLoading.value = true
  systemApi.userList.get().then(response => {
    userList.value = response.data
  }).finally(() => {
    getUserListLoading.value = false
  })
}
const headers = ref([
  {title: '用户名', key: 'username'},
  {title: '用户昵称', key: 'nickname'},
  {title: '角色', key: 'role'},
  {title: '账号状态', key: 'disabled'},
  {title: '集群创建权限', key: 'clusterCreationProhibited'},
  {title: '世界数量限制', key: 'maxWorldsPerCluster'},
  {title: '操作', key: 'actions'},
])

const userDialogFormRef = ref()
const userDialogForm = ref({
  username: '',
  nickname: '',
  password: '',
  disabled: false,
  role: 'Non-admin',
  clusterPermission: null,
  clusterCreationProhibited: false,
  maxWorldsPerCluster: 2,
})

const userDialogVisible = ref(false)
const dialogSubmitLoading = ref(false)
const dialogCreate = ref(false)
const isPasswordVisible = ref(false)

const openCreateDialog = () => {
  dialogCreate.value = true
  userDialogForm.value = {
    username: '',
    nickname: '',
    password: '',
    disabled: false,
    role: 'Non-admin',
    clusterPermission: null,
    clusterCreationProhibited: false,
    maxWorldsPerCluster: 2,
  }
  userDialogVisible.value = true
}
const rules = ref({
  require: [
    value => {
      if (!value) return '此项为必填项'
      return true
    }
  ],
})

const handleUser = async (event) => {
  if (dialogCreate.value) {
    await handleCreateUser(event)
  } else {
    await handleUpdateUser(event)
  }
}

const handleCreateUser = async (event) => {
  dialogSubmitLoading.value = true
  const results = await event
  if (!results.valid) {
    dialogSubmitLoading.value = false
    return
  }

  const reqForm = {
    username: userDialogForm.value.username,
    nickname: userDialogForm.value.nickname,
    password: SHA512(userDialogForm.value.password),
    disabled: userDialogForm.value.disabled,
    role: userDialogForm.value.role,
    clusterPermission: userDialogForm.value.clusterPermission,
    clusterCreationProhibited: userDialogForm.value.clusterCreationProhibited,
    maxWorldsPerCluster: userDialogForm.value.maxWorldsPerCluster,
  }
  systemApi.user.post(reqForm).then(response => {
    userDialogVisible.value = false
    showSnackbar(response.message)
    handleGetUserList()
  }).finally(() => {
    dialogSubmitLoading.value = false
  })
}

const openUpdateDialog = (row) => {
  dialogCreate.value = false
  userDialogForm.value = {
    username: row.username,
    nickname: row.nickname,
    password: '',
    disabled: row.disabled,
    role: row.role,
    clusterPermission: row.clusterPermission,
    clusterCreationProhibited: row.clusterCreationProhibited,
    maxWorldsPerCluster: row.maxWorldsPerCluster,
  }
  userDialogVisible.value = true
}

const handleUpdateUser = async (event) => {
  dialogSubmitLoading.value = true
  const results = await event
  if (!results.valid) {
    dialogSubmitLoading.value = false
    return
  }

  dialogSubmitLoading.value = true
  const reqForm = {
    username: userDialogForm.value.username,
    nickname: userDialogForm.value.nickname,
    password: SHA512('nicai'),
    disabled: userDialogForm.value.disabled,
    role: userDialogForm.value.role,
    clusterPermission: userDialogForm.value.clusterPermission,
    clusterCreationProhibited: userDialogForm.value.clusterCreationProhibited,
    maxWorldsPerCluster: userDialogForm.value.maxWorldsPerCluster,
  }
  systemApi.user.put(reqForm).then(response => {
    userDialogVisible.value = false
    showSnackbar(response.message)
    handleGetUserList()
  }).finally(() => {
    dialogSubmitLoading.value = false
  })
}

const deleteUserLoading = ref(false)
const handleDeleteUser = (row) => {
  deleteUserLoading.value = true
  const reqForm = {
    username: row.username,
    nickname: row.nickname,
    password: SHA512('nicai'),
    disabled: row.disabled,
  }
  systemApi.user.delete(reqForm).then(response => {
    showSnackbar(response.message)
    handleGetUserList()
  }).finally(() => {
    deleteUserLoading.value = false
  })
}

</script>

<style scoped>
</style>