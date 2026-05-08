# ChattingApp

Real-time chat application monorepo with React frontend and NestJS backend.

## Live Demo

Frontend:  
https://chattingappcip.onrender.com

Backend API:  
https://chattingappapi-49bd.onrender.com/api

> The backend is hosted on Render free tier, so the first request may take 30–60 seconds due to cold starts.

---
## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Socket.io-client
- **Backend**: NestJS, TypeORM, PostgreSQL, WebSockets (Socket.io)
- **Auth**: JWT

## Project Structure

```
/frontend    - React application (Vite)
/backend     - NestJS API server
```

## Prerequisites

- Node.js 18+
- PostgreSQL

## Installation

```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd backend && npm install
```

## Running the Project

**Backend:**
```bash
cd backend
# Configure .env with your PostgreSQL credentials
npm run start:dev
```
Server runs on `http://localhost:3000`

**Frontend:**
```bash
cd frontend
npm run dev
```
Client runs on `http://localhost:5173` (default Vite port)

## Environment Variables

**Backend** (`backend/.env`):
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=ChattingApp
JWT_SECRET=your_secret
PORT=3000
```

**Frontend** (`frontend/.env`):
```
VITE_SERVER_URL=http://localhost:3000/
VITE_GATEWAY_URL=http://localhost:3000/
```

## Available Scripts

### Backend
- `npm run start` - Start production server
- `npm run start:dev` - Start in development with watch mode
- `npm run test` - Run unit tests
- `npm run build` - Build for production

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Features

- User registration/login with JWT authentication
- Real-time messaging via WebSockets
- Group conversations
- Participant management
- REST API with Swagger documentation at `/api`