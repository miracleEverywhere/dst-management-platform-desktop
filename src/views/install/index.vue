<template>
  <transition name="fade">
    <v-container
      v-if="!installing"
      fluid
    >
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-text>
              <div
                class="d-flex align-center justify-start"
                :style="{height: `${calculateContainerSize()-64}px`}"
              >
                <div class=" w-100">
                  <v-row>
                    <v-col
                      cols="12"
                      class="fcc"
                    >
                      <v-rating
                        v-model="rating"
                        :item-labels="ratingLabels"
                        density="default"
                        readonly
                      >
                        <template #item-label="props">
                          <span style="font-size: 0.66rem">
                            {{ t(`install.prepare.left.rating.${props.label}`) }}
                          </span>
                        </template>
                      </v-rating>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.Architecture') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.Architecture }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.CPUModel') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.CPUModel }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.CPUCores') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.CPUCores }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.MemorySize') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ formatBytes(osInfo.MemorySize) }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.OS') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.OS }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.Platform') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.Platform }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.PlatformVersion') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      {{ osInfo.PlatformVersion }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="6"
                      class="d-flex justify-end"
                    >
                      <v-chip>
                        {{ t('install.prepare.left.Uptime') }}
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex align-center"
                    >
                      <time-running :seconds="osInfo.Uptime" />
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-text>
              <result
                :height="calculateContainerSize()-64"
                type="info"
                :title="globalStore.gameVersion.local===0?t('install.prepare.right.title'):t('install.prepare.right.varTitle')"
                :sub-title="t('install.prepare.right.subTitle')"
              >
                <v-btn
                  v-if="globalStore.gameVersion.local===0"
                  color="info"
                  class="mt-4"
                  @click="handleInstall"
                >
                  {{ t('install.prepare.right.install') }}
                </v-btn>
                <v-btn
                  v-if="globalStore.gameVersion.local!==0"
                  color="warning"
                  class="mt-4"
                  @click="handleInstall"
                >
                  {{ t('install.prepare.right.reinstall') }}
                </v-btn>
                <v-btn
                  v-if="globalStore.gameVersion.local!==0"
                  color="primary"
                  class="mt-4"
                  @click="handleUpdate"
                >
                  {{ t('install.prepare.right.update') }}
                </v-btn>
              </result>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div v-else>
      <v-alert
        color="warning"
        density="compact"
        class="mt-2 mb-2"
      >
        {{ t('install.install.alert') }}
      </v-alert>
      <div
        ref="terminalEl"
        class="terminal"
        :style="{height: `${calculateContainerSize()-78}px`}"
      />
    </div>
  </transition>
  <confirm-box
    v-model="installSuccessDialog"
    type="success"
    :title="t('install.install.success')"
    :content="t('install.install.success')"
    :confirm-text="t('install.install.confirm')"
    :cancel-button="false"
    @confirm="reloadPage"
  />
  <confirm-box
    v-model="installErrorDialog"
    type="error"
    :title="t('install.install.fail')"
    :content="t('install.install.fail')"
    :confirm-text="t('install.install.confirm')"
    :cancel-button="false"
    @confirm="reloadPage"
  />
  <confirm-box
    v-model="updateSuccessDialog"
    type="success"
    :title="t('install.install.updateSuccess')"
    :content="t('install.install.updateSuccess')"
    :confirm-text="t('install.install.confirm')"
    :cancel-button="false"
    @confirm="reloadPage"
  />
  <confirm-box
    v-model="updateErrorDialog"
    type="error"
    :title="t('install.install.updateFail')"
    :content="t('install.install.updateFail')"
    :confirm-text="t('install.install.confirm')"
    :cancel-button="false"
    @confirm="reloadPage"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { formatBytes, getToken } from "@/utils/tools.js"
import useGlobalStore from "@store/global.js"
import platformApi from "@/api/platform.js"
import { sleep } from "@antfu/utils"
import { useI18n } from "vue-i18n"
import { showSnackbar } from "@/utils/snackbar.js"
import ElectronApi from "@/utils/electronApi";

// 响应式数据
const terminalContainer = ref(null)
const terminalEl = ref(null)
const term = ref(null)
const fitAddon = ref(null)
const ws = ref(null)
const connected = ref(false)
const customCommand = ref('')
const globalStore = useGlobalStore()
const { t } = useI18n()

// 添加状态跟踪
const terminalInitialized = ref(false)
const fitAddonLoaded = ref(false)

const theme = computed(() => globalStore.theme)

const installing = ref(false)

const osInfo = ref({
  Architecture: "",
  OS: "",
  CPUModel: "",
  CPUCores: 2,
  MemorySize: 0,
  Platform: "",
  PlatformVersion: "",
  Uptime: 0,
})

const getOSInfo = () => {
  platformApi.osInfo.get().then(response => {
    osInfo.value = response.data
  })
}

const rating = computed(() => {
  let r = 5

  if (osInfo.value.CPUCores < 4) {
    r--
  }

  if (osInfo.value.CPUCores < 2) {
    r--
  }

  if (osInfo.value.MemorySize < 1750000000 * 4) {
    r--
  }

  if (osInfo.value.MemorySize < 1750000000 * 2) {
    r--
  }

  if (osInfo.value.MemorySize < 1750000000) {
    r--
  }

  return r
})

const ratingLabels = ref(['hell', 'bad', 'ok', 'good', 'great'])

const handleInstall = async () => {
  showSnackbar(t('install.prepare.right.tip'))
  installing.value = true
  await initTerminal()
  await connectWebSocket()

  await sleep(2000)
  await sendCommand('bash manual_install.sh')
}

