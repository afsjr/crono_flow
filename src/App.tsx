import { useState, useEffect, createContext, useContext } from 'react';
import { storage } from './services/storage';
import { TASKS, type User, type Client, type Entry } from './types';
import { Clock, FolderKanban, CheckCircle, FileText, LogOut, Play, Square, Monitor, X } from 'lucide-react';

type View = 'dashboard' | 'timer' | 'entries' | 'validation' | 'reports';

interface AppContextType {
  currentUser: User | null;
  clients: Client[];
  entries: Entry[];
  users: User[];
  setView: (v: View) => void;
  addEntry: (e: Entry) => void;
  updateEntry: (e: Entry) => void;
  logout: () => void;
}

const AppCtx = createContext<AppContextType | null>(null);

const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('pt-BR');
}

function LoginScreen() {
  const [code, setCode] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    storage.init();
    setUsers(storage.getUsers());
  }, []);

  const handleLogin = () => {
    if (!storage.validateAccessCode(code)) {
      setError('Código de acesso inválido');
      return;
    }
    if (!selectedUserId) {
      setError('Selecione um usuário');
      return;
    }
    storage.setCurrentUser(selectedUserId);
    window.location.reload();
  };

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
  );
}

function Dashboard() {
  const { entries, clients } = useApp();
  
  const approvedEntries = entries.filter(e => e.status === 'approved');
  const pendingEntries = entries.filter(e => e.status === 'pending');
  
  const totalMinutes = approvedEntries.reduce((sum, e) => sum + e.durationMinutes, 0);
  const totalValue = approvedEntries.reduce((sum, e) => {
    const client = clients.find(c => c.id === e.clientId);
    return sum + (e.durationMinutes * (client?.hourlyRate || 0) / 60);
  }, 0);

  const todayEntries = entries.filter(e => {
    const today = new Date();
    const entryDate = new Date(e.createdAt);
    return entryDate.toDateString() === today.toDateString();
  });
  const todayMinutes = todayEntries.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.durationMinutes, 0);

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
              const client = clients.find(c => c.id === entry.clientId);
              return (
                <div key={entry.id} className="glass-card entry-item">
                  <div className="entry-info">
                    <div className="entry-client">{client?.name}</div>
                    <div className="entry-details">
                      {entry.taskName} • {formatDate(entry.createdAt)}
                    </div>
                  </div>
                  <div className="entry-duration">
                    {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
                  </div>
                  <span className={`status-badge ${entry.status}`}>
                    {entry.status === 'pending' ? 'Pendente' : entry.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Timer() {
  const { clients, addEntry, currentUser } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [customTask, setCustomTask] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [showCompact, setShowCompact] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        setElapsed(Date.now() - (startTime || Date.now()));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!selectedClient || !selectedTask) return;
    setStartTime(Date.now());
    setIsRunning(true);
    setShowForm(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleSave = () => {
    if (!currentUser || !selectedClient || !startTime) return;
    
    const entry: Entry = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
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
    };
    
    addEntry(entry);
    
    setIsRunning(false);
    setElapsed(0);
    setStartTime(null);
    setSelectedClient('');
    setSelectedCategory('');
    setSelectedTask('');
    setCustomTask('');
    setDescription('');
    setEvidenceUrl('');
    setShowForm(false);
  };

  const handleCancel = () => {
    setIsRunning(false);
    setElapsed(0);
    setStartTime(null);
    setShowForm(false);
  };

  const allTasks = selectedCategory ? TASKS[selectedCategory as keyof typeof TASKS] || [] : [];

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
    );
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
  );
}

