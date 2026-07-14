# Objects App

Web-only full-stack app to manage a collection of **Objects** (title, description, image, createdAt).

> Mobile (React Native / Expo) from the original brief was intentionally skipped to deliver a complete web stack (API + UI + realtime). The REST API is ready for a future Expo client.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js + Tailwind + shadcn-style UI |
| Backend | NestJS REST API + Socket.IO |
| Database | MongoDB (in-memory by default, or Docker) |
| Storage | Local disk by default, or MinIO (S3-compatible, non-Amazon) |

## Quick start (no Docker)

### 1. Backend

```bash
cd Backend
cp .env.example .env   # already set for local demo
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

## Optional: MongoDB + MinIO via Docker

```bash
docker compose up -d
```

Then in `Backend/.env`:

```
USE_MEMORY_DB=false
MONGODB_URI=mongodb://127.0.0.1:27017/objects
STORAGE_DRIVER=s3
S3_ENDPOINT=http://127.0.0.1:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=objects
S3_PUBLIC_URL=http://127.0.0.1:9000/objects
```

MinIO console: http://localhost:9001 (minioadmin / minioadmin)

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/objects` | multipart: `title`, `description`, `image` |
| GET | `/objects` | list |
| GET | `/objects/:id` | detail |
| DELETE | `/objects/:id` | delete Mongo + storage, emit `objectDeleted` |

Socket events: `objectCreated`, `objectDeleted`
