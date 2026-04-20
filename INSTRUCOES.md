# CronosFlow - Instruções de Uso

---

## O que é o CronosFlow?

O CronosFlow é um sistema de controle de tempo e faturamento para seu escritório de advocacia. Ele permite que você registre o tempo de trabalho em cada cliente, valide os lançamentos e gere relatórios para cobrar seus clientes.

---

## Como Acessar

### 1. Credenciais de Acesso

| Informação | Dados |
|---|---|
| **Código de acesso** | `adv2026` |
| **URL** | http://localhost:5173 (ambiente local) |

### 2. Usuários de Teste

| Nome | Função |
|---|---|
| Adelino (Admin) | Dono do escritório - acesso total |
| Marcos (Supervisor) | Pode validar lançamentos |
| Joana | Funcionário |
| Pedro | Funcionário |
| Carla | Funcionário |

### 3. Clientes de Teste

| Cliente | Taxa por Hora |
|---|---|
| Silva & Associados | R$ 250,00 |
| Oliveira Advocacia | R$ 300,00 |
| Santos Advocacia | R$ 280,00 |
| Pereira Sociedade de Advogados | R$ 350,00 |

---

## Como Usar - Passo a Passo

### Passo 1: Login

1. Abra o aplicativo no navegador
2. Digite o código de acesso: `adv2026`
3. Selecione seu nome na lista
4. Clique em "Entrar"

### Passo 2: Registrar Tempo (Funcionário)

1. Vá para a seção **Cronômetro**
2. Selecione o **cliente** (obrigatório)
3. Selecione a **categoria** da tarefa:
   - Processual
   - Administrativo
   - Consultoria
4. Selecione a **tarefa** (ou escolha "Outros" para自定义)
5. Clique em **Iniciar** para começar o cronômetro
6. Quando terminar, clique em **Parar**
7. Adicione uma **descrição** do que fez (opcional)
8. Adicione uma **evidência** (link para arquivo, Drive, Teams, etc)
9. Clique em **Salvar Lançamento**

O lançamento ficará com status "Pendente" até ser validado.

### Passo 3: Modo Discreto

Enquanto o cronômetro está rodando, você pode ativar o **Modo Discreto**:
- Clique no botão "Modo Discreto"
- O app será minimizado para uma barra no canto da tela
- Ainda mostra o tempo decorrendo
- Para sair, clique em "Sair"

### Passo 4: Validar Lançamentos (Supervisor/Admin)

1. Vá para a seção **Validação**
2. Veja todos os lançamentos com status "Pendente"
3. Clique em um lançamento para ver os detalhes
4. Clique em **Aprovar** se estiver correto
   OU
5. Clique em **Rejeitar** e adicione uma justificativa

### Passo 5: Gerar Relatórios (Admin)

1. Vá para a seção **Relatórios**
2. Selecione o **cliente**
3. Escolha o **período** (data início e data fim)
4. Clique em **Gerar Relatório**
5. Veja o total de horas e valor a cobrar
6. Clique em **Copiar para Área de Transferência** para colar em um email ou documento

---

## Fluxo de Trabalho Resumido

```
Funcionário                      Supervisor                    Admin
    │                              │                           │
    ├── registra tempo ──────────►│                           │
    │  (status: Pendente)         │                           │
    │                           valida ──────────────────────►│
    │                           (aprovado/rejeitado)          │
    │                                                      │
    │                                                      └───► relatório PDF
                                                                    │
                                                             cobra cliente
```

---

## Lista de Tarefas Disponíveis

### Processual
- Petição
- Recurso
- Mandado
- Audiência
- Diligência
- Contestação
- Réplica

### Administrativo
- Protocolo
- Arquivo
- Atendimento Telefônico
- Organização de Autos

### Consultoria
- Parecer
- Análise de Contrato
- Reunião
- Elaboração de Contrato

### Outros
- Campo livre para自定义

---

## Perguntas Frequentes

**P: Posso editar um lançamento depois de salvo?**
R: Não diretamente. Se precisar alterar, o supervisor pode rejeitar e você pode lançar novamente.

**P: O que acontece se eu fechar o navegador com o cronômetro ligado?**
R: O tempo será perdido. Sempre pare o cronômetro antes de fechar.

**P: Posso ter múltiplos lançamentos ao mesmo tempo?**
R: Sim, mas recomendado um lançamento por vez para garantir precisão.

**P: Os dados ficamsalvos onde?**
R: No navegador (localStorage). Limpar o cache do navegador pode apagar os dados.

---

## Limitações do MVP (Teste)

- Dados ficam no navegador (não sincroniza entre dispositivos)
- Relatório é texto (não PDF ainda)
- Sem upload de imagens (apenas URL)
- Sem notificação automática

Essas funcionalidades serão adicionadasna versão completa.

---

## Contato para Suporte

Em caso de dúvidas ou problemas, entre em contato com o desenvolvedor.

---

*Documento criado em 20/04/2026*
*Versão: MVP 1.0 (Teste)*