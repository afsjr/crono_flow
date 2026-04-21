/**
 * Relatórios do CronosFlow
 * Geração de relatórios por cliente e período
 */

import { useState } from 'react'
import { formatCurrency, formatDurationReadable } from '../../utils/format'
import type { Client, Entry } from '../../types'

interface ReportsProps {
  entries: Entry[]
  clients: Client[]
  userRole: string
}

export function Reports({ entries, clients, userRole }: ReportsProps) {
  const [selectedClient, setSelectedClient] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reportData, setReportData] = useState<Entry[]>([])
  const [showReport, setShowReport] = useState(false)

  if (userRole !== 'admin') {
    return (
      <div className="glass-card empty-state">
        Apenas administradores podem acessar relatórios.
      </div>
    )
  }

  const generateReport = () => {
    if (!selectedClient || !startDate || !endDate) return
    
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime() + 86400000
    
    const filtered = entries.filter(e => 
      e.clientId === selectedClient && 
      e.status === 'approved' &&
      e.createdAt >= start && 
      e.createdAt < end
    )
    
    setReportData(filtered)
    setShowReport(true)
  }

  const client = clients.find(c => c.id === selectedClient)
  const totalMinutes = reportData.reduce((sum, e) => sum + e.durationMinutes, 0)
  const totalValue = totalMinutes * (client?.hourlyRate || 0) / 60

  const copyToClipboard = () => {
    let text = 'RELATÓRIO DE SERVIÇOS\n'
    text += `${client?.name}\n`
    text += `Período: ${startDate} a ${endDate}\n\n`
    
    reportData.forEach(e => {
      text += `- ${e.taskName}: ${Math.floor(e.durationMinutes / 60)}h ${e.durationMinutes % 60}m\n`
      text += `  ${e.description}\n`
    })
    
    text += `\nTotal: ${formatDurationReadable(totalMinutes)}\n`
    text += `Valor: ${formatCurrency(totalValue)}\n`
    
    navigator.clipboard.writeText(text)
    alert('Copiado para clipboard!')
  }

  return (
    <div>
      <h2 className="page-title">Relatórios</h2>
      
      <div className="glass-card" style={{padding: '20px'}}>
        <div className="report-filters">
          <div className="form-group" style={{flex: 1}}>
            <label className="form-label">Cliente</label>
            <select
              className="glass-input"
              value={selectedClient}
              onChange={e => setSelectedClient(e.target.value)}
            >
              <option value="">Selecione</option>
              {clients.filter(c => c.active).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group" style={{flex: 1}}>
            <label className="form-label">Data Início</label>
            <input
              type="date"
              className="glass-input"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="form-group" style={{flex: 1}}>
            <label className="form-label">Data Fim</label>
            <input
              type="date"
              className="glass-input"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
        
        <button className="glass-button" onClick={generateReport}>
          Gerar Relatório
        </button>
      </div>
      
      {showReport && (
        <div className="glass-card report-preview" style={{marginTop: '24px'}}>
          <h3 style={{marginBottom: '16px'}}>{client?.name}</h3>
          <p style={{color: 'var(--text-secondary)', marginBottom: '16px'}}>
            Período: {startDate} a {endDate}
          </p>
          
          {reportData.length === 0 ? (
            <div className="empty-state">Nenhum dado no período</div>
          ) : (
            <>
              {reportData.map(e => (
                <div key={e.id} className="report-line">
                  <div>
                    <div>{e.taskName}</div>
                    <div style={{fontSize: '13px', color: 'var(--text-secondary)'}}>
                      {new Date(e.createdAt).toLocaleDateString('pt-BR')} • {e.description || '-'}
                    </div>
                  </div>
                  <div>
                    {Math.floor(e.durationMinutes / 60)}h {e.durationMinutes % 60}m
                  </div>
                </div>
              ))}
              
              <div className="report-total">
                <span>Total</span>
                <span>{formatDurationReadable(totalMinutes)} = {formatCurrency(totalValue)}</span>
              </div>
              
              <button className="glass-button" style={{marginTop: '16px'}} onClick={copyToClipboard}>
                Copiar para Área de Transferência
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}