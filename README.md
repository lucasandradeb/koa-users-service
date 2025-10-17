# Koa Users Service

Um serviço de **API REST** em **Node.js/TypeScript** para gerenciamento de usuários, utilizando **Koa.js**, **TypeORM**, **PostgreSQL** e **AWS Cognito** para autenticação e autorização.

## Funcionalidades

- **Autenticação:** Integração com AWS Cognito para validação de tokens (**ID Token** ou **Access Token**, conforme o fluxo).
- **Gerenciamento de Usuários:** CRUD básico, com permissões baseadas em **grupos do Cognito** (`admin`/`user`).
- **Rotas Protegidas:** Endpoints com middleware de **auth** e **autorização (RBAC)**.
- **Banco de Dados:** PostgreSQL com **migrations** via TypeORM.
- **Docker:** Ambiente containerizado para desenvolvimento.

## Pré-requisitos

- **Docker** e **Docker Compose** instalados.
- **Conta AWS** com **User Pool do Cognito** configurado (para auth real).
- **Node.js 18+** _(opcional, se rodar localmente sem Docker)_.

---

## Instalação e Configuração

### 1) Clone o repositório

```bash
git clone <URL_DO_REPO>
cd <PASTA_DO_REPO>
```

### 2) Configure o arquivo `.env`

Copie o arquivo de exemplo e preencha com suas credenciais.

```bash
cp .env.example .env
```

Edite `.env` com:

- Credenciais do **PostgreSQL** (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` etc.)
- Configurações do **Cognito** (`COGNITO_REGION`, `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `COGNITO_DOMAIN`)
- **Porta** da API (`PORT`, padrão: `3000`)

**Exemplo:**

```env
# App
PORT=3000
NODE_ENV=development

# DB
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=users_db

# Cognito
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_DOMAIN=seu-dominio.auth.us-east-1.amazoncognito.com
```

### 3) Construa e inicie os containers

```bash
docker compose up -d --build
```

Isso iniciará:

- **API** (porta `3000`)
- **PostgreSQL** (porta `5432`)

### 4) Execute as migrations

```bash
npm run migration:run
```

Isso criará as tabelas no banco.

---

## Uso

### Endpoints disponíveis

- `GET /health` — Status da API (**público**)
- `POST /auth/signin` — Cria/busca usuário por e-mail (**público**; usado para registrar no seu DB)
- `POST /me` — Retorna dados do usuário autenticado (**protegido**)
- `GET /users` — Lista todos os usuários (**protegido**, apenas **admin**)
- `POST /edit-account` — Edita nome/role do usuário (**protegido**; permissões variam por escopo)

> Observação: dependendo da sua implementação, `/me` pode ser `GET`. Ajuste aqui conforme seu código.

### Exemplos de requisições com cURL

#### 1) Health Check (público)

```bash
curl -i http://localhost:3000/health
```

**Resposta (200 OK):**

```json
{ "status": "ok" }
```

#### 2) Sign In (criar/buscar usuário)

```bash
curl -s -X POST http://localhost:3000/auth/signin   -H "Content-Type: application/json"   -d '{ "email": "user@example.com" }'
```

**Resposta (200 OK):**

```json
{ "user": { "id": 1, "email": "user@example.com", "role": "user", "isOnboarded": false } }
```

#### 3) Obter dados do usuário autenticado (`/me`)

```bash
ACCESS_TOKEN="<cole_aqui_o_token>"
curl -s -X POST http://localhost:3000/me   -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Resposta (200 OK):**

```json
{ "user": { "id": 1, "email": "user@example.com", "role": "user", "isOnboarded": true } }
```

**Erro (401 Unauthorized) – token inválido/ausente:**

```json
{ "message": "Invalid or expired token" }
```

#### 4) Listar todos os usuários (`/users` – apenas **admin**)

```bash
curl -s http://localhost:3000/users   -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Resposta (200 OK) – admin:**

```json
{ "users": [{ "id": 1, "email": "user@example.com" }] }
```

**Erro (403 Forbidden) – usuário comum:**

```json
{ "message": "Forbidden: insufficient scope" }
```

#### 5) Editar conta (`/edit-account`)

```bash
curl -s -X POST http://localhost:3000/edit-account   -H "Authorization: Bearer $ACCESS_TOKEN"   -H "Content-Type: application/json"   -d '{ "name": "Novo Nome", "role": "admin" }'
```

**Resposta (200 OK) – usuário comum (apenas `name`):**

```json
{ "user": { "id": 1, "name": "Novo Nome", "role": "user", "isOnboarded": true } }
```

**Erro (403 Forbidden) – usuário comum tentando alterar `role`:**

```json
{ "message": "Forbidden: insufficient scope" }
```

---

## 🔐 Como obter o **token** (ID Token ou Access Token)

Use **Postman** (ou similar):

- Configure **OAuth 2.0** apontando para seu **User Pool (Hosted UI)**  
  `scope: openid email profile`
- Faça login e copie o **token** (**access_token** recomendado para API; **id_token** se você exigir isso).
- Use no header:

```
Authorization: Bearer <SEU_TOKEN>
```

---

## 🧰 Scripts disponíveis

```bash
npm run dev                # inicia em modo desenvolvimento
npm run build              # compila TypeScript
npm run start              # executa build (produção)
npm run lint               # ESLint
npm run migration:generate # gera nova migration
npm run migration:run      # aplica migrations
npm run migration:revert   # reverte última migration
```

---
