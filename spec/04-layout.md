# 04 — 布局系统设计

## 布局模式

支持两种预设布局，可在工具栏一键切换：

| 模式 | 描述 | 默认 |
|------|------|------|
| `horizontal` | 左编辑器 / 右预览（左右分栏）| ✅ |
| `vertical` | 上编辑器 / 下预览（上下分栏）| ❌ |

## 布局切换行为

- 工具栏提供布局切换按钮（图标区分两种模式）
- 切换时使用 CSS transition 平滑过渡
- 当前布局偏好持久化到 `localStorage`，刷新后恢复

## 分栏比例

- 默认比例：编辑器 50% / 预览 50%
- 支持拖拽分隔条（`resizable divider`）自由调整比例
- 拖拽比例持久化到 `localStorage`

## 组件结构

```
App.vue
└── SplitLayout.vue          # 核心布局容器
    ├── LayoutToolbar.vue     # 顶部工具栏
    │   ├── 编辑器选择下拉
    │   ├── 语言选择下拉
    │   ├── 布局切换按钮
    │   └── 手动刷新按钮
    ├── EditorPanel           # 编辑区（左/上）
    │   └── EditorContainer.vue
    ├── ResizeDivider.vue     # 可拖拽分隔条
    └── PreviewPanel          # 预览区（右/下）
        └── PreviewFrame.vue
```

## SplitLayout 组件接口

```vue
<SplitLayout
  :direction="layout"        <!-- 'horizontal' | 'vertical' -->
  :split-ratio="splitRatio"  <!-- 0.1 ~ 0.9，默认 0.5 -->
  @update:split-ratio="onResize"
/>
```

## 响应式适配

- 桌面端（>= 768px）：左右布局为默认
- 移动端（< 768px）：自动切换为上下布局，隐藏拖拽分隔条

## 工具栏说明

工具栏固定在顶部，包含以下控件：

| 控件 | 类型 | 功能 |
|------|------|------|
| 编辑器选择 | 下拉菜单 | 切换 Monaco / CodeMirror |
| 语言选择 | 下拉菜单 | 切换语言（html/css/js/ts/vue）|
| 布局切换 | 图标按钮组 | 切换水平 / 垂直布局 |
| 刷新预览 | 图标按钮 | 手动触发 iframe 刷新 |

## 测试要求

- [ ] 单元测试：`useLayout` — 布局模式切换
- [ ] 单元测试：`useLayout` — localStorage 持久化与恢复
- [ ] 单元测试：分隔条拖拽比例计算
- [ ] 组件测试：`SplitLayout` 在不同 direction 下 CSS class 正确
- [ ] 组件测试：`LayoutToolbar` 各按钮点击触发正确事件
