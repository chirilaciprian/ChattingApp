# Frontend

React 19 frontend for real-time chat application.

## Tech Stack

- React 19
- Vite
- Tailwind CSS + DaisyUI
- React Router DOM
- Socket.io-client
- React Hook Form + Zod
- React Toastify
- Axios

## Installation

```bash
npm install
```

## Running

```bash
npm run dev
```

Runs on `http://localhost:5173` (default)

## Environment Variables

Create `.env`:
```
VITE_SERVER_URL=http://localhost:3000/
VITE_GATEWAY_URL=http://localhost:3000/
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Features

- User authentication (login/register)
- Real-time chat with WebSocket
- Conversation management (create, join, settings)
- Message display with sender info
- Toast notifications
- Protected routes

## Build

```bash
npm run build
```

Output in `dist/` folder.