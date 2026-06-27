# Hero Factory

Plataforma de gestão de heróis — criação, listagem, edição e exclusão de heróis com seus poderes e características.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Banco de dados | MySQL 8.0 (Docker) |
| ORM/Query | mysql2 (raw queries tipadas) |
| Validação | Zod |
| State/Cache | React Query |

## Pré-requisitos

- Node.js 18+
- Docker + Docker Compose
- pnpm ou npm

## Como rodar

### 1. Suba o banco de dados

```bash
docker-compose up -d
```

Aguarde o MySQL inicializar (~15s). Verifique com:

```bash
docker-compose logs mysql
```

### 2. Configure o backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

O servidor inicia em `http://localhost:3001`. A tabela `heroes` é criada automaticamente na primeira execução.

### 3. Configure o frontend

```bash
cd frontend
npm install
npm run dev
```

O app abre em `http://localhost:5173`.

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/heroes` | Lista heróis (paginado, busca por nome/nickname) |
| GET | `/api/heroes/:id` | Detalhes de um herói |
| POST | `/api/heroes` | Criar herói |
| PUT | `/api/heroes/:id` | Editar herói (somente ativos) |
| PATCH | `/api/heroes/:id/activate` | Reativar herói inativo |
| DELETE | `/api/heroes/:id` | Excluir herói (somente ativos) |

### Query params para listagem

| Param | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `page` | number | 1 | Página atual |
| `limit` | number | 10 | Registros por página |
| `search` | string | — | Filtro por name ou nickname |

### Exemplo de herói

```json
{
  "id": "e314636e-1ca6-4925-a0e7-da5eb5ae2403",
  "name": "Robert Bruce Banner",
  "nickname": "Hulk",
  "date_of_birth": "1962-04-10 00:00:00",
  "universe": "Marvel",
  "main_power": "Force",
  "avatar_url": "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
  "is_active": true,
  "created_at": "2024-09-18 21:41:43",
  "updated_at": "2024-09-18 21:41:43"
}
```

## Funcionalidades

- ✅ Listagem com paginação (10 por página, 5 por linha)
- ✅ Busca por nome ou nome de guerra (debounce)
- ✅ Criação de herói via modal
- ✅ Edição via modal (apenas heróis ativos)
- ✅ Exclusão com modal de confirmação
- ✅ Ativação de herói inativo com confirmação
- ✅ Heróis inativos com coloração cinza
- ✅ Loading states em todas as ações assíncronas
- ✅ Mensagens de sucesso e erro
- ✅ Visualização detalhada ao clicar no herói

## Decisões técnicas

- **mysql2 com raw queries tipadas**: escolhido por leveza e controle total sobre o SQL, sem overhead de ORM
- **Zod para validação**: validação robusta dos dados de entrada na camada de serviço
- **Arquitetura em camadas**: `routes → controllers → services → repositories` para separação de responsabilidades e facilidade de testes
- **React Query**: cache e sincronização automática de dados, evitando re-fetches desnecessários
- **Docker Compose**: ambiente de banco de dados reproduzível, sem instalação local do MySQL
