import { STORAGE_KEYS, DEFAULT_ACCESS_CODE, type User, type Client, type Entry, type AppConfig } from '../types';

const DEFAULT_USERS: User[] = [
  { id: '1', name: 'Adelino (Admin)', role: 'admin' },
  { id: '2', name: 'Marcos (Supervisor)', role: 'supervisor' },
  { id: '3', name: 'Joana', role: 'employee' },
  { id: '4', name: 'Pedro', role: 'employee' },
  { id: '5', name: 'Carla', role: 'employee' },
];

const DEFAULT_CLIENTS: Client[] = [
  { id: '1', name: 'Silva & Associados', hourlyRate: 25000, active: true },
  { id: '2', name: 'Oliveira Advocacia', hourlyRate: 30000, active: true },
  { id: '3', name: 'Santos Advocacia', hourlyRate: 28000, active: true },
  { id: '4', name: 'Pereira Sociedade de Advogados', hourlyRate: 35000, active: true },
];

const DEFAULT_CONFIG: AppConfig = {
  currentUserId: null,
  accessCode: DEFAULT_ACCESS_CODE,
};

function getItem<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  init() {
    if (!getItem(STORAGE_KEYS.USERS)) {
      setItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
    }
    if (!getItem(STORAGE_KEYS.CLIENTS)) {
      setItem(STORAGE_KEYS.CLIENTS, DEFAULT_CLIENTS);
    }
    if (!getItem(STORAGE_KEYS.ENTRIES)) {
      setItem(STORAGE_KEYS.ENTRIES, []);
    }
    if (!getItem(STORAGE_KEYS.CONFIG)) {
      setItem(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
    }
  },

  getUsers(): User[] {
    return getItem<User[]>(STORAGE_KEYS.USERS) || [];
  },

  getClients(): Client[] {
    return getItem<Client[]>(STORAGE_KEYS.CLIENTS) || [];
  },

  getEntries(): Entry[] {
    return getItem<Entry[]>(STORAGE_KEYS.ENTRIES) || [];
  },

  getConfig(): AppConfig {
    return getItem<AppConfig>(STORAGE_KEYS.CONFIG) || DEFAULT_CONFIG;
  },

  setCurrentUser(userId: string | null) {
    const config = this.getConfig();
    config.currentUserId = userId;
    setItem(STORAGE_KEYS.CONFIG, config);
  },

  getCurrentUserId(): string | null {
    return this.getConfig().currentUserId;
  },

  validateAccessCode(code: string): boolean {
    return code === DEFAULT_ACCESS_CODE;
  },

  addEntry(entry: Entry): void {
    const entries = this.getEntries();
    entries.push(entry);
    setItem(STORAGE_KEYS.ENTRIES, entries);
  },

  updateEntry(entry: Entry): void {
    const entries = this.getEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      entries[index] = entry;
      setItem(STORAGE_KEYS.ENTRIES, entries);
    }
  },

  addClient(client: Client): void {
    const clients = this.getClients();
    clients.push(client);
    setItem(STORAGE_KEYS.CLIENTS, clients);
  },

  updateClient(client: Client): void {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === client.id);
    if (index !== -1) {
      clients[index] = client;
      setItem(STORAGE_KEYS.CLIENTS, clients);
    }
  },

  deleteClient(id: string): void {
    const clients = this.getClients().filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CLIENTS, clients);
  },
};