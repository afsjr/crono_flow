# PRD - CronosFlow
## Product Requirements Document

---

## 1. Visão do Produto

### 1.1 Problema
O escritório de advocacia enfrenta dificuldade em:
- Controlar o tempo de trabalho dos funcionários em cada cliente
- Verificar se a precificação por hora está correta
- Garantir que o tempo seja lançado com evidência objetiva
- Validar os lançamentos antes do faturamento

### 1.2 Solução Proposta
Sistema de controle de tempo com "trava" que força o lançamento, workflow de validação supervisor, e relatórios em PDF para cobrar clientes.

### 1.3 Benefícios Principais
- Precificação precisa baseada em tempo real
- Validação com evidência objetiva
- Relatórios prontos para enviar aos clientes
- Dashboard para controle de faturamento

---

## 2. Personas

| Persona | Função | Necessidade |
|---|---|---|
| **Admin** | Dono do escritório | Ver todos os dados, gerar relatórios, controlar faturamento |
| **Supervisor** | Revisor/validador | Aprovar/rejeitar lançamentos com justificativa |
| **Funcionário** | Executor | Lançar tempo de forma rápida e simples |

---

## 3. Funcionalidades

### 3.1 Autenticação e Acesso

| ID | Funcionalidade | Descrição |
|---|---|---|
| F1 | Login simples | Código de acesso compartilhado para MVP |
| F2 | Identificação usuário | Selecionar quem está usando |
| F3 | Roles (Admin/Supervisor/Funcionário) | Controle de acesso |

### 3.2 Cadastro

| ID | Funcionalidade | Descrição |
|---|---|---|
| F4 | Cadastro de clientes | Nome + taxa por hora |
| F5 | Lista de tarefas padrão | Tarefas pré-definidas para advocacia |
| F6 | Campo "Outros" | Tarefa livre |

**Lista de Tarefas Padrão:**

| Categoria | Tarefas |
|---|---|
| **Processual** | Petição, Recurso, Mandado, Audiência, Diligência, Contestação, Réplica |
| **Administrativo** | Protocolo, Arquivo, Atendimento Telefônico, Organização de Autos |
| **Consultoria** | Parecer, Análise de Contrato, Reunião, Elaboração de Contrato |
| **Outros** | Campo livre |

### 3.3 Cronômetro

| ID | Funcionalidade | Descrição |
|---|---|---|
| F7 | Iniciar/Parar cronômetro | Contador de tempo |
| F8 | Modo discreto | Barra mínima no canto da tela |
| F9 | Associa cliente + tarefa | Vinculação necessária |

### 3.4 Lançamentos

| ID | Funcionalidade | Descrição |
|---|---|---|
| F10 | Descrição livre | Campo texto para detalhes |
| F11 | Evidência URL | Link para drive/teams/documento |
| F12 | Status padrão = "Pendente" | Aguarda validação |

### 3.5 Validação

| ID | Funcionalidade | Descrição |
|---|---|---|
| F13 | Lista de pendentes | Visualizar lançamentos aguardando |
| F14 | Aprovar lançamento | Move para "Aprovado" |
| F15 | Rejeitar com justificativa | Motivo obrigatório |
| F16 | Notificação visual | Alerta de novos lançamentos |

### 3.6 Dashboard

| ID | Funcionalidade | Descrição |
|---|---|---|
| F17 | Tempo por cliente | Total horas/cliente |
| F18 | Tempo por funcionário | Total horas/usuário |
| F19 | Tempo por tarefa | Distribuição atividades |
| F20 | Valor estimado | Taxa × horas |

### 3.7 Relatórios

| ID | Funcionalidade | Descrição |
|---|---|---|
| F21 | Gerar relatório PDF | Por Cliente + Período |
| F22 | Lista exportável | Copiar/colar para MVP |
| F23 | Dados: cliente, atividades, tempos, valor | Estrutura do relatório |

---

## 4. Epics e Stories

| Epic |Stories|Descrição|
|---|---|---|
|E1: Autenticação e Usuários|3|Código de acesso, seleção usuário, controle roles|
|E2: Cadastro|3|Clientes, tarefas padrão, campo outros|
|E3: Cronômetro|5|Iniciar/parar, modo discreto, associação, descrição, evidência|
|E4: Validação|3|Lista pendentes, aprovar, rejeitar|
|E5: Dashboard|4|Tempo cliente, tempo usuário, tempo tarefa, valor|
|E6: Relatórios|2|Lista exportável, dados por período|
|E7: UI/UX|2|Tema visual, ajustes|

**Total: ~20 stories**

---

## 5. Stack Tecnológico

| Componente | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Vite |
| Banco de dados | localStorage (MVP) |
| Estilização | CSS (Glassmorphismo) |
| Relatórios | jsPDF |
| Ícones | Lucide React |

---

## 6. Cronograma MVP

| Fase | Estimativa |
|---|---|
| Setup projeto | 30 min |
| Autenticação | 1 hora |
| Cadastro | 1 hora |
| Cronômetro | 2 horas |
| Validação | 1 hora |
| Dashboard | 1 hora |
| Relatórios | 1 hora |
| **Total** | **~8 horas** |

---

## 7. Status das Fases

- [x] Fase 1: Análise
- [ ] Fase 2: PRD
- [ ] Fase 3: Arquitetura
- [ ] Fase 4: Implementação

---

## 8. Custos Estimados (Mensal)

| Recurso | Plano | Custo |
|---|---|---|
| Supabase | Free | R$ 0 |
| Hospedagem | Vercel (Free) | R$ 0 |
| **Total** | | **R$ 0** |

---

*Documento criado em: 20/04/2026*
*Próximo passo: Arquitetura e implementação*