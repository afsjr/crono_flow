/**
 * Componente Sidebar do CronosFlow
 * Navegação lateral do aplicativo
 */

import { Clock, FolderKanban, CheckCircle, FileText, LogOut } from 'lucide-react'
import type { View } from '../../types'

interface SidebarProps {
  currentView: View
  onViewChange: (view: View) => void
  userName: string
  onLogout: () => void
}

const navItems: { id: View; label: string; icon: typeof Clock }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: FolderKanban },
  { id: 'timer', label: 'Cronômetro', icon: Clock },
  { id: 'entries', label: 'Meus Lançamentos', icon: FileText },
  { id: 'validation', label: 'Validação', icon: CheckCircle },
  { id: 'reports', label: 'Relatórios', icon: FileText },
]

export function Sidebar({ currentView, onViewChange, userName, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">CronosFlow</div>
      
      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          onClick={() => onViewChange(item.id)}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </div>
      ))}
      
      <div className="sidebar-user">
        <p style={{marginBottom: '8px'}}>{userName}</p>
        <button className="glass-button secondary" onClick={onLogout} style={{width: '100%'}}>
          <LogOut size={16} style={{marginRight: '8px'}} />
          Sair
        </button>
      </div>
    </aside>
  )
}