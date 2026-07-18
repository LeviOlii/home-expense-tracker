# Home Expense Tracker

Sistema simples de controle de gastos residenciais: cadastro de pessoas, cadastro de transações (receitas/despesas) e consulta de totais (por pessoa e geral).

Desenvolvido como desafio técnico, com foco em código limpo e legível e separação clara de responsabilidades, sem arquitetura desnecessária pro tamanho do projeto.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | .NET 10 / C#, ASP.NET Core Web API |
| ORM | Entity Framework Core |
| Banco de dados | SQLite (arquivo local, persiste entre execuções) |
| Frontend | React + TypeScript |
| Documentação da API | Swagger / OpenAPI |

## Arquitetura

O backend segue uma estrutura em camadas simples — sem camada de Repository, já que o `DbContext` do EF Core já cumpre esse papel num projeto desse tamanho:

```
Requisição HTTP
     │
     ▼
Controller   → recebe a requisição, delega pro service
     │
     ▼
Service      → regra de negócio mora aqui (validações, cálculos)
     │
     ▼
DbContext    → EF Core, conversa com o banco
     │
     ▼
SQLite (home-expense-tracker.db)
```

**DTOs** são usados na borda da API em vez de expor as entidades do EF Core diretamente — isso deixa o contrato da API explícito e evita vazar detalhes do banco (como navigation properties) pro cliente.

## Estrutura do projeto

```
home-expense-tracker/
├── backend/
│   ├── Controllers/
│   ├── Models/            # Entidades do EF Core (Person, Transaction, TransactionType)
│   ├── DTOs/               # Contratos de entrada/saída da API
│   ├── Services/           # Regras de negócio
│   ├── Data/                # AppDbContext
│   ├── HomeExpenseTracker.csproj
│   └── Program.cs
├── frontend/                # React + TS (em breve)
└── README.md
```

## Regras de negócio

- Uma pessoa tem: `Id` (gerado automaticamente), `Name`, `Age`.
- Uma transação tem: `Id` (gerado automaticamente), `Description`, `Amount`, `Type` (`Expense`/`Income`), `PersonId`.
- Deletar uma pessoa apaga em cascata todas as suas transações.
- Pessoas menores de 18 anos só podem cadastrar transações do tipo `Expense` — `Income` é bloqueado.
- Uma transação precisa referenciar uma pessoa existente.

## Plus implementados

Além do escopo mínimo do desafio:

- **Swagger/OpenAPI** — documentação interativa da API em `/swagger`.
- **Tratamento de erro global** — exceções de domínio (ex: pessoa não encontrada, violação de regra de negócio) são traduzidas em respostas JSON de erro consistentes, em vez de vazar stack trace cru.
- **Paginação** — a listagem de transações suporta `page`/`pageSize`, além de filtros opcionais por pessoa e por tipo.

## Como rodar

### Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js](https://nodejs.org/) (pro frontend, quando estiver disponível)

### Rodando o backend

```bash
cd backend

# restaura os pacotes NuGet
dotnet restore

# instala a ferramenta de linha de comando do EF Core (uma vez só, globalmente)
dotnet tool install --global dotnet-ef

# cria o banco e aplica as migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# sobe a API
dotnet run
```

A API sobe em `https://localhost:5001` (confere a porta exata no output do terminal). A documentação interativa fica em `https://localhost:5001/swagger`.

O arquivo do banco SQLite é criado automaticamente na pasta `backend/` e persiste entre execuções.

### Rodando o frontend

```bash
cd frontend
npm install
npm run dev
```

## Endpoints da API

### Pessoas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/people` | Cadastra uma nova pessoa |
| `GET` | `/api/people` | Lista todas as pessoas |
| `DELETE` | `/api/people/{id}` | Remove uma pessoa (em cascata, remove suas transações) |
| `GET` | `/api/people/totals` | Receitas, despesas e saldo por pessoa, além dos totais gerais |

### Transações

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/transactions` | Cadastra uma nova transação |
| `GET` | `/api/transactions?page=1&pageSize=10&personId=&type=` | Listagem paginada, com filtros opcionais |

## Status

- [x] Models `Person`, `Transaction` e `TransactionType`
- [ ] `AppDbContext` + migration inicial
- [ ] CRUD de pessoas (criar, listar, deletar)
- [ ] Transações (criar, listar com paginação)
- [ ] Endpoint de totais
- [ ] Middleware de tratamento de erro global
- [ ] Configuração do Swagger
- [ ] Frontend

## Fluxo de Git

O projeto usa um modelo de branches simplificado:

- `main` — sempre estável
- `develop` — branch de integração
- `feature/*` — uma branch por funcionalidade, mergeada na `develop`