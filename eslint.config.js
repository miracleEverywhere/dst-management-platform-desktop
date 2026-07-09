import pluginVue from 'eslint-plugin-vue'
import importX from 'eslint-plugin-import-x'
import pluginPromise from 'eslint-plugin-promise'
import pluginSonarjs from 'eslint-plugin-sonarjs'
import pluginRegexp from 'eslint-plugin-regexp'
import stylistic from '@stylistic/eslint-plugin'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import globals from 'globals'
import autoImportGlobals from './.eslintrc-auto-import.json' with { type: 'json' }

// Convert auto-import globals from { "name": true } to { "name": "writable" }
const autoGlobals = Object.fromEntries(
  Object.entries(autoImportGlobals.globals).map(([key, value]) => [key, value ? 'writable' : 'readonly']),
)

// Local rules to replace eslint-plugin-regex (which does not support flat config)
const localRules = {
  rules: {
    'restrict-patterns': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Restrict patterns in source code content',
        },
        schema: [{
          type: 'object',
          properties: {
            patterns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  regex: { type: 'string' },
                  message: { type: 'string' },
                  replacement: { type: 'string' },
                  files: { type: 'string' },
                },
                required: ['regex', 'message'],
              },
            },
          },
        }],
      },
      create(context, options) {
        const { patterns = [] } = options || {}
        const filename = context.filename

        const applicablePatterns = patterns.filter(p => {
          if (!p.files) return true

          return new RegExp(p.files).test(filename)
        })

        if (applicablePatterns.length === 0) return {}

        const sourceCode = context.sourceCode
        const text = sourceCode.getText()

        for (const pattern of applicablePatterns) {
          const regex = new RegExp(pattern.regex, 'g')
          let match
          while ((match = regex.exec(text)) !== null) {
            const loc = sourceCode.getLocFromIndex(match.index)

            context.report({
              loc,
              message: pattern.replacement
                ? `${pattern.message} Use '${pattern.replacement}' instead.`
                : pattern.message,
            })
          }
        }

        return {}
      },
    },
  },
}

