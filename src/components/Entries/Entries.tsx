/**
 * Lista de Lançamentos do CronosFlow
 * Exibe lançamentos do usuário atual
 */

import type { Client, Entry } from '../../types'

interface EntriesProps {
  entries: Entry[]
  clients: Client[]
  userId: string
}

export function Entries({ entries, clients, userId }: EntriesProps) {
  const myEntries = entries.filter(e => e.userId === userId)
  const sortedEntries = [...myEntries].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div>
      <h2 className="page-title">Meus Lançamentos</h2>
      
      {sortedEntries.length === 0 ? (
        <div className="glass-card empty-state">
          Nenhum lançamento ainda. Comece a usar o cronômetro!
        </div>
      ) : (
        <div className="entries-list">
          {sortedEntries.map(entry => {
            const client = clients.find(c => c.id === entry.clientId)
            return (
              <div key={entry.id} className="glass-card entry-item">
                <div className="entry-info">
                  <div className="entry-client">{client?.name}</div>
                  <div className="entry-details">
                    {entry.taskName} • {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                    {entry.description && <> • {entry.description}</>}
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
  )
}