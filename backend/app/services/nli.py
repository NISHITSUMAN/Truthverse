from typing import Dict
from transformers import pipeline
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class NLIService:
    """Natural Language Inference for stance detection"""

    def __init__(self):
        self.model = None
        self._initialize_model()

    def _initialize_model(self):
        """Initialize NLI model"""
        try:
            if settings.USE_HF_INFERENCE:
                logger.info("Using HuggingFace Inference API for NLI")
            else:
                logger.info(f"Loading local NLI model: {settings.NLI_MODEL}")
                self.model = pipeline(
                    "text-classification",
                    model=settings.NLI_MODEL,
                    device=-1,
                )
        except Exception as e:
            logger.warning(f"Failed to load NLI model: {e}")
            self.model = None

    def get_stance(self, claim: str, evidence: str) -> Dict[str, any]:
        """
        Determine stance of evidence toward claim
        Returns: {"stance": "support|contradict|neutral", "score": float, "explanation": str}
        """
        if not self.model:
            return self._fallback_stance(claim, evidence)

        try:
            input_text = f"{claim} [SEP] {evidence}"

            result = self.model(input_text, truncation=True, max_length=512)[0]

            label = result["label"].lower()
            score = result["score"]

            if "entailment" in label or "support" in label:
                stance = "support"
            elif "contradiction" in label or "contradict" in label:
                stance = "contradict"
            else:
                stance = "neutral"

            explanation = self._generate_explanation(claim, evidence, stance, score)

            return {
                "stance": stance,
                "score": score,
                "explanation": explanation,
            }

        except Exception as e:
            logger.error(f"NLI inference error: {e}")
            return self._fallback_stance(claim, evidence)

    def _fallback_stance(self, claim: str, evidence: str) -> Dict[str, any]:
        """Simple keyword-based fallback"""
        claim_lower = claim.lower()
        evidence_lower = evidence.lower()

        claim_words = set(claim_lower.split())
        evidence_words = set(evidence_lower.split())
        overlap = len(claim_words & evidence_words)

        if overlap > len(claim_words) * 0.5:
            stance = "support"
            score = 0.6
        else:
            stance = "neutral"
            score = 0.5

        return {
            "stance": stance,
            "score": score,
            "explanation": "Fallback stance detection based on keyword overlap",
        }

    def _generate_explanation(
        self, claim: str, evidence: str, stance: str, score: float
    ) -> str:
        """Generate human-readable explanation"""
        if stance == "support":
            return f"Evidence supports the claim with {score:.1%} confidence"
        elif stance == "contradict":
            return f"Evidence contradicts the claim with {score:.1%} confidence"
        else:
            return f"Evidence is neutral to the claim"
