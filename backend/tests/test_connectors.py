import pytest
from app.connectors.newsapi_connector import NewsAPIConnector
from app.connectors.google_factcheck_connector import GoogleFactCheckConnector
from datetime import datetime, timedelta


class TestNewsAPIConnector:
    def test_normalize_item(self):
        """Test item normalization"""
        connector = NewsAPIConnector()

        item = connector._normalize_item(
            source_name="Reuters",
            source_domain="reuters.com",
            url="https://reuters.com/article",
            title="Test Article",
            body_text="Test body",
            published_at=datetime.utcnow(),
            raw_json={"test": "data"},
        )

        assert item["source_name"] == "Reuters"
        assert item["source_domain"] == "reuters.com"
        assert item["url"] == "https://reuters.com/article"
        assert item["title"] == "Test Article"

    def test_extract_domain(self):
        """Test domain extraction"""
        connector = NewsAPIConnector()

        domain = connector._extract_domain("https://reuters.com/article/test")
        assert domain == "reuters.com"

        domain = connector._extract_domain("https://www.bbc.com/news/article")
        assert domain == "www.bbc.com"


class TestGoogleFactCheckConnector:
    def test_connector_initialization(self):
        """Test connector can be initialized"""
        connector = GoogleFactCheckConnector()
        assert connector is not None
        assert connector.base_url is not None
