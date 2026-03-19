# 05 — 优秀 Playground 调研报告

> 调研时间：2026-03-19
> 调研对象：Tailwind Play、UnoCSS Playground、Vue SFC Playground

---

## 1. Tailwind CSS Play

**地址：** https://play.tailwindcss.com/

### 1.1 UI 布局和交互设计

- **布局模式：** 支持三种布局
  - 左右分栏（默认）
  - 上下分栏
  - 仅预览模式
- **布局切换：** 顶部工具栏按钮，图标清晰
- **响应式设计模式：** 一键切换，支持多种设备尺寸预览
- **配色：** 简洁的暗色主题，编辑器与预览区对比明显

### 1.2 代码编辑器功能

- **编辑器：** 基于 Monaco Editor
- **语言支持：** HTML + CSS（CSS 面板用于自定义配置）
- **语法高亮：** 完整的 HTML/CSS 高亮
- **自动补全：** 支持 Tailwind 类名智能提示
- **格式化：** Tidy 按钮，一键整理代码
- **复制：** 快速复制代码到剪贴板
- **多文件：** HTML 和 CSS 两个标签页

### 1.3 预览功能

- **实时预览：** 代码修改即时反映
- **响应式模式：** 支持多种设备尺寸（iPhone、iPad、Desktop 等）
- **设备旋转：** 支持横竖屏切换
- **预览区独立滚动：** 不影响编辑器

### 1.4 版本管理

- **版本选择：** 支持 v4.x、v3.x、v2.x、v1.x 以及 Insiders 版本
- **版本切换：** 下拉菜单快速切换，无需刷新页面

### 1.5 分享功能

- **Share 按钮：** 生成分享链接
- **URL 编码：** 代码存储在 URL hash 中
- **自动保存：** 浏览器本地存储

### 1.6 用户体验细节

- **简洁界面：** 工具栏按钮少而精
- **快捷键：** Ctrl+K 快速搜索
- **暗色主题：** 默认暗色，适合开发者
- **无广告：** 干净无干扰

### 1.7 特色功能

- **Generated CSS 面板：** 查看编译后的 CSS
- **配置面板：** CSS 标签页可配置 Tailwind 主题、插件
- **@utility、@plugin 支持：** 完整的 Tailwind 功能

---

## 2. UnoCSS Playground

**地址：** https://unocss.dev/play/

### 2.1 UI 布局和交互设计

- **四栏布局：**
  1. HTML 编辑区
  2. Config 编辑区（UnoCSS 配置）
  3. Custom CSS 编辑区
  4. Output 输出区（生成的 CSS）
- **底部预览：** 预览区在底部，独立于编辑区
- **可折叠面板：** 每个编辑区可独立收起
- **Transform 复选框：** 控制是否应用转换

### 2.2 代码编辑器功能

- **编辑器：** 基于 Monaco Editor
- **多文件：** HTML、Config、Custom CSS 三个输入区
- **格式化：** 每个编辑区独立的 Format 按钮
- **语法高亮：** 支持 HTML、TypeScript（config）、CSS
- **Transform 开关：** 每个 panel 可开关转换功能

### 2.3 预览功能

- **实时预览：** 底部 iframe 预览
- **响应式模式：** Responsive 按钮切换
- **Prettify 输出：** 格式化生成的 CSS

### 2.4 配置功能

- **完整的 UnoCSS 配置：** 支持 presets、rules、shortcuts
- **presetWind4：** 默认使用 Wind4 预设
- **presetAttributify：** 属性化模式
- **presetIcons：** 图标预设，支持 CDN
- **自定义 rules 和 shortcuts**

### 2.5 分享功能

- **Share Link 按钮：** 生成分享链接
- **Reset To Default：** 重置到默认示例

### 2.6 用户体验细节

- **主题切换：** 明暗主题切换按钮
- **版本显示：** 显示当前 UnoCSS 版本和 commit hash
- **链接导航：** Documentation、Interactive Docs、GitHub
- **暗色主题：** 默认暗色，支持切换

### 2.7 特色功能

- **多面板设计：** 同时展示输入和输出
- **Config 编辑：** 可实时修改 UnoCSS 配置
- **Output 面板：** 实时显示生成的 CSS
- **Interactive Docs 链接：** 快速跳转到交互式文档

---

## 3. Vue SFC Playground

**地址：** https://play.vuejs.org/

### 3.1 功能概述（基于官方文档和社区反馈）

- **Vue SFC 编辑：** 支持 .vue 单文件组件
- **多文件支持：** 可创建多个 .vue 文件
- **Import 导入：** 可从 URL 导入组件
- **编译输出：** 显示编译后的 JavaScript
- **Console 面板：** 内置控制台输出
- **主题切换：** 支持明暗主题
- **下载/分享：** 支持导出和分享

### 3.2 特色功能

