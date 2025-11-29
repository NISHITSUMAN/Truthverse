from typing import List, Dict, Any
import math
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class ScoringService:
    """Compute explainable credibility scores"""

    def compute_score(
        self,
        supporting: List[Dict[str, float]],
        contradicting: List[Dict[str, float]],
        neutral: List[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """
        Compute credibility score from evidence

        Formula:
        raw_score = sum(stance_val * nli_conf * (0.7 + 0.3*source_trust)) / sqrt(N)
        cred_score = sigmoid_scale(raw_score) * 100
        """
        if neutral is None:
            neutral = []

        all_evidence = supporting + contradicting + neutral
        if not all_evidence:
            return {
                "cred_score": 50.0,
                "label": "needs_review",
                "explanation": "No evidence found to verify claim",
            }

        raw_score = 0.0
        for evidence in supporting:
            stance_val = 1.0
            nli_conf = evidence["nli_conf"]
            source_trust = evidence.get("source_trust", 0.5)
            contribution = stance_val * nli_conf * (0.7 + 0.3 * source_trust)
            raw_score += contribution

        for evidence in contradicting:
            stance_val = -1.0
            nli_conf = evidence["nli_conf"]
            source_trust = evidence.get("source_trust", 0.5)
            contribution = stance_val * nli_conf * (0.7 + 0.3 * source_trust)
            raw_score += contribution

        n_evidence = len(all_evidence)
        normalized_score = raw_score / math.sqrt(n_evidence)

        cred_score = self._sigmoid_scale(normalized_score) * 100

        if cred_score >= settings.SCORE_VERIFIED_MIN:
            label = "verified"
        elif cred_score <= settings.SCORE_FAKE_MAX:
            label = "fake"
        else:
            label = "needs_review"

        explanation = self._generate_explanation(
            cred_score, len(supporting), len(contradicting), len(neutral)
        )

        return {
            "cred_score": round(cred_score, 1),
            "label": label,
            "explanation": explanation,
            "evidence_breakdown": {
                "supporting": len(supporting),
                "contradicting": len(contradicting),
                "neutral": len(neutral),
            },
        }

    def _sigmoid_scale(self, x: float) -> float:
        """Map raw score to 0-1 using sigmoid"""
        return 1 / (1 + math.exp(-x))

    def _generate_explanation(
        self, score: float, n_support: int, n_contradict: int, n_neutral: int
    ) -> str:
        """Generate explanation text"""
        total = n_support + n_contradict + n_neutral

        if score >= settings.SCORE_VERIFIED_MIN:
            return (
                f"This claim is VERIFIED with {score:.0f}% confidence. "
                f"Found {n_support} supporting evidence from {total} sources analyzed. "
                f"The claim is backed by credible sources with high agreement."
            )
        elif score <= settings.SCORE_FAKE_MAX:
            return (
                f"This claim is likely FALSE with {100-score:.0f}% confidence. "
                f"Found {n_contradict} contradicting evidence from {total} sources analyzed. "
                f"Multiple credible sources dispute this claim."
            )
        else:
            return (
                f"This claim NEEDS REVIEW (confidence: {score:.0f}%). "
                f"Evidence is mixed: {n_support} supporting, {n_contradict} contradicting from {total} sources. "
                f"Further verification recommended."
            )
