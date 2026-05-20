# TypeScript + Express — Quick Startn (with deployment tips)

This document explains how to set up and run a simple Express server written in TypeScript. It covers installation, common scripts, and convenient development workflows (including Nodemon and ts-node).

## Prerequisites

- Node.js (v14+ recommended)
- npm (or Yarn)

## Installation

Install TypeScript as a development dependency:

```bash
npm install --save-dev typescript
```

Optionally install the TypeScript type definitions you need:

```bash
npm install --save-dev @types/node @types/express
```

If you prefer a global TypeScript compiler:

```bash
npm install -g typescript
```

Initialize a `tsconfig.json` in your project (recommended):

```bash
npx tsc --init
```

## Example project layout

```
typescript/
  ├─ package.json
  ├─ tsconfig.json
  ├─ server.ts       # TypeScript source
  └─ dist/           # Compiled JavaScript output (after `tsc`)
```

## Scripts (recommended)

Add the following scripts to `package.json` for common workflows:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js",
  "dev": "ts-node server.ts"
}
```

- `npm run build` — compile TypeScript to JavaScript (outputs to `dist/` by default)
- `npm start` — run the compiled server
- `npm run dev` — run the TypeScript server directly using `ts-node` (development)

If you do not want `ts-node` in your project, run the compiled output instead.

## Compiling and running

Compile all TypeScript files according to `tsconfig.json`:

```bash
npx tsc
```

Then run the compiled server:

```bash
node dist/server.js
```

Or run directly with `ts-node` (development):

```bash
npx ts-node server.ts
```

## Using Nodemon for automatic restarts

Install Nodemon as a development dependency:

```bash
npm install --save-dev nodemon
```

Recommended `dev` script to restart on changes across the project:

```json
"scripts": {
  "dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' server.ts"
}
```

- `npx nodemon server.ts` watches only `server.ts`.
- `nodemon --watch 'src/**/*.ts' --exec 'ts-node' server.ts` watches all TypeScript files under `src/` and restarts `server.ts` when any change occurs.

If your TypeScript files live in the project root (not `src/`), use `--watch '*.ts'`.

## Minimal Express `server.ts` example

```ts
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from TypeScript + Express!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

Compile and run the example using the commands above.

## Tips and troubleshooting

- Ensure `outDir` in `tsconfig.json` matches your `start` script (`dist/` by default).
- Install `@types/*` packages for runtime libraries to get proper typings.
- If `ts-node` is slow for large projects, prefer the `build` → `start` workflow.

## Summary

This README provides a compact, practical guide to using TypeScript with Express, covering installation, scripts, and development workflows. For advanced configuration, customize `tsconfig.json` and your `package.json` scripts to match your project's structure and needs.

## For more details, refer to the official TypeScript documentation and Express documentation.

## TypeScript Backend Development — Quick Start Guide

This section covers common deployment approaches for a TypeScript + Express backend: using Coolify (self-hosted PaaS), deploying directly to a VPS (systemd or Docker), and deploying to Render and Vercel.

### 1) Deploy with Coolify (self-hosted)

- Ensure you have a working Coolify instance (Docker + Docker Compose on your server). See Coolify docs for installation.
- In Coolify create a new app and point it at your Git repository.
- Configure build and run commands in Coolify:

  - Build command: `npm ci && npm run build`
  - Start command: `npm start`
  - Port: `3000` (or your app port)
  - Environment variables: add any `NODE_ENV`, `PORT`, database URLs, or secrets in the Coolify UI.

- Coolify will build using your configured build command and run the service in a container. Use logs in Coolify to diagnose issues.

### 2) Deploy to a VPS (no Coolify)

Option A — systemd (process manager)

1. SSH to your VPS and install Node and npm.
2. Clone your repository and install dependencies:

```bash
git clone <repo-url> app
cd app
npm ci
npm run build
```

3. Create a `systemd` unit at `/etc/systemd/system/myapp.service`:

```ini
[Unit]
Description=My TypeScript App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/app
Environment=NODE_ENV=production PORT=3000
ExecStart=/usr/bin/node /path/to/app/dist/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

4. Reload and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
sudo journalctl -u myapp -f
```

Option B — Docker on VPS

1. Create a simple `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

2. Build and run:

```bash
docker build -t myapp:latest .
docker run -d --name myapp -p 3000:3000 --env-file .env myapp:latest
```

3. (Optional) Use `docker-compose` or a container orchestrator for multi-service stacks.

Reverse proxy (Nginx)

Use Nginx to route traffic and handle TLS:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3) Deploy to Render

- Create a new Web Service on Render and link your repository.
- Set the environment to Node and provide the following:
  - Build Command: `npm ci && npm run build`
  - Start Command: `npm start`
  - Environment: set `NODE_ENV=production` and other secrets in Render's dashboard.
- Render will build and deploy automatically on pushes.

### 4) Deploy to Vercel

Vercel is optimized for serverless functions; full Express servers should be adapted or containerized.

Option A — Convert routes to Vercel Serverless Functions

- Move API routes into an `api/` folder (e.g., `api/hello.ts`) that exports a handler compatible with Vercel.
- Remove long-running listeners (e.g., `app.listen`) from server entrypoints used by serverless handlers.
- Deploy with `vercel` CLI or Git integration. Vercel will build and deploy functions automatically.

Option B — Deploy as a Docker container on Vercel (for full server)

- Add a `Dockerfile` and configure Vercel to build from Docker. This keeps your Express server running like a normal server but requires a Pro/Team plan.

Vercel notes:

- For most backends, Render, Fly, or a VPS are preferable when you need a persistent Node process.

---

If you want, I can:
- add a worked `package.json` example with the recommended scripts, or
- add a `vercel.json` and `docker-compose.yml` examples to the repo.

