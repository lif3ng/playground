<script setup lang="ts">
import { useEditor } from '@/composables/useEditor'
import { useLayout } from '@/composables/useLayout'
import { usePreview } from '@/composables/usePreview'
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
} = useEditor()

const { direction, toggleDirection } = useLayout()
const { previewHtml } = usePreview(code, language)
</script>

<template>
  <div class="playground">
    <LayoutToolbar
      :direction="direction"
      :files="files"
      :active-file-id="activeFileId"
      :editor-type="editorType"
      @toggle-direction="toggleDirection"
      @set-active-file="setActiveFile"
      @add-file="addFile"
      @remove-file="removeFile"
      @set-editor-type="setEditorType"
      @reset-code="resetCode"
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
        <PreviewFrame :html="previewHtml" />
      </template>
    </SplitLayout>
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
</style>
