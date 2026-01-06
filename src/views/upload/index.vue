<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <v-row>
      <v-col>
        <v-sheet
          border
          rounded
        >
          <v-toolbar flat>
            <v-toolbar-title>
              <v-icon
                icon="ri-contacts-book-upload-line"
                start
              />
              <span v-if="!mobile">{{ t('upload.title') }}</span>
            </v-toolbar-title>
            <v-dialog
              v-model="uploadDialogVisible"
              :persistent="uploadLoading"
              class="flex-wrap"
              :width="mobile?'90%':'40%'"
            >
              <template #activator="{ props: activatorProps }">
                <v-btn
                  class="mr-2"
                  color="primary"
                  prepend-icon="ri-upload-line"
                  v-bind="activatorProps"
                >
                  {{ t('upload.button') }}
                </v-btn>
              </template>
              <template #default="{ isActive }">
                <v-card
                  :title="t('upload.dialog.title')"
                  min-height="500"
                >
                  <v-card-text>
                    <template v-if="!uploadLoading">
                      <v-alert
                        color="warning"
                        density="compact"
                        class="mt-2 mb-2"
                      >
                        {{ t('upload.dialog.tip') }}
                      </v-alert>
                      <v-radio-group
                        v-model="uploadType"
                        inline
                        color="primary"
                        class="my-4"
                      >
                        <template #prepend>
                          <v-chip>
                            {{ t('upload.dialog.uploadType') }}
                          </v-chip>
                        </template>
                        <v-radio
                          :label="t('upload.dialog.uploadNew')"
                          :disabled="!canCreateRoom()"
                          value="new"
                        />
                        <v-radio
                          :label="t('upload.dialog.uploadOld')"
                          :disabled="globalStore.room.id===0"
                          value="old"
                        />
                      </v-radio-group>
                      <v-file-upload
                        density="default"
                        icon="ri-upload-cloud-2-line"
                        @update:model-value="handleUpload"
                      />
                    </template>
                    <template v-else>
                      <result
                        :height="400"
                        type="info"
                        :title="t('upload.dialog.uploadingTitle')"
                        :sub-title="t('upload.dialog.uploadingSubTitle')"
                      />
                    </template>
                  </v-card-text>
                </v-card>
              </template>
            </v-dialog>
          </v-toolbar>
          <v-expansion-panels>
            <v-expansion-panel :text="t('upload.expansions.panel1.text')">
              <template #title>
                <v-icon
                  icon="ri-error-warning-line"
                  start
                  color="error"
                />
                <span class="text-error">
                  {{ t('upload.expansions.panel1.title') }}
                </span>
              </template>
            </v-expansion-panel>
            <v-expansion-panel :text="t('upload.expansions.panel2.text')">
              <template #title>
                <v-icon
                  icon="ri-error-warning-line"
                  start
                  color="error"
                />
                <span class="text-error">
                  {{ t('upload.expansions.panel2.title') }}
                </span>
              </template>
            </v-expansion-panel>
            <v-expansion-panel :text="t('upload.expansions.panel3.text')">
              <template #title>
                <v-icon
                  icon="ri-error-warning-line"
                  start
                  color="error"
                />
                <span class="text-error">
                  {{ t('upload.expansions.panel3.title') }}
                </span>
              </template>
            </v-expansion-panel>
            <v-expansion-panel
              :title="t('upload.expansions.panel4.title')"
              :text="t('upload.expansions.panel4.text')"
            />
          </v-expansion-panels>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-treeview
          v-model:opened="open"
          :items="items"
          item-value="id"
          variant="flat"
          density="compact"
          activatable
          open-on-click
          no-filter
        >
          <template #prepend="{ item, isOpen }">
            <v-icon
              v-if="!item.file"
              :icon="isOpen ? 'ri-folder-open-fill' : 'ri-folder-fill'"
            />
            <v-icon
              v-else
              :icon="files[item.file]"
            />
          </template>

          <template #append="{ item }">
            <v-icon
              v-if="item.required"
              icon="ri-pushpin-fill"
              color="error"
            />
          </template>
        </v-treeview>
      </v-col>
    </v-row>
  </template>
  <template v-else>
    <result
      v-if="userStore.userInfo.role==='admin'"
      :title="t('global.noGame.title')"
      :sub-title="t('global.noGame.subTitle')"
      :height="calculateContainerSize()"
      type="error"
    >
      <v-btn
        to="/install"
        class="mt-4"
      >
        {{ t('global.noGame.button') }}
      </v-btn>
    </result>
    <result
      v-else
      :title="t('global.noGameNoAdmin.title')"
      :sub-title="t('global.noGameNoAdmin.subTitle')"
      :height="calculateContainerSize()"
      type="error"
    />
  </template>
