# Web Code Playground — 项目总览

## 项目简介

一个运行在浏览器端的代码沙盒（Playground）应用，支持所见即所得的代码编写、实时预览运行结果、多编辑器切换和多种布局模式。

## 技术栈

| 工具 | 版本 | 用途 |
|------|------|------|
| Vite | 6.x | 构建工具 |
| Vue | 3.5.x | 前端框架（Composition API + `<script setup>`）|
| TypeScript | 5.x | 类型安全 |
| Monaco Editor | latest | VSCode 同款编辑器 |
| CodeMirror | 6.x | 轻量可定制编辑器 |
| Vue Router | 4.x | 前端路由 |
| Vitest | 3.x | 单元测试 + 组件测试 |
| @vue/test-utils | 2.x | Vue 组件测试工具 |
| ESLint + Prettier | latest | 代码规范 |

> 状态管理：不使用 Pinia，采用 Vue 原生 `reactive` / `ref` + Composition API + `provide/inject`

## 文档索引

| 文档 | 内容 |
|------|------|
| [01-architecture.md](./01-architecture.md) | 整体架构设计 |
| [02-editor.md](./02-editor.md) | 编辑器模块设计 |
| [03-preview.md](./03-preview.md) | 预览沙盒设计 |
| [04-layout.md](./04-layout.md) | 布局系统设计 |

## 目录结构

```
playground/
├── spec/                    # 需求文档
│   ├── README.md
│   ├── 01-architecture.md
│   ├── 02-editor.md
│   ├── 03-preview.md
│   └── 04-layout.md
├── src/
│   ├── components/
│   │   ├── editors/         # 编辑器适配器（Monaco / CodeMirror）
│   │   │   ├── MonacoEditor.vue
│   │   │   ├── CodeMirrorEditor.vue
│   │   │   └── EditorContainer.vue  # 统一编辑器入口
│   │   ├── preview/         # iframe 沙盒预览
│   │   │   └── PreviewFrame.vue
│   │   └── layout/          # 布局切换
│   │       ├── SplitLayout.vue
│   │       └── LayoutToolbar.vue
│   ├── composables/         # 可复用逻辑（替代 Pinia）
│   │   ├── useEditor.ts     # 编辑器状态
│   │   ├── usePreview.ts    # 预览逻辑
│   │   └── useLayout.ts     # 布局状态
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── public/
├── tests/                   # Vitest 测试文件
│   ├── unit/
│   └── components/
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── .eslintrc.cjs
└── .prettierrc
```
