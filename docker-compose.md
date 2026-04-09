# 🐳 Running Locally with Docker Compose

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Ports **3000**, **3001**, **3010**, **4001–4005**, **4011–4015**, **9092**, **29092**, and **3308** available

## Quick Start

```bash
# 1. Clone the repo and navigate to the project root
cd microsservices

# 2. Copy environment file (edit values as needed)
cp .env.example .env

# 3. Build and start all services in detached mode
docker compose up --build -d

# 4. Wait for all health checks to pass (~2-3 min on first run)
docker compose ps
```

## Services Overview

| Service            | Container Name                 | Internal Port | External Port | Health Check       |
| ------------------ | ------------------------------ | ------------- | ------------- | ------------------ |
| **Zookeeper**      | ag-ecommerce-zookeeper         | 2181          | —             | —                  |
| **Kafka**          | ag-ecommerce-kafka             | 9092          | 9092 / 29092  | ✅ broker API       |
| **MySQL**          | ag-ecommerce-mysql             | 3306          | 3308          | ✅ mysqladmin ping  |
| **Users Service**  | ag-ecommerce-users-service     | 4001          | 4001          | ✅ /health (4011)   |
| **Orders Service** | ag-ecommerce-orders-service    | 4002          | 4002          | ✅ /health (4012)   |
| **Auth Service**   | ag-ecommerce-auth-service      | 4003          | 4003          | ✅ /health (4013)   |
| **Product Service**| ag-ecommerce-product-service   | 4004          | 4004          | ✅ /health (4014)   |
| **Shipping Service**| ag-ecommerce-shipping-service | 4005          | 4005          | ✅ /health (4015)   |
| **API Gateway**    | ag-ecommerce-api-gateway       | 3000          | 3010          | ✅ /health          |
| **Seed**           | ag-ecommerce-seed              | —             | —             | exits after seeding |
| **Frontend**       | ag-ecommerce-frontend          | 3000          | 3000          | —                  |
| **Frontend Admin** | ag-ecommerce-admin             | 3001          | 3001          | —                  |

## Access Points

| Application         | URL                          |
| ------------------- | ---------------------------- |
| **Frontend (Store)** | http://localhost:3000        |
| **Frontend (Admin)** | http://localhost:3001        |
| **API Gateway**      | http://localhost:3010        |
| **API Health Check** | http://localhost:3010/health |

## Useful Commands

### Start / Stop

```bash
# Start all services (detached)
docker compose up -d

# Start all services with rebuild
docker compose up --build -d

# Stop all services (keep data)
docker compose down

# Stop all services and remove volumes (clean slate)
docker compose down -v
```

### Logs

```bash
# Follow logs for all services
docker compose logs -f

# Follow logs for a specific service
docker compose logs -f api-gateway
docker compose logs -f users-service
docker compose logs -f frontend

# Show last 50 lines of a service
docker compose logs --tail 50 auth-service
```

### Status & Health

```bash
# List all containers with status
docker compose ps -a

# Quick health check on the API Gateway
curl http://localhost:3010/health
```

### Rebuild a Single Service

```bash
# Rebuild and restart only one service (e.g. after code changes)
docker compose up -d --build <service-name>

# Examples:
docker compose up -d --build api-gateway
docker compose up -d --build frontend
docker compose up -d --build users-service
```

### Database

```bash
# Connect to MySQL
docker exec -it ag-ecommerce-mysql mysql -u root -proot study_ms

# Reset database (removes volume and recreates)
docker compose down -v
docker compose up --build -d
```

### Run the Seed Manually

```bash
docker compose run --rm seed
```

## Startup Order

The services start in the following dependency order:

```
Zookeeper → Kafka (healthy)
                ↓
MySQL (healthy) → Users Service (healthy) → Orders Service
                                           → Auth Service
                                           → Product Service
                                           → Shipping Service
                                                    ↓
                                           API Gateway (healthy)
                                                    ↓
                                           Seed (runs once)
                                           Frontend
                                           Frontend Admin
```

> **Note:** The `users-service` runs `prisma db push` to create/sync all database tables.
> All other services only run `prisma generate` since they share the same schema.

## Troubleshooting

### Service won't start or exits immediately
```bash
# Check the logs for the failing service
docker compose logs <service-name>
```

### Port already in use
```bash
# Find what's using the port (e.g. 3000)
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Kafka connection issues
Kafka takes ~30s to become healthy. Services will retry automatically. If issues persist:
```bash
docker compose restart kafka
```

### Clean restart (nuclear option)
```bash
docker compose down -v --rmi local
docker compose up --build -d
```

## Default Credentials

| Field    | Value                     |
| -------- | ------------------------- |
| Admin Email | admin@aguiadiesel.com.br |
| Admin Password | admin@123            |
| MySQL Root Password | root          |
| MySQL Database | study_ms              |
