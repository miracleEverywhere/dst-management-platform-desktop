<!--
  * @Descripttion: 代码编辑器
  * @version: 1.0
  * @Author: sakuya
  * @Date: 2022年5月20日21:46:29
  * @LastEditors:
  * @LastEditTime:
-->

<template>
  <div
    class="sc-code-editor"
    :style="{'height':_height}"
  >
    <textarea
      ref="textarea"
      v-model="contentValue"
    />
  </div>
</template>

<script>
import { markRaw } from "vue"

//框架
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

//主题
import 'codemirror/theme/idea.css'
import 'codemirror/theme/lucario.css'

//功能
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/display/autorefresh'

//语言
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/lua/lua'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/python/python.js'

export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "javascript",
    },
    height: {
      type: [String, Number],
      default: 300,
    },
    options: {
      type: Object,
      default: () => {},
    },
    theme: {
      type: String,
      default: "idea",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      contentValue: this.modelValue,
      coder: null,
      opt: {
        autoRefresh: true,
        theme: this.theme,	//主题
        styleActiveLine: true,	//高亮当前行
        lineNumbers: true,	//行号
        lineWrapping: false,	//自动换行
        tabSize: 2,	//Tab缩进
        indentUnit: 2,	//缩进单位
        indentWithTabs: true,	//自动缩进
        mode: this.mode,	//语言
        readOnly: this.readOnly,	//只读
        ...this.options,
      },
    }
  },
  computed: {
    _height() {
      return Number(this.height)?Number(this.height)+'px':this.height
    },
  },
  watch: {
    modelValue(val) {
      this.contentValue = val
      if (val !== this.coder.getValue()) {
        this.coder.setValue(val)
      }
    },
    theme(val) {
      this.toggleTheme(val)
    },
  },
  mounted() {
    this.init()

    //获取挂载的所有modes
    //console.log(CodeMirror.modes)
  },
  methods: {
    init(){
      this.coder = markRaw(CodeMirror.fromTextArea(this.$refs.textarea, this.opt))
      this.coder.on('change', coder => {
        this.contentValue = coder.getValue()
        this.$emit('update:modelValue', this.contentValue)
      })
    },
    formatStrInJson(strValue) {
      return JSON.stringify(JSON.parse(strValue), null, 4)
    },
    toggleTheme(theme) {
      // 切换主题
      this.coder.setOption("theme", theme)
    },
    refresh() {
      this.coder.refresh()
    },
  },
}
</script>

<style scoped>
.sc-code-editor {font-size: 14px;border: 1px solid #ddd;line-height: 150%;}
.sc-code-editor:deep(.CodeMirror)  {height: 100%;}
</style>
