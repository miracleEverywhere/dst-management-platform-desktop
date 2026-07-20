<template>
  <v-card
    class="mt-4"
    :height="props.height-70"
  >
    <v-card-title>
      <div class="card-header my-2">
        <span>
          {{ t(`game.player.list.${props.listType}`) }}
        </span>
        <div>
          <v-btn
            v-if="props.listType === 'blocklist' && !mobile"
            :loading="listChangeLoading"
            class="mr-2"
          >
            DST Block
            <v-dialog
              v-model="dstBlockDialog"
              :persistent="listChangeLoading"
              activator="parent"
              :width="mobile?'90%':'45%'"
            >
              <v-card>
                <v-card-title>
                  {{ t('game.player.list.dstBlock.import') }} DST Block
                </v-card-title>
                <v-card-text class="mt-4">
                  <v-alert
                    color="success"
                    class="mb-4"
                  >
                    {{ t('game.player.list.dstBlock.introduce') }}
                  </v-alert>
                  <v-alert
                    color="info"
                    class="mb-4"
                  >
                    {{ t('game.player.list.dstBlock.urlText') }}
                    <v-btn
                      variant="text"
                      href="https://dst-block.miraclesses.top"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-lowercase"
                    >
                      https://dst-block.miraclesses.top
                    </v-btn>
                  </v-alert>
                  <v-alert class="mb-4">
                    {{ t('game.player.list.dstBlock.tip') }}
                  </v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="x"
                    @click="dstBlockDialog=false"
                  >
                    {{ t('game.player.list.dstBlock.cancel') }}
                  </v-btn>
                  <v-btn
                    color="info"
                    @click="handleListChange('', 'import')"
                  >
                    {{ t('game.player.list.dstBlock.import') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
          <v-btn
            class="mr-2"
            color="success"
            @click="handleOpenImportDialog"
          >
            {{ t('game.player.list.import.title') }}
          </v-btn>
          <v-dialog
            v-model="importDialog"
            :width="mobile?'90%':'45%'"
          >
            <v-card>
              <v-card-title />
              <v-card-text>
                <v-alert
                  color="warning"
                  density="compact"
                  class="mt-2 mb-2"
                >
                  {{ t('game.player.list.import.tip') }}
                </v-alert>
                <v-file-upload
                  density="default"
                  icon="ri-upload-cloud-2-line"
                  @update:model-value="handleImport"
                />
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            color="error"
            class="mr-2"
            :loading="listChangeLoading"
            @click="confirmSettings.visible = true"
          >
            {{ t('game.player.list.deleteAll') }}
          </v-btn>
          <v-btn
            color="default"
            @click="getListData(true)"
          >
            {{ t('game.player.list.refresh') }}
          </v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-container
        fluid
        :height="props.height-152"
        style="overflow-y: auto"
      >
        <v-row>
          <v-alert
            color="success"
            density="compact"
          >
            {{ t('game.player.list.tip') }}
          </v-alert>
          <v-col
            class="mt-4"
            cols="12"
          />
          <v-chip
            v-for="uid in listData"
            :key="uid"
            closable
            color="info"
            class="mt-2 mr-2"
            label
            size="large"
            @click:close="handleListChange(uid,'delete')"
          >
            {{ uid }}
            <span v-if="(props.uidmap.find(item => item.uid === uid)?.nickname||'')!==''">
              ({{ props.uidmap.find(item => item.uid === uid)?.nickname||'' }})
            </span>
          </v-chip>
          <div
            class="d-flex align-center"
            style="width: 160px"
          >
            <v-text-field
              v-if="inputVisible"
              ref="inputRef"
              v-model="inputValue"
              density="compact"
              :placeholder="t('game.player.list.placeholder')"
              persistent-placeholder
              class="mt-2"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <v-btn
              v-else
              variant="tonal"
              append-icon="ri-add-line"
              color="default"
              class="mt-2 mr-2"
              @click="showInput"
            >
              {{ t('game.player.list.add') }}
            </v-btn>
          </div>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>

  <confirm-box
    v-model="confirmSettings.visible"
    type="warning"
    :title="t('global.confirm.title')"
    :content="t('global.confirm.content')"
    :confirm-text="t('global.confirm.confirm')"
    :cancel-text="t('global.confirm.cancel')"
    :confirm-loading="confirmSettings.loading"
    @confirm="handleConfirm"
    @cancel="confirmSettings.visible = false"
  />
</template>

<script setup>
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import playerApi from "@/api/player"
import { showSnackbar } from "@/utils/snackbar"

const props = defineProps({
  listType: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: 0,
  },
  uidmap: {
    type: Array,
    default: () => [],
  },
})

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const listData = ref([])
const getListDataLoading = ref(false)

const getListData = (tip=false) => {
  getListDataLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    listType: props.listType,
  }

  playerApi.list.get(reqForm).then(response => {
    listData.value = response.data || []
    if (tip) {
      showSnackbar(t('game.player.list.refreshSuccess'))
    }
  }).finally(() => {
    getListDataLoading.value = false
  })
}

const listChangeLoading = ref(false)

const handleListChange = async (uid, actionType) => {
  listChangeLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    listType: props.listType,
    uids: [uid],
    actionType: actionType,
  }

  playerApi.list.post(reqForm).then(response => {
    showSnackbar(response.message)
    getListData()
  }).finally(() => {
    listChangeLoading.value = false
    dstBlockDialog.value = false
  })
}

const inputVisible = ref(false)
const inputRef = ref()
const inputValue = ref('')

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    if (!(/^KU_/.test(inputValue.value))) {
      showSnackbar(t('game.player.list.uidValid'), 'error')

      return
    }
    handleListChange(inputValue.value, 'add')
  }
  inputVisible.value = false
  inputValue.value = ''
}

const importDialog = ref(false)

const handleOpenImportDialog = () => {
  importDialog.value = true
}

const checkUploadFile = param => {
  const zipPattern = /\.txt$/i

  return zipPattern.test(param.name)
}

const importLoading = ref(false)

const handleImport = file => {
  importLoading.value = true
  if (!checkUploadFile(file)) {
    showSnackbar(t('game.player.list.import.fileTypeError'), 'error')
    importDialog.value = false
    importLoading.value = false

    return
  }

  // 创建FileReader对象
  const reader = new FileReader()

  // 读取为文本
  reader.readAsText(file)

  // 读取完成时的回调
  reader.onload = () => {
    const fileContent = reader.result

    const uidsFile = fileContent.split('\n')

    const uids = []
    for (let uid of uidsFile) {
      if (uid !== "") {
        uids.push(uid)
      }
    }

    const reqForm = {
      roomID: globalStore.room.id,
      listType: props.listType,
      uids: uids,
      actionType: 'add',
    }

    playerApi.list.post(reqForm).then(response => {
      showSnackbar(response.message)
      getListData()
    }).finally(() => {
      importLoading.value = false
      importDialog.value = false
    })
  }

  // 读取错误时的回调
  reader.onerror = () => {
    showSnackbar(t('game.player.list.import.fileReadError'), 'error')
    importLoading.value = false
    importDialog.value = false
  }
}

const dstBlockDialog = ref(false)
const dstBlockLoading = ref(false)

const confirmSettings = ref({
  visible: false,
  loading: false,
})

const handleConfirm = async () => {
  confirmSettings.value.loading = true
  await handleListChange('', 'deleteAll')
  confirmSettings.value.loading = false
  confirmSettings.value.visible = false
}

onMounted(() => {
  getListData()
})
</script>

