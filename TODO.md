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

## Phase 3 — 预览沙盒模块 ✅
- [x] 3.1 实现 usePreview composable（各语言 HTML 生成）
- [x] 3.2 实现 PreviewFrame 组件（postMessage console + 错误展示 + 刷新）
- [x] 3.3 编写预览模块测试（22/22 通过）

## Phase 4 — 布局模块 ✅
- [x] 4.1 实现 useLayout composable（含移动端默认垂直布局）
- [x] 4.2 实现 SplitLayout 组件（水平/垂直）
- [x] 4.3 实现 ResizeDivider 可拖拽分隔条（含 touch 支持）
- [x] 4.4 实现 LayoutToolbar 工具栏（移动端响应式折叠）
- [x] 4.5 编写布局模块测试（14/14 通过）

## Phase 5 — 集成与打磨 ✅
- [x] 5.1 App.vue 整合所有模块
- [x] 5.2 移动端响应式适配（LayoutToolbar 折叠 + 默认垂直布局 + viewport meta）
- [x] 5.3 错误处理与展示（PreviewFrame 内嵌）
- [x] 5.4 localStorage 持久化（编辑器偏好、布局方向、分隔比例）
- [x] 5.5 最终测试 & 清理（36/36 通过）

## Phase 6 — 响应式预览模式 ✅
- [x] 6.1 实现 useResponsive composable（设备预设 + 持久化）
- [x] 6.2 实现 DeviceSelector 组件（设备选择 + 横竖屏切换）
- [x] 6.3 更新 PreviewFrame 支持响应式尺寸
- [x] 6.4 更新 LayoutToolbar 集成设备选择器
- [x] 6.5 更新 PlaygroundView 连接所有状态
- [x] 6.6 测试通过（50/50）

## Phase 7 — URL 分享功能 ✅
- [x] 7.1 实现 useShare composable（代码压缩 + URL 编码）
- [x] 7.2 添加分享按钮到 LayoutToolbar
- [x] 7.3 支持从 URL hash 恢复代码
- [x] 7.4 复制分享链接到剪贴板
- [x] 7.5 测试 URL 分享功能

## Phase 8 — 格式化功能 ✅
- [x] 8.1 集成 Prettier（HTML/CSS/JS/TS）
- [x] 8.2 添加格式化按钮到 LayoutToolbar
- [x] 8.3 格式化当前文件
- [x] 8.4 测试格式化功能

## Phase 9 — 主题切换 ✅
- [x] 9.1 实现明暗主题切换
- [x] 9.2 CSS 变量主题系统
- [x] 9.3 持久化主题偏好
- [x] 9.4 测试主题切换

## Phase 10 — 优化与发布
- [ ] 10.1 性能优化（代码分割、懒加载）
- [ ] 10.2 SEO 优化（meta 标签）
- [ ] 10.3 部署配置
- [ ] 10.4 最终测试
