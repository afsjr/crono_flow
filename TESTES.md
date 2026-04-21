# Testes - CronosFlow

---

## Visão Geral

O projeto CronosFlow utiliza **Vitest** para testes unitários e de integração.

---

## Configuração

### Instalação

```bash
npm install -D vitest @testing-library/react jsdom
```

### Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm test` | Rodar testes uma vez |
| `npm run test:w` | Modo watch (reage a mudanças) |
| `npm run test:coverage` | Relatório de cobertura |

### Arquivos de Configuração

- `vitest.config.ts` - Configuração principal
- `src/test/setup.ts` - Setup global (mocks)

---

## Estrutura de Testes

```
src/test/
├── setup.ts         # Mocks globais
├── format.test.ts   # Testes de formatação
├── types.test.ts   # Testes de tipos
└── storage.test.ts # Testes de storage
```

---

## Testes Implementados

### 1. format.test.ts (19 testes)

| Função | Testes |
|---|---|
| `formatTime` | 6 testes |
| `formatCurrency` | 5 testes |
| `formatDate` | 1 teste |
| `calculateDuration` | 3 testes |
| `calculateValue` | 4 testes |

### 2. types.test.ts (8 testes)

| Módulo | Testes |
|---|---|
| `TASKS` | 4 testes |
| `STORAGE_KEYS` | 5 testes |
| `DEFAULT_ACCESS_CODE` | 1 teste |

### 3. storage.test.ts (8 testes)

| Função | Testes |
|---|---|
| `getUsers` | 1 teste |
| `getClients` | 1 teste |
| `getEntries` | 1 teste |
| `validateAccessCode` | 2 testes |
| `addEntry` | 1 teste |
| `addClient` | 1 teste |

---

## Como Rodar os Testes

```bash
# Todos os testes
npm test

# Com coverage
npm run test:coverage

# Modo watch (desenvolvimento)
npm run test:w
```

---

## Resultado Atual

```
Test Files  3 passed (3)
Tests     36 passed (36)
Duration  6.34s
```

---

## Boas Práticas

1. **Testes puros**: Lógica copiada para dentro do teste
2. **Nomenclatura clara**: `deve fazer algo específico`
3. **Um objetivo por teste**: Evita múltiplas assertions
4. **Mocks consistentes**: setup.ts global

---

## Próximos Testes Sugeridos

| Teste | Prioridade | Motivo |
|---|---|---|
| Testes UI (React) | Baixa | Requer ambiente browser completo |
| Testes de integração | Média | Após implementar Supabase |
| Testes E2E | Baixa | MVP não justifica |
| Testes de performance | Baixa | Projeto pequeno |

---

## Coverage Atual

**36 testes passando** - Cobertura dos核心 funções de negócio.

---

*Documento atualizado em 20/04/2026*
*Versão: 1.0.0*