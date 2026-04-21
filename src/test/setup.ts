import { vi } from 'vitest'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  },
  writable: true,
})

export { localStorageMock }
