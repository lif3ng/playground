import { ref, computed, watch } from 'vue'

export interface DevicePreset {
  id: string
  name: string
  width: number | '100%'
  height: number | '100%'
  icon: string
}

export const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'desktop', name: 'Desktop', width: '100%', height: '100%', icon: '🖥' },
  { id: 'iphone', name: 'iPhone', width: 375, height: 667, icon: '📱' },
  { id: 'iphone-plus', name: 'iPhone Plus', width: 414, height: 736, icon: '📱' },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, icon: '📱' },
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', width: 430, height: 932, icon: '📱' },
  { id: 'ipad', name: 'iPad', width: 768, height: 1024, icon: '📋' },
  { id: 'ipad-pro', name: 'iPad Pro', width: 1024, height: 1366, icon: '📋' },
  { id: 'custom', name: '自定义', width: 0, height: 0, icon: '⚙' },
]

const STORAGE_KEY = 'playground:responsive:settings'

interface SavedSettings {
  deviceId: string
  isLandscape: boolean
  customWidth: number
  customHeight: number
}

function loadSettings(): SavedSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // ignore
  }
  return {
    deviceId: 'desktop',
    isLandscape: false,
    customWidth: 375,
    customHeight: 667,
  }
}

export function useResponsive() {
  const settings = loadSettings()

  const selectedDeviceId = ref<string>(settings.deviceId)
  const isLandscape = ref<boolean>(settings.isLandscape)
  const customWidth = ref<number>(settings.customWidth)
  const customHeight = ref<number>(settings.customHeight)
  const isResponsiveMode = ref<boolean>(settings.deviceId !== 'desktop')

  const selectedDevice = computed<DevicePreset | null>(() => {
    if (selectedDeviceId.value === 'custom') {
      return {
        id: 'custom',
        name: '自定义',
        width: customWidth.value,
        height: customHeight.value,
        icon: '⚙',
      }
    }
    return DEVICE_PRESETS.find((d) => d.id === selectedDeviceId.value) ?? null
  })

  const effectiveSize = computed(() => {
    const device = selectedDevice.value
    if (!device || device.id === 'desktop') {
      return { width: '100%' as const, height: '100%' as const }
    }

    let w = device.width
    let h = device.height

    // 交换宽高
    if (isLandscape.value && typeof w === 'number' && typeof h === 'number') {
      [w, h] = [h, w]
    }

    return { width: w, height: h }
  })

  const displaySize = computed(() => {
    const { width, height } = effectiveSize.value
    if (width === '100%' && height === '100%') {
      return '100%'
    }
    return `${width}×${height}`
  })

  function selectDevice(deviceId: string) {
    selectedDeviceId.value = deviceId
    isResponsiveMode.value = deviceId !== 'desktop'
  }

  function toggleLandscape() {
    isLandscape.value = !isLandscape.value
  }

  function setCustomSize(width: number, height: number) {
    customWidth.value = width
    customHeight.value = height
  }

  // 保存设置
  watch(
    [selectedDeviceId, isLandscape, customWidth, customHeight],
    () => {
      const settings: SavedSettings = {
        deviceId: selectedDeviceId.value,
        isLandscape: isLandscape.value,
        customWidth: customWidth.value,
        customHeight: customHeight.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    },
    { deep: true }
  )

  return {
    devicePresets: DEVICE_PRESETS,
    selectedDeviceId,
    selectedDevice,
    isLandscape,
    isResponsiveMode,
    customWidth,
    customHeight,
    effectiveSize,
    displaySize,
    selectDevice,
    toggleLandscape,
    setCustomSize,
  }
}
