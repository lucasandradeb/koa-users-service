# Koa Users Service

API REST em Node.js/TypeScript para gerenciamento de usuários, usando Koa.js, TypeORM, PostgreSQL e AWS Cognito (auth/authorization).

## Funcionalidades
- Autenticação com AWS Cognito (validação de token e grupos para RBAC).
- CRUD de usuários (foco em listagem e edição de conta).
- Rotas protegidas por middleware de autenticação e autorização.
- Banco PostgreSQL com migrations (TypeORM).
- Docker Compose para desenvolvimento.
- Documentação via Swagger (OpenAPI) e Collection do Postman.

## Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (opcional, se rodar localmente)
- User Pool do Cognito configurado (domínio, client, grupos)

## Configuração

1) Clone o repositório
```bash
git clone <URL_DO_REPO>
cd <PASTA_DO_REPO>
```

2) Configure o .env
```bash
cp .env.example .env
```
Defina:
- DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
- COGNITO_REGION, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, COGNITO_DOMAIN
- PORT=3000

3) Suba os serviços
```bash
docker compose up -d --build
```

4) Rode as migrations
```bash
npm run migration:run
```

## Execução
- Dev: `npm run dev`
- Prod: `npm run build && npm start`

## Endpoints

- GET /health
  - Público. Verifica o status da API.

- POST /auth/signin
  - Público. Cria/retorna usuário no banco a partir do email no body.
  - Body: `{ "email": "user@example.com" }`

- POST /me
  - Protegido. Valida o token e usa o email enviado no body para retornar o usuário do banco.
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "email": "user@example.com" }`

- GET /users
  - Protegido (apenas admin). Lista todos os usuários cadastrados.
  - Header: `Authorization: Bearer <token>`

- POST /edit-account
  - Protegido. Usuário comum: pode alterar apenas `name` (e marca `isOnboarded=true`). Admin: pode alterar `name` e `role`.
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "name": "Novo Nome", "role": "admin" | "user" }` (role é ignorado/rejeitado para não-admin)

Observação sobre autorização:
- A verificação de “admin” é feita via grupos do Cognito (claim `cognito:groups` → `['admin']`). Garanta que o token enviado contenha os grupos (recomendado: ID Token com `openid email profile`).

## Swagger (OpenAPI)

- UI: http://localhost:3000/swagger
- Spec JSON: http://localhost:3000/swagger.json

As anotações estão nos controllers/rotas. Ajuste `src/swagger.ts` conforme necessário.

## Postman

- Collection incluída: `docs/postman/Koa Users Service.postman_collection.json`
- Variáveis:
  - `base_url` = `http://localhost:3000`
  - `token` = cole aqui seu token (ID Token recomendado se precisar de grupos)
- Importação: Postman > Import > File > selecione o JSON.
- Execução em CI (opcional): use Newman.

Exemplos rápidos (curl):
```bash
# Health
curl -i http://localhost:3000/health

# Sign in
curl -s -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# /me
TOKEN="<seu_token>"
curl -s -X POST http://localhost:3000/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# /users (admin)
curl -s http://localhost:3000/users -H "Authorization: Bearer $TOKEN"

# /edit-account
curl -s -X POST http://localhost:3000/edit-account \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Nome"}'
```

## Testes

- Unitários (Jest): `npm test`
- E2E (opcional): Postman + Newman executando a collection contra docker-compose.

## Dicas e solução de problemas

- Porta ocupada (3000): pare instâncias anteriores (`docker compose down`) ou altere `PORT`.
- DB indisponível: verifique `docker compose ps`, variáveis do `.env` e aplique migrations.
- Token inválido: confirme se está enviando o token correto (ID Token vs Access Token) e escopos (`openid email profile`).

```// filepath: /home/lucasandrade/estudo/koa-users-service/README.md
# Koa Users Service

API REST em Node.js/TypeScript para gerenciamento de usuários, usando Koa.js, TypeORM, PostgreSQL e AWS Cognito (auth/authorization).

## Funcionalidades
- Autenticação com AWS Cognito (validação de token e grupos para RBAC).
- CRUD de usuários (foco em listagem e edição de conta).
- Rotas protegidas por middleware de autenticação e autorização.
- Banco PostgreSQL com migrations (TypeORM).
- Docker Compose para desenvolvimento.
- Documentação via Swagger (OpenAPI) e Collection do Postman.

## Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (opcional, se rodar localmente)
- User Pool do Cognito configurado (domínio, client, grupos)

## Configuração

1) Clone o repositório
```bash
git clone <URL_DO_REPO>
cd <PASTA_DO_REPO>
```

2) Configure o .env
```bash
cp .env.example .env
```
Defina:
- DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
- COGNITO_REGION, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, COGNITO_DOMAIN
- PORT=3000

3) Suba os serviços
```bash
docker compose up -d --build
```

4) Rode as migrations
```bash
npm run migration:run
```

## Execução
- Dev: `npm run dev`
- Prod: `npm run build && npm start`

## Endpoints

- GET /health
  - Público. Verifica o status da API.

- POST /auth/signin
  - Público. Cria/retorna usuário no banco a partir do email no body.
  - Body: `{ "email": "user@example.com" }`

- POST /me
  - Protegido. Valida o token e usa o email enviado no body para retornar o usuário do banco.
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "email": "user@example.com" }`

- GET /users
  - Protegido (apenas admin). Lista todos os usuários cadastrados.
  - Header: `Authorization: Bearer <token>`

- PUT /edit-account
  - Protegido. Usuário comum: pode alterar apenas `name` (e marca `isOnboarded=true`). Admin: pode alterar `name` e `role`.
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "name": "Novo Nome", "role": "admin" | "user" }` (role é ignorado/rejeitado para não-admin)

Observação sobre autorização:
- A verificação de “admin” é feita via grupos do Cognito (claim `cognito:groups` → `['admin']`). Garanta que o token enviado contenha os grupos (recomendado: ID Token com `openid email profile`).


## Postman

- Collection incluída: `docs/postman/Koa Users Service.postman_collection.json`
- Variáveis:
  - `base_url` = `http://localhost:3000`
  - `token` = cole aqui seu token (ID Token recomendado se precisar de grupos)
- Importação: Postman > Import > File > selecione o JSON.
- Execução em CI (opcional): use Newman.

Exemplos rápidos (curl):
```bash
# Health
curl -i http://localhost:3000/health

# Sign in
curl -s -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# /me
TOKEN="<seu_token>"
curl -s -X POST http://localhost:3000/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# /users (admin)
curl -s http://localhost:3000/users -H "Authorization: Bearer $TOKEN"

# /edit-account
curl -s -X PUT http://localhost:3000/edit-account \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Nome"}'
```

## Testes

- Unitários (Jest): `npm test`

## Dicas e solução de problemas

- Porta ocupada (3000): pare instâncias anteriores (`docker compose down`) ou altere `PORT`.
- DB indisponível: verifique `docker compose ps`, variáveis do `.env` e aplique migrations.
- Token inválido: confirme se está enviando o token correto (ID Token vs Access Token) e escopos (`openid email profile`).
