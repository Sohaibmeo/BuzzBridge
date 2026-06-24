# BuzzBridge

BuzzBridge is a full-stack community app with a React/MUI frontend and a
NestJS/Postgres backend.

## First-Time Setup

### Prerequisites

- Node.js 22.x
- npm
- Docker Desktop
- Git

The app may run on newer Node versions, but the project is configured for
Node 22.x.

### 1. Clone the repository

```bash
git clone https://github.com/Sohaibmeo/BuzzBridge.git
cd BuzzBridge
```

### 2. Start the database with Docker

```bash
docker compose up -d
```

This starts:

- Postgres on `localhost:5432`
- Adminer on `http://localhost:8080`

The Docker setup uses Postgres 16. Avoid changing it back to
`postgres:latest`; major Postgres image changes can break an existing local
data folder.

Default database credentials from `docker-compose.yml`:

```text
Database: buzz-bridge
Username: postgres
Password: postgres
Host: localhost
Port: 5432
```

To stop the containers:

```bash
docker compose down
```

To reset the local database completely, stop Docker and delete `data/db`.

### 3. Install backend dependencies

```bash
cd buzzbridge-backend
npm install
```

Create `buzzbridge-backend/.env`:

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=buzz-bridge
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

JWT_SECRET=replace-with-a-local-secret

GOOGLE_CLIENT_ID=local-google-client-id
GOOGLE_CLIENT_SECRET=local-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

GOOGLE_SMTP_EMAIL=
GOOGLE_SMTP_PASSWORD=
EMAIL_DELIVERY_ENABLED=false

IMAGEKIT_PUBLIC_KEY=local-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=local-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://example.com
IMAGEKIT_FOLDER=/buzz-bridge
```

Start the backend:

```bash
npm run start:dev
```

The backend runs on `http://localhost:3000`.

Seed the local database with the default test user:

```bash
npm run seed
```

Default seeded login:

```text
Email: sohaibmayo12@gmail.com
Password: Test@123
```

If `bcrypt` fails after changing Node versions, run:

```bash
npm rebuild bcrypt
```

### 4. Install frontend dependencies

Open a second terminal from the repo root:

```bash
cd buzzbridge-frontend
npm install
```

Create `buzzbridge-frontend/.env`:

```env
REACT_APP_BASE_URL=http://localhost:3000
REACT_APP_FRONTEND_URL=http://localhost:3001
```

Start the frontend:

```bash
npm start
```

The frontend runs on `http://localhost:3001`.

## Useful Commands

Backend:

```bash
cd buzzbridge-backend
npm run start:dev
npm run build
npm test
```

Frontend:

```bash
cd buzzbridge-frontend
npm start
npm run build
npm test
```

Docker:

```bash
docker compose up -d
docker compose down
```

## Current Roadmap

### V3 Priority

- Improve search bar UI
- Hide edit/delete actions when the user is not the owner
- Improve User Card layout and prevent overlapping content
- Make score/following clickable and show paginated users in a modal

### Later

- Polls: title, options, close time, disabled answers, vote changing, charts,
  and percentages
- Profile setup steps for first login
- Cache implementation
- Recommendation logic and disliked-content hiding
- Tags for posts
- Rich text editor for descriptions/questions
