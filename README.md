# Home Expense Tracker

Aplicação cujo objetivo é controlar gastos residenciais de forma simples, organizada e visualmente clara.

A solução foi construída com backend em .NET e frontend em React + TypeScript, com persistência local em SQLite, entregando uma experiência mais completa para o usuário.

## O que foi implementado

### Funcionalidades principais

- Cadastro de pessoas com criação, listagem e deleção.
- Cadastro de transações com criação e listagem paginada.
- Consulta de totais por pessoa e total geral.
- Regras de negócio aplicadas no backend:
  - uma pessoa só pode ter transações se existir no cadastro;
  - pessoas menores de 18 anos só podem cadastrar despesas;
  - ao deletar uma pessoa, todas as suas transações são removidas em cascata.

### Diferenciais do projeto

Além do escopo mínimo do desafio, a aplicação ganhou:

- interface moderna e responsiva para o frontend;
- abas separadas para Pessoas, Transações e Totais;
- filtros e paginação na listagem de transações;
- validações no formulário com mensagens claras;
- tratamento global de erros na API;
- documentação interativa com Swagger/OpenAPI.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | .NET 10 / C# / ASP.NET Core Web API |
| ORM | Entity Framework Core |
| Banco de dados | SQLite |
| Frontend | React + TypeScript + Vite |
| Estilo visual | Tailwind CSS + componentes com estrutura shadcn-style |
| Documentação da API | Swagger / OpenAPI |

## Arquitetura

O backend segue uma estrutura simples e organizada em camadas:

```text
Controller -> recebe a requisição e delega para o service
Service -> concentra a regra de negócio e os cálculos
DbContext -> acessa o banco via Entity Framework Core
SQLite -> persiste os dados localmente
```

Os DTOs são usados na borda da API para manter o contrato explícito e evitar expor detalhes internos do modelo EF diretamente ao cliente.

## Estrutura do projeto

```text
home-expense-tracker/
├── backend/
│   ├── Controllers/      # Endpoints da API
│   ├── DTOs/             # Contratos de entrada/saída
│   ├── Services/         # Regras de negócio
│   ├── Data/             # AppDbContext
│   ├── Models/           # Entidades do domínio
│   └── Program.cs
├── frontend/
│   ├── src/
│   │   ├── components/   # Interface do usuário
│   │   ├── hooks/        # Lógica de estado e chamadas de API
│   │   └── api/          # Cliente HTTP para o backend
└── README.md
```

## Regras de negócio implementadas

- Uma pessoa possui: `Id`, `Name` e `Age`.
- Uma transação possui: `Id`, `Description`, `Amount`, `Type` (`Expense` / `Income`) e `PersonId`.
- A transação precisa apontar para uma pessoa existente.
- Pessoas menores de 18 anos só podem cadastrar despesas.
- Deletar uma pessoa remove automaticamente todas as suas transações.
- O total geral é calculado com base nas transações registradas.

## Como rodar

### Pré-requisitos

- .NET 10 SDK
- Node.js

### Backend

```bash
cd backend
dotnet restore
dotnet run
```

A API fica disponível em `http://localhost:5087` por padrão, e a documentação Swagger em `http://localhost:5087/swagger`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend é servido em `http://localhost:5173`.

## Endpoints principais

### Pessoas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/people` | Cria uma pessoa |
| `GET` | `/api/people` | Lista todas as pessoas |
| `DELETE` | `/api/people/{id}` | Remove uma pessoa e suas transações |
| `GET` | `/api/people/totals` | Retorna totais por pessoa e geral |

### Transações

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/transactions` | Cria uma transação |
| `GET` | `/api/transactions?page=1&pageSize=10&personId=&type=` | Lista transações com paginação e filtros opcionais |

## Destaques da entrega

- A lógica de negócio está centralizada em services, deixando o código mais limpo e fácil de manter.
- A experiência do usuário foi tratada com cuidado no frontend, não apenas com a funcionalidade básica, mas com uma interface mais agradável e organizada.
- O projeto está preparado para ser apresentado como uma solução completa, com foco em qualidade, legibilidade e boas práticas.

## Comentários e documentação no código

A lógica mais importante foi documentada diretamente nos pontos-chave do backend para facilitar a leitura e compreensão da solução durante a avaliação.
