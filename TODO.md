# Playground 开发待办

## Phase 1 — 项目脚手架 ✅
- [x] 1.1 初始化 Vite + Vue + TypeScript 项目
- [x] 1.2 配置 UnoCSS + design tokens
- [x] 1.3 配置 ESLint + Prettier
- [x] 1.4 配置 Vitest
- [x] 1.5 配置 Vue Router
- [x] 1.6 搭建基础目录结构与空壳组件

## Phase 2 — 编辑器模块 ✅
- [x] 2.1 定义 EditorAdapter 接口与 SupportedLanguage 类型
- [x] 2.2 实现 useEditor composable
- [x] 2.3 实现 Monaco Editor 适配器
- [x] 2.4 实现 CodeMirror 6 适配器
- [x] 2.5 实现 EditorContainer（可切换编辑器）
- [x] 2.6 编写编辑器模块测试（15/15 通过）

## Phase 3 — 预览沙盒模块
- [ ] 3.1 实现 usePreview composable（各语言 HTML 生成）
- [ ] 3.2 实现 PreviewFrame 组件
- [ ] 3.3 编写预览模块测试

## Phase 4 — 布局模块
- [ ] 4.1 实现 useLayout composable
- [ ] 4.2 实现 SplitLayout 组件（水平/垂直）
- [ ] 4.3 实现 ResizeDivider 可拖拽分隔条
- [ ] 4.4 实现 LayoutToolbar 工具栏
- [ ] 4.5 编写布局模块测试

## Phase 5 — 集成与打磨
- [ ] 5.1 App.vue 整合所有模块
- [ ] 5.2 移动端响应式适配
- [ ] 5.3 错误处理与展示
- [ ] 5.4 localStorage 持久化（编辑器偏好、布局、分隔比例）
- [ ] 5.5 最终测试 & 清理
