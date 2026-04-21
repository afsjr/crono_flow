import { describe, it, expect, beforeEach, vi } from 'vitest'

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

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockReturnValue(undefined)
  })

  it('deve ter dados iniciais padrão', async () => {
    const { storage } = await import('../services/storage')
    const users = storage.getUsers()
    expect(users).toBeDefined()
    expect(Array.isArray(users)).toBe(true)
  })

  it('deve obter clientes do storage', async () => {
    const { storage } = await import('../services/storage')
    const clients = storage.getClients()
    expect(clients).toBeDefined()
  })

  it('deve obter lançamentos do storage', async () => {
    const { storage } = await import('../services/storage')
    const entries = storage.getEntries()
    expect(entries).toBeDefined()
  })

  it('deve validar código de acesso correto', async () => {
    const { storage } = await import('../services/storage')
    expect(storage.validateAccessCode('adv2026')).toBe(true)
  })

  it('deve rejeitar código incorreto', async () => {
    const { storage } = await import('../services/storage')
    expect(storage.validateAccessCode('codigo-errado')).toBe(false)
    expect(storage.validateAccessCode('')).toBe(false)
  })

  it('deve adicionar lançamento', async () => {
    const { storage } = await import('../services/storage')
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([]))
    
    storage.addEntry({
      id: 'test-1',
      userId: '1',
      clientId: '1',
      taskCategory: 'processual',
      taskName: 'Petição',
      description: 'Teste',
      startTime: Date.now(),
      endTime: Date.now() + 3600000,
      durationMinutes: 60,
      evidenceUrl: '',
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('deve adicionar cliente', async () => {
    const { storage } = await import('../services/storage')
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([]))
    
    storage.addClient({
      id: 'new-client',
      name: 'Novo Cliente',
      hourlyRate: 30000,
      active: true,
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })
})