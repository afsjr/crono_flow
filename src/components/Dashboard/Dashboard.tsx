/**
 * Dashboard do CronosFlow
 * Painel principal com estatísticas
 */

import { formatCurrency } from '../../utils/format'
import type { Client, Entry } from '../../types'

interface DashboardProps {
  entries: Entry[]
  clients: Client[]
}

export function Dashboard({ entries, clients }: DashboardProps) {
  const approvedEntries = entries.filter(e => e.status === 'approved')
  const pendingEntries = entries.filter(e => e.status === 'pending')
  
  const totalMinutes = approvedEntries.reduce((sum, e) => sum + e.durationMinutes, 0)
  const totalValue = approvedEntries.reduce((sum, e) => {
    const client = clients.find(c => c.id === e.clientId)
    return sum + (e.durationMinutes * (client?.hourlyRate || 0) / 60)
  }, 0)

  const todayEntries = entries.filter(e => {
    const today = new Date()
    const entryDate = new Date(e.createdAt)
    return entryDate.toLocaleDateString() === today.toLocaleDateString()
  })
  const todayMinutes = todayEntries.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.durationMinutes, 0)

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      
      <div className="stats-grid">
        <div className="glass-card stats-card">
          <div className="stats-label">Hoje</div>
          <div className="stats-value blue">{Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m</div>
        </div>
        <div className="glass-card stats-card">
          <div className="stats-label">Total Horas</div>
          <div className="stats-value purple">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</div>
        </div>
        <div className="glass-card stats-card">
          <div className="stats-label">Pendente</div>
          <div className="stats-value" style={{color: '#fbbf24'}}>{pendingEntries.length}</div>
        </div>
        <div className="glass-card stats-card">
          <div className="stats-label">Faturado</div>
          <div className="stats-value green">{formatCurrency(totalValue)}</div>
        </div>
      </div>

      <div className="glass-card" style={{padding: '20px'}}>
        <h3 style={{marginBottom: '16px'}}>Atividade Recente</h3>
        {entries.length === 0 ? (
          <div className="empty-state">Nenhuma atividade ainda</div>
        ) : (
          <div className="entries-list">
            {entries.slice(-5).reverse().map(entry => {
              const client = clients.find(c => c.id === entry.clientId)
              return (
                <div key={entry.id} className="glass-card entry-item">
                  <div className="entry-info">
                    <div className="entry-client">{client?.name}</div>
                    <div className="entry-details">
                      {entry.taskName} • {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="entry-duration">
                    {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
                  </div>
                  <span className={`status-badge ${entry.status}`}>
                    {entry.status === 'pending' ? 'Pendente' : entry.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}