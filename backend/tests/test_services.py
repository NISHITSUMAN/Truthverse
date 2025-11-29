import pytest
from app.services.claim_extraction import ClaimExtractor
from app.services.scoring import ScoringService


class TestClaimExtractor:
    def test_extract_claims(self):
        """Test claim extraction"""
        extractor = ClaimExtractor()

        text = "Study shows that 95% of patients improved. According to research, AI can detect cancer early."

        claims = extractor.extract_claims(text)

        assert len(claims) > 0
        assert any("95%" in claim.lower() for claim in claims)

    def test_canonicalize(self):
        """Test text canonicalization"""
        extractor = ClaimExtractor()

        text1 = "  The   AI  improves  healthcare  "
        text2 = "the ai improves healthcare"

        assert extractor._canonicalize(text1) == extractor._canonicalize(text2)

    def test_is_potential_claim(self):
        """Test claim detection"""
        extractor = ClaimExtractor()

        assert extractor._is_potential_claim("Study shows 95% improvement")
        assert extractor._is_potential_claim("According to research, AI helps")
        assert not extractor._is_potential_claim("Hello world")


class TestScoringService:
    def test_compute_score_verified(self):
        """Test verified claim scoring"""
        scorer = ScoringService()

        supporting = [
            {"nli_conf": 0.9, "source_trust": 0.95},
            {"nli_conf": 0.85, "source_trust": 0.90},
        ]

        result = scorer.compute_score(supporting=supporting, contradicting=[])

        assert result["cred_score"] >= 70
        assert result["label"] == "verified"

    def test_compute_score_fake(self):
        """Test fake claim scoring"""
        scorer = ScoringService()

        contradicting = [
            {"nli_conf": 0.9, "source_trust": 0.95},
            {"nli_conf": 0.85, "source_trust": 0.90},
        ]

        result = scorer.compute_score(supporting=[], contradicting=contradicting)

        assert result["cred_score"] <= 40
        assert result["label"] == "fake"

    def test_compute_score_mixed(self):
        """Test mixed evidence scoring"""
        scorer = ScoringService()

        supporting = [{"nli_conf": 0.7, "source_trust": 0.8}]
        contradicting = [{"nli_conf": 0.6, "source_trust": 0.75}]

        result = scorer.compute_score(supporting=supporting, contradicting=contradicting)

        assert 40 < result["cred_score"] < 70
        assert result["label"] == "needs_review"
