<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEditor } from '@/composables/useEditor'
import { useLayout } from '@/composables/useLayout'
import { usePreview } from '@/composables/usePreview'
import { useResponsive } from '@/composables/useResponsive'
import { useShare } from '@/composables/useShare'
import { useFormat } from '@/composables/useFormat'
import { useTheme } from '@/composables/useTheme'
import LayoutToolbar from '@/components/layout/LayoutToolbar.vue'
import SplitLayout from '@/components/layout/SplitLayout.vue'
import EditorContainer from '@/components/editors/EditorContainer.vue'
import PreviewFrame from '@/components/preview/PreviewFrame.vue'

const {
  files,
  activeFileId,
  code,
  language,
  editorType,
  setActiveFile,
  addFile,
  removeFile,
  setEditorType,
  saveCode,
  resetCode,
  setFiles,
} = useEditor()

const { direction, toggleDirection } = useLayout()
const { previewHtml } = usePreview(code, language)

const {
  selectedDeviceId,
  isLandscape,
  isResponsiveMode,
  customWidth,
  customHeight,
  effectiveSize,
  selectDevice,
  toggleLandscape,
  setCustomSize,
} = useResponsive()

const {
  copyShareUrl,
  loadFromHash,
  clearHash,
  isSharing,
  shareError,
} = useShare()

const { formatCode, isFormatting, formatError } = useFormat()
const { theme, toggleTheme } = useTheme()

const showShareToast = ref(false)
const shareToastMessage = ref('')

function toggleResponsiveMode() {
  // 在桌面和上一次选择的设备间切换
  if (isResponsiveMode.value) {
    selectDevice('desktop')
  } else {
    selectDevice(selectedDeviceId.value === 'desktop' ? 'iphone' : selectedDeviceId.value)
  }
}

async function handleShare() {
  const success = await copyShareUrl(files.value)
  if (success) {
    showToast('链接已复制到剪贴板')
  } else {
    showToast(shareError.value || '分享失败')
  }
}

function showToast(message: string) {
  shareToastMessage.value = message
  showShareToast.value = true
  setTimeout(() => {
    showShareToast.value = false
  }, 2000)
}

async function handleFormat() {
  const result = await formatCode(code.value, language.value)
  if (result.success && result.code) {
    saveCode(result.code)
    showToast('格式化完成')
  } else {
    showToast(result.error || '格式化失败')
  }
}

// 初始化：从 URL hash 加载分享的代码
onMounted(async () => {
  const sharedFiles = await loadFromHash()
  if (sharedFiles && sharedFiles.length > 0) {
    setFiles(sharedFiles)
    clearHash()
    showToast('已加载分享的代码')
  }
})
</script>

<template>
  <div class="playground">
    <LayoutToolbar
      :direction="direction"
      :files="files"
      :active-file-id="activeFileId"
      :editor-type="editorType"
      :is-responsive-mode="isResponsiveMode"
      :selected-device-id="selectedDeviceId"
      :is-landscape="isLandscape"
      :custom-width="customWidth"
      :custom-height="customHeight"
      :theme="theme"
      @toggle-direction="toggleDirection"
      @set-active-file="setActiveFile"
      @add-file="addFile"
      @remove-file="removeFile"
      @set-editor-type="setEditorType"
      @reset-code="resetCode"
      @toggle-responsive-mode="toggleResponsiveMode"
      @select-device="selectDevice"
      @toggle-landscape="toggleLandscape"
      @set-custom-size="setCustomSize"
      @share="handleShare"
      @format="handleFormat"
      @toggle-theme="toggleTheme"
    />
    <SplitLayout :direction="direction" class="playground-body">
      <template #left>
        <EditorContainer
          :code="code"
          :language="language"
          :editor-type="editorType"
          @update:code="saveCode"
        />
      </template>
      <template #right>
        <PreviewFrame
          :html="previewHtml"
          :preview-width="effectiveSize.width"
          :preview-height="effectiveSize.height"
          :is-responsive-mode="isResponsiveMode"
        />
      </template>
    </SplitLayout>

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="showShareToast" class="toast">
        {{ shareToastMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #1e1e2e;
}
.playground-body {
  flex: 1;
  min-height: 0;
}

/* Toast 提示 */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #313244;
  z-index: 10000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
