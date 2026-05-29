# Setup Quick Start Guide

## Prerequisites

- Node.js 16+
- Docker & Docker Compose
- Git

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
git clone https://github.com/cantstop113/Archisynapse-.git
cd Archisynapse-
npm install
```

### 2. Start Local Environment

```bash
# Copy environment template
cp .env.example .env.local

# Start services with Docker Compose
docker-compose up -d
```

Services now running:
- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **RabbitMQ**: localhost:5672 (Management: http://localhost:15672)

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Create transaction (replace with actual API key)
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer sk_test_123456789" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "USD",
    "payment_method": { "type": "card" }
  }'
```

## Available Commands

```bash
npm start        # Start production server
npm run dev      # Start with auto-reload
npm test         # Run tests
npm run lint     # Lint code
npm run migrate  # Run database migrations
```

## Docker Commands

```bash
# View running services
docker-compose ps

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Clean everything (including data)
docker-compose down -v
```

## Troubleshooting

**Port already in use?**
```bash
# Kill service on port
lsof -ti:3000 | xargs kill -9
```

**Database connection error?**
```bash
# Check database is running
docker-compose logs postgres

# Restart all services
docker-compose restart
```

**Need to reset data?**
```bash
docker-compose down -v
docker-compose up -d
```

---

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment.