- **SSR 模式：** 支持服务端渲染预览
- **编译选项：** 可切换生产/开发模式
- **版本选择：** 支持不同 Vue 版本

---

## 4. 综合对比

| 功能 | Tailwind Play | UnoCSS Play | Vue SFC Play |
|------|--------------|-------------|--------------|
| 编辑器 | Monaco | Monaco | Monaco |
| 布局模式 | 3种 | 4栏+预览 | 左右分栏 |
| 响应式预览 | ✅ 多设备 | ✅ | ❌ |
| 主题切换 | ❌ 暗色固定 | ✅ 明暗切换 | ✅ |
| 多文件 | 2个(HTML/CSS) | 3个 | 多个 .vue |
| 版本选择 | ✅ v1-v4 | ✅ | ✅ |
| URL 分享 | ✅ | ✅ | ✅ |
| 格式化 | ✅ Tidy | ✅ Format | ✅ |
| Console | ❌ | ❌ | ✅ |
| 配置面板 | ✅ CSS配置 | ✅ Config | ✅ |
| 导出功能 | ❌ | ❌ | ✅ 下载 |

---

## 5. 关键发现

### 5.1 UI/UX 最佳实践

1. **简洁的工具栏** — Tailwind Play 只保留必要按钮，不堆砌功能
2. **布局灵活性** — 支持多种布局模式适应不同场景
3. **响应式预览** — 设备模拟是高频需求
4. **暗色主题** — 开发者偏好暗色，减少眼疲劳
5. **快捷键支持** — Ctrl+K 搜索、格式化等

### 5.2 编辑器最佳实践

1. **Monaco Editor** — 业界标准，功能完整
2. **多标签/多面板** — 同时编辑多个文件
3. **实时格式化** — Tidy/Format 按钮提升体验
4. **一键复制** — 快速分享代码片段
5. **语法智能提示** — Tailwind 类名补全是关键

### 5.3 预览最佳实践

1. **实时预览** — 代码修改即时反映
2. **设备模拟** — iPhone/iPad/Desktop 预设
3. **独立滚动** — 预览区不影响编辑区
4. **Console 面板** — Vue Playground 的亮点

### 5.4 分享最佳实践

1. **URL Hash 存储** — 代码存在 URL 中，无需后端
2. **一键分享** — Share 按钮生成链接
3. **版本锁定** — 分享链接包含版本信息

---

## 6. 对当前项目的启示

### 6.1 需要改进的功能

| 优先级 | 功能 | 参考 |
|--------|------|------|
| P0 | 响应式预览模式 | Tailwind Play |
| P0 | URL 分享功能 | 所有 Playground |
| P0 | 格式化按钮 | 所有 Playground |
| P1 | 主题切换（明暗） | UnoCSS Play |
| P1 | Console 面板 | Vue SFC Play |
| P1 | 版本选择 | Tailwind Play |
| P2 | 导出/下载功能 | Vue SFC Play |
| P2 | 快捷键提示 | Tailwind Play |
| P2 | 编辑器全屏模式 | 所有 Playground |

### 6.2 UI 布局优化建议

1. **工具栏精简** — 当前工具栏功能较多，考虑分组/折叠
2. **布局切换** — 添加仅预览模式，适合展示
3. **文件标签优化** — 考虑标签页拖拽排序

### 6.3 编辑器优化建议

1. **Tailwind 类名补全** — 如果支持 HTML，添加类名智能提示
2. **Emmet 支持** — HTML/CSS 快速编写
3. **多光标编辑** — Monaco 原生支持，确保启用
4. **Minimap** — 代码缩略图，方便导航

### 6.4 预览优化建议

1. **设备预设** — iPhone、iPad、Desktop 等常用尺寸
2. **缩放控制** — 50%、100%、200% 等
3. **刷新按钮** — 手动刷新预览（当前已有）
4. **Console 面板** — 显示 console.log 输出（当前已有）

---

## 7. 截图

- `screenshots/tailwind-playground.png` — Tailwind Play 主界面
- `screenshots/tailwind-responsive.png` — Tailwind 响应式模式
- `screenshots/tailwind-version-dropdown.png` — Tailwind 版本选择
- `screenshots/unocss-playground.png` — UnoCSS Playground 主界面
- `screenshots/unocss-responsive.png` — UnoCSS 响应式模式
- `screenshots/unocss-dark-mode.png` — UnoCSS 暗色主题

---

## 8. 总结

通过调研三个优秀的 Playground，我们发现：

1. **简洁至上** — 工具栏不应堆砌功能，保持清爽
2. **响应式预览** — 是刚需功能，应优先实现
3. **URL 分享** — 无后端分享的最佳方案
4. **格式化** — 提升代码可读性的必备功能
5. **主题切换** — 明暗主题满足不同偏好
6. **Console 面板** — 调试利器，Vue Playground 的亮点

当前项目已完成基础功能，下一步应优先实现响应式预览和 URL 分享功能。
