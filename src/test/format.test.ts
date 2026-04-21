import { describe, it, expect } from 'vitest'
import { formatTime, formatCurrency, formatDate, calculateDuration, calculateValue } from './utils/format'

describe('formatTime', () => {
  it('deve formatar 0 milissegundos para 00:00:00', () => {
    expect(formatTime(0)).toBe('00:00:00')
  })

  it('deve formatar 1000ms para 00:00:01', () => {
    expect(formatTime(1000)).toBe('00:00:01')
  })

  it('deve formatar 60000ms (1 minuto) para 00:01:00', () => {
    expect(formatTime(60000)).toBe('00:01:00')
  })

  it('deve formatar 3600000ms (1 hora) para 01:00:00', () => {
    expect(formatTime(3600000)).toBe('01:00:00')
  })

  it('deve formatar 3661000ms (1h 1min 1s) para 01:01:01', () => {
    expect(formatTime(3661000)).toBe('01:01:01')
  })

  it('deve formatar 90000000ms (25 horas) para 25:00:00', () => {
    expect(formatTime(90000000)).toBe('25:00:00')
  })
})

describe('formatCurrency', () => {
  it('deve formatar 0 centavos para R$ 0,00', () => {
    expect(formatCurrency(0)).toContain('0,00')
  })

  it('deve formatar 100 centavos para R$ 1,00', () => {
    expect(formatCurrency(100)).toContain('1,00')
  })

  it('deve formatar 25000 centavos (R$ 250,00)', () => {
    expect(formatCurrency(25000)).toContain('250,00')
  })

  it('deve formatar 29990 centavos para R$ 299,90', () => {
    expect(formatCurrency(29990)).toContain('299,90')
  })

  it('deve formatar valores grandes corretamente', () => {
    expect(formatCurrency(1250000)).toContain('12.500')
  })
})

describe('formatDate', () => {
  it('deve formatar timestamp para data brasileira', () => {
    const timestamp = new Date('2026-04-20').getTime()
    const result = formatDate(timestamp)
    expect(result).toContain('20')
    expect(result).toContain('04')
    expect(result).toContain('2026')
  })
})

describe('calculateDuration', () => {
  it('deve calcular duração em minutos corretamente', () => {
    const start = 0
    const end = 60000
    expect(calculateDuration(start, end)).toBe(1)
  })

  it('deve calcular duração de 1 hora', () => {
    const start = 0
    const end = 3600000
    expect(calculateDuration(start, end)).toBe(60)
  })

  it('deve arredondar para baixo', () => {
    const start = 0
    const end = 90000
    expect(calculateDuration(start, end)).toBe(1)
  })
})

describe('calculateValue', () => {
  it('deve calcular valor com taxa de R$ 250/hora', () => {
    expect(calculateValue(60, 25000)).toBe(25000)
  })

  it('deve calcular valor com 30 minutos', () => {
    expect(calculateValue(30, 25000)).toBe(12500)
  })

  it('deve calcular valor com taxa de R$ 300/hora', () => {
    expect(calculateValue(45, 30000)).toBe(22500)
  })

  it('deve retornar 0 para duração 0', () => {
    expect(calculateValue(0, 25000)).toBe(0)
  })
})
