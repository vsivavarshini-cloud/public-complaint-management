# React Frontend - Public Complaint Management

## Stack
- React 19
- Vite
- JavaScript
- CSS
- Nginx for Docker production serving

## Run locally

Make sure the Spring Boot backend is running on `http://localhost:8080`.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Vite proxies `/api` requests to the Spring Boot backend on port 8080.

## Build for production

```bash
npm run build
```

## Docker

The frontend Dockerfile builds the React app with Node and serves the generated `dist` files through Nginx. In the full project, `docker compose up --build` starts MySQL, backend, and frontend together.
