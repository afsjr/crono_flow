/**
 * Tela de Login do CronosFlow
 * Primeira tela mostrada ao usuário
 */

import { useState, useEffect } from 'react'
import { storage } from '../../services/storage'
import type { User } from '../../types'

interface LoginScreenProps {
  onLogin: (user: User) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [code, setCode] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [error, setError] = useState('')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    storage.init()
    setUsers(storage.getUsers())
  }, [])

  const handleLogin = () => {
    if (!storage.validateAccessCode(code)) {
      setError('Código de acesso inválido')
      return
    }
    if (!selectedUserId) {
      setError('Selecione um usuário')
      return
    }
    const user = users.find(u => u.id === selectedUserId)
    if (user) {
      storage.setCurrentUser(selectedUserId)
      onLogin(user)
    }
  }

  return (
    <div className="login-screen">
      <div className="glass-card login-box">
        <h1 className="login-title">CronosFlow</h1>
        <p className="login-subtitle">Controle de Tempo e Faturamento</p>
        
        <div className="login-form">
          <input
            type="password"
            placeholder="Código de acesso"
            className="glass-input"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          
          <select
            className="glass-input"
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
          >
            <option value="">Selecione seu nome</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          
          {error && <p style={{color: 'var(--accent-red)', fontSize: '13px'}}>{error}</p>}
          
          <button className="glass-button" onClick={handleLogin}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}