import { ref, watch } from 'vue'
import type { EditorFile } from './useEditor'

const STORAGE_KEY = 'playground:share:settings'

interface ShareSettings {
  autoShare: boolean
}

function loadSettings(): ShareSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // ignore
  }
  return { autoShare: false }
}

export function useShare() {
  const settings = loadSettings()
  const autoShare = ref(settings.autoShare)
  const shareUrl = ref('')
  const isSharing = ref(false)
  const shareError = ref<string | null>(null)

  // 压缩并编码文件数据
  async function encodeFiles(files: EditorFile[]): Promise<string> {
    const data = {
      v: 1, // 版本号，便于后续扩展
      files: files.map(f => ({
        n: f.name,      // name -> n
        l: f.language,  // language -> l
        c: f.code,      // code -> c
      })),
    }
    const json = JSON.stringify(data)

    // 使用 CompressionStream 压缩（现代浏览器支持）
    if (typeof CompressionStream !== 'undefined') {
      try {
        const compressed = await compressString(json)
        return compressed
      } catch {
        // 降级到 base64
      }
    }

    // 降级方案：直接 base64 编码
    return btoa(encodeURIComponent(json))
  }

  // 解码文件数据
  async function decodeFiles(encoded: string): Promise<EditorFile[] | null> {
    try {
      let json: string

      // 尝试解压
      if (typeof DecompressionStream !== 'undefined' && encoded.startsWith('gz:')) {
        try {
          json = await decompressString(encoded.slice(3))
        } catch {
          // 降级到 base64
          json = decodeURIComponent(atob(encoded))
        }
      } else {
        json = decodeURIComponent(atob(encoded))
      }

      const data = JSON.parse(json)

      // 版本检查
      if (data.v !== 1) {
        console.warn('Unknown share data version:', data.v)
      }

      return data.files.map((f: any, i: number) => ({
        id: `file-${Date.now()}-${i}`,
        name: f.n,
        language: f.l,
        code: f.c,
      }))
    } catch (e) {
      console.error('Failed to decode share data:', e)
      return null
    }
  }

  // 生成分享 URL
  async function generateShareUrl(files: EditorFile[], baseUrl?: string): Promise<string> {
    const encoded = await encodeFiles(files)
    const base = baseUrl || window.location.origin + window.location.pathname
    return `${base}#share=${encoded}`
  }

  // 复制分享链接到剪贴板
  async function copyShareUrl(files: EditorFile[]): Promise<boolean> {
    isSharing.value = true
    shareError.value = null

    try {
      const url = await generateShareUrl(files)
      await navigator.clipboard.writeText(url)
      shareUrl.value = url
      return true
    } catch (e) {
      shareError.value = e instanceof Error ? e.message : '复制失败'
      return false
    } finally {
      isSharing.value = false
    }
  }

  // 从 URL hash 读取分享数据
  async function loadFromHash(): Promise<EditorFile[] | null> {
    const hash = window.location.hash
    if (!hash.startsWith('#share=')) {
      return null
    }

    const encoded = hash.slice(7) // '#share='.length
    return await decodeFiles(encoded)
  }

  // 清除 URL hash
  function clearHash() {
    history.replaceState(null, '', window.location.pathname)
  }

  // 压缩字符串（使用 Gzip）
  async function compressString(str: string): Promise<string> {
    const stream = new CompressionStream('gzip')
    const writer = stream.writable.getWriter()
    writer.write(new TextEncoder().encode(str))
    writer.close()

    const reader = stream.readable.getReader()
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    // 合并 chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }

    // 转为 base64
    return 'gz:' + btoa(String.fromCharCode(...result))
  }

  // 解压字符串
  async function decompressString(compressed: string): Promise<string> {
    const binary = atob(compressed)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const stream = new DecompressionStream('gzip')
    const writer = stream.writable.getWriter()
    writer.write(bytes)
    writer.close()

    const reader = stream.readable.getReader()
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    // 合并并解码
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }

    return new TextDecoder().decode(result)
  }

  // 保存设置
  watch(autoShare, () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ autoShare: autoShare.value }))
  })

  return {
    autoShare,
    shareUrl,
    isSharing,
    shareError,
    generateShareUrl,
    copyShareUrl,
    loadFromHash,
    clearHash,
    encodeFiles,
    decodeFiles,
  }
}
