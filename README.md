# Objects App

Web-only full-stack app to manage a collection of **Objects** (title, description, image, createdAt).

> Web stack (API + UI + realtime). The REST API is ready for a future Expo client.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js + Tailwind + shadcn-style UI |
| Backend | NestJS REST API + Socket.IO |
| Database | MongoDB |
| Storage | MinIO (S3-compatible, non-Amazon) |

## Deploy with Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose).

```bash
# from repo root
cp .env.example .env   # adjust public URLs if needed
docker compose up --build -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001 |
| MinIO API | http://localhost:9000 |
| MinIO console | http://localhost:9001 (`minioadmin` / `minioadmin`) |

Stop:

```bash
docker compose down
```

### Deploy on a VPS / remote host

1. Copy the project to the server.
2. Edit `.env` with your public URLs, for example:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_WS_URL=https://api.example.com
CORS_ORIGIN=https://app.example.com
S3_PUBLIC_URL=https://files.example.com/objects
MINIO_ROOT_USER=...
MINIO_ROOT_PASSWORD=...
```

3. Rebuild frontend so `NEXT_PUBLIC_*` are baked in:

```bash
docker compose up --build -d
```

4. Put a reverse proxy (Nginx / Caddy / Traefik) in front of ports `3000`, `3001`, and `9000` with HTTPS. Enable WebSocket upgrade for the API host (Socket.IO).

## Local development (without Docker for apps)

### 1. Backend

```bash
cd Backend
cp .env.example .env
npm install
npm run start:dev
```

API: http://localhost:3001

### 2. Frontend

```bash
cd Frontend
cp .env.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

### Realtime demo

1. Open two browser tabs on `/objects`
2. Create an object in one tab
3. It appears live in the other via Socket.IO (`objectCreated`)

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/objects` | multipart: `title`, `description`, `image` |
| GET | `/objects` | list |
| GET | `/objects/:id` | detail |
| DELETE | `/objects/:id` | delete Mongo + storage, emit `objectDeleted` |

Socket events: `objectCreated`, `objectDeleted`
