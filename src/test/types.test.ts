import { describe, it, expect } from 'vitest'
import { TASKS, STORAGE_KEYS, DEFAULT_ACCESS_CODE } from '../types'

describe('TASKS', () => {
  it('deve ter categoria processual', () => {
    expect(TASKS).toHaveProperty('processual')
    expect(TASKS.processual).toContain('Petição')
    expect(TASKS.processual).toContain('Audiência')
    expect(TASKS.processual).toContain('Recurso')
  })

  it('deve ter categoria administrativo', () => {
    expect(TASKS).toHaveProperty('administrativo')
    expect(TASKS.administrativo).toContain('Protocolo')
    expect(TASKS.administrativo).toContain('Arquivo')
  })

  it('deve ter categoria consultoria', () => {
    expect(TASKS).toHaveProperty('consultoria')
    expect(TASKS.consultoria).toContain('Parecer')
    expect(TASKS.consultoria).toContain('Reunião')
  })

  it('deve ter tarefas padrão de advocacia', () => {
    const allTasks = [...TASKS.processual, ...TASKS.administrativo, ...TASKS.consultoria]
    expect(allTasks.length).toBeGreaterThan(10)
  })
})

describe('STORAGE_KEYS', () => {
  it('deve ter chave para usuários', () => {
    expect(STORAGE_KEYS.USERS).toBe('cronoflow_users')
  })

  it('deve ter chave para clientes', () => {
    expect(STORAGE_KEYS.CLIENTS).toBe('cronoflow_clients')
  })

  it('deve ter chave para lançamentos', () => {
    expect(STORAGE_KEYS.ENTRIES).toBe('cronoflow_entries')
  })

  it('deve ter chave para sessão', () => {
    expect(STORAGE_KEYS.SESSION).toBe('cronoflow_session')
  })

  it('deve ter chave para configurações', () => {
    expect(STORAGE_KEYS.CONFIG).toBe('cronoflow_config')
  })
})

describe('DEFAULT_ACCESS_CODE', () => {
  it('deve ser adv2026', () => {
    expect(DEFAULT_ACCESS_CODE).toBe('adv2026')
  })
})
