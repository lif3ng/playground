import { ref } from 'vue'
import type { SupportedLanguage } from './useEditor'

export interface FormatResult {
  success: boolean
  code?: string
  error?: string
}

const LANGUAGE_TO_PARSER: Partial<Record<SupportedLanguage, string>> = {
  html: 'html',
  css: 'css',
  javascript: 'babel',
  typescript: 'babel-ts',
  vue: 'vue',
}

// 动态导入 prettier 插件
async function loadPrettier() {
  const [
    { format },
    { default: htmlPlugin },
    { default: cssPlugin },
    { default: babelPlugin },
    { default: estreePlugin },
  ] = await Promise.all([
    import('prettier/standalone'),
    import('prettier/plugins/html'),
    import('prettier/plugins/postcss'),
    import('prettier/plugins/babel'),
    import('prettier/plugins/estree'),
  ])

  return { format, htmlPlugin, cssPlugin, babelPlugin, estreePlugin }
}

export function useFormat() {
  const isFormatting = ref(false)
  const formatError = ref<string | null>(null)

  async function formatCode(code: string, language: SupportedLanguage): Promise<FormatResult> {
    const parser = LANGUAGE_TO_PARSER[language]
    if (!parser) {
      return {
        success: false,
        error: `不支持格式化 ${language} 语言`,
      }
    }

    isFormatting.value = true
    formatError.value = null

    try {
      const { format, htmlPlugin, cssPlugin, babelPlugin, estreePlugin } = await loadPrettier()

      const plugins = getPluginsForLanguage(language, {
        htmlPlugin,
        cssPlugin,
        babelPlugin,
        estreePlugin,
      })

      const formatted = await format(code, {
        parser,
        plugins,
        // 格式化配置
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        arrowParens: 'always',
        htmlWhitespaceSensitivity: 'css',
        vueIndentScriptAndStyle: false,
      })

      return {
        success: true,
        code: formatted,
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : '格式化失败'
      formatError.value = error
      return {
        success: false,
        error,
      }
    } finally {
      isFormatting.value = false
    }
  }

  function getPluginsForLanguage(
    language: SupportedLanguage,
    plugins: {
      htmlPlugin: any
      cssPlugin: any
      babelPlugin: any
      estreePlugin: any
    }
  ) {
    switch (language) {
      case 'html':
        return [plugins.htmlPlugin]
      case 'css':
        return [plugins.cssPlugin]
      case 'javascript':
      case 'typescript':
        return [plugins.babelPlugin, plugins.estreePlugin]
      case 'vue':
        // Vue 需要额外的插件，暂时回退到 HTML
        return [plugins.htmlPlugin]
      default:
        return []
    }
  }

  return {
    isFormatting,
    formatError,
    formatCode,
  }
}
