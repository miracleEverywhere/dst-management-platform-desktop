import DOMPurify from 'dompurify'

// 允许出现在描述类富文本里的标签：只保留 bbcode 解析器可能产出的排版标签。
// script / iframe / style / form / input 等一律不在白名单内。
const ALLOWED_TAGS = [
  'a',
  'b',
  'br',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'span',
  'strong',
  'u',
  'ul',
]

// 允许的属性：事件属性（onerror、onclick 等）不在白名单内，会被直接剔除。
const ALLOWED_ATTR = ['alt', 'href', 'src', 'style', 'title']

// [color=...] / [size=...] 会生成 style 属性。DOMPurify 默认不限制 CSS，
// 而 background-image:url(...) 之类会让浏览器向外部发起请求（可用于追踪管理员 IP），
// 因此这里只保留无副作用的纯色/字号类内联样式。
const ALLOWED_STYLE_PROPS = [
  'background-color', 'color', 'font-size', 'font-style', 'font-weight', 'text-align', 'text-decoration',
]

const DANGEROUS_STYLE_VALUE = /(?:url|expression|image-set|element|var|attr)\s*\(/i

DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (data.attrName !== 'style') return

  data.attrValue = String(data.attrValue)
    .split(';')
    .map(declaration => declaration.trim())
    .filter(Boolean)
    .filter(declaration => {
      const separator = declaration.indexOf(':')
      if (separator === -1) return false

      const property = declaration.slice(0, separator).trim().toLowerCase()
      const value = declaration.slice(separator + 1).trim()

      return ALLOWED_STYLE_PROPS.includes(property) && !DANGEROUS_STYLE_VALUE.test(value)
    })
    .join('; ')
})

/**
 * 净化不可信 HTML，供 v-html 渲染使用。
 *
 * DOMPurify 会额外处理属性值里的危险内容：
 * - href / src 中的 javascript:、data:text/html 等协议会被移除；
 * - 配合上面的 hook，style 中只保留安全的内联样式声明。
 *
 * @param {String} html 不可信的 HTML 字符串
 * @returns {String} 净化后的 HTML
 */
export const sanitizeHtml = html => DOMPurify.sanitize(html ?? '', {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
})
