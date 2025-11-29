# TruthVerse Backend - Quickstart Guide

Get the TruthVerse backend running in 5 minutes.

## Prerequisites

- Python 3.10+
- Docker & Docker Compose (recommended)
- Supabase account (free tier works)

## Quick Setup with Docker (Recommended)

### 1. Configure Supabase

1. Create a free Supabase project at https://supabase.com
2. Go to Settings > API to get your credentials
3. Go to SQL Editor and run the migration script:

```bash
# Copy the contents of scripts/init_supabase_schema.sql
# Paste into Supabase SQL Editor and run
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

For demo mode (works without API keys):
```bash
DEMO_MODE=true
```

### 3. Start Services

```bash
docker-compose up --build
```

This starts:
- API server on http://localhost:8000
- Postgres database
- Redis cache
- Celery worker

### 4. Seed Demo Data

In a new terminal:

```bash
docker-compose exec api python scripts/seed_data.py
```

### 5. Test the API

Open http://localhost:8000/docs to see the interactive API documentation.

Try these endpoints:
- GET http://localhost:8000/health - Health check
- GET http://localhost:8000/feed - Get news feed

## Quick Setup without Docker

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Initialize Database

Run the SQL migration in your Supabase project (scripts/init_supabase_schema.sql)

### 4. Download Models (Optional)

```bash
python scripts/ensure_models.py
```

This downloads ML models for local inference. Skip this if using DEMO_MODE.

### 5. Seed Demo Data

```bash
python scripts/seed_data.py
```

### 6. Start Redis (Required)

```bash
# Install and start Redis locally, or:
docker run -d -p 6379:6379 redis:7-alpine
```

### 7. Start the API Server

```bash
uvicorn app.main:app --reload --port 8000
```

### 8. Start Worker (Optional)

In a new terminal:

```bash
celery -A app.workers.celery_app worker --loglevel=info
```

## Testing the API

### Get Health Status

```bash
curl http://localhost:8000/health
```

### Get News Feed

```bash
curl "http://localhost:8000/feed?min_confidence=70&limit=10"
```

### Verify a Claim

```bash
curl -X POST http://localhost:8000/verify \
  -H "Content-Type: application/json" \
  -d '{"text": "AI improves healthcare by 95%"}'
```

## Next Steps

1. **Add API Keys**: Add external API keys to `.env` for live data:
   - NEWSAPI_KEY
   - GOOGLE_FACTCHECK_KEY
   - NEWSCATCHER_KEY

2. **Connect Frontend**: Follow the integration guide in `docs/frontend_integration.md`

3. **Deploy**: See deployment instructions in the main README.md

## Troubleshooting

### "Supabase credentials not configured"

Make sure you've set SUPABASE_URL and SUPABASE_KEY in `.env`

### "Connection refused" for Redis

Start Redis:
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

### "No module named 'app'"

Make sure you're in the backend directory and your virtual environment is activated.

### Database tables don't exist

Run the SQL migration script in your Supabase SQL editor:
```bash
cat scripts/init_supabase_schema.sql
```

### API returns empty feed

Run the seed script to populate demo data:
```bash
python scripts/seed_data.py
```

## Demo Mode

To run completely offline without API keys:

```bash
# In .env
DEMO_MODE=true
```

Then seed data and start the server. The system will use only cached/seeded data.

## Development Tips

1. **Hot Reload**: Use `--reload` flag with uvicorn for auto-restart on code changes

2. **Debug Logging**: Set `DEBUG=true` in `.env` for verbose logs

3. **API Docs**: Visit http://localhost:8000/docs for interactive Swagger UI

4. **Database Inspection**: Use Supabase dashboard to inspect tables and data

5. **Run Tests**:
   ```bash
   pytest tests/ -v
   ```

## Common Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# Run tests in container
docker-compose exec api pytest

# Access Python shell
docker-compose exec api python
```

## Support

- Documentation: See README.md and docs/
- API Reference: http://localhost:8000/docs
- Issues: Check logs with `docker-compose logs`
