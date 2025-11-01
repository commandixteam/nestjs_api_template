# Sistema de Autenticação JWT - NestJS

Este projeto implementa um sistema completo de autenticação baseado em JWT (JSON Web Tokens) usando NestJS.

## Funcionalidades Implementadas

### 1. Entidade User
- **Arquivo**: `src/entities/user.entity.ts`
- Campos: id, email, password, name, createdAt, updatedAt
- Email único para evitar duplicatas

### 2. DTOs de Validação
- **Arquivo**: `src/auth/dto/auth.dto.ts`
- `CreateUserDto`: Para registro de usuários
- `LoginDto`: Para login de usuários
- Validações com class-validator

### 3. Serviço de Autenticação
- **Arquivo**: `src/auth/auth.service.ts`
- Métodos: register, login, validateUser, findById
- Hash de senhas com bcryptjs
- Geração de JWT tokens

### 4. Estratégia JWT
- **Arquivo**: `src/auth/jwt.strategy.ts`
- Configuração do Passport JWT
- Validação de tokens

### 5. Guard de Autenticação
- **Arquivo**: `src/auth/jwt-auth.guard.ts`
- Proteção de rotas que requerem autenticação

### 6. Controller de Autenticação
- **Arquivo**: `src/auth/auth.controller.ts`
- Endpoints: POST /auth/register, POST /auth/login, GET /auth/profile

## Endpoints Disponíveis

### POST /auth/register
Registra um novo usuário.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário"
  }
}
```

### POST /auth/login
Autentica um usuário existente.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário"
  }
}
```

### GET /auth/profile
Obtém o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta:**
```json
{
  "id": 1,
  "email": "usuario@exemplo.com",
  "name": "Nome do Usuário"
}
```

## Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` baseado no `env.example`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=first_api

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App
PORT=3000
```

### Executar Migrações
```bash
npm run build
npx typeorm migration:run -d dist/ormconfig.js
```

## Como Usar em Outros Controllers

Para proteger rotas em outros controllers, use o `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProtectedData(@Request() req) {
    // req.user contém os dados do usuário autenticado
    return { message: 'Dados protegidos', user: req.user };
  }
}
```

## Dependências Instaladas

- `@nestjs/jwt`: Módulo JWT do NestJS
- `@nestjs/passport`: Integração com Passport
- `passport`: Framework de autenticação
- `passport-jwt`: Estratégia JWT para Passport
- `bcryptjs`: Hash de senhas
- `class-validator`: Validação de DTOs
- `class-transformer`: Transformação de objetos

## Segurança

- Senhas são hasheadas com bcryptjs (salt rounds: 10)
- JWT tokens expiram em 24 horas
- Validação de email único
- Validação de entrada com DTOs
- Proteção de rotas com Guards
