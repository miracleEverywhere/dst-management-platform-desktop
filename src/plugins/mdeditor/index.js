import { config, XSSPlugin } from 'md-editor-v3'

// md-editor-v3 内部的 markdown-it 使用 html: true 渲染，且 MdPreview 的 sanitize 属性
// 默认是恒等函数（html => html），因此任何进入预览的不可信文本（日志、模组描述、后端返回内容）
// 中的原始 HTML 都会被直接写入 DOM，形成 XSS。
//
// 这里全局启用官方提供的 XSSPlugin，对 html_block / html_inline 做白名单过滤，
// 去掉 onerror 等事件属性与 script、javascript: 链接，作为日志渲染修复之外的兜底防护。
export default function () {
  config({
    markdownItPlugins: plugins => [...plugins, { type: 'xss', plugin: XSSPlugin, options: {} }],
  })
}
