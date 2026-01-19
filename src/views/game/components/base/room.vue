<template>
  <v-form ref="roomFormRef">
    <!-- 游戏名 -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.gameName"
          v-tooltip="t('game.base.step1.gameName.tip')"
          :rules="roomFormRules.gameName"
          :label="t('game.base.step1.gameName.name')"
          append-inner-icon="ri-emotion-happy-line"
          @click:append-inner="emojiDialog=true;emojiGameName=true"
        />
      </v-col>
    </v-row>
    <!-- 描述 -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.description"
          v-tooltip="t('game.base.step1.description.tip')"
          :label="t('game.base.step1.description.name')"
          append-inner-icon="ri-emotion-happy-line"
          @click:append-inner="emojiDialog=true;emojiGameName=false"
        />
      </v-col>
    </v-row>
    <!-- 游戏模式 -->
    <v-row>
      <v-col>
        <v-radio-group
          v-model="roomForm.gameMode"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.gameMode.tip')">
              {{ t('game.base.step1.gameMode.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.gameMode.modes.endless')"
            value="endless"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.survival')"
            value="survival"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.relaxed')"
            value="relaxed"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.wilderness')"
            value="wilderness"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.lightsOut')"
            value="lightsOut"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.lavaarena')"
            value="lavaarena"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.quagmire')"
            value="quagmire"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.gameMode.modes.custom.name')"
            value="custom"
            class="mr-4"
          />
          <v-text-field
            v-if="roomForm.gameMode==='custom'"
            v-model="roomForm.customGameMode"
            :rules="roomFormRules.customGameMode"
            :label="t('game.base.step1.gameMode.modes.custom.label')"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <!-- 玩家数 -->
    <v-row>
      <v-col>
        <v-slider
          v-model="roomForm.maxPlayer"
          :max="props.maxPlayers===0?64:props.maxPlayers"
          :min="1"
          class="align-center"
          hide-details
          step="1"
          style="margin-left: -1px"
        >
          <template #label>
            <v-chip
              v-tooltip="t('game.base.step1.maxPlayer.tip')"
              style="margin-right: 1rem"
            >
              {{ t('game.base.step1.maxPlayer.name') }}
            </v-chip>
          </template>
          <template #append>
            <v-chip
              label
              color="primary"
            >
              {{ roomForm.maxPlayer }}
            </v-chip>
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <!-- pvp等 -->
    <v-row>
      <v-col :cols="mobile?12:4">
        <v-radio-group
          v-model="roomForm.pvp"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.pvp.tip')">
              {{ t('game.base.step1.pvp.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.pvp.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.pvp.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
      <v-col :cols="mobile?12:4">
        <v-radio-group
          v-model="roomForm.vote"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.vote.tip')">
              {{ t('game.base.step1.vote.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.vote.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.vote.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
      <v-col :cols="mobile?12:4">
        <v-radio-group
          v-model="roomForm.pauseEmpty"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.pauseEmpty.tip')">
              {{ t('game.base.step1.pauseEmpty.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.pauseEmpty.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.pauseEmpty.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <!-- 回档天数 -->
    <v-row>
      <v-col>
        <v-slider
          v-model="roomForm.maxRollBack"
          :max="64"
          :min="1"
          class="align-center"
          hide-details
          step="1"
          style="margin-left: -1px"
        >
          <template #label>
            <v-chip
              v-tooltip="t('game.base.step1.maxRollBack.tip')"
              style="margin-right: 1rem"
            >
              {{ t('game.base.step1.maxRollBack.name') }}
            </v-chip>
          </template>
          <template #append>
            <v-chip
              label
              color="primary"
            >
              {{ roomForm.maxRollBack }}
            </v-chip>
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <!-- 密码 -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.password"
          v-tooltip="t('game.base.step1.password.tip')"
          autocomplete="new-password"
          :label="t('game.base.step1.password.name')"
          :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />
      </v-col>
    </v-row>
    <!-- 令牌 -->
    <v-row>
      <v-col class="fcc">
        <v-text-field
          v-model="roomForm.token"
          v-tooltip="t('game.base.step1.token.tip')"
          :rules="roomFormRules.token"
          :label="t('game.base.step1.token.name')"
          :append-inner-icon="isTokenVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
          :type="isTokenVisible ? 'text' : 'password'"
          class="w-100"
          @click:append-inner="isTokenVisible = !isTokenVisible"
        />
        <v-btn
          v-if="!mobile"
          density="comfortable"
          variant="text"
          class="ml-4"
          color="success"
          prepend-icon="ri-add-line"
          @click="handleAddToken"
        >
          {{ t('game.base.step1.token.buttonAdd') }}
        </v-btn>
        <v-btn
          v-if="!mobile"
          density="comfortable"
          variant="text"
          class="ml-4"
          color="info"
          href="https://accounts.klei.com"
          target="_blank"
          prepend-icon="ri-links-line"
        >
          {{ t('game.base.step1.token.buttonUrl') }}
        </v-btn>
      </v-col>
    </v-row>
    <!-- master ip -->
    <v-row>
      <v-col
        :cols="mobile?12:9"
        :style="mobile?{marginBottom:'1.25rem'}:{}"
      >
        <v-text-field
          v-model="roomForm.masterIP"
          v-tooltip="t('game.base.step1.masterIP.tip')"
          :rules="roomFormRules.masterIP"
          :label="t('game.base.step1.masterIP.name')"
        />
      </v-col>
      <v-col :cols="mobile?12:3">
        <v-number-input
          v-model="roomForm.masterPort"
          v-tooltip="t('game.base.step1.masterPort.tip')"
          :rules="roomFormRules.masterPort"
          :label="t('game.base.step1.masterPort.name')"
          :min="1"
          :max="65535"
          style="margin-bottom: -1.25rem"
        />
      </v-col>
    </v-row>
    <!-- cluster key -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.clusterKey"
          v-tooltip="t('game.base.step1.clusterKey.tip')"
          :rules="roomFormRules.clusterKey"
          :label="t('game.base.step1.clusterKey.name')"
          :append-inner-icon="isClusterKeyVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
          :type="isClusterKeyVisible ? 'text' : 'password'"
          @click:append-inner="isClusterKeyVisible = !isClusterKeyVisible"
        />
      </v-col>
    </v-row>
    <!-- lan offline -->
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-radio-group
          v-model="roomForm.lan"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.lan.tip')">
              {{ t('game.base.step1.lan.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.lan.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.lan.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-radio-group
          v-model="roomForm.offline"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.offline.tip')">
              {{ t('game.base.step1.offline.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.offline.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.offline.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <!-- steam群组ID -->
    <v-row>
      <v-col>
        <v-text-field
          v-model="roomForm.steamGroupID"
          v-tooltip="t('game.base.step1.steamGroupID.tip')"
          :label="t('game.base.step1.steamGroupID.name')"
        />
      </v-col>
    </v-row>
    <!-- steam群组设置 -->
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-radio-group
          v-model="roomForm.steamGroupOnly"
          :disabled="roomForm.steamGroupID===''"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.steamGroupOnly.tip')">
              {{ t('game.base.step1.steamGroupOnly.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.steamGroupOnly.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.steamGroupOnly.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-radio-group
          v-model="roomForm.steamGroupAdmins"
          :disabled="roomForm.steamGroupID===''"
          inline
        >
          <template #prepend>
            <v-chip v-tooltip="t('game.base.step1.steamGroupAdmins.tip')">
              {{ t('game.base.step1.steamGroupAdmins.name') }}
            </v-chip>
          </template>
          <v-radio
            :label="t('game.base.step1.steamGroupAdmins.enable')"
            :value="true"
            class="mr-4"
          />
          <v-radio
            :label="t('game.base.step1.steamGroupAdmins.disable')"
            :value="false"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
    </v-row>
  </v-form>
  <v-dialog
    v-model="emojiDialog"
    :width="mobile?'90%':'60%'"
  >
    <v-card>
      <v-card-title>
        <div class="card-header">
          <div>
            {{ t('game.base.step1.emoji.title') }}
          </div>
          <div>
            <v-radio-group
              v-model="emojiInsertMode"
              inline
            >
              <v-radio
                :label="t('game.base.step1.emoji.insert')"
                :value="true"
                class="mr-4"
              />
              <v-radio
                :label="t('game.base.step1.emoji.copy')"
                :value="false"
              />
            </v-radio-group>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="mt-4">
        <div v-if="emojiInsertMode">
          <v-text-field
            v-if="emojiGameName"
            ref="emojiInputNameRef"
            v-model="roomForm.gameName"
            :label="t('game.base.step1.gameName.name')"
          />
          <v-text-field
            v-else
            ref="emojiInputDescriptionRef"
            v-model="roomForm.description"
            :label="t('game.base.step1.description.name')"
          />
        </div>
        <div class="emoji-container mt-8">
          <div
            v-for="e in Emoji"
            class="emoji-item"
            @click="handleEmoji(e)"
          >
            {{ e }}
          </div>
        </div>
      </v-card-text>
      <v-card-actions v-if="!mobile">
        <v-spacer />
        <v-btn
          variant="text"
          color="info"
          href="https://www.bilibili.com/opus/814456568458248259"
          target="_blank"
          append-icon="ri-share-box-line"
        >
          {{ t('game.base.step1.emoji.thanks') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { GamePortFactor } from "@/config/index.js"
import { generateRandomString, getDstToken } from "@/utils/tools.js"
import Emoji from "@/views/game/components/base/emoji.js"
import { showSnackbar } from "@/utils/snackbar.js"

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({}),
  },
  roomCount: {
    type: Number,
    default: 0,
  },
  maxPlayers: {
    type: Number,
    default: 0,
  },
})

const { mobile } = useDisplay()
const { t } = useI18n()

onMounted(() => {
  if ((props.formData?.id||0) !== 0) {
    roomForm.value = props.formData
  } else {
    roomForm.value.masterPort = props.roomCount + GamePortFactor.masterPort + 1
    roomForm.value.gameMode = 'endless'
    roomForm.value.clusterKey = generateRandomString(14)
    roomForm.value.modInOne = true
  }
})

const roomFormRef = ref()

const roomForm = ref({
  id: 0,
  gameName: '',
  description: '',
  gameMode: '',
  customGameMode: '',
  pvp: false,
  maxPlayer: 6,
  maxRollBack: 10,
  modInOne: false,
  modData: '',
  vote: false,
  pauseEmpty: true,
  password: '',
  token: '',
  masterIP: '127.0.0.1',
  masterPort: 0,
  clusterKey: '',
  lan: false,
  offline: false,
  steamGroupOnly: false,
  steamGroupID: '',
  steamGroupAdmins: false,
})

const roomFormRules = ref({
  gameName: [
    value => {
      if (value) return true

      return t('game.base.step1.gameName.required')
    },
  ],
  customGameMode: [
    value => {
      if (value) return true

      return t('game.base.step1.gameMode.modes.custom.required')
    },
  ],
  token: [
    value => {
      if (value) return true

      return t('game.base.step1.token.required')
    },
  ],
  masterIP: [
    value => {
      if (value) return true

      return t('game.base.step1.masterIP.required')
    },
  ],
  masterPort: [
    value => {
      if (value) return true

      return t('game.base.step1.masterPort.required')
    },
  ],
  clusterKey: [
    value => {
      if (value) return true

      return t('game.base.step1.clusterKey.required')
    },
  ],
})

const isPasswordVisible = ref(false)
const isTokenVisible = ref(false)
const isClusterKeyVisible = ref(false)

const handleAddToken = () => {
  roomForm.value.token = getDstToken()
}

const emojiGameName = ref(false) // 游戏名为true 游戏描述为false
const emojiInsertMode = ref(true) // 插入模式为true 复制模式为false
const emojiDialog = ref(false)
const emojiInputNameRef = ref()
const emojiInputDescriptionRef = ref()
const cursorPosition = ref(0)

const handleEmoji = e => {
  if (emojiInsertMode.value) {
    let input, currentValue
    if (emojiGameName.value) {
      input = emojiInputNameRef.value?.$el.querySelector('input')
      if (!input) return
      currentValue = roomForm.value.gameName
    } else {
      input = emojiInputDescriptionRef.value?.$el.querySelector('input')
      if (!input) return
      currentValue = roomForm.value.description
    }



    const startPos = input.selectionStart || cursorPosition.value
    const endPos = input.selectionEnd || cursorPosition.value

    // 更新值
    if (emojiGameName.value) {
      roomForm.value.gameName =
        currentValue.substring(0, startPos) +
        e +
        currentValue.substring(endPos)
    } else {
      roomForm.value.description =
        currentValue.substring(0, startPos) +
        e +
        currentValue.substring(endPos)
    }


    // 更新光标
    const newCursorPos = startPos + e.length

    cursorPosition.value = newCursorPos

    // 设置光标位置
    nextTick(() => {
      input.setSelectionRange(newCursorPos, newCursorPos)
      input.focus()
    })
  } else {
    copyToClipboard(e).then(() => {
      let message
      showSnackbar('复制成功')
      emojiDialog.value = false
    }).catch(() => {
      showSnackbar('复制失败', 'error')
    })
  }
}

function copyToClipboard(text, onSuccess, onError) {
  // 返回一个Promise以便可以使用await或.then()
  return new Promise((resolve, reject) => {
    // 检查是否支持navigator.clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      // 使用现代剪贴板API
      navigator.clipboard.writeText(text)
        .then(() => {
          if (typeof onSuccess === 'function') onSuccess(text)
          resolve(text)
        })
        .catch(err => {
          if (typeof onError === 'function') onError(err, text)
          reject(err)
        })
    } else {
      // 降级方案：使用document.execCommand
      try {
        // 创建一个临时的textarea元素
        const textarea = document.createElement('textarea')

        textarea.value = text
        textarea.style.position = 'fixed' // 防止页面滚动
        textarea.style.opacity = '0' // 隐藏元素

        // 将textarea添加到DOM中
        document.body.appendChild(textarea)

        // 选中文本
        textarea.select()

        // 执行复制命令
        const success = document.execCommand('copy')

        // 移除临时元素
        document.body.removeChild(textarea)

        if (success) {
          if (typeof onSuccess === 'function') onSuccess(text)
          resolve(text)
        } else {
          throw new Error('复制失败，execCommand返回false')
        }
      } catch (err) {
        if (typeof onError === 'function') onError(err, text)
        reject(err)
      }
    }
  })
}

const validate = async () => {
  const { valid } = await roomFormRef.value.validate()
  if (valid) {
    return {
      validate: true,
      formData: roomForm.value,
    }
  }
  
  return {
    validate: false,
    formData: {},
  }
}

defineExpose({
  validate,
})
</script>

<style scoped>
.layout-wrapper .v-row {
  margin-bottom: 1.25rem;
}

.emoji-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
  gap: 2rem;
  justify-content: center;
}

.emoji-item {
  font-size: 3rem;
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.emoji-item:hover {
  transform: scale(1.5); /* 放大1.5倍 */
}
</style>

