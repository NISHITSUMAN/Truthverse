# Frontend Integration Guide

This guide shows how to integrate the TruthVerse frontend (built with Lovable) with the backend API.

## Base Configuration

Set the API base URL in your frontend environment:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

## Authentication

For public endpoints, no authentication is required. For admin endpoints, include JWT token:

```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${jwtToken}`
};
```

## API Endpoints Reference

### 1. Get News Feed

**Endpoint:** `GET /feed`

**Query Parameters:**
- `topic` (optional): Filter by category
- `min_confidence` (optional): Minimum confidence score (0-100), default: 70
- `limit` (optional): Number of items, default: 20
- `cursor` (optional): Pagination cursor

**Example Request:**

```javascript
async function fetchNewsFeed(minConfidence = 70, limit = 20) {
  const response = await fetch(
    `${API_BASE_URL}/feed?min_confidence=${minConfidence}&limit=${limit}`
  );
  const data = await response.json();
  return data;
}
```

**Example Response:**

```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "AI Breakthrough in Healthcare Diagnostics",
      "summary": "Scientists develop new AI system that can detect diseases 95% faster than traditional methods...",
      "cred_score": 94.0,
      "label": "verified",
      "source": "Reuters",
      "published_at": "2024-01-15T10:30:00Z",
      "category": "Science",
      "confidence": 94
    }
  ],
  "cursor": null,
  "total": 1
}
```

**Integration with Lovable Frontend:**

The response matches the `mockNews` data structure in `src/pages/Index.tsx`. Map the response directly:

```javascript
// In your Index.tsx or data fetching component
const [news, setNews] = useState([]);

useEffect(() => {
  fetchNewsFeed(70, 20).then(data => {
    const mappedNews = data.items.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop', // Use default or fetch from CDN
      confidence: item.confidence,
      verified: item.label === 'verified',
      source: item.source,
      timeAgo: formatTimeAgo(item.published_at),
      category: item.category,
    }));
    setNews(mappedNews);
  });
}, []);
```

### 2. Get Claim Details

**Endpoint:** `GET /claim/{id}`

**Example Request:**

```javascript
async function fetchClaimDetails(claimId) {
  const response = await fetch(`${API_BASE_URL}/claim/${claimId}`);
  const data = await response.json();
  return data;
}
```

**Example Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "claim_text": "AI improves healthcare diagnostics by 95%",
  "cred_score": 94.0,
  "label": "verified",
  "explain_text": "This claim is VERIFIED with 94% confidence. Found strong supporting evidence from multiple trusted sources including Nature Medicine and WHO reports.",
  "evidence": [
    {
      "snippet": "Clinical trials demonstrate 94.7% improvement in diagnostic speed with 98.2% accuracy rate",
      "source": "Nature Medicine",
      "stance": "support",
      "nli_conf": 0.94,
      "url": "https://nature.com/article/ai-diagnosis-study"
    },
    {
      "snippet": "WHO validates methodology and endorses the technology",
      "source": "WHO Report",
      "stance": "support",
      "nli_conf": 0.97,
      "url": "https://who.int/report"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Integration:**

This data structure matches the `article` object in `src/pages/NewsDetail.tsx`. Use it directly in the detail view.

### 3. Verify Link/Text

**Endpoint:** `POST /verify`

**Request Body:**

```json
{
  "url": "https://example.com/article",
  "text": null
}
```

OR

```json
{
  "url": null,
  "text": "Your claim text here"
}
```

**Example Request:**

```javascript
async function verifyContent(url = null, text = null) {
  const response = await fetch(`${API_BASE_URL}/verify`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url, text})
  });
  const data = await response.json();
  return data;
}
```

**Example Response:**

```json
{
  "claims": [
    {
      "id": "abc123",
      "claim_text": "AI improves healthcare by 95%",
      "cred_score": 88.0,
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
  ],
  "processing_time": 2.3,
  "checked_sources": 47
}
```

**Integration with Verify Page:**

The response structure matches what's expected in `src/pages/VerifyLink.tsx`:

```javascript
// In VerifyLink.tsx
const handleVerify = async () => {
  setIsVerifying(true);

  const data = await verifyContent(url, null);

  if (data.claims.length > 0) {
    setResult({
      url: url,
      title: data.claims[0].claim_text,
      status: data.claims[0].label,
      confidence: data.claims[0].cred_score,
      summary: data.claims[0].explain_text,
      evidence: data.claims[0].evidence,
      checkedSources: data.checked_sources,
      processingTime: data.processing_time,
    });
  }

  setIsVerifying(false);
};
```

### 4. AI Chat

**Endpoint:** `POST /ai_chat`

**Request Body:**

```json
{
  "user_id": "user-uuid",
  "prompt": "What is the current status of AI in healthcare?",
  "max_tokens": 500
}
```

**Example Request:**

```javascript
async function askAI(userId, prompt) {
  const response = await fetch(`${API_BASE_URL}/ai_chat`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      user_id: userId,
      prompt: prompt,
      max_tokens: 500
    })
  });
  const data = await response.json();
  return data;
}
```

**Example Response:**

```json
{
  "answer": "Based on verified sources: AI has shown significant improvements in healthcare diagnostics...",
  "confidence": 0.85,
  "sources": [
    {
      "title": "AI Breakthrough in Healthcare",
      "source": "Reuters",
      "confidence": 0.95
    }
  ],
  "chats_remaining": 4
}
```

**Integration with AI Chat Page:**

Matches the structure in `src/pages/AIChat.tsx`:

```javascript
// In AIChat.tsx
const handleSend = async () => {
  const newMessage = {
    id: Date.now().toString(),
    role: "user",
    content: input,
    timestamp: new Date(),
  };
  setMessages([...messages, newMessage]);

  const response = await askAI(userId, input);

  const aiMessage = {
    id: (Date.now() + 1).toString(),
    role: "assistant",
    content: response.answer,
    confidence: Math.round(response.confidence * 100),
    sources: response.sources.map(s => ({
      name: s.source,
      url: "#"
    })),
    timestamp: new Date(),
  };
  setMessages(prev => [...prev, aiMessage]);
};
```

### 5. Report a Claim

**Endpoint:** `POST /report`

**Request Body:**

```json
{
  "claim_id": "claim-uuid",
  "user_id": "user-uuid",
  "reason": "Misleading information"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "detail": "Error message here"
}
```

Handle errors in your frontend:

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }
  return await response.json();
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly error message
}
```

