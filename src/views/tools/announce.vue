<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <v-card>
        <v-sheet
          border
          rounded
        >
          <v-data-table
            :headers="headers"
            :items="announces"
            :loading="getAnnounceLoading"
          >
            <template #loading>
              <v-skeleton-loader type="table-row@10" />
            </template>
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>
                  <v-icon
                    icon="ri-chat-smile-ai-3-line"
                    start
                  />
                  <span v-if="!mobile">{{ t('tools.announce.title') }}</span>
                </v-toolbar-title>
                <v-btn
                  prepend-icon="ri-add-line"
                  color="success"
                  @click="openAnnounceDialog"
                >
                  {{ t('tools.announce.add') }}
                </v-btn>
                <v-btn
                  prepend-icon="ri-refresh-line"
                  :loading="getAnnounceLoading"
                  color="default"
                  @click="getAnnounce"
                >
                  {{ t('tools.announce.refresh') }}
                </v-btn>
              </v-toolbar>
            </template>
            <template #item.status="{value}">
              <v-chip
                v-if="value"
                label
                color="success"
              >
                {{ t('tools.announce.form.status.y') }}
              </v-chip>
              <v-chip
                v-else
                label
                color="error"
              >
                {{ t('tools.announce.form.status.n') }}
              </v-chip>
            </template>
            <template #item.interval="{value}">
              <v-chip label>
                {{ value }}
              </v-chip>
            </template>
            <template #item.content="{value}">
              {{ truncateString(value, 40) }}
            </template>
            <template #item.actions="{ item }">
              <v-btn
                color="info"
                append-icon="ri-arrow-drop-down-line"
                variant="text"
                :loading="deleteLoading"
              >
                {{ t('tools.announce.actions') }}
                <v-menu activator="parent">
                  <v-list>
                    <v-list-item
                      class="text-info"
                      @click="openAnnounceDialog(item, true)"
                    >
                      <template #prepend>
                        <v-icon
                          icon="ri-edit-line"
                          size="22"
                        />
                      </template>
                      <v-list-item-title>
                        {{ t('tools.announce.update') }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      class="text-error"
                      @click="handleDelete(item.id)"
                    >
                      <template #prepend>
                        <v-icon
                          icon="ri-delete-bin-line"
                          size="22"
                        />
                      </template>
                      <v-list-item-title>
                        {{ t('tools.announce.delete') }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </template>
          </v-data-table>
        </v-sheet>
      </v-card>
    </template>
    <template v-else>
      <result
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        type="error"
        :height="calculateContainerSize()"
      >
        <v-btn
          to="/rooms"
          class="mt-4"
        >
          {{ t('global.noRoomSelected.button') }}
        </v-btn>
      </result>
    </template>
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

  <v-dialog
    v-model="announceDialog"
    :width="mobile?'90%':'60%'"
  >
    <v-card>
      <v-form
        ref="announceFormRef"
        class="ma-4"
        @submit.prevent="handleSubmit"
      >
        <v-card-title>
          <span>
            {{ t('tools.announce.title') }}
          </span>
        </v-card-title>
        <v-card-text class="my-8">
          <v-row class="mb-8">
            <v-radio-group
              v-model="announceForm.status"
              inline
            >
              <template #prepend>
                <v-chip v-tooltip="t('tools.announce.form.status.tip')">
                  {{ t('tools.announce.form.status.title') }}
                </v-chip>
              </template>
              <v-radio
                :label="t('tools.announce.form.status.y')"
                :value="true"
                class="mr-4"
              />
              <v-radio
                :label="t('tools.announce.form.status.n')"
                :value="false"
                class="mr-4"
              />
            </v-radio-group>
          </v-row>
          <v-row class="mb-8">
            <v-number-input
              v-model="announceForm.interval"
              v-tooltip="t('tools.announce.form.interval.tip')"
              :label="t('tools.announce.form.interval.title')"
              :min="1"
              style="margin-bottom: -1.25rem"
            >
              <template #append-inner>
                <div style="width: 50px">
                  {{ t('tools.announce.form.interval.unit') }}
                </div>
              </template>
            </v-number-input>
          </v-row>
          <v-row>
            <v-text-field
              v-model="announceForm.content"
              v-tooltip="t('tools.announce.form.content.tip')"
              :label="t('tools.announce.form.content.title')"
              :rules="announceFormRules.content"
            />
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="default"
            variant="elevated"
            :text="t('login.cancel')"
            class="mr-4"
            @click="announceDialog = false"
          />
          <v-btn
            :text="t('login.submit')"
            :loading="submitLoading"
            variant="elevated"
            type="submit"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import useGlobalStore from "@store/global.js"
import useUserStore from "@store/user.js"
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify/framework"
import { debounce, deepCopy, generateUUID, truncateString } from "@/utils/tools.js"
import toolsApi from "@/api/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"


const globalStore = useGlobalStore()
const userStore = useUserStore()
const { t } = useI18n()
const { mobile } = useDisplay()
const windowHeight = ref(window.innerHeight)

const announces = ref([])
const getAnnounceLoading = ref(false)

const getAnnounce = () => {
  if (globalStore.room.id === 0) return
  getAnnounceLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  toolsApi.announce.get(reqForm).then(response => {
    if (response.data !== "") {
      announces.value = JSON.parse(response.data)
    }
  }).finally(() => {
    getAnnounceLoading.value = false
  })
}

const headers = [
  { key: 'status', title: t('tools.announce.form.status.title') },
  { key: 'interval', title: t('tools.announce.form.interval.title'), minWidth: 120 },
  { key: 'content', title: t('tools.announce.form.content.title') },
  { key: 'actions', title: t('tools.announce.actions') },
]

const announceDialog = ref(false)
const isEdit = ref(false)

const openAnnounceDialog = (row, edit=false) => {
  if (edit) {
    isEdit.value = true
    announceForm.value = { ...row }
  } else {
    isEdit.value = false
    announceForm.value = {
      id: '',
      status: true,
      interval: 600,
      content: '',
    }
  }
  nextTick(() => {
    if (announceFormRef.value) {
      announceFormRef.value.resetValidation()
    }
  })
  announceDialog.value = true
}

const announceFormRef = ref()

const announceForm = ref({
  id: '',
  status: true,
  interval: 600,
  content: '',
})

const announceFormRules = ref({
  content: [
    value => {
      if (value) {
        if (value.includes('"') || value.includes("'")) {
          return t('tools.announce.form.content.rule')
        }
        
        return true
      }
      
      return t('tools.announce.form.content.required')
    },
  ],
})

const submitLoading = ref(false)

const handleSubmit = async () => {
  const { valid } = await announceFormRef.value.validate()
  if (valid) {
    announceForm.value.content = announceForm.value.content.replace(/['"]/g, '')
    if (isEdit.value) {
      // 编辑
      for (let i = 0; i < announces.value.length; i++) {
        if (announces.value[i].id === announceForm.value.id) {
          announces.value[i] = announceForm.value
          break
        }
      }
    } else {
      // 新建
      submitLoading.value = true
      announceForm.value.id = generateUUID()
      announces.value.push(announceForm.value)
    }

    const reqForm = {
      roomID: globalStore.room.id,
      setting: JSON.stringify(announces.value),
    }

    toolsApi.announce.put(reqForm).then(response => {
      showSnackbar(response.message)
      announceDialog.value = false
      getAnnounce()
    }).finally(() => {
      submitLoading.value = false
    })
  }
}

const deleteLoading = ref(false)

const handleDelete = id => {
  deleteLoading.value = true

  const newAnnounces = announces.value.filter(item => item.id !== id)

  const reqForm = {
    roomID: globalStore.room.id,
    setting: JSON.stringify(newAnnounces),
  }

  toolsApi.announce.put(reqForm).then(response => {
    showSnackbar(t('tools.announce.deleteMessage'))
    getAnnounce()
  }).finally(() => {
    deleteLoading.value = false
  })
}


const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  getAnnounce()
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