const handleUpdate = async () => {
  installing.value = true
  await initTerminal()
  await connectWebSocket()

  await sleep(2000)
  await sendCommand('bash manual_update.sh')
}

const windowHeight = ref(window.innerHeight)

// 初始化终端
const initTerminal = async () => {
  // 先清理现有的终端实例
  cleanupTerminal()

  term.value = new Terminal({
    cursorBlink: true,
    fontSize: 15,
    theme: {
      background: theme.value === 'dark' ? '#1e1e1e' : '#ffffff',
      foreground: theme.value === 'dark' ? '#ffffff' : '#1e1e1e',
      cursor: theme.value === 'dark' ? '#ffffff' : '#000000',
      cursorAccent: theme.value === 'dark' ? '#1e1e1e' : '#ffffff',
    },
    cols: 120,
    rows: 30,
    convertEol: true,
    disableStdin: false,
    cursorStyle: 'block',
    scrollback: 1000,
    tabStopWidth: 8,
    bellStyle: 'none',
  })

  fitAddon.value = new FitAddon()

  try {
    term.value.loadAddon(fitAddon.value)
    fitAddonLoaded.value = true
  } catch (error) {
    console.error('Failed to load fit addon:', error)
    fitAddonLoaded.value = false
  }

  await nextTick()

  if (terminalEl.value) {
    term.value.open(terminalEl.value)

    if (fitAddonLoaded.value) {
      try {
        fitAddon.value.fit()
      } catch (error) {
        console.warn('Fit addon fit failed:', error)
      }
    }

    terminalInitialized.value = true
  }

  // 添加窗口大小调整监听
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小调整
const handleResize = () => {
  windowHeight.value = window.innerHeight
  if (fitAddonLoaded.value && fitAddon.value) {
    try {
      fitAddon.value.fit()
      sendResizeMessage()
    } catch (error) {
      console.warn('Resize fit failed:', error)
    }
  }
}

const calculateContainerSize = () => {
  const other = 120

  return Math.max(2, Math.floor(windowHeight.value - other))
}

// 发送终端大小信息
const sendResizeMessage = () => {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return

  const dimensions = {
    cols: term.value.cols,
    rows: term.value.rows,
    type: 'resize',
  }

  ws.value.send(JSON.stringify(dimensions))
}

// 发送命令到终端
const sendCommand = command => {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
    console.error('WebSocket未连接')

    return
  }

  const commandToSend = command + '\r'

  ws.value.send(commandToSend)
}

const installSuccessDialog = ref(false)
const installErrorDialog = ref(false)
const updateSuccessDialog = ref(false)
const updateErrorDialog = ref(false)

const reloadPage = () => {
  ElectronApi.window.reload()
}

// 连接WebSocket
const connectWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const token = globalStore.entry.token
  const wsUrl = `${protocol}//${globalStore.entry.ip}:${globalStore.entry.port}/v3/platform/webssh?token=${token}`
  const regexSuccess = /==>dmp@@ 安装完成 @@dmp<==/
  const regexFail = /==>dmp@@ 安装失败 @@dmp<==/
  const regexUpdateSuccess = /==>dmp@@ 更新完成 @@dmp<==/
  const regexUpdateFail = /==>dmp@@ 更新失败 @@dmp<==/

  ws.value = new WebSocket(wsUrl)

  ws.value.onopen = () => {
    connected.value = true
    sendResizeMessage()
    if (term.value) {
      term.value.focus()
      term.value.write('\r\n\x1b[0m')
    }
  }

  ws.value.onmessage = event => {
    if (!term.value) return

    if (event.data instanceof Blob) {
      const reader = new FileReader()

      reader.onload = () => {
        term.value.write(reader.result)

        const str = reader.result || ''
        if (str.match(regexSuccess)) {
          installSuccessDialog.value = true
        }
        if (str.match(regexFail)) {
          installErrorDialog.value = true
        }
        if (str.match(regexUpdateSuccess)) {
          updateSuccessDialog.value = true
        }
        if (str.match(regexUpdateFail)) {
          updateErrorDialog.value = true
        }
      }
      reader.readAsText(event.data)
    } else {
      term.value.write(event.data)
    }
  }

  ws.value.onclose = event => {
    connected.value = false
    if (!term.value) return

    if (!event.wasClean) {
      term.value.write('\r\n\x1b[31m连接异常关闭，5秒后尝试重新连接...\x1b[0m\r\n')
      setTimeout(reconnect, 5000)
    } else {
      term.value.write('\r\n\x1b[33m连接已关闭\x1b[0m\r\n')
    }
  }

  ws.value.onerror = error => {
    console.error('WebSocket error:', error)
    connected.value = false
  }

  // 终端输入处理
  if (term.value) {
    term.value.onData(data => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(data)
      }
    })

    term.value.onBinary(data => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(data)
      }
    })
  }
}

// 重新连接
const reconnect = () => {
  cleanup()
  setTimeout(() => {
    connectWebSocket()
  }, 1000)
}

// 清理终端资源
const cleanupTerminal = () => {
  if (term.value) {
    try {
      // 先移除所有事件监听器
      term.value.dispose()
    } catch (error) {
      console.warn('Error disposing terminal:', error)
    }
    term.value = null
  }

  fitAddon.value = null
  fitAddonLoaded.value = false
  terminalInitialized.value = false
}

// 清理所有资源
const cleanup = () => {
  if (ws.value) {
    ws.value.close()
    ws.value = null
  }

  cleanupTerminal()
  window.removeEventListener('resize', handleResize)
}

// 生命周期
onMounted(async () => {
  window.addEventListener('resize', handleResize)
  getOSInfo()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cleanup()
})
</script>

<style scoped>
.terminal {
  width: 100%;
}

:deep(.xterm) * {
  letter-spacing: normal !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
