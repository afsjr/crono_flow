# Estrutura de Dependências - CronosFlow

---

## Visão Geral da Arquitetura

Este documento descreve a estrutura de dependências do projeto para facilitar manutenção e onboarding de novos desenvolvedores.

---

## Diagrama de Arquitetura

```
src/
├── main.tsx              ← Entry point
│
└── App.tsx             ← Componente raiz
    │
    ├── components/     ← UI Components (paralelo)
    │   ├── Dashboard/
    │   ├── Entries/
    │   ├── Layout/
    │   ├── Login/
    │   ├── Reports/
    │   ├── Timer/
    │   └── Validation/
    │
    ├── services/      ← Lógica de negócio
    │   └── storage.ts
    │
    ├── types.ts       ← Tipos compartilhados
    │
    └── utils/         ← Funções utilitárias
        ├── format.ts
        └── validation.ts
```

---

## Regras de Dependência

### ✅ Permitido

| De | Para | Exemplo |
|---|---|---|
| components/* | types.ts | Dashboard → types |
| components/* | utils/* | Timer → utils/format |
| components/* | services/* | Login → storage |
| components/* | other components | App → components/* |
| services/* | types.ts | storage → types |
| utils/* | types.ts | format → types |

### ❌ Proibido

| De | Para | Motivo |
|---|---|---|
| components/* | test/* | Test files são desenvolvimento |
| services/* | components/* | Inverte camadas |
| utils/* | services/* | Utils devem ser puros |
| utils/* | components/* | Utils não sabem de UI |

---

## Análise Atual

### Circular Dependencies
```
✔ No circular dependency found!
```

### Dependency Tree

| Camada | Arquivos | Depende de |
|---|---|---|
| **Entry** | main.tsx | App.tsx, index.css |
| **Root** | App.tsx | components/*, services/*, types.ts |
| **Components** | 8 componentes | types.ts, utils/* |
| **Services** | storage.ts | types.ts |
| **Utils** | format.ts, validation.ts | types.ts |
| **Types** | types.ts | (nenhum - raiz) |

---

## Metricas

| Métrica | Valor |
|---|---|
| **Total de arquivos** | 27 |
| **Camadas de arquitetura** | 4 |
| **Dependências circulares** | 0 |
| **Maior profundidade** | 3 níveis |

### Níveis de Profundidade

| Nível | Arquivo | Depende de |
|---|---|---|
| 1 | main.tsx | 2 |
| 2 | App.tsx | 12 |
| 3 | components/*.tsx | 2 |

---

## Scripts de Verificação

```bash
# Verificar dependências circulares
npm run dep:circular

# Ver árvore de dependências
npm run dep:tree

# Gerar JSON para análise
npm run dep:analyze
```

---

## Adicionando Novos Arquivos

### Regra 1: Components

Componentes devem:
1. Ficar em `src/components/[Nome]/`
2. Ter barrel export (`index.ts`)
3. Importar tipos de `types.ts`
4. Importar utils de `utils/`

### Regra 2: Utils

Funções utilitárias devem:
1. Ficar em `src/utils/[nome].ts`
2. Ser funções puras (sem side effects)
3. Importar apenas types se necessário

### Regra 3: Services

Services devem:
1. Ficar em `src/services/[nome].ts`
2. Conter lógica de negócio
3. Importar apenas types

---

## Verificação em CI/CD

Para adicionar verificação automática, adicionar ao workflow:

```yaml
- name: Check Dependencies
  run: npm run dep:circular
```

---

## Histórico de Alterações

| Data | Alteração | Responsável |
|---|---|---|
| 21/04/2026 | Criação da arquitetura | - |

---

*Documento criado em 21/04/2026*
*Versão: 1.0.0*