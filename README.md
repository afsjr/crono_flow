# CronosFlow

Sistema de controle de tempo e faturamento para escritórios de advocacia.

---

## Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19.x | Framework UI |
| TypeScript | 5.x | Linguagem |
| Vite | 8.x | Build |
| Vitest | 4.x | Testes |
| localStorage | - | Persistência (MVP) |

---

## Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── Dashboard/        # Painel principal
│   ├── Entries/         # Lista de lançamentos
│   ├── Layout/          # Sidebar, layout
│   ├── Login/           # Tela de login
│   ├── Reports/         # Relatórios
│   ├── Timer/          # Cronômetro
│   └── Validation/      # Validação de lançamentos
├── hooks/              # Custom hooks (futuro)
├── services/           # Lógica de negócio
│   └── storage.ts      # Persistência localStorage
├── test/               # Testes unitários
│   ├── setup.ts        # Config de testes
│   ├── format.test.ts  # Testes de formatação
│   ├── storage.test.ts # Testes de storage
│   ├── types.test.ts  # Testes de tipos
│   └── utils/         # Funções de teste
├── types/             # Types globais (futuro)
├── utils/             # Funções utilitárias
│   ├── format.ts      # Formatação
│   └── validation.ts # Validação
├── App.tsx            # Componente principal
└── main.tsx           # Entry point
```

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Desenvolvimento local |
| `npm run build` | Build produção |
| `npm run preview` | Preview produção |
| `npm test` | Rodar testes |
| `npm run test:w` | Testes em watch |
| `npm run lint` | Linting |

---

## Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build produção
npm run build
```

---

## Funcionalidades

### MVP Implementado

- [x] Login com código de acesso
- [x] Seleção de usuário
- [x] Cronômetro com iniciar/parar
- [x] Modo discreto (segundo plano)
- [x] Lançamento com cliente + tarefa
- [x] Evidência URL
- [x] Validação de lançamentos
- [x] Dashboard com estatísticas
- [x] Relatórios por período
- [x] Lista de tarefas advocacia

### Futuro (Pós-MVP)

- [ ] Autenticação Google (Supabase)
- [ ] Upload de imagens
- [ ] Relatório PDF
- [ ] Notificações
- [ ] Multi-dispositivo (Supabase)

---

## Regras de Negócio

| Regra | Descrição |
|---|---|
| Código de acesso | `adv2026` |
| Status inicial | `pending` |
| Cliente obrigatório | Sim |
| Tarefa obrigatória | Sim |
| Evidência | URL ou campo livre |

---

## Deploy

### Vercel

| Setting | Value |
|---|---|
| Framework | Other |
| Root Directory | `/crono_flow` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**URL:** https://cronoflow-gig.vercel.app

---

## Testes

```bash
# Todos os testes
npm test

# Com coverage
npm run test:coverage
```

**Status atual:** 36 testes passando

---

## Contato

Desenvolvido para escritório de advocacia - controle de tempo e faturamento.

---

*Versão 1.0.0 - 21/04/2026*