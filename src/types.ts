export type View = 'dashboard' | 'timer' | 'entries' | 'validation' | 'reports';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'supervisor' | 'employee';
}

export interface Client {
  id: string;
  name: string;
  hourlyRate: number;
  active: boolean;
}

export interface Entry {
  id: string;
  userId: string;
  clientId: string;
  taskCategory: string;
  taskName: string;
  description: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  evidenceUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppConfig {
  currentUserId: string | null;
  accessCode: string;
}

export const STORAGE_KEYS = {
  USERS: 'cronoflow_users',
  CLIENTS: 'cronoflow_clients',
  ENTRIES: 'cronoflow_entries',
  SESSION: 'cronoflow_session',
  CONFIG: 'cronoflow_config',
} as const;

export const DEFAULT_ACCESS_CODE = 'adv2026';

export const TASKS = {
  processual: [
    'Petição',
    'Recurso',
    'Mandado',
    'Audiência',
    'Diligência',
    'Contestação',
    'Réplica'
  ],
  administrativo: [
    'Protocolo',
    'Arquivo',
    'Atendimento Telefônico',
    'Organização de Autos'
  ],
  consultoria: [
    'Parecer',
    'Análise de Contrato',
    'Reunião',
    'Elaboração de Contrato'
  ]
} as const;