## Rate Limiting

Public endpoints have rate limits:
- General endpoints: 60 requests/minute per IP
- `/verify`: 10 requests/minute per user
- `/ai_chat`: 5 requests/day for free users

When rate limited, you'll receive a 429 status code.

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:8080` (Vite dev server)
- `http://localhost:3000` (Create React App)

For production, update `CORS_ORIGINS` in the backend `.env` file.

## Complete Integration Example

```javascript
// api.js - Centralized API client
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class TruthVerseAPI {
  async getFeed(options = {}) {
    const { minConfidence = 70, limit = 20, topic = null } = options;
    const params = new URLSearchParams({
      min_confidence: minConfidence,
      limit: limit,
    });
    if (topic) params.append('topic', topic);

    const response = await fetch(`${API_BASE_URL}/feed?${params}`);
    return await response.json();
  }

  async verifyClaim(url = null, text = null) {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url, text})
    });
    return await response.json();
  }

  async askAI(userId, prompt) {
    const response = await fetch(`${API_BASE_URL}/ai_chat`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userId, prompt, max_tokens: 500})
    });
    return await response.json();
  }

  async reportClaim(claimId, userId, reason) {
    const response = await fetch(`${API_BASE_URL}/report`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({claim_id: claimId, user_id: userId, reason})
    });
    return await response.json();
  }
}

export default new TruthVerseAPI();
```

## Testing the Integration

1. Start the backend:
```bash
cd backend
docker-compose up
```

2. Start the frontend:
```bash
cd ..
npm run dev
```

3. The frontend should now connect to `http://localhost:8000` and display real data from the backend.

4. Test key flows:
   - View feed on home page
   - Click article to see details
   - Use verify link feature
   - Try AI chat

## Production Deployment

When deploying to production:

1. Update `REACT_APP_API_URL` to your production backend URL
2. Ensure CORS is configured correctly in backend
3. Use HTTPS for all API calls
4. Implement proper JWT token management for authenticated requests
