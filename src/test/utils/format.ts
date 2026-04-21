export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('pt-BR')
}

export function calculateDuration(startTime: number, endTime: number): number {
  return Math.floor((endTime - startTime) / 60000)
}

export function calculateValue(durationMinutes: number, hourlyRate: number): number {
  return Math.floor(durationMinutes * (hourlyRate / 60))
}