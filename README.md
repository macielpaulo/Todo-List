# 📝 Todo List

Aplicação fullstack de lista de tarefas (**Todo List**), construída com uma API REST em Node.js/TypeScript e uma interface em React. O projeto segue uma arquitetura em camadas para manter o código organizado, testável e fácil de evoluir.

---

## 🚀 Tecnologias utilizadas

### Backend
| Tecnologia | Uso |
| --- | --- |
| **Node.js** + **TypeScript** | Plataforma e tipagem estática |
| **Express 5** | Framework HTTP / rotas |
| **TypeORM** | ORM para acesso ao banco |
| **PostgreSQL 15** | Banco de dados relacional |
| **tsyringe** | Injeção de dependência (DI) |
| **ts-node-dev** | Recarregamento automático em desenvolvimento |

### Frontend
| Tecnologia | Uso |
| --- | --- |
| **React 19** | Construção da interface por componentes |
| **Vite** | Build e servidor de desenvolvimento (HMR) |
| **Tailwind CSS 4** | Estilização por classes utilitárias |
| **TypeScript** | Tipagem estática |
| **Oxlint** | Lint rápido do código |

### Infraestrutura
| Tecnologia | Uso |
| --- | --- |
| **Docker** + **Docker Compose** | Subir o banco de dados PostgreSQL de forma isolada |

---

## 📁 Estrutura do projeto

```text
todo-list/
├── backend/               # API REST (Node + Express + TypeORM)
│   └── src/
│       ├── controllers/   # Camada HTTP (entrada/saída)
│       ├── services/      # Regras de negócio
│       ├── repositories/  # Acesso ao banco (CRUD)
│       ├── entities/      # Modelos do banco de dados
│       ├── dtos/          # Objetos de transferência de dados
│       ├── container/     # Registro de injeção de dependência
│       ├── routes/        # Definição das rotas
│       └── index.ts       # Ponto de entrada da aplicação
├── frontend/              # Interface (React + Vite + Tailwind)
│   └── src/
│       ├── App.tsx        # Componente principal
│       ├── main.tsx       # Bootstrap do React
│       └── index.css      # Estilos globais + Tailwind
└── docker-compose.yml     # Banco de dados PostgreSQL
```

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [**Node.js**](https://nodejs.org/) (v20 ou superior) e **npm**
- [**Docker**](https://www.docker.com/) e **Docker Compose**
- **Git**

---

## 🏃 Como rodar o projeto

O projeto é dividido em três partes: **banco de dados (Docker)**, **backend** e **frontend**. Recomenda-se subir nesta ordem.

### 1. Banco de dados (Docker)

Na raiz do projeto, suba o container PostgreSQL:

```bash
docker compose up -d db
```

Isso iniciará o PostgreSQL com as seguintes configurações:

| Configuração | Valor |
| --- | --- |
| Host / Porta | `localhost:5432` |
| Usuário | `postgres` |
| Senha | `postgres` |
| Banco | `todolist` |

> [!IMPORTANT]
> O TypeORM está configurado com `synchronize: true`, ou seja, **as tabelas são criadas automaticamente** a partir das entidades na primeira execução. Isso é ótimo para desenvolvimento, mas **não** deve ser usado em produção (prefira migrations).

Para parar o banco:

```bash
docker compose down
```

Para parar e **apagar os dados** do volume:

```bash
docker compose down -v
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

O servidor sobe em **http://localhost:3000** e reinicia automaticamente a cada alteração no código.

**Scripts disponíveis:**

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia em modo desenvolvimento (watch/HMR) |
| `npm test` | Executa os testes |

**Endpoints da API:**

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/tasks` | Lista todas as tarefas |
| `POST` | `/tasks` | Cria uma nova tarefa |
| `GET` | `/tasks/:id` | Busca uma tarefa pelo ID |
| `PUT` | `/tasks/:id` | Atualiza uma tarefa |
| `DELETE` | `/tasks/:id` | Remove uma tarefa |

Exemplo de criação de tarefa:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Aprender React e Tailwind"}'
```

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A interface sobe em **http://localhost:5173** (porta padrão do Vite).

**Scripts disponíveis:**

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite) |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Pré-visualiza a build de produção |
| `npm run lint` | Executa o Oxlint |

---

## 🧱 Boas práticas adotadas

### Arquitetura
- **Separação de responsabilidades** em camadas: `Controller > Service > Repository`. Cada camada tem uma função bem definida (HTTP, regra de negócio e persistência, respectivamente).
- **Injeção de dependência** com **tsyringe**, facilitando o desacoplamento e a substituição de implementações (ex.: mocks em testes).
- **DTOs** para trafegar dados entre as camadas, evitando expor as entidades diretamente.
- **Frontend desacoplado do banco**: a interface conversa apenas com a API REST, nunca com o banco de dados.

### Versionamento (Git)
- **Não versionar dependências nem artefatos de build**: `node_modules/`, `dist/` e `build/` estão no `.gitignore`.
- **Nunca commitar segredos**: arquivos `.env` são ignorados. Use variáveis de ambiente para credenciais.
- **Mensagens de commit descritivas** (sugestão: padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/), ex.: `feat:`, `fix:`, `docs:`).
- **Commits pequenos e focados**, cada um resolvendo uma coisa só.

### Código
- **Tipagem estática** com TypeScript em todo o projeto.
- **Lint** no frontend com Oxlint para manter o padrão de código.
- **Documentação viva**: mantenha os documentos de arquitetura atualizados a cada mudança estrutural.

### Segurança (atenção)
- As credenciais do banco estão fixas no `docker-compose.yml` e no `data-source.ts` **apenas para facilitar o desenvolvimento local**. Em produção, utilize variáveis de ambiente e senhas fortes.

---

## 🤝 Contribuindo

1. Crie uma branch para sua alteração: `git checkout -b feat/minha-feature`
2. Faça commits pequenos e descritivos.
3. Abra um Pull Request descrevendo a mudança.

---

## 📄 Licença

Este projeto está sob a licença **MIT** — sinta-se à vontade para usar, estudar e adaptar.
