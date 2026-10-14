<template>
  <md-preview
    :model-value="previewValue"
    :theme="editorTheme"
    :language="editorLanguage"
    preview-theme="github"
    class="mdp"
    :style="{'overflow-y': 'auto','height':props.height+'px'}"
  />
</template>

<script setup>
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import useGlobalStore from "@store/global.js"
import { getEditorLang } from "@/utils/tools.js"


const props = defineProps({
  content: {
    type: String,
    default: "",
  },
  height: {
    type: Number,
    default: 800,
  },
})

const globalStore = useGlobalStore()
const editorTheme = computed(() => globalStore.theme)
const editorLanguage = computed(() => getEditorLang(globalStore.language))

// 日志内容是不可信数据（例如访问日志会记录请求路径，攻击者可注入换行与 Markdown 语法）。
// 使用「比内容中最长反引号串更长」的围栏包裹日志，保证内容无法提前闭合代码块，
// 否则围栏之后的日志内容会被 md-editor-v3 当作 Markdown/HTML 解析，形成 XSS。
const previewValue = computed(() => {
  const backtickRuns = props.content.match(/`+/g) || []
  const longestRun = backtickRuns.reduce((max, run) => Math.max(max, run.length), 0)
  const fence = '`'.repeat(Math.max(3, longestRun + 1))

  return `${fence}text ::open\n${props.content}\n${fence}`
})
</script>

<style scoped>
.mdp :deep(.md-editor-preview .md-editor-code) {
  margin: 0 !important;
}
</style>