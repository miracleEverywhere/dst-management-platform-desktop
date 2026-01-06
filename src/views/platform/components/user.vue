<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search"
            :label="t('platform.user.search.label')"
            :placeholder="t('platform.user.search.placeholder')"
            clearable
            @keyup.enter="getUserListData({page: userListData.page,
                                           itemsPerPage: userListData.pageSize,
                                           sortBy: undefined,
            })"
            @click:clear="getUserListData({page: userListData.page,
                                           itemsPerPage: userListData.pageSize,
                                           sortBy: undefined,
            })"
          />
        </v-col>
        <v-col cols="12">
          <v-sheet
            rounded
            border
          >
            <v-data-table-server
              v-model:items-per-page="userListData.pageSize"
              :items="userListData.rows"
              :items-length="userListData.total"
              :page="userListData.page"
              :loading="getUserListDataLoading"
              :headers="headers"
              @update:options="getUserListData"
            >
              <template #top>
                <v-toolbar flat>
                  <v-toolbar-title>
                    <v-icon
                      icon="ri-id-card-line"
                      start
                    />
                    <span v-if="!mobile">{{ t('platform.user.table.title') }}</span>
                  </v-toolbar-title>
                  <v-btn
                    prepend-icon="ri-add-line"
                    color="success"
                    @click="openCreateUserDialog"
                  >
                    {{ t('platform.user.table.create') }}
                  </v-btn>
                  <v-btn
                    prepend-icon="ri-refresh-line"
                    :loading="getUserListDataLoading"
                    color="default"
                    @click="getUserListData({page: userListData.page,
                                             itemsPerPage: userListData.pageSize,
                                             sortBy: undefined,
                    })"
                  >
                    {{ t('platform.user.table.refresh') }}
                  </v-btn>
                </v-toolbar>
              </template>
              <template #item.username="{ value }">
                <v-chip label>
                  {{ value }}
                </v-chip>
              </template>
              <template #item.nickname="{ value }">
                <v-chip label>
                  {{ value }}
                </v-chip>
              </template>
              <template #item.role="{ value }">
                <v-chip
                  v-if="value==='admin'"
                  color="primary"
                  label
                >
                  {{ t('platform.user.table.admin') }}
                </v-chip>
                <v-chip
                  v-else
                  label
                >
                  {{ t('platform.user.table.nonAdmin') }}
                </v-chip>
              </template>
              <template #item.avatar="{ value }">
                <v-avatar
                  v-ripple
                  color="primary"
                  variant="tonal"
                >
                  <v-img :src="getAvatar(value)" />
                </v-avatar>
              </template>
              <template #item.disabled="{ value }">
                <v-chip
                  v-if="value"
                  color="error"
                  label
                >
                  {{ t('platform.user.table.yes') }}
                </v-chip>
                <v-chip
                  v-else
                  color="success"
                  label
                >
                  {{ t('platform.user.table.no') }}
                </v-chip>
              </template>
              <template #item.rooms="{ item }">
                <v-chip
                  v-if="item.role==='admin'"
                  color="success"
                  label
                >
                  {{ t('platform.user.table.noLimit') }}
                </v-chip>
                <v-chip
                  v-else
                  color="info"
                  label
                >
                  {{ dbRoomsToRooms(item.rooms).length }}{{ t('platform.user.table.unit') }}
                </v-chip>
              </template>
              <template #item.roomCreation="{ item }">
                <template v-if="item.role==='admin'">
                  <v-chip
                    color="success"
                    label
                  >
                    {{ t('platform.user.table.yes') }}
                  </v-chip>
                </template>
                <template v-else>
                  <v-chip
                    v-if="item.roomCreation"
                    color="success"
                    label
                  >
                    {{ t('platform.user.table.yes') }}
                  </v-chip>
                  <v-chip
                    v-else
                    color="error"
                    label
                  >
                    {{ t('platform.user.table.no') }}
                  </v-chip>
                </template>
              </template>
              <template #item.maxWorlds="{ item }">
                <v-chip
                  v-if="item.role==='admin'"
                  color="success"
                  label
                >
                  {{ t('platform.user.table.noLimit') }}
                </v-chip>
                <v-chip
                  v-else
                  label
                >
                  {{ item.maxWorlds }}
                </v-chip>
              </template>
              <template #item.maxPlayers="{ item }">
                <v-chip
                  v-if="item.role==='admin'"
                  color="success"
                  label
                >
                  {{ t('platform.user.table.noLimit') }}
                </v-chip>
                <v-chip
                  v-else
                  label
                >
                  {{ item.maxPlayers }}
                </v-chip>
              </template>
              <template #item.actions="{ item }">
                <v-btn
                  color="info"
                  append-icon="ri-arrow-drop-down-line"
                  variant="text"
                >
                  {{ t('platform.user.table.actions') }}
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item
                        class="text-warning"
                        @click="handleAction('update', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-user-settings-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.user.table.update') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :disabled="item.role==='admin'"
                        class="text-error"
                        @click="handleAction('delete', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-user-unfollow-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.user.table.delete') }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </template>
            </v-data-table-server>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog
    v-model="userDialogVisible"
    :width="mobile?'85%':'60%'"
  >
    <v-card>
      <v-card-title>
        {{ t('platform.user.dialogTitle') }}
      </v-card-title>
      <v-form
        ref="userFormRef"
        class="mx-6"
        @submit.prevent="handleUserSubmit"
      >
        <v-card-text class="my-2">
          <v-row>
            <v-col>
              <v-text-field
                v-model="userForm.username"
                v-tooltip="t('platform.user.form.username.tip')"
                :rules="userFormRules.username"
                :label="t('platform.user.form.username.title')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="userForm.nickname"
                v-tooltip="t('platform.user.form.nickname.tip')"
                :rules="userFormRules.nickname"
                :label="t('platform.user.form.nickname.title')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-radio-group
                v-model="userForm.role"
                :disabled="userForm.username===userStore.userInfo.username"
                inline
              >
                <template #prepend>
                  <v-chip v-tooltip="t('platform.user.form.role.tip')">
                    {{ t('platform.user.form.role.title') }}
                  </v-chip>
                </template>
                <v-radio
                  :label="t('platform.user.form.role.admin')"
                  value="admin"
                  class="mr-4"
                />
                <v-radio
                  :label="t('platform.user.form.role.nonAdmin')"
                  value="non-admin"
                  class="mr-4"
                />
              </v-radio-group>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-radio-group
                v-model="userForm.disabled"
                :disabled="userForm.username===userStore.userInfo.username"
                inline
              >
                <template #prepend>
                  <v-chip v-tooltip="t('platform.user.form.disabled.tip')">
                    {{ t('platform.user.form.disabled.title') }}
                  </v-chip>
                </template>
                <v-radio
                  :label="t('platform.user.form.disabled.yes')"
                  :value="true"
                  class="mr-4"
                />
                <v-radio
                  :label="t('platform.user.form.disabled.no')"
                  :value="false"
                  class="mr-4"
                />
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              :cols="mobile?4:2"
              class="d-flex align-center"
            >
              <v-row>
                <v-col>
                  <v-chip v-tooltip="t('platform.user.form.avatar.tip')">
                    {{ t('platform.user.form.avatar.title') }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="mobile?8:10">
              <v-row>
                <v-col
                  v-for="i in 4"
                  :key="i"
                  :cols="mobile?6:3"
                >
                  <v-badge
                    dot
                    location="bottom right"
                    offset-x="3"
                    offset-y="3"
                    color="success"
                    :model-value="userForm.avatar === i.toString()"
                  >
                    <v-avatar
                      v-ripple
                      color="primary"
                      variant="tonal"
                      @click="userForm.avatar = i.toString()"
                    >
                      <v-img :src="getAvatar(i)" />
                    </v-avatar>
                  </v-badge>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="!isEdit">
            <v-col>
              <v-text-field
                v-model="userForm.password"
                v-tooltip="t('platform.user.form.password.tip')"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :label="t('platform.user.form.password.title')"
                :rules="userFormRules.password"
                clearable
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-radio-group
                v-model="userForm.roomCreation"
                :disabled="userForm.role==='admin'"
                inline
              >
                <template #prepend>
                  <v-chip v-tooltip="t('platform.user.form.roomCreation.tip')">
                    {{ t('platform.user.form.roomCreation.title') }}
                  </v-chip>
                </template>
                <v-radio
                  :label="t('platform.user.form.roomCreation.yes')"
                  :value="true"
                  class="mr-4"
                />
                <v-radio
                  :label="t('platform.user.form.roomCreation.no')"
                  :value="false"
                  class="mr-4"
                />
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="userForm.rooms"
                v-tooltip="t('platform.user.form.rooms.tip')"
                :disabled="userForm.role==='admin'"
                :items="roomBasic"
                item-title="roomName"
                item-value="roomID"
                :label="t('platform.user.form.rooms.title')"
                multiple
                chips
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-slider
                v-model="userForm.maxPlayers"
                :disabled="userForm.role==='admin'"
                :max="64"
                :min="1"
                class="align-center"
                hide-details
                step="1"
                style="margin-left: -1px"
              >
                <template #label>
                  <v-chip
                    v-tooltip="t('platform.user.form.maxPlayers.tip')"
                    style="margin-right: 1rem"
                  >
                    {{ t('platform.user.form.maxPlayers.title') }}
                  </v-chip>
                </template>
                <template #append>
                  <v-chip
                    label
                    color="primary"
                  >
                    {{ userForm.maxPlayers }}
                  </v-chip>
                </template>
              </v-slider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-slider
                v-model="userForm.maxWorlds"
                :disabled="userForm.role==='admin'"
                :max="64"
                :min="1"
                class="align-center"
                hide-details
                step="1"
                style="margin-left: -1px"
              >
                <template #label>
                  <v-chip
                    v-tooltip="t('platform.user.form.maxWorlds.tip')"
                    style="margin-right: 1rem"
                  >
                    {{ t('platform.user.form.maxWorlds.title') }}
                  </v-chip>
                </template>
                <template #append>
                  <v-chip
                    label
                    color="primary"
                  >
                    {{ userForm.maxWorlds }}
                  </v-chip>
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="my-6">
          <v-spacer />
          <v-btn
            color="default"
            variant="elevated"
            :text="t('login.cancel')"
            class="mr-4"
            @click="userDialogVisible = false"
          />
          <v-btn
            :text="t('login.submit')"
            :loading="userSubmitLoading"
            variant="elevated"
            type="submit"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
  <confirm-box
    v-model="confirmVisible"
    type="warning"
    :title="t('global.confirm.title')"
    :content="t('global.confirm.content')"
    :confirm-text="t('global.confirm.confirm')"
    :cancel-text="t('global.confirm.cancel')"
    :confirm-loading="confirmLoading"
    @confirm="handleDelete"
    @cancel="confirmVisible=false"
  />
</template>

<script setup>
import userApi from "@/api/user.js"
import roomApi from "@/api/room.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import avatar1 from "@images/avatars/avatar-1.png"
import avatar2 from "@images/avatars/avatar-2.png"
import avatar3 from "@images/avatars/avatar-3.png"
import avatar4 from "@images/avatars/avatar-4.png"
import { SHA512 } from "@/utils/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"
import globalStore from "@store/global.js"
import useUserStore from "@store/user.js"


const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const roomBasic = ref([{
  roomName: '',
  roomID: 0,
}])

const getRoomBasic = () => {
  roomApi.basic.get().then(response => {
    roomBasic.value = response.data || []
  })
}

const search = ref('')

const userListData = ref({
  rows: [],
  page: 1,
  pageSize: 10,
  total: 0,
})

const getUserListDataLoading = ref(false)

const getUserListData = ({ page, itemsPerPage, sortBy }) => {
  const reqFrom = {
    q: search.value,
    page: page,
    pageSize: itemsPerPage,
  }

  getUserListDataLoading.value = true
  userApi.list.get(reqFrom).then(response => {
    userListData.value = response.data
  }).finally(() => {
    getUserListDataLoading.value = false
  })
}

const headers = [
  { title: t('platform.user.form.username.title'), value: 'username' },
  { title: t('platform.user.form.nickname.title'), value: 'nickname' },
  { title: t('platform.user.form.role.title'), value: 'role' },
  { title: t('platform.user.form.avatar.title'), value: 'avatar' },
  { title: t('platform.user.form.disabled.title'), value: 'disabled' },
  { title: t('platform.user.form.rooms.title'), value: 'rooms' },
  { title: t('platform.user.form.roomCreation.title'), value: 'roomCreation' },
  { title: t('platform.user.form.maxWorlds.title'), value: 'maxWorlds' },
  { title: t('platform.user.form.maxPlayers.title'), value: 'maxPlayers' },
  { title: t('platform.user.table.actions'), value: 'actions' },
]

const userFormRef = ref()

const userForm = ref({
  username: '',
  nickname: '',
  role: 'non-admin',
  avatar: '1',
  password: '',
  disabled: false,
  rooms: [],
  roomCreation: true,
  maxWorlds: 2,
  maxPlayers: 6,
})

const userFormRules = {
  username: [
    value => {
      if (value) return true

      return t('platform.user.form.username.required')
    },
  ],
  nickname: [
    value => {
      if (value) return true

      return t('platform.user.form.nickname.required')
    },
  ],
  password: [
    value => {
      if (value) return true

      return t('platform.user.form.password.required')
    },
  ],
}

const userDialogVisible = ref(false)

const isEdit = ref(false)

const openCreateUserDialog = () => {
  userDialogVisible.value = true
  isEdit.value = false
  userForm.value = {
    username: '',
    nickname: '',
    role: 'non-admin',
    avatar: '1',
    password: '',
    disabled: false,
    rooms: [],
    roomCreation: false,
    maxWorlds: 2,
    maxPlayers: 6,
  }
  nextTick(() => {
    if (userFormRef.value) {
      userFormRef.value.resetValidation()
    }
  })
}

const avatars = {
  1: avatar1,
  2: avatar2,
  3: avatar3,
  4: avatar4,
}

const getAvatar = index => {
  return avatars[index]
}

const isPasswordVisible = ref(false)

const userSubmitLoading = ref(false)

const handleUserSubmit = async () => {
  const { valid } = await userFormRef.value.validate()
  if (!valid) return

  userSubmitLoading.value = true

  if (isEdit.value) {
    // 编辑
    const reqForm = {
      username: userForm.value.username,
      nickname: userForm.value.nickname,
      role: userForm.value.role,
      avatar: userForm.value.avatar,
      password: '',
      disabled: userForm.value.disabled,
      rooms: userForm.value.rooms.join(','),
      roomCreation: userForm.value.roomCreation,
      maxWorlds: userForm.value.maxWorlds,
      maxPlayers: userForm.value.maxPlayers,
    }

    userApi.base.put(reqForm).then(response => {
      userDialogVisible.value = false
      showSnackbar(response.message)
      getUserListData({ page: userListData.value.page,
        itemsPerPage: userListData.value.pageSize,
        sortBy: undefined,
      })
    }).finally(() => {
      userSubmitLoading.value = false
    })
  } else {
    // 创建
    const reqForm = {
      username: userForm.value.username,
      nickname: userForm.value.nickname,
      role: userForm.value.role,
      avatar: userForm.value.avatar,
      password: SHA512(userForm.value.password),
      disabled: userForm.value.disabled,
      rooms: userForm.value.rooms.join(','),
      roomCreation: userForm.value.roomCreation,
      maxWorlds: userForm.value.maxWorlds,
      maxPlayers: userForm.value.maxPlayers,
    }

    userApi.base.post(reqForm).then(response => {
      userDialogVisible.value = false
      showSnackbar(response.message)
      getUserListData({ page: userListData.value.page,
        itemsPerPage: userListData.value.pageSize,
        sortBy: undefined,
      })
    }).finally(() => {
      userSubmitLoading.value = false
    })
  }

}

const dbRoomsToRooms = str =>
  str ? str.split(',').map(Number).filter(item => !isNaN(item)) : []

const handleAction = (action, user) => {
  switch (action) {
  case "update":
    openUpdateUserDialog(user)
    break
  case "delete":
    currentUsername.value = user.username
    confirmVisible.value = true
    break
  default:
    showSnackbar("牛哇", "error")
  }
}

const openUpdateUserDialog = user => {
  userDialogVisible.value = true
  isEdit.value = true
  userForm.value = {
    username: user.username,
    nickname: user.nickname,
    role: user.role,
    avatar: user.avatar,
    disabled: user.disabled,
    rooms: dbRoomsToRooms(user.rooms),
    roomCreation: user.roomCreation,
    maxWorlds: user.maxWorlds,
    maxPlayers: user.maxPlayers,
  }
  nextTick(() => {
    if (userFormRef.value) {
      userFormRef.value.resetValidation()
    }
  })
}

const confirmVisible = ref(false)
const confirmLoading = ref(false)
const currentUsername = ref('')

const handleDelete = () => {
  confirmLoading.value = true

  const reqForm = {
    username: currentUsername.value,
  }

  userApi.base.delete(reqForm).then(response => {
    confirmVisible.value = false
    showSnackbar(response.message)
    getUserListData({
      page: userListData.value.page,
      itemsPerPage: userListData.value.pageSize,
      sortBy: undefined,
    })
  }).finally(() => {
    confirmLoading.value = false
  })
}


onMounted(() => {
  getRoomBasic()
})
</script>

