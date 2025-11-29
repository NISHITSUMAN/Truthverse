#!/usr/bin/env python3
"""
Seed database with demo data for offline testing
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
import json
from app.core.database import db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_sources():
    """Create trusted sources"""
    sources = [
        {"name": "Reuters", "domain": "reuters.com", "trust_score": 0.95},
        {"name": "Associated Press", "domain": "ap.org", "trust_score": 0.95},
        {"name": "BBC News", "domain": "bbc.com", "trust_score": 0.90},
        {"name": "The Guardian", "domain": "theguardian.com", "trust_score": 0.85},
        {"name": "Nature Medicine", "domain": "nature.com", "trust_score": 0.98},
        {"name": "WHO", "domain": "who.int", "trust_score": 0.97},
        {"name": "PolitiFact", "domain": "politifact.com", "trust_score": 0.90},
        {"name": "FactCheck.org", "domain": "factcheck.org", "trust_score": 0.90},
    ]

    client = db.get_service_client()

    for source in sources:
        try:
            client.table("sources").insert(source).execute()
            logger.info(f"Created source: {source['name']}")
        except Exception as e:
            logger.warning(f"Source may already exist: {source['name']}")


def seed_sample_articles():
    """Create sample articles"""
    client = db.get_service_client()

    sources_response = client.table("sources").select("id, name").execute()
    sources_map = {s["name"]: s["id"] for s in sources_response.data}

    articles = [
        {
            "source_id": sources_map.get("Reuters"),
            "url": "https://reuters.com/article/ai-healthcare-breakthrough",
            "title": "AI Breakthrough in Healthcare Diagnostics",
            "body_text": "Scientists develop new AI system that can detect diseases 95% faster than traditional methods. The system has been tested across 15 countries with over 10,000 patient cases.",
            "published_at": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
        },
        {
            "source_id": sources_map.get("Nature Medicine"),
            "url": "https://nature.com/article/ai-diagnosis-study",
            "title": "Clinical Trials Show AI Diagnostic Accuracy",
            "body_text": "Clinical trials demonstrate 94.7% improvement in diagnostic speed with 98.2% accuracy rate across diverse patient populations.",
            "published_at": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
        },
        {
            "source_id": sources_map.get("BBC News"),
            "url": "https://bbc.com/news/climate-agreement",
            "title": "Global Climate Agreement Reaches Historic Milestone",
            "body_text": "195 nations commit to unprecedented emissions reductions, marking the most significant climate action in history.",
            "published_at": (datetime.utcnow() - timedelta(hours=4)).isoformat(),
        },
    ]

    for article in articles:
        try:
            response = client.table("raw_items").insert(article).execute()
            article_id = response.data[0]["id"]
            logger.info(f"Created article: {article['title']}")

            sentences = article["body_text"].split(". ")
            for idx, sentence in enumerate(sentences):
                if sentence.strip():
                    client.table("snippets").insert({
                        "raw_item_id": article_id,
                        "sentence_text": sentence.strip(),
                        "sentence_idx": idx,
                    }).execute()

        except Exception as e:
            logger.error(f"Error creating article: {e}")


def seed_demo_claims():
    """Create demo claims with reports"""
    client = db.get_service_client()

    snippets_response = client.table("snippets").select("*").limit(10).execute()

    if not snippets_response.data:
        logger.warning("No snippets found, skipping claims")
        return

    snippet = snippets_response.data[0]

    claim_data = {
        "raw_item_id": snippet["raw_item_id"],
        "claim_text": "AI improves healthcare diagnostics by 95%",
        "canonical_hash": "abc123",
        "status": "verified",
    }

    try:
        claim_response = client.table("claims").insert(claim_data).execute()
        claim_id = claim_response.data[0]["id"]
        logger.info("Created demo claim")

        report_data = {
            "claim_id": claim_id,
            "cred_score": 94.0,
            "label": "verified",
            "explain_text": "This claim is VERIFIED with 94% confidence. Found strong supporting evidence from multiple trusted sources.",
            "supporting_evidence_ids": json.dumps([snippet["id"]]),
            "contradicting_evidence_ids": json.dumps([]),
        }

        client.table("claim_reports").insert(report_data).execute()
        logger.info("Created demo claim report")

    except Exception as e:
        logger.error(f"Error creating claim: {e}")


def main():
    logger.info("Starting database seeding...")

    try:
        seed_sources()
        seed_sample_articles()
        seed_demo_claims()

        logger.info("Database seeding completed successfully!")

    except Exception as e:
        logger.error(f"Seeding failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
