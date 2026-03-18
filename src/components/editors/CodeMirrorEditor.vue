<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import type { SupportedLanguage } from '@/composables/useEditor'

const props = defineProps<{
  code: string
  language: SupportedLanguage
}>()

const emit = defineEmits<{
  'update:code': [code: string]
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const view = shallowRef<any>(null)
let langCompartment: any = null

async function getLanguageExtension(lang: SupportedLanguage) {
  switch (lang) {
    case 'html':
    case 'vue': {
      const { html } = await import('@codemirror/lang-html')
      return html()
    }
    case 'css': {
      const { css } = await import('@codemirror/lang-css')
      return css()
    }
    case 'javascript': {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript()
    }
    case 'typescript': {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript({ typescript: true })
    }
    default: {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript()
    }
  }
}

onMounted(async () => {
  const [
    { EditorView, basicSetup },
    { EditorState },
    { Compartment },
    { oneDark },
    langExt,
  ] = await Promise.all([
    import('codemirror'),
    import('@codemirror/state'),
    import('@codemirror/state'),
    import('@codemirror/theme-one-dark'),
    getLanguageExtension(props.language),
  ])

  if (!containerRef.value) return

  langCompartment = new Compartment()

  const updateListener = EditorView.updateListener.of((update: any) => {
    if (update.docChanged) {
      emit('update:code', update.state.doc.toString())
    }
  })

  view.value = new EditorView({
    state: EditorState.create({
      doc: props.code,
      extensions: [
        basicSetup,
        oneDark,
        langCompartment.of(langExt),
        updateListener,
        EditorView.theme({
          '&': { height: '100%', fontSize: '14px' },
          '.cm-scroller': { fontFamily: '"Cascadia Code", "Fira Code", Menlo, Monaco, monospace', overflow: 'auto' },
          '.cm-content': { padding: '12px 0' },
        }),
      ],
    }),
    parent: containerRef.value,
  })
})

// Sync code
watch(() => props.code, (newCode) => {
  if (!view.value) return
  const current = view.value.state.doc.toString()
  if (current !== newCode) {
    view.value.dispatch({
      changes: { from: 0, to: current.length, insert: newCode },
    })
  }
})

// Sync language — 用 Compartment reconfigure，不重建 state
watch(() => props.language, async (lang) => {
  if (!view.value || !langCompartment) return
  const langExt = await getLanguageExtension(lang)
  view.value.dispatch({
    effects: langCompartment.reconfigure(langExt),
  })
})

onBeforeUnmount(() => {
  view.value?.destroy()
})
</script>

<template>
  <div ref="containerRef" class="cm-container" />
</template>

<style scoped>
.cm-container {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
