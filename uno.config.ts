import { defineConfig, presetWind, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetWind(),
    presetTypography(),
  ],
  theme: {
    colors: {
      // Design tokens — 基于 Radix Colors 风格的语义化色彩
      surface: {
        DEFAULT: '#ffffff',
        subtle: '#f9fafb',
        inset: '#f3f4f6',
        overlay: '#1f2937',
      },
      border: {
        DEFAULT: '#e5e7eb',
        strong: '#d1d5db',
      },
      text: {
        primary: '#111827',
        secondary: '#6b7280',
        disabled: '#9ca3af',
        inverse: '#ffffff',
      },
      accent: {
        DEFAULT: '#6366f1',
        hover: '#4f46e5',
        subtle: '#eef2ff',
        foreground: '#ffffff',
      },
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      // Editor 专用色彩
      editor: {
        bg: '#1e1e1e',
        gutter: '#252526',
        line: '#2d2d30',
        selection: '#264f78',
        cursor: '#aeafad',
      },
    },
    fontFamily: {
      mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    },
  },
  shortcuts: {
    'btn': 'inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
    'btn-primary': 'btn bg-accent text-accent-foreground hover:bg-accent-hover',
    'btn-ghost': 'btn hover:bg-surface-inset text-text-secondary',
    'panel': 'bg-surface border border-border rounded-lg',
    'toolbar': 'flex items-center gap-2 px-3 py-2 bg-surface-subtle border-b border-border',
  },
})
