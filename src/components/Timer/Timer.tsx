/**
 * Cronômetro do CronosFlow
 * Componente para registrar tempo de trabalho
 */

import { useState, useEffect } from 'react'
import { Play, Square, Monitor } from 'lucide-react'
import { formatTime } from '../../utils/format'
import type { Client, Entry } from '../../types'
import { TASKS } from '../../types'
import { generateId } from '../../utils/format'

interface TimerProps {
  clients: Client[]
  onSave: (entry: Entry) => void
}

export function Timer({ clients, onSave }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTask, setSelectedTask] = useState('')
  const [customTask, setCustomTask] = useState('')
  const [description, setDescription] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [showCompact, setShowCompact] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let interval: number
    if (isRunning) {
      interval = window.setInterval(() => {
        setElapsed(Date.now() - (startTime || Date.now()))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, startTime])

  const handleStart = () => {
    if (!selectedClient || !selectedTask) return
    setStartTime(Date.now())
    setIsRunning(true)
    setShowForm(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleSave = () => {
    if (!selectedClient || !startTime) return
    
    const entry: Entry = {
      id: generateId(),
      userId: 'current', // TODO: hook de auth
      clientId: selectedClient,
      taskCategory: selectedCategory,
      taskName: selectedTask === 'outros' ? customTask : selectedTask,
      description,
      startTime,
      endTime: Date.now(),
      durationMinutes: Math.floor(elapsed / 60000),
      evidenceUrl,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    onSave(entry)
    
    setIsRunning(false)
    setElapsed(0)
    setStartTime(null)
    setSelectedClient('')
    setSelectedCategory('')
    setSelectedTask('')
    setCustomTask('')
    setDescription('')
    setEvidenceUrl('')
    setShowForm(false)
  }

  const handleCancel = () => {
    setIsRunning(false)
    setElapsed(0)
    setStartTime(null)
    setShowForm(false)
  }

  const allTasks = selectedCategory ? TASKS[selectedCategory as keyof typeof TASKS] || [] : []

  if (showCompact) {
    return (
      <div className="compact-mode">
        <div className="compact-info">
          {clients.find(c => c.id === selectedClient)?.name}
        </div>
        <div className={`compact-timer ${isRunning ? 'timer-running' : 'timer-stopped'}`}>
          {formatTime(elapsed)}
        </div>
        <button 
          className="glass-button danger"
          style={{padding: '8px 16px'}}
          onClick={() => setShowCompact(false)}
        >
          Sair
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="page-title">Cronômetro</h2>
      
      {!showForm ? (
        <div className="glass-card timer-section">
          <div className="form-group" style={{marginBottom: '24px'}}>
            <label className="form-label">Cliente</label>
            <select
              className="glass-input"
              value={selectedClient}
              onChange={e => setSelectedClient(e.target.value)}
              disabled={isRunning}
            >
              <option value="">Selecione o cliente</option>
              {clients.filter(c => c.active).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group" style={{marginBottom: '24px'}}>
            <label className="form-label">Categoria</label>
            <select
              className="glass-input"
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setSelectedTask(''); }}
              disabled={isRunning}
            >
              <option value="">Selecione a categoria</option>
              <option value="processual">Processual</option>
              <option value="administrativo">Administrativo</option>
              <option value="consultoria">Consultoria</option>
            </select>
          </div>
          
          {selectedCategory && (
            <div className="form-group" style={{marginBottom: '24px'}}>
              <label className="form-label">Tarefa</label>
              <select
                className="glass-input"
                value={selectedTask}
                onChange={e => setSelectedTask(e.target.value)}
                disabled={isRunning}
              >
                <option value="">Selecione a tarefa</option>
                {allTasks.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
                <option value="outros">Outros...</option>
              </select>
              {selectedTask === 'outros' && (
                <input
                  type="text"
                  placeholder="Descreva a tarefa"
                  className="glass-input"
                  style={{marginTop: '8px'}}
                  value={customTask}
                  onChange={e => setCustomTask(e.target.value)}
                />
              )}
            </div>
          )}
          
          <button
            className="glass-button"
            onClick={handleStart}
            disabled={!selectedClient || !selectedTask}
          >
            <Play size={20} style={{marginRight: '8px'}} />
            Iniciar
          </button>
        </div>
      ) : (
        <div className="glass-card timer-section">
          <div className={`timer-display ${isRunning ? 'timer-running' : 'timer-stopped'}`}>
            {formatTime(elapsed)}
          </div>
          
          {isRunning && (
            <button className="glass-button danger" onClick={handleStop}>
              <Square size={20} style={{marginRight: '8px'}} />
              Parar
            </button>
          )}
          
          {!isRunning && (
            <div style={{marginTop: '24px'}}>
              <div className="form-group" style={{marginBottom: '16px'}}>
                <label className="form-label">Descrição (opcional)</label>
                <textarea
                  className="glass-input"
                  rows={3}
                  placeholder="O que você fez?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              
              <div className="form-group" style={{marginBottom: '24px'}}>
                <label className="form-label">Evidência URL (opcional)</label>
                <input
                  type="text"
                  placeholder="Link para arquivo, drive, Teams..."
                  className="glass-input"
                  value={evidenceUrl}
                  onChange={e => setEvidenceUrl(e.target.value)}
                />
              </div>
              
              <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                <button className="glass-button secondary" onClick={handleCancel}>
                  Cancelar
                </button>
                <button className="glass-button success" onClick={handleSave}>
                  Salvar Lançamento
                </button>
              </div>
            </div>
          )}
          
          <button
            className="glass-button secondary"
            style={{marginTop: '24px'}}
            onClick={() => setShowCompact(true)}
          >
            <Monitor size={18} style={{marginRight: '8px'}} />
            Modo Discreto
          </button>
        </div>
      )}
    </div>
  )
}