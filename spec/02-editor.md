# 02 — 编辑器模块设计

## 支持的编辑器

| 编辑器 | npm 包 | 特点 |
|--------|--------|------|
| Monaco Editor | `monaco-editor` + `@monaco-editor/loader` | VSCode 同款，IntelliSense、多光标、代码折叠 |
| CodeMirror 6 | `@codemirror/...` | 轻量，高度可扩展，移动端友好 |

## 编辑器切换

- 工具栏提供编辑器选择下拉菜单（Monaco / CodeMirror）
- 切换时：
  1. 保存当前编辑器的代码内容
  2. 销毁当前编辑器实例（`dispose()`）
  3. 实例化新编辑器，恢复代码内容和语言
  4. 切换偏好持久化到 `localStorage`

## 语法高亮方案

### Monaco Editor 高亮

Monaco 内置语言高亮，通过 `setModelLanguage` 切换：

| 语言 | Monaco language ID |
|------|-----------------|
| HTML | `html` |
| CSS | `css` |
| JavaScript | `javascript` |
| TypeScript | `typescript` |
| Vue SFC | `html`（暂用）+ 自定义 token |

### CodeMirror 6 高亮

按语言按需加载扩展包：

| 语言 | 扩展包 |
|------|---------|
| HTML | `@codemirror/lang-html` |
| CSS | `@codemirror/lang-css` |
| JavaScript | `@codemirror/lang-javascript` |
| TypeScript | `@codemirror/lang-javascript`（typescript: true）|
| Vue | `@codemirror/lang-vue` 或 `@vue/codemirror-plugin` |

### 语言自动检测

根据当前编辑文件的扩展名或用户手动选择的语言类型，自动应用对应高亮方案。

## 编辑器功能要求

### 通用功能（两种编辑器均需支持）

- [x] 语法高亮
- [x] 行号显示
- [x] 自动缩进
- [x] 括号匹配
- [x] 代码折叠
- [x] 主题（默认亮色，可选暗色）

### Monaco 专属功能

- [x] 智能补全（IntelliSense）
- [x] 错误提示（红色波浪线）
- [x] 多光标编辑
- [x] 代码格式化（Shift+Alt+F）

### CodeMirror 专属功能

- [x] 轻量快速加载
- [x] 自定义扩展灵活

## 组件接口

```vue
<!-- EditorContainer.vue -->
<EditorContainer
  :editor-type="currentEditor"   <!-- 'monaco' | 'codemirror' -->
  :language="currentLanguage"    <!-- SupportedLanguage -->
  :model-value="code"            <!-- 代码字符串 -->
  @update:model-value="onCodeChange"
/>
```

## 测试要求

- [ ] 单元测试：`useEditor` composable 状态变化
- [ ] 单元测试：编辑器切换时代码内容保留
- [ ] 单元测试：语言切换时高亮方案映射正确
- [ ] 组件测试：`EditorContainer` 渲染正确的编辑器组件
