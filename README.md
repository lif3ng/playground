# Playground

An online code editor that lets you write and preview HTML, CSS, JavaScript, TypeScript, and Vue SFCs in real time.

🔗 **Live:** https://lif3ng.github.io/playground/

## Features

- **Multi-language support** — HTML, CSS, JS, TS, Vue SFC
- **Live preview** — instant iframe preview as you type
- **Console panel** — captures `console.log` / errors from the preview
- **Dual editor engines** — Monaco Editor & CodeMirror 6
- **Resizable layout** — draggable split pane, vertical on mobile
- **Persistent state** — code auto-saved to localStorage

## Tech Stack

- [Vue 3](https://vuejs.org/) + TypeScript
- [Vite](https://vitejs.dev/)
- [UnoCSS](https://unocss.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [CodeMirror 6](https://codemirror.net/)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
  composables/
    useEditor.ts      # Editor state, localStorage persistence
    useLayout.ts      # Layout direction, mobile defaults
    usePreview.ts     # Preview generation (HTML/CSS/JS/TS/Vue)
  components/
    editors/
      EditorContainer.vue    # Editor wrapper with filename label
      MonacoEditor.vue       # Monaco adapter
      CodeMirrorEditor.vue   # CodeMirror 6 adapter
    layout/
      SplitLayout.vue        # Draggable split layout (touch support)
      LayoutToolbar.vue      # Toolbar with responsive collapse
    preview/
      PreviewFrame.vue       # iframe preview + console panel
  views/
    PlaygroundView.vue       # Main view
```

## Deployment

CI/CD via GitHub Actions → GitHub Pages using `pnpm`.

## License

MIT
