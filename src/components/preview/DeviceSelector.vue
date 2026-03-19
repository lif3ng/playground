<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DevicePreset } from '@/composables/useResponsive'
import { DEVICE_PRESETS } from '@/composables/useResponsive'

const props = defineProps<{
  selectedDeviceId: string
  isLandscape: boolean
  customWidth: number
  customHeight: number
  isResponsiveMode: boolean
}>()

const emit = defineEmits<{
  selectDevice: [deviceId: string]
  toggleLandscape: []
  setCustomSize: [width: number, height: number]
  toggleResponsiveMode: []
}>()

const isOpen = ref(false)
const showCustomInput = computed(() => props.selectedDeviceId === 'custom')

const localCustomWidth = ref(props.customWidth)
const localCustomHeight = ref(props.customHeight)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectDevice(device: DevicePreset) {
  emit('selectDevice', device.id)
  isOpen.value = false
}

function applyCustomSize() {
  const w = Math.max(100, Math.min(2000, localCustomWidth.value || 375))
  const h = Math.max(100, Math.min(2000, localCustomHeight.value || 667))
  emit('setCustomSize', w, h)
}

function closeDropdown() {
  isOpen.value = false
}

// 点击外部关闭
function onBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('dropdown-backdrop')) {
    closeDropdown()
  }
}
</script>

<template>
  <div class="device-selector">
    <button
      class="device-btn"
      :class="{ active: isResponsiveMode }"
      title="响应式预览"
      @click="emit('toggleResponsiveMode')"
    >
      📱
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen && isResponsiveMode" class="dropdown-backdrop" @click="onBackdropClick">
        <div class="dropdown">
          <div class="dropdown-header">
            <span>设备预设</span>
            <button class="close-btn" @click="closeDropdown">×</button>
          </div>

          <div class="device-list">
            <button
              v-for="device in DEVICE_PRESETS"
              :key="device.id"
              class="device-item"
              :class="{ active: device.id === selectedDeviceId }"
              @click="selectDevice(device)"
            >
              <span class="device-icon">{{ device.icon }}</span>
              <span class="device-name">{{ device.name }}</span>
              <span v-if="device.id !== 'desktop' && device.id !== 'custom'" class="device-size">
                {{ device.width }}×{{ device.height }}
              </span>
            </button>
          </div>

          <!-- 自定义尺寸输入 -->
          <div v-if="showCustomInput" class="custom-size">
            <label>
              宽度
              <input
                v-model.number="localCustomWidth"
                type="number"
                min="100"
                max="2000"
                class="size-input"
                @change="applyCustomSize"
              >
            </label>
            <label>
              高度
              <input
                v-model.number="localCustomHeight"
                type="number"
                min="100"
                max="2000"
                class="size-input"
                @change="applyCustomSize"
              >
            </label>
            <button class="apply-btn" @click="applyCustomSize">应用</button>
          </div>

          <!-- 旋转按钮 -->
          <div v-if="selectedDeviceId !== 'desktop'" class="rotate-section">
            <button
              class="rotate-btn"
              :class="{ active: isLandscape }"
              @click="emit('toggleLandscape')"
            >
              <span class="rotate-icon">{{ isLandscape ? '↕' : '↔' }}</span>
              {{ isLandscape ? '竖屏' : '横屏' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.device-selector {
  position: relative;
  display: flex;
  align-items: center;
}

.device-btn {
  background: #313244;
  color: #cdd6f4;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.device-btn:hover {
  background: #45475a;
}

.device-btn.active {
  background: #6366f1;
  color: #fff;
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: transparent;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #1e1e2e;
  border: 1px solid #313244;
  border-radius: 8px;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1001;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #313244;
  color: #cdd6f4;
  font-size: 0.8rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #6c7086;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #f38ba8;
}

.device-list {
  max-height: 280px;
  overflow-y: auto;
  padding: 4px 0;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #cdd6f4;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.device-item:hover {
  background: #313244;
}

.device-item.active {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.device-icon {
  font-size: 1rem;
}

.device-name {
  flex: 1;
}

.device-size {
  color: #6c7086;
  font-size: 0.72rem;
  font-family: monospace;
}

.custom-size {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid #313244;
  background: #181825;
}

.custom-size label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.7rem;
  color: #6c7086;
}

.size-input {
  width: 70px;
  padding: 4px 6px;
  background: #1e1e2e;
  border: 1px solid #313244;
  border-radius: 4px;
  color: #cdd6f4;
  font-size: 0.8rem;
  font-family: monospace;
}

.size-input:focus {
  outline: none;
  border-color: #6366f1;
}

.apply-btn {
  padding: 4px 8px;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  margin-top: auto;
}

.apply-btn:hover {
  background: #4f46e5;
}

.rotate-section {
  padding: 8px 12px;
  border-top: 1px solid #313244;
}

.rotate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px;
  background: #313244;
  color: #cdd6f4;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.rotate-btn:hover {
  background: #45475a;
}

.rotate-btn.active {
  background: #6366f1;
  color: #fff;
}

.rotate-icon {
  font-size: 1rem;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