export default [
  // Global ignores
  {
    ignores: [
      'src/plugins/iconify/*.js',
      'node_modules/',
      'dist/',
      '**/*.d.ts',
      'vendor/',
      '**/*.json',
    ],
  },

  // Plugin presets
  ...pluginVue.configs['flat/recommended'],
  importX.flatConfigs.recommended,
  pluginPromise.configs['flat/recommended'],
  pluginSonarjs.configs.recommended,
  pluginRegexp.configs['flat/recommended'],

  // Main custom config
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...autoGlobals,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      local: localRules,
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // Stylistic rules (migrated from deprecated ESLint core rules to @stylistic)
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/key-spacing': ['error', { afterColon: true }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],

      // newline-before-return replaced by padding-line-between-statements below
      '@stylistic/lines-around-comment': [
        'error',
        {
          beforeBlockComment: false,
          beforeLineComment: true,
          allowBlockStart: true,
          allowClassStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
          ignorePattern: '!SECTION',
        },
      ],
      '@stylistic/array-element-newline': ['error', 'consistent'],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: 'expression', next: 'const' },
        { blankLine: 'always', prev: 'const', next: 'expression' },
        { blankLine: 'always', prev: 'multiline-const', next: '*' },
        { blankLine: 'always', prev: '*', next: 'multiline-const' },
      ],

      // camelCase naming convention
      'camelcase': 'error',

      // Vue rules
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'beside',
        multiline: 'below',
      }],
      'vue/multi-word-component-names': 'off',
      'vue/block-tag-newline': 'error',
      'vue/component-api-style': 'off',
      'vue/component-name-in-template-casing': ['error', 'kebab-case', { registeredComponentsOnly: false, ignores: ['/^swiper-/'] }],
      'vue/custom-event-name-casing': ['error', 'camelCase', {
        ignores: [
          '/^(click):[a-z]+((\\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?/',
        ],
      }],
      'vue/define-macros-order': 'error',
      'vue/html-comment-content-newline': 'error',
      'vue/html-comment-content-spacing': 'error',
      'vue/html-comment-indent': 'error',
      'vue/match-component-file-name': 'error',
      'vue/no-child-content': 'error',
      'vue/require-default-prop': 'off',
      'vue/no-required-prop-with-default': 'off',
      'vue/no-duplicate-attr-inheritance': 'error',
      'vue/no-empty-component-block': 'error',
      'vue/no-multiple-objects-in-class': 'error',
      'vue/no-reserved-component-names': 'error',
      'vue/no-template-target-blank': 'off',
      'vue/no-useless-mustaches': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/padding-line-between-blocks': 'error',
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-true-attribute-shorthand': 'off',

      // 'vue/v-on-function-call' removed in eslint-plugin-vue v10, use vue/v-on-handler-style instead
      'vue/no-use-v-if-with-v-for': 'off',
      'vue/valid-v-for': 'off',
      'vue/require-v-for-key': 'off',
      'vue/valid-v-slot': ['error', {
        allowModifiers: true,
      }],
      'vue/no-irregular-whitespace': 'error',
      'vue/template-curly-spacing': 'error',

      // Import-x rules (migrated from eslint-plugin-import)
      'import-x/prefer-default-export': 'off',
      'import-x/newline-after-import': ['error', { count: 1 }],
      'import-x/extensions': 'off',
      'import-x/no-unresolved': 'off',

      // Restricted imports
      'no-restricted-imports': ['error', 'vuetify/components', {
        name: 'vue3-apexcharts',
        message: 'apexcharts are auto imported',
      }],

      // no-shadow
      'no-shadow': 'off',

      // Promise rules
      'promise/always-return': 'off',
      'promise/catch-or-return': 'off',

      // Sonarjs rules
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-nested-template-literals': 'off',
      'sonarjs/todo-tag': 'off',
      'sonarjs/unused-import': 'off',
      'sonarjs/no-all-duplicated-branches': 'off',
      'sonarjs/no-duplicated-branches': 'off',
      'sonarjs/prefer-single-boolean-return': 'off',
      'sonarjs/pseudo-random': 'off',
      'sonarjs/anchor-precedence': 'off',
      'sonarjs/slow-regex': 'off',
      'sonarjs/regex-complexity': 'off',
      'sonarjs/no-dead-store': 'off',
      'sonarjs/no-redundant-assignments': 'off',
      'sonarjs/no-ignored-exceptions': 'off',

      // Local pattern restriction rules (replaces eslint-plugin-regex)
      'local/restrict-patterns': ['error', {
        patterns: [
          {
            regex: '@/assets/images',
            message: "Use '@images' path alias for image imports",
            replacement: '@images',
          },
          {
            regex: '@/plugins/store',
            message: "Use '@store' path alias for store imports",
            replacement: '@store',
          },
          {
            regex: '@/assets/styles',
            message: "Use '@styles' path alias for importing styles from 'src/assets/styles'",
            replacement: '@styles',
          },
          {
            regex: 'tabler-\\w',
            message: "Only 'mdi' icons are allowed",
          },
          {
            regex: '@core/\\w',
            message: "You can't use @core when you are in @layouts module",
            files: '@layouts/.*',
          },
          {
            regex: 'useLayouts\\(',
            message: '`useLayouts` composable is only allowed in @layouts & @core directory. Please use `useThemeConfig` composable instead.',
            files: '^(?!.*(@core|@layouts)).*',
          },
        ],
      }],
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: ['./jsconfig.json'],
        }),
      ],
    },
  },

  // DST game config files use snake_case identifiers
  // DST游戏配置文件中使用snake_case命名，忽略camelcase
  {
    files: [
      'src/views/game/components/base/levelDataMap.js',
      'src/views/game/components/mod/setting.vue',
    ],
    rules: {
      camelcase: 'off',
    },
  },

]
