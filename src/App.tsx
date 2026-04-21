/**
 * CronosFlow - Aplicação Principal
 * Sistema de controle de tempo e faturamento para escritórios de advocacia
 */

import { useState, useEffect } from 'react'
import { storage } from './services/storage'
import type { User, Client, Entry, View } from './types'

import { LoginScreen } from './components/Login'
import { Sidebar } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { Timer } from './components/Timer'
import { Entries } from './components/Entries'
import { Validation } from './components/Validation'
import { Reports } from './components/Reports'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    storage.init()
    const userId = storage.getCurrentUserId()
    if (userId) {
      const user = storage.getUsers().find(u => u.id === userId)
      if (user) {
        setCurrentUser(user)
        setClients(storage.getClients())
        setEntries(storage.getEntries())
        setIsLoggedIn(true)
      }
    }
  }, [])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setClients(storage.getClients())
    setEntries(storage.getEntries())
    setIsLoggedIn(true)
  }

  const handleSaveEntry = (entry: Entry) => {
    const newEntry = { ...entry, userId: currentUser?.id || 'unknown' }
    storage.addEntry(newEntry)
    setEntries(storage.getEntries())
  }

  const handleApproveEntry = (entry: Entry) => {
    storage.updateEntry({ ...entry, status: 'approved', updatedAt: Date.now() })
    setEntries(storage.getEntries())
  }

  const handleRejectEntry = (entry: Entry, reason: string) => {
    storage.updateEntry({ ...entry, status: 'rejected', rejectionReason: reason, updatedAt: Date.now() })
    setEntries(storage.getEntries())
  }

  const handleLogout = () => {
    storage.setCurrentUser(null)
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  if (!isLoggedIn || !currentUser) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        userName={currentUser.name}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard entries={entries} clients={clients} />}
        {currentView === 'timer' && <Timer clients={clients} onSave={handleSaveEntry} />}
        {currentView === 'entries' && <Entries entries={entries} clients={clients} userId={currentUser.id} />}
        {currentView === 'validation' && (
          <Validation 
            entries={entries} 
            clients={clients} 
            userRole={currentUser.role}
            onApprove={handleApproveEntry}
            onReject={handleRejectEntry}
          />
        )}
        {currentView === 'reports' && <Reports entries={entries} clients={clients} userRole={currentUser.role} />}
      </main>
    </div>
  )
}