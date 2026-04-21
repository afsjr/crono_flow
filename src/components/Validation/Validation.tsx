/**
 * Validação de Lançamentos do CronosFlow
 * Interface para supervisors validarem Entries
 */

import { useState } from 'react'
import type { Client, Entry } from '../../types'

interface ValidationProps {
  entries: Entry[]
  clients: Client[]
  userRole: string
  onApprove: (entry: Entry) => void
  onReject: (entry: Entry, reason: string) => void
}

export function Validation({ entries, clients, userRole, onApprove, onReject }: ValidationProps) {
  const pendingEntries = entries.filter(e => e.status === 'pending')
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  if (userRole === 'employee') {
    return (
      <div className="glass-card empty-state">
        Você não tem acesso a validação. Procure um supervisor.
      </div>
    )
  }

  const handleApprove = (entry: Entry) => {
    onApprove(entry)
    setSelectedEntry(null)
  }

  const handleReject = (entry: Entry) => {
    if (!rejectionReason) return
    onReject(entry, rejectionReason)
    setSelectedEntry(null)
    setRejectionReason('')
  }

  return (
    <div>
      <h2 className="page-title">Validação</h2>
      
      {pendingEntries.length === 0 ? (
        <div className="glass-card empty-state">
          Nenhum lançamento pendente para validar.
        </div>
      ) : (
        <div className="entries-list">
          {pendingEntries.map(entry => {
            const client = clients.find(c => c.id === entry.clientId)
            return (
              <div 
                key={entry.id} 
                className="glass-card entry-item"
                onClick={() => setSelectedEntry(entry)}
                style={{cursor: 'pointer'}}
              >
                <div className="entry-info">
                  <div className="entry-client">{client?.name}</div>
                  <div className="entry-details">
                    {entry.taskName} • {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="entry-duration">
                  {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
                </div>
                <span className="status-badge pending">Pendente</span>
              </div>
            )
          })}
        </div>
      )}
      
      {selectedEntry && (
        <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
          <div className="glass-card modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Detalhes do Lançamento</h3>
              <button 
                className="glass-button secondary" 
                style={{padding: '8px'}} 
                onClick={() => setSelectedEntry(null)}
              >
                ✕
              </button>
            </div>
            
            <div style={{marginBottom: '16px'}}>
              <p><strong>Cliente:</strong> {clients.find(c => c.id === selectedEntry.clientId)?.name}</p>
              <p><strong>Tarefa:</strong> {selectedEntry.taskName}</p>
              <p><strong>Duração:</strong> {Math.floor(selectedEntry.durationMinutes / 60)}h {selectedEntry.durationMinutes % 60}m</p>
              <p><strong>Descrição:</strong> {selectedEntry.description || '-'}</p>
              <p>
                <strong>Evidência:</strong> {selectedEntry.evidenceUrl 
                  ? <a href={selectedEntry.evidenceUrl} target="_blank" rel="noopener" style={{color: 'var(--accent-blue)'}}>Acessar</a> 
                  : '-'}
              </p>
            </div>
            
            <div className="form-group" style={{marginBottom: '16px'}}>
              <label className="form-label">Justificativa (para rejeição)</label>
              <textarea
                className="glass-input"
                rows={3}
                placeholder="Motivo da rejeição..."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
              />
            </div>
            
            <div className="validation-actions">
              <button 
                className="glass-button danger"
                onClick={() => handleReject(selectedEntry)}
                disabled={!rejectionReason}
              >
                Rejeitar
              </button>
              <button 
                className="glass-button success"
                onClick={() => handleApprove(selectedEntry)}
              >
                Aprovar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}