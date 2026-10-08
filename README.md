# Public Complaint Management

Simple full-stack college project for learning database concepts and REST APIs.

## Stack
- Java 21
- Spring Boot 4.1.1
- Spring Web + Spring JDBC + MySQL Driver
- MySQL 8.0
- React + Vite frontend
- Nginx
- Docker Compose

## Main database requirements
- JOIN report
- Above-average category subquery
- Stored procedure: register_complaint
- Stored function: count_open_complaints
- Trigger: complaint status history

## Run with Docker

From this project folder:

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

The MySQL container is exposed on host port 3307 only to avoid conflicts with a local MySQL running on 3306.

## Important
The MySQL init scripts run only when the database volume is created for the first time. To rebuild the demo database from scratch:

```bash
docker compose down -v
docker compose up --build
```

## Useful REST endpoints

- `GET /api/complaints`
- `POST /api/complaints`
- `PUT /api/complaints/{id}/status`
- `GET /api/complaints/{id}/history`
- `GET /api/categories/above-average`
- `GET /api/officers/{id}/open-count`
- `GET /api/citizens`
- `GET /api/categories`
- `GET /api/officers`
