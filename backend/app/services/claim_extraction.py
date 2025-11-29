import re
from typing import List
import hashlib
import logging

logger = logging.getLogger(__name__)


class ClaimExtractor:
    """Extract factual claims from text using rule-based and pattern matching"""

    def __init__(self):
        self.claim_patterns = [
            r'\b\d+%',
            r'\b\d+\s+(percent|million|billion|thousand)',
            r'\b(proven|shows|demonstrates|reveals|indicates|suggests|found)\b',
            r'\b(increases|decreases|reduces|improves|causes|prevents)\b',
            r'\b(according to|study|research|report|data)\b',
        ]

    def extract_claims(self, text: str, max_claims: int = 10) -> List[str]:
        """Extract potential claims from text"""
        sentences = self._split_sentences(text)
        claims = []

        for sentence in sentences:
            if self._is_potential_claim(sentence):
                canonical = self._canonicalize(sentence)
                claims.append(canonical)

            if len(claims) >= max_claims:
                break

        return claims

    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        text = text.replace('\n', ' ').strip()
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if len(s.strip()) > 20]

    def _is_potential_claim(self, sentence: str) -> bool:
        """Check if sentence is likely to be a factual claim"""
        sentence_lower = sentence.lower()

        for pattern in self.claim_patterns:
            if re.search(pattern, sentence_lower):
                return True

        if any(entity in sentence for entity in ['COVID', 'WHO', 'FDA', 'UN']):
            return True

        return False

    def _canonicalize(self, text: str) -> str:
        """Normalize text for deduplication"""
        text = text.lower().strip()
        text = re.sub(r'\s+', ' ', text)
        return text

    def compute_canonical_hash(self, text: str) -> str:
        """Compute hash for claim deduplication"""
        canonical = self._canonicalize(text)
        canonical = re.sub(r'\d+', '#NUM#', canonical)
        canonical = re.sub(r'[^\w\s]', '', canonical)
        return hashlib.sha256(canonical.encode()).hexdigest()
