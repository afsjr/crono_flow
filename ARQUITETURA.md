# Arquitetura - CronosFlow
## Technical Architecture Document

---

## 1. Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Login   │  │Dashboard│  │Cronômetro│  │Relatórios│    │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘     │
│       └──────────────┼──────────────┴──────────────┘         │
│                     │                                    │
│              ┌─────▼─────┐                              │
│              │  Services │                              │
│              │ (lógica)  │                              │
│              └─────┬─────┘                              │
└──────────────────┼──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                  DADOS                                   │
│              localStorage                                │
│         ┌────────┬────────┬────────┐                  │
│         │clients │users  │entries │                   │
│         └────────┴────────┴────────┘                  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológico

| Componente | Tecnologia | Versão |
|---|---|---|
| Framework | React | 18.x |
| Linguagem | TypeScript | 5.x |
| Build | Vite | 5.x |
| Estado | React Context | - |
| Persistência | localStorage | - |
| Estilização | CSS Modules | - |
| Ícones | Lucide React | latest |
| PDF | jsPDF | latest |

---

## 3. Estrutura de Dados

### 3.1 Schema - localStorage

```typescript
// Usuários
interface User {
  id: string;
  name: string;
  role: 'admin' | 'supervisor' | 'employee';
}

// Clientes
interface Client {
  id: string;
  name: string;
  hourlyRate: number; // em centavos
  active: boolean;
}

// Lançamentos
interface Entry {
  id: string;
  userId: string;
  clientId: string;
  taskCategory: string;
  taskName: string;
  description: string;
  startTime: number; // timestamp
  endTime: number; // timestamp
  durationMinutes: number;
  evidenceUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: number;
  updatedAt: number;
}
```

### 3.2 Estrutura localStorage

| Chave | Conteúdo |
|---|---|
| `cronoflow_users` | Array de User[] |
| `cronoflow_clients` | Array de Client[] |
| `cronoflow_entries` | Array de Entry[] |
| `cronoflow_session` | userId atual |
| `cronoflow_config` | Configurações do app |

---

## 4. Componentes e Módulos

### 4.1 Estrutura de Arquivos

```
src/
├── components/
│   ├── Login/
│   │   └── LoginScreen.tsx
│   ├── Dashboard/
│   │   ├── StatsCard.tsx
│   │   └── Charts.tsx
│   ├── Timer/
│   │   ├── Timer.tsx
│   │   └── CompactMode.tsx
│   ├── Entry/
│   │   ├── EntryForm.tsx
│   │   └── EntryList.tsx
│   ├── Validation/
│   │   └── ValidationPanel.tsx
│   └── Report/
│       └── ReportGenerator.tsx
├── services/
│   ├── storage.ts
│   ├── entries.ts
│   └── reports.ts
├── context/
│   └── AppContext.tsx
├── types/
│   └── index.ts
├── data/
│   └── tasks.ts
├── styles/
│   └── global.css
├── App.tsx
└── main.tsx
```

### 4.2 Dependências entre Módulos

```
App.tsx
├── AppContext (estado global)
├── LoginScreen (se não autenticado)
└── MainLayout (se autenticado)
    ├── Sidebar
    ├── DashboardView
    ├── TimerView
    ├── EntriesView
    ├── ValidationView
    └── ReportsView
```

---

## 5. Fluxos de Usuário

### 5.1 Fluxo: Login

```
1. Usuário abre app
2. Se não há session → mostra LoginScreen
3. Usuário insere código + seleciona nome
4. Valida no localStorage
5. Se válido → redireciona para Dashboard
```

### 5.2 Fluxo: Lançamento

```
1. Seleciona cliente (obrigatório)
2. Seleciona tarefa (obrigatório)
3. Clica "Iniciar" → cronômetro inicia
4. Trabalha...
5. Clica "Parar"
6. Preenche descrição (opcional)
7. Preenche evidência URL (opcional)
8. Clica "Salvar" → status = "pending"
9. Retorna para Dashboard
```

### 5.3 Fluxo: Validação

```
1. Supervisor acessa "Validação"
2. Vê lista de pendentes
3. Clica em um lançamento
4. Vê detalhes + evidência
5. Aprovar → status = "approved"
   OU
   Rejeitar → preenche justificativa → status = "rejected"
```

### 5.4 Fluxo: Relatório

```
1. Admin acessa "Relatórios"
2. Seleciona cliente
3. Seleciona período
4. Clica "Gerar"
5. Visualiza lista + valor total
6. Exporta para copiar ou gera PDF
```

---

## 6. Regras de Negócio

| Regra | Descrição |
|---|---|
| R1 | Cliente é obrigatório para iniciar cronômetro |
| R2 | Tarefa é obrigatória para iniciar cronômetro |
| R3 | Status inicial de lançamento = "pending" |
| R4 | Apenas supervisor pode aprovar/rejeitar |
| R5 | Rejeição requer justificativa |
| R6 | Only admin pode acessar Relatórios |
| R7 | Cálculo valor = durationMinutes × (hourlyRate / 60) |

---

## 7. Lista de Tarefas Padrão

```typescript
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
};
```

---

## 8. Considerações de Segurança

| Item | Observação |
|---|---|
| localStorage | Dados sensíveis no navegador do usuário |
| Código de acesso | Simples, para MVP |
| Limpeza | dados podem ser limpos ao limpar cache |
| produção | Em produção, usar Supabase Auth |

---

## 9. Fatores Não-Funcionais

| Requisito | Target |
|---|---|
| Performance | < 100ms para renderizar |
| Usabilidade | Intuitivo, mínimo 3 cliques |
| Responsividade | Desktop only (MVP) |
| Compatibilidade | Chrome, Firefox, Edge |

---

## 10. Decisões Técnicas (ADRs)

| ADR | Decisão | Rationale |
|---|---|---|
| ADR-001 | localStorage para MVP | Simplificar teste inicial sem backend |
| ADR-002 | React Context | Estado simples, não precisa Redux/Zustand |
| ADR-003 | CSS puro | Theme glassmorphism, sem bibliotecas |
| ADR-004 | Código de acesso | Auth simples para MVP |

---

*Documento criado em: 20/04/2026*
*Próximo passo: Implementação*