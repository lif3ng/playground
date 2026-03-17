# 01 — 整体架构设计

## 核心概念

应用分为三个核心区域：

1. **编辑区（Editor Panel）** — 代码输入，支持多编辑器、多文件、语法高亮
2. **预览区（Preview Panel）** — iframe 沙盒，实时渲染代码运行结果
3. **工具栏（Toolbar）** — 编辑器切换、布局切换、文件类型选择等控制项

## 数据流

```
用户输入代码
    ↓
编辑器组件（Monaco / CodeMirror）
    ↓
useEditor composable（持有代码状态）
    ↓
usePreview composable（监听代码变化，生成可执行 HTML）
    ↓
PreviewFrame（通过 srcdoc 注入 iframe）
    ↓
实时渲染结果
```

## 编辑器插件架构

所有编辑器统一实现以下接口，通过适配器模式接入 `EditorContainer`：

```typescript
interface EditorAdapter {
  // 当前编辑器类型
  type: 'monaco' | 'codemirror'
  // 获取当前代码
  getValue(): string
  // 设置代码
  setValue(code: string): void
  // 设置语言（触发高亮切换）
  setLanguage(lang: SupportedLanguage): void
  // 销毁实例（切换编辑器时调用）
  dispose(): void
}
```

## 支持的语言类型

```typescript
type SupportedLanguage = 'html' | 'css' | 'javascript' | 'typescript' | 'vue'
```

文件扩展名与语言映射：

| 扩展名 | 语言 |
|--------|------|
| `.html` | html |
| `.css` | css |
| `.js` | javascript |
| `.ts` | typescript |
| `.vue` | vue |

## 状态管理

采用 Vue Composition API + `provide/inject` 替代 Pinia，按模块划分：

| Composable | 职责 |
|-----------|------|
| `useEditor` | 当前编辑器类型、代码内容、语言类型 |
| `usePreview` | 预览 HTML 生成、刷新控制 |
| `useLayout` | 当前布局模式（左右 / 上下）|

所有 composable 在 `App.vue` 层初始化，通过 `provide` 向下传递。

## 性能考量

- 预览刷新使用 **debounce**（默认 300ms），避免频繁重绘
- Monaco Editor 按需加载（动态 import），减小首屏体积
- CodeMirror 扩展按语言懒加载
