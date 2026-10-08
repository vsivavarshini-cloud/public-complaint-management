# Public Complaint Management - Backend

Simple Spring Boot REST backend for the college project **Public Complaint Management**.

## What is included

- JOIN: complaint list combines citizen, category and officer details.
- Subquery: categories with complaint counts above the average.
- Stored procedure: `register_complaint` registers a complaint.
- Stored function: `count_open_complaints` counts open complaints for an officer.
- Trigger: `complaint_status_history` writes status changes to `complaint_history`.
- REST API: exposes the above operations as HTTP endpoints.

## Technology

- Java 21
- Spring Boot 4.1.1
- Spring Web
- Spring JDBC
- MySQL Connector/J
- Maven

## Database expected

The application expects the existing MySQL database `public_complaint_db` with these tables/routines:

- citizens
- categories
- officers
- complaints
- complaint_history
- register_complaint
- count_open_complaints
- complaint_status_history

The `database/` folder contains the SQL used to recreate the database from scratch if needed.

## Database connection

Defaults:

- URL: `jdbc:mysql://localhost:3306/public_complaint_db`
- Username: `root`
- Password: empty

If your MySQL username/password is different, edit `src/main/resources/application.properties` or set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables.

Windows CMD example:

```text
set DB_USERNAME=root
set DB_PASSWORD=your_password
```

PowerShell example:

```text
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_password"
```

## Run

Open the folder as a Maven project in IntelliJ IDEA, Eclipse/STS, or VS Code.

Run the main class:

`com.example.publiccomplaint.PublicComplaintApplication`

The API runs at:

`http://localhost:8080`

With Maven installed:

```text
mvn spring-boot:run
```

## REST endpoints

### Complaints

`GET /api/complaints`

Returns complaints with citizen/category/officer details using the JOIN query.

`GET /api/complaints/{id}`

Returns one complaint.

`POST /api/complaints`

Registers a complaint by calling the MySQL stored procedure.

Example JSON:

```json
{
  "citizenId": 2,
  "categoryId": 1,
  "officerId": 1,
  "description": "Water leakage near my house"
}
```

`officerId` can be `null` when the complaint has not been assigned.

`PUT /api/complaints/{id}/status`

Changes complaint status. The database trigger automatically writes the change to `complaint_history`.

Example JSON:

```json
{
  "status": "IN_PROGRESS"
}
```

Allowed statuses: `OPEN`, `IN_PROGRESS`, `RESOLVED`.

`GET /api/complaints/{id}/history`

Returns status history for a complaint.

### Categories

`GET /api/categories`

Returns category IDs and names.

`GET /api/categories/above-average`

Runs the above-average subquery.

### Officers

`GET /api/officers`

Returns officer IDs and names.

`GET /api/officers/{id}/open-count`

Calls the MySQL stored function.

### Citizens

`GET /api/citizens`

Returns citizen IDs and names for use in a future complaint form.

## Suggested API test order

1. `GET http://localhost:8080/api/complaints`
2. `GET http://localhost:8080/api/categories/above-average`
3. `GET http://localhost:8080/api/officers/1/open-count`
4. `POST http://localhost:8080/api/complaints`
5. `PUT http://localhost:8080/api/complaints/1/status`
6. `GET http://localhost:8080/api/complaints/1/history`

## Scope

This is intentionally simple for a college project. It does not add authentication, JWT, microservices, JPA, or a complicated frontend.