function Entries() {
  const { entries, clients, currentUser } = useApp();
  
  const myEntries = entries.filter(e => e.userId === currentUser?.id);
  const sortedEntries = [...myEntries].sort((a, b) => b.createdAt - a.createdAt);

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
            const client = clients.find(c => c.id === entry.clientId);
            return (
              <div key={entry.id} className="glass-card entry-item">
                <div className="entry-info">
                  <div className="entry-client">{client?.name}</div>
                  <div className="entry-details">
                    {entry.taskName} • {formatDate(entry.createdAt)}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

function Validation() {
  const { entries, clients, updateEntry, currentUser } = useApp();
  
  const pendingEntries = entries.filter(e => e.status === 'pending');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  if (currentUser?.role === 'employee') {
    return (
      <div className="glass-card empty-state">
        Você não tem acesso a validação. Procure um supervisor.
      </div>
    );
  }

  const handleApprove = (entry: Entry) => {
    updateEntry({ ...entry, status: 'approved', updatedAt: Date.now() });
    setSelectedEntry(null);
  };

  const handleReject = (entry: Entry) => {
    if (!rejectionReason) return;
    updateEntry({ ...entry, status: 'rejected', rejectionReason, updatedAt: Date.now() });
    setSelectedEntry(null);
    setRejectionReason('');
  };

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
            const client = clients.find(c => c.id === entry.clientId);
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
                    {entry.taskName} • {formatDate(entry.createdAt)}
                  </div>
                </div>
                <div className="entry-duration">
                  {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
                </div>
                <span className="status-badge pending">Pendente</span>
              </div>
            );
          })}
        </div>
      )}
      
      {selectedEntry && (
        <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
          <div className="glass-card modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Detalhes do Lançamento</h3>
              <button className="glass-button secondary" style={{padding: '8px'}} onClick={() => setSelectedEntry(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div style={{marginBottom: '16px'}}>
              <p><strong>Cliente:</strong> {clients.find(c => c.id === selectedEntry.clientId)?.name}</p>
              <p><strong>Tarefa:</strong> {selectedEntry.taskName}</p>
              <p><strong>Duração:</strong> {Math.floor(selectedEntry.durationMinutes / 60)}h {selectedEntry.durationMinutes % 60}m</p>
              <p><strong>Descrição:</strong> {selectedEntry.description || '-'}</p>
              <p><strong>Evidência:</strong> {selectedEntry.evidenceUrl ? <a href={selectedEntry.evidenceUrl} target="_blank" rel="noopener" style={{color: 'var(--accent-blue)'}}>Acessar</a> : '-'}</p>
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
  );
}

function Reports() {
  const { entries, clients, currentUser } = useApp();
  const [selectedClient, setSelectedClient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<Entry[]>([]);
  const [showReport, setShowReport] = useState(false);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="glass-card empty-state">
        Apenas administradores podem acessar relatórios.
      </div>
    );
  }

  const generateReport = () => {
    if (!selectedClient || !startDate || !endDate) return;
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime() + 86400000;
    
    const filtered = entries.filter(e => 
      e.clientId === selectedClient && 
      e.status === 'approved' &&
      e.createdAt >= start && 
      e.createdAt < end
    );
    
    setReportData(filtered);
    setShowReport(true);
  };

  const client = clients.find(c => c.id === selectedClient);
  const totalMinutes = reportData.reduce((sum, e) => sum + e.durationMinutes, 0);
  const totalValue = totalMinutes * (client?.hourlyRate || 0) / 60;

  const copyToClipboard = () => {
    let text = `RELATÓRIO DE SERVIÇOS\n`;
    text += `${client?.name}\n`;
    text += `Período: ${startDate} a ${endDate}\n\n`;
    
    reportData.forEach(e => {
      text += `- ${e.taskName}: ${Math.floor(e.durationMinutes / 60)}h ${e.durationMinutes % 60}m\n`;
      text += `  ${e.description}\n`;
    });
    
    text += `\nTotal: ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m\n`;
    text += `Valor: ${formatCurrency(totalValue)}\n`;
    
    navigator.clipboard.writeText(text);
    alert('Copiado para clipboard!');
  };

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
                      {formatDate(e.createdAt)} • {e.description || '-'}
                    </div>
                  </div>
                  <div>
                    {Math.floor(e.durationMinutes / 60)}h {e.durationMinutes % 60}m
                  </div>
                </div>
              ))}
              
              <div className="report-total">
                <span>Total</span>
                <span>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m = {formatCurrency(totalValue)}</span>
              </div>
              
              <button className="glass-button" style={{marginTop: '16px'}} onClick={copyToClipboard}>
                Copiar para Área de Transferência
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Sidebar({ currentView, setView }: { currentView: View; setView: (v: View) => void }) {
  const { logout, currentUser } = useApp();
  
  const navItems: { id: View; label: string; icon: typeof Clock }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: FolderKanban },
    { id: 'timer', label: 'Cronômetro', icon: Clock },
    { id: 'entries', label: 'Meus Lançamentos', icon: FileText },
    { id: 'validation', label: 'Validação', icon: CheckCircle },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">CronosFlow</div>
      
      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          onClick={() => setView(item.id)}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </div>
      ))}
      
      <div className="sidebar-user">
        <p style={{marginBottom: '8px'}}>{currentUser?.name}</p>
        <button className="glass-button secondary" onClick={logout} style={{width: '100%'}}>
          <LogOut size={16} style={{marginRight: '8px'}} />
          Sair
        </button>
      </div>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    storage.init();
    const userId = storage.getCurrentUserId();
    if (userId) {
      const user = storage.getUsers().find(u => u.id === userId);
      if (user) {
        setCurrentUser(user);
        setClients(storage.getClients());
        setEntries(storage.getEntries());
        setUsers(storage.getUsers());
        setIsLoggedIn(true);
      }
    }
  }, []);

  const addEntry = (entry: Entry) => {
    storage.addEntry(entry);
    setEntries(storage.getEntries());
  };

  const updateEntry = (entry: Entry) => {
    storage.updateEntry(entry);
    setEntries(storage.getEntries());
  };

  const logout = () => {
    storage.setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn || !currentUser) {
    return <LoginScreen />;
  }

  return (
    <AppCtx.Provider value={{ currentUser, clients, entries, users, setView: setCurrentView, addEntry, updateEntry, logout }}>
      <div className="app">
        <Sidebar currentView={currentView} setView={setCurrentView} />
        <main className="main-content">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'timer' && <Timer />}
          {currentView === 'entries' && <Entries />}
          {currentView === 'validation' && <Validation />}
          {currentView === 'reports' && <Reports />}
        </main>
      </div>
    </AppCtx.Provider>
  );
}

export default App;