</template>

<script setup>
import { showSnackbar } from "@/utils/snackbar"
import roomApi from "@/api/room"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import useGlobalStore from "@store/global.js"
import useUserStore from "@store/user.js"
import { debounce } from "@/utils/tools"

const { mobile } = useDisplay()
const { t } = useI18n()
const globalStore = useGlobalStore()
const userStore = useUserStore()
const windowHeight = ref(window.innerHeight)
const uploadLoading = ref(false)
const uploadDialogVisible = ref(false)
const uploadType = ref('')

const checkUploadFile = param => {
  const zipPattern = /\.zip$/i
  
  return zipPattern.test(param.name)
}

const canCreateRoom = () => {
  if (userStore.userInfo.role === 'admin') {
    return true
  }
  
  return userStore.userInfo.roomCreation
}

const handleUpload = file => {
  if (uploadType.value !== 'old' && uploadType.value !== 'new') {
    showSnackbar(t('upload.dialog.uploadTypeTip'), 'error')

    return
  }
  if (!checkUploadFile(file)) {
    showSnackbar(t('upload.dialog.zipTip'), 'error')
    uploadDialogVisible.value = false
    
    return
  }
  uploadLoading.value = true

  const formData = new FormData()

  formData.append('file', file)
  if (uploadType.value === 'old') {
    formData.append('roomID', globalStore.room.id)
  }

  roomApi.upload.post(formData).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    uploadDialogVisible.value = false
    uploadLoading.value = false
  })
}

const open = shallowRef([1, 14])

const files = shallowRef({
  ini: 'ri-file-settings-line',
  lua: 'ri-file-code-line',
  txt: 'ri-file-text-line',
})

const items = [
  {
    id: 1,
    title: 'xxxxx.zip',
    children: [
      {
        id: 2,
        title: 'adminlist.txt',
        file: 'txt',
      },
      {
        id: 3,
        title: 'blocklist.txt',
        file: 'txt',
      },
      {
        id: 4,
        title: t('upload.tree.caves'),
        children: [
          {
            id: 5,
            title: 'backup',
          },
          {
            id: 6,
            title: 'leveldataoverride.lua',
            file: 'lua',
            required: true,
          },
          {
            id: 7,
            title: 'modoverrides.lua',
            file: 'lua',
          },
          {
            id: 8,
            title: 'save',
            required: true,
          },
          {
            id: 9,
            title: 'server_chat_log.txt',
            file: 'txt',
          },
          {
            id: 10,
            title: 'server.ini',
            file: 'ini',
            required: true,
          },
          {
            id: 11,
            title: 'server_log.txt',
            file: 'txt',
          },
        ],
      },
      {
        id: 12,
        title: 'cluster.ini',
        file: 'ini',
        required: true,
      },
      {
        id: 13,
        title: 'cluster_token.txt',
        file: 'txt',
      },
      {
        id: 14,
        title: 'Master',
        children: [
          {
            id: 15,
            title: 'backup',
          },
          {
            id: 16,
            title: 'leveldataoverride.lua',
            file: 'lua',
            required: true,
          },
          {
            id: 17,
            title: 'modoverrides.lua',
            file: 'lua',
          },
          {
            id: 18,
            title: 'save',
            required: true,
          },
          {
            id: 19,
            title: 'server_chat_log.txt',
            file: 'txt',
          },
          {
            id: 20,
            title: 'server.ini',
            file: 'ini',
            required: true,
          },
          {
            id: 21,
            title: 'server_log.txt',
            file: 'txt',
          },
        ],
        required: true,
      },
      {
        id: 22,
        title: 'whitelist.txt',
        file: 'txt',
      },
    ],
  },
]

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

onMounted(() => {
  handleResize()

  // 添加事件监听
  window.addEventListener('resize', handleResize)
})
</script>

