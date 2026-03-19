import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'playground:theme'

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch {
    // ignore
  }
  // 默认跟随系统
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function useTheme() {
  const theme = ref<Theme>(loadTheme())

  const isDark = () => theme.value === 'dark'

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  // 应用主题到 DOM
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
    // 同步更新 Monaco 编辑器主题
    document.documentElement.style.colorScheme = theme.value
  }

  // 初始化应用主题
  applyTheme()

  // 监听主题变化
  watch(theme, () => {
    applyTheme()
    localStorage.setItem(STORAGE_KEY, theme.value)
  })

  // 监听系统主题变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // 如果用户没有手动设置过主题，跟随系统
      if (!localStorage.getItem(STORAGE_KEY)) {
        theme.value = e.matches ? 'dark' : 'light'
      }
    })
  }

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  }
}
