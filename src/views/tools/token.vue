<template>
  <v-card :height="calculateContainerSize()">
    <v-card-title>
      <div class="card-header">
        <span>
          {{ t('tools.token.title') }}
        </span>
      </div>
    </v-card-title>
    <v-card-text class="mx-2">
      <v-row class="mt-4">
        <v-alert
          color="warning"
          density="compact"
        >
          {{ t('tools.token.tip') }}
        </v-alert>
      </v-row>

      <v-row
        v-if="token===''"
        class="mt-8 d-flex align-center"
      >
        <v-select
          v-model="reqForm.expiration"
          :label="t('tools.token.select.label')"
          :items="items"
        />
        <v-btn
          size="large"
          class="ml-4"
          @click="handleCreate"
        >
          {{ t('tools.token.create') }}
        </v-btn>
      </v-row>

      <v-row
        v-else
        class="mt-8"
      >
        <v-text-field v-model="token">
          <template #append-inner>
            <v-btn
              v-copy="token"
              variant="text"
              icon="ri-file-copy-line"
            />
          </template>
        </v-text-field>
      </v-row>

      <v-row class="mt-8">
        <md-preview
          :model-value="requestShow"
          :theme="editorTheme"
          :language="editorLanguage"
          preview-theme="github"
          class="mdp"
          :style="{'overflow-y': 'auto','height':(calculateContainerSize()-220)+'px'}"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { debounce, getEditorLang } from "@/utils/tools.js"
import useGlobalStore from "@store/global.js"
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { showSnackbar } from "@/utils/snackbar.js"
import toolsApi from "@/api/tools.js"

const { t } = useI18n()
const globalStore = useGlobalStore()

const editorTheme = computed(() => globalStore.theme)
const editorLanguage = computed(() => getEditorLang(globalStore.language))

const reqForm = ref({
  expiration: undefined,
})

const items = [
  {
    title: t('tools.token.select.day'),
    value: 24,
  },
  {
    title: t('tools.token.select.week'),
    value: 7 * 24,
  },
  {
    title: t('tools.token.select.month'),
    value: 30 * 24,
  },
  {
    title: t('tools.token.select.year'),
    value: 365 * 24,
  },
  {
    title: t('tools.token.select.permanent'),
    value: 0,
  },
]

const creteLoading = ref(false)
const token = ref('')

const handleCreate = () => {
  if (reqForm.value.expiration === undefined) {
    showSnackbar(t('tools.token.noSelected'), 'error')
    
    return
  }

  toolsApi.token.post(reqForm.value).then(response => {
    token.value = response.data
    reqForm.value.expiration = undefined
    showSnackbar(response.message, 'success')
  })
}

const requestPython = ref('```python [id:Python]\n' +
  'import requests\n' +
  '\n' +
  'url = "http://{ip}:{port}"\n' +
  'token = "your token"\n' +
  '# 中文\n' +
  'lang = "zh"\n' +
  '# English\n' +
  '# lang = "en"\n' +
  '\n' +
  'payload = {}\n' +
  'headers = {\n' +
  '    \'X-DMP-TOKEN\': token,\n' +
  '    \'X-I18n-Lang\': lang\n' +
  '}\n' +
  '\n' +
  'response = requests.request("GET", url, headers=headers, data=payload)\n' +
  '\n' +
  'print(response.text)\n' +
  '```')

