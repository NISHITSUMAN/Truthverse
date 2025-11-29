# TruthVerse Backend

Production-grade fact-checking and news verification API with hybrid retrieval, NLI stance detection, and explainable credibility scoring.

## Features

- Multi-source news ingestion (GDELT, NewsAPI, Newscatcher, etc.)
- Hybrid retrieval (BM25 + FAISS dense vectors)
- NLI-based stance detection using Hugging Face models
- Explainable credibility scoring with provenance
- REST API with OpenAPI/Swagger docs
- JWT-based authentication for moderation
- Rate limiting and caching
- Background job processing with Celery
- Supabase for data persistence
- Docker-ready deployment

## Architecture

```
backend/
├── app/
│   ├── api/           # FastAPI routes
│   ├── connectors/    # External API integrations
│   ├── core/          # Config, database, utilities
│   ├── models/        # Pydantic data models
│   ├── services/      # Business logic (NLI, scoring, retrieval)
│   └── workers/       # Celery background tasks
├── scripts/           # Setup and seed scripts
├── tests/             # Unit and integration tests
├── docker/            # Docker configuration
└── docs/              # Additional documentation
```

## Quick Start

### Prerequisites

- Python 3.10+
- Docker & Docker Compose (for local development)
- Supabase account (or use local PostgreSQL)
- Redis instance
- API keys for external sources (optional for demo mode)

### Installation

1. **Clone and setup:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure environment:**

```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Initialize Supabase database:**

Run the SQL migration script in your Supabase SQL editor:

```bash
cat scripts/init_supabase_schema.sql
```

Or use the Supabase CLI:

```bash
supabase db push
```

4. **Download NLP models:**

```bash
python scripts/ensure_models.py
```

5. **Seed demo data (optional):**

```bash
python scripts/seed_data.py
```

### Running Locally

**Option 1: Direct Python**

```bash
# Terminal 1: Start Redis (or use Docker)
redis-server

# Terminal 2: Start API server
uvicorn app.main:app --reload --port 8000

# Terminal 3: Start Celery worker
celery -A app.workers.celery_app worker --loglevel=info
```

**Option 2: Docker Compose**

```bash
docker-compose up --build
```

Access the API:
- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc
- Prometheus metrics: http://localhost:8000/metrics

## Demo Mode

Set `DEMO_MODE=true` in `.env` to run without external API keys. The system will use seeded data only.

```bash
DEMO_MODE=true uvicorn app.main:app --reload
```

## API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `GET /feed` - Get verified news feed
  - Query params: `topic`, `min_confidence`, `limit`, `cursor`
- `GET /claim/{id}` - Get full claim report with evidence
- `POST /verify` - Verify a URL or text
  - Body: `{"url": "...", "text": "..."}`
- `POST /report` - Report a claim
  - Body: `{"claim_id": "...", "user_id": "...", "reason": "..."}`

### AI Chat

- `POST /ai_chat` - Ask AI questions (rate-limited)
  - Body: `{"user_id": "...", "prompt": "...", "max_tokens": 500}`

### Admin Endpoints (JWT Required)

- `GET /admin/reported` - List reported claims
- `POST /admin/review/{claim_id}` - Review a claim
  - Body: `{"action": "approve|reject|needs_review", "note": "..."}`
- `POST /admin/publish_manual` - Manually add verified claim
- `POST /admin/ban_user` - Ban a user

## Configuration

Key environment variables:

```bash
# Supabase
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# External APIs
NEWSAPI_KEY=your-key
NEWSCATCHER_KEY=your-key
GOOGLE_FACTCHECK_KEY=your-key

# Models
EMBEDDING_MODEL=sentence-transformers/all-mpnet-base-v2
NLI_MODEL=facebook/bart-large-mnli

# Scoring
SCORE_VERIFIED_MIN=70
SCORE_FAKE_MAX=40

