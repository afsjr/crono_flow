/**
 * Utilities de formatação para o CronosFlow
 * Centraliza funções de formatação para reutilização
 */

/**
 * Formata milliseconds para formato HH:MM:SS
 * @param ms - Tempo em milliseconds
 * @returns String formatada (ex: "01:30:00")
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Formata centavos para moeda brasileira
 * @param cents - Valor em centavos
 * @returns String formatada (ex: "R$ 250,00")
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

/**
 * Formata timestamp para data brasileira
 * @param ts - Timestamp em milliseconds
 * @returns Data formatada (ex: "20/04/2026")
 */
export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('pt-BR')
}

/**
 * Calcula duração em minutos entre dois timestamps
 * @param startTime - Timestamp inicial
 * @param endTime - Timestamp final
 * @returns Duração em minutos
 */
export function calculateDuration(startTime: number, endTime: number): number {
  return Math.floor((endTime - startTime) / 60000)
}

/**
 * Calcula valor a cobrar baseado em duração e taxa horária
 * @param durationMinutes - Duração em minutos
 * @param hourlyRate - Taxa por hora em centavos
 * @returns Valor em centavos
 */
export function calculateValue(durationMinutes: number, hourlyRate: number): number {
  return Math.floor(durationMinutes * (hourlyRate / 60))
}

/**
 * Formata duração em minutos parastring legível
 * @param minutes - Minutos
 * @returns String formatada (ex: "1h 30m")
 */
export function formatDurationReadable(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Gera ID único
 * @returns UUID único
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Valida URL
 * @param url - String a validar
 * @returns true se for URL válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}