const requestGolang = ref('```golang [id:Golang]\n' +
  'package main\n' +
  '\n' +
  'import (\n' +
  '  "fmt"\n' +
  '  "net/http"\n' +
  '  "io"\n' +
  ')\n' +
  '\n' +
  'func main() {\n' +
  '  token := "your token"\n' +
  '  url := "http://{ip}:{port}"\n' +
  '  method := "GET"\n' +
  '  //中文\n' +
  '  lang := "zh"\n' +
  '  //English\n' +
  '  //lang := "en"\n' +
  '\n' +
  '  client := &http.Client{}\n' +
  '  req, err := http.NewRequest(method, url, nil)\n' +
  '\n' +
  '  if err != nil {\n' +
  '    fmt.Println(err)\n' +
  '    return\n' +
  '  }\n' +
  '  req.Header.Add("X-DMP-TOKEN", token)\n' +
  '  req.Header.Add("X-I18n-Lang", lang)\n' +
  '\n' +
  '  res, err := client.Do(req)\n' +
  '  if err != nil {\n' +
  '    fmt.Println(err)\n' +
  '    return\n' +
  '  }\n' +
  '  defer res.Body.Close()\n' +
  '\n' +
  '  body, err := io.ReadAll(res.Body)\n' +
  '  if err != nil {\n' +
  '    fmt.Println(err)\n' +
  '    return\n' +
  '  }\n' +
  '  fmt.Println(string(body))\n' +
  '}\n' +
  '```')

const requestJava = ref('```java [id:Java]\n' +
  'import java.io.BufferedReader;\n' +
  'import java.io.InputStreamReader;\n' +
  'import java.net.HttpURLConnection;\n' +
  'import java.net.URL;\n' +
  '\n' +
  'public class Main {\n' +
  '    public static void main(String[] args) {\n' +
  '        try {\n' +
  '            // 定义请求的 URL\n' +
  '            String url = "http://{ip}:{port}";\n' +
  '            // 定义 token 和语言\n' +
  '            String token = "your token";\n' +
  '            String lang = "zh"; // 中文\n' +
  '            // String lang = "en"; // English\n' +
  '\n' +
  '            // 创建 URL 对象\n' +
  '            URL apiUrl = new URL(url);\n' +
  '            // 打开连接\n' +
  '            HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();\n' +
  '            // 设置请求方法\n' +
  '            connection.setRequestMethod("GET");\n' +
  '            // 添加请求头\n' +
  '            connection.setRequestProperty("X-DMP-TOKEN", token);\n' +
  '            connection.setRequestProperty("X-I18n-Lang", lang);\n' +
  '\n' +
  '            // 获取响应码\n' +
  '            int responseCode = connection.getResponseCode();\n' +
  '            System.out.println("Response Code: " + responseCode);\n' +
  '\n' +
  '            // 读取响应内容\n' +
  '            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));\n' +
  '            String inputLine;\n' +
  '            StringBuilder response = new StringBuilder();\n' +
  '\n' +
  '            while ((inputLine = in.readLine()) != null) {\n' +
  '                response.append(inputLine);\n' +
  '            }\n' +
  '            in.close();\n' +
  '\n' +
  '            // 打印响应内容\n' +
  '            System.out.println("Response Body: " + response.toString());\n' +
  '        } catch (Exception e) {\n' +
  '            e.printStackTrace();\n' +
  '        }\n' +
  '    }\n' +
  '}\n' +
  '```')

const requestCurl = ref('```bash [id:cURL]\n' +
  'curl --location --globoff \'http://{ip}:{port}\' \\\n' +
  '--header \'X-DMP-TOKEN: token\' \\\n' +
  '--header \'X-I18n-Lang: lang\'\n' +
  '```')

const requestPowerShell = ref('```powershell [id:PowerShell]\n'+
  '$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"\n' +
  '$headers.Add("X-DMP-TOKEN", "token")\n' +
  '$headers.Add("X-I18n-Lang", "lang")\n' +
  '\n' +
  '$response = Invoke-RestMethod \'http://{ip}:{port}\' -Method \'GET\' -Headers $headers\n' +
  '$response | ConvertTo-JSON\n' +
  '```')

const requestShow = requestPython.value + '\n\n' +
  requestGolang.value + '\n\n' +
  requestJava.value + '\n\n' +
  requestCurl.value + '\n\n' +
  requestPowerShell.value

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

onMounted(async () => {
  // 添加事件监听
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.mdp :deep(.md-editor-preview .md-editor-code) {
  margin: 0 !important;
}
</style>