# Rate Limits
RATE_LIMIT_VERIFY=10
FREE_VERIFIES_PER_DAY=10
```

## External Data Sources

The backend integrates with:

1. **News APIs:**
   - NewsAPI - General news aggregator
   - Newscatcher API - News search
   - Mediastack - News API
   - GDELT - Global events database

2. **Fact-Checking:**
   - Google Fact Check API - Verified fact-checks

3. **Specialized Sources:**
   - ReliefWeb API - Humanitarian news
   - disease.sh - COVID-19 data
   - openFDA - FDA data
   - NCBI/PubMed - Medical research

## How It Works

### 1. Ingestion Pipeline

```python
# Automatic polling or manual trigger
POST /ingest {"url": "https://example.com/article"}

# System workflow:
1. Fetch article via connectors
2. Store as raw_item
3. Extract sentences (snippets)
4. Generate embeddings
5. Index for search (BM25 + FAISS)
6. Queue for claim verification
```

### 2. Claim Verification

```python
# When a claim is detected:
1. Extract claims from text (rule-based + ML)
2. Canonicalize claim text
3. Hybrid retrieval (BM25 + dense)
4. NLI stance detection on top-K snippets
5. Aggregate evidence with source trust
6. Compute credibility score (0-100)
7. Generate explanation
8. Store claim_report
```

### 3. Credibility Scoring

```python
# Explainable formula:
raw_score = sum(
    stance_val * nli_conf * (0.7 + 0.3 * source_trust)
    for each evidence snippet
) / sqrt(N_snippets)

cred_score = sigmoid_scale(raw_score) * 100

# Labels:
- cred_score >= 70: "verified"
- cred_score < 40: "fake"
- 40-70: "needs_review"
```

### 4. Human-in-the-Loop

Claims are queued for moderator review if:
- Credibility score in ambiguous range (40-70)
- High-impact topics (health, elections)
- Multiple user reports (>= 3)

## Testing

```bash
# Run all tests
pytest

# With coverage
pytest --cov=app tests/

# Specific test file
pytest tests/test_connectors.py

# Integration tests
pytest tests/integration/
```

## Deployment

### Docker

```bash
# Build image
docker build -t truthverse-backend .

# Run container
docker run -p 8000:8000 --env-file .env truthverse-backend
```

### Docker Compose (Production)

```bash
# Production setup with all services
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment

**Heroku:**
```bash
heroku create truthverse-api
heroku addons:create heroku-redis
heroku config:set SUPABASE_URL=...
git push heroku main
```

**Render:**
```bash
# Use render.yaml for configuration
# Set environment variables in Render dashboard
```

## Monitoring

- **Prometheus metrics:** Available at `/metrics`
- **Sentry error tracking:** Configure `SENTRY_DSN`
- **Logging:** Structured JSON logs to stdout

Example Grafana dashboard available in `docker/grafana/dashboards/`.

## Model Management

### Download Models

```bash
python scripts/ensure_models.py
```

### Fine-tune Models

```bash
# Claim detector
python scripts/train_claim_detector.py --data human_labels.csv

# NLI model
python scripts/train_nli.py --data stance_dataset.csv
```

### Model Registry

Models are cached in `~/.cache/huggingface/` by default.

## Frontend Integration

### Example: Fetch News Feed

```javascript
const response = await fetch('http://localhost:8000/feed?min_confidence=70&limit=20');
const data = await response.json();

// Response structure:
{
  "items": [
    {
      "id": "uuid",
      "title": "Article Title",
      "summary": "Preview text...",
      "cred_score": 94,
      "label": "verified",
      "source": "Reuters",
      "published_at": "2024-01-15T10:30:00Z",
      "category": "Science"
    }
  ],
  "cursor": "next_page_token"
}
```

### Example: Verify Link

```javascript
const response = await fetch('http://localhost:8000/verify', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({url: 'https://example.com/article'})
});

const data = await response.json();

// Response structure:
{
  "claims": [
    {
      "id": "uuid",
      "claim_text": "AI improves healthcare by 95%",
      "cred_score": 88,
      "label": "verified",
      "explain_text": "Verified across 47 sources...",
      "evidence": [
        {
          "snippet": "Clinical trials show...",
          "source": "Nature Medicine",
          "stance": "support",
          "nli_conf": 0.94,
          "url": "https://..."
        }
      ]
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License

## Support

- Documentation: `/docs`
- Issues: GitHub Issues
- API Support: support@truthverse.com
