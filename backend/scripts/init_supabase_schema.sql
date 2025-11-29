/*
  # TruthVerse Database Schema

  1. Tables
    - users: User accounts with roles and usage limits
    - sources: Trusted news sources with credibility scores
    - raw_items: Fetched articles and content
    - snippets: Sentence-level extracted text for retrieval
    - claims: Extracted factual claims
    - evidence: Supporting/contradicting evidence for claims
    - claim_reports: Verification results with scores
    - human_labels: Manual moderator reviews
    - reports: User-submitted reports on claims
    - embeddings: Vector embeddings for dense retrieval

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users and admins
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'mod', 'admin')),
  free_chats_left INTEGER NOT NULL DEFAULT 5,
  free_verifies_left INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  trust_score FLOAT NOT NULL DEFAULT 0.5 CHECK (trust_score >= 0 AND trust_score <= 1),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sources are publicly readable"
  ON sources FOR SELECT
  TO authenticated
  USING (true);

-- Raw items table
CREATE TABLE IF NOT EXISTS raw_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body_text TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT now(),
  raw_json JSONB
);

ALTER TABLE raw_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Raw items are publicly readable"
  ON raw_items FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_raw_items_source ON raw_items(source_id);
CREATE INDEX idx_raw_items_published ON raw_items(published_at DESC);
CREATE INDEX idx_raw_items_url ON raw_items(url);

-- Snippets table
CREATE TABLE IF NOT EXISTS snippets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raw_item_id UUID NOT NULL REFERENCES raw_items(id) ON DELETE CASCADE,
  sentence_text TEXT NOT NULL,
  sentence_idx INTEGER NOT NULL,
  embedding_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Snippets are publicly readable"
  ON snippets FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_snippets_raw_item ON snippets(raw_item_id);
CREATE INDEX idx_snippets_embedding ON snippets(embedding_id);

-- Full-text search index on snippets
CREATE INDEX idx_snippets_fts ON snippets USING gin(to_tsvector('english', sentence_text));

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raw_item_id UUID NOT NULL REFERENCES raw_items(id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  canonical_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'fake', 'needs_review'))
);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Claims are publicly readable"
  ON claims FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_claims_raw_item ON claims(raw_item_id);
CREATE INDEX idx_claims_hash ON claims(canonical_hash);
CREATE INDEX idx_claims_status ON claims(status);

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  stance TEXT NOT NULL CHECK (stance IN ('support', 'contradict', 'neutral')),
  nli_conf FLOAT NOT NULL CHECK (nli_conf >= 0 AND nli_conf <= 1),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Evidence is publicly readable"
  ON evidence FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_evidence_claim ON evidence(claim_id);
CREATE INDEX idx_evidence_snippet ON evidence(snippet_id);
CREATE INDEX idx_evidence_stance ON evidence(stance);

-- Claim reports table
CREATE TABLE IF NOT EXISTS claim_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  cred_score FLOAT NOT NULL CHECK (cred_score >= 0 AND cred_score <= 100),
  label TEXT NOT NULL CHECK (label IN ('verified', 'needs_review', 'fake')),
  explain_text TEXT NOT NULL,
  supporting_evidence_ids JSONB,
  contradicting_evidence_ids JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE claim_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Claim reports are publicly readable"
  ON claim_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_claim_reports_claim ON claim_reports(claim_id);
CREATE INDEX idx_claim_reports_label ON claim_reports(label);
CREATE INDEX idx_claim_reports_score ON claim_reports(cred_score DESC);

-- Human labels table
CREATE TABLE IF NOT EXISTS human_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  reviewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE human_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Moderators can read all labels"
  ON human_labels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('mod', 'admin')
    )
  );

CREATE POLICY "Moderators can create labels"
  ON human_labels FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('mod', 'admin')
    )
  );

CREATE INDEX idx_human_labels_claim ON human_labels(claim_id);
CREATE INDEX idx_human_labels_reviewer ON human_labels(reviewer_user_id);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Moderators can read reports"
  ON reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('mod', 'admin')
    )
  );

CREATE INDEX idx_reports_claim ON reports(claim_id);
CREATE INDEX idx_reports_user ON reports(user_id);

-- Embeddings table (for FAISS indexing)
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  vector_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Embeddings are readable by system"
  ON embeddings FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_embeddings_snippet ON embeddings(snippet_id);
