/**
 * Utilities de validação para o CronosFlow
 * Centraliza funções de validação
 */

import type { Entry, Client, User } from '../types'

/**
 * Valida se um lançamento é válido
 * @param entry - Lançamento a validar
 * @returns Objeto com errosfound
 */
export function validateEntry(entry: Partial<Entry>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!entry.userId) errors.push('Usuário é obrigatório')
  if (!entry.clientId) errors.push('Cliente é obrigatório')
  if (!entry.taskName) errors.push('Tarefa é obrigatória')
  if (!entry.startTime) errors.push('Hora de início é obrigatória')
  if (!entry.endTime) errors.push('Hora de fim é obrigatória')
  if (entry.startTime && entry.endTime && entry.endTime < entry.startTime) {
    errors.push('Hora de fim deve ser maior que hora de início')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Valida se um cliente é válido
 * @param client - Cliente a validar
 * @returns Objeto com erros
 */
export function validateClient(client: Partial<Client>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!client.name?.trim()) errors.push('Nome é obrigatório')
  if (!client.hourlyRate || client.hourlyRate <= 0) errors.push('Taxa horária deve ser maior que zero')

  return { valid: errors.length === 0, errors }
}

/**
 * Valida se um usuário é válido
 * @param user - Usuário a validar
 * @returns Objeto com erros
 */
export function validateUser(user: Partial<User>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!user.name?.trim()) errors.push('Nome é obrigatório')
  if (!user.role) errors.push('Função é obrigatória')

  return { valid: errors.length === 0, errors }
}

/**
 * Verifica se usuário pode validar Entries
 * @param user - Usuário
 * @returns true se for admin ou supervisor
 */
export function canValidate(user: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'supervisor'
}

/**
 * Verifica se usuário pode ver relatórios
 * @param user - Usuário
 * @returns true se for admin
 */
export function canViewReports(user: User | null): boolean {
  return user?.role === 'admin'
}