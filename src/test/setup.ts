import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver for tests
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
})
window.IntersectionObserver = mockIntersectionObserver
window.IntersectionObserver.prototype.observe = vi.fn()
window.IntersectionObserver.prototype.unobserve = vi.fn()
window.IntersectionObserver.prototype.disconnect = vi.fn()

// Mock window.scrollTo for navigation tests
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
})

// Mock window.print for PDF download tests
Object.defineProperty(window, 'print', {
  value: vi.fn(),
  writable: true
})

// Mock fetch for potential API calls
global.fetch = vi.fn()

// Suppress console warnings in tests
const originalConsoleWarn = console.warn
console.warn = (...args) => {
  if (args[0]?.includes('Warning: ReactDOM.render is no longer supported')) {
    return
  }
  originalConsoleWarn(...args)
} 