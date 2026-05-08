# Backend

NestJS API server with real-time WebSocket support.

## Tech Stack

- NestJS
- TypeORM + PostgreSQL
- JWT Authentication
- WebSockets (Socket.io)
- Swagger/OpenAPI

## Installation

```bash
npm install
```

## Configuration

Create `.env` in `backend/`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=ChattingApp
JWT_SECRET=your_secret
PORT=3000
```

Ensure PostgreSQL is running and database exists.

## Running

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run start:prod
```

Server runs on `http://localhost:3000`

API docs available at `http://localhost:3000/api`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start production server |
| `npm run start:dev` | Start with hot reload |
| `npm run start:debug` | Start with debugging |
| `npm run build` | Compile TypeScript |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run lint` | Lint and fix |

## Features

- REST API with CRUD operations
- JWT authentication (register/login)
- Real-time messaging via WebSocket gateway
- TypeORM entities: User, Conversation, Message, Participant
- Swagger API documentation
- Input validation with class-validator

## Database

Uses TypeORM with PostgreSQL. Entities:
- `User` - User accounts
- `Conversation` - Chat conversations
- `Message` - Messages within conversations
- `Participant` - Conversation participants

## Build

```bash
npm run build
npm run start:prod
```

Output in `dist/` folder.