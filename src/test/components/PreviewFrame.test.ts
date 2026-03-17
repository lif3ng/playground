import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PreviewFrame from '@/components/preview/PreviewFrame.vue'

// Mock iframe srcdoc
Object.defineProperty(HTMLIFrameElement.prototype, 'srcdoc', {
  set: vi.fn(),
  get: vi.fn(() => ''),
  configurable: true,
})

describe('PreviewFrame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders preview header', () => {
    const wrapper = mount(PreviewFrame, {
      props: { html: '<h1>Test</h1>' },
    })
    expect(wrapper.find('.preview-label').text()).toBe('预览')
  })

  it('renders iframe element', () => {
    const wrapper = mount(PreviewFrame, {
      props: { html: '<h1>Test</h1>' },
    })
    expect(wrapper.find('iframe').exists()).toBe(true)
  })

  it('shows refresh button', () => {
    const wrapper = mount(PreviewFrame, {
      props: { html: '' },
    })
    const btns = wrapper.findAll('.action-btn')
    expect(btns.length).toBeGreaterThan(0)
  })

  it('does not show console panel when no logs', () => {
    const wrapper = mount(PreviewFrame, {
      props: { html: '' },
    })
    expect(wrapper.find('.console-panel').exists()).toBe(false)
  })

  it('shows error banner when receiving error message', async () => {
    const wrapper = mount(PreviewFrame, {
      props: { html: '' },
    })
    // Simulate postMessage error
    window.dispatchEvent(new MessageEvent('message', {
      data: {
        source: 'playground-preview',
        type: 'error',
        payload: { message: 'ReferenceError: x is not defined' },
      },
    }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.preview-error').exists()).toBe(true)
    expect(wrapper.find('.preview-error').text()).toContain('ReferenceError')
  })

  it('clears error on html change', async () => {
    const wrapper = mount(PreviewFrame, {
      props: { html: '' },
    })
    window.dispatchEvent(new MessageEvent('message', {
      data: {
        source: 'playground-preview',
        type: 'error',
        payload: { message: 'Some error' },
      },
    }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.preview-error').exists()).toBe(true)
    await wrapper.setProps({ html: '<p>new</p>' })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.preview-error').exists()).toBe(false)
  })

  it('ignores postMessage from unknown sources', async () => {
    const wrapper = mount(PreviewFrame, {
      props: { html: '' },
    })
    window.dispatchEvent(new MessageEvent('message', {
      data: { source: 'unknown', type: 'error', payload: { message: 'hack' } },
    }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.preview-error').exists()).toBe(false)
  })
})
