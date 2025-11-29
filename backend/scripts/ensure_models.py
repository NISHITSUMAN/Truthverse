#!/usr/bin/env python3
"""
Download and cache required ML models
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import SentenceTransformer
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def download_model(model_name: str, model_type: str = "transformer"):
    """Download and cache a model"""
    try:
        logger.info(f"Downloading {model_type} model: {model_name}")

        if model_type == "sentence_transformer":
            model = SentenceTransformer(model_name)
            logger.info(f"Successfully cached: {model_name}")
        else:
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForSequenceClassification.from_pretrained(model_name)
            logger.info(f"Successfully cached: {model_name}")

    except Exception as e:
        logger.error(f"Failed to download {model_name}: {e}")


def main():
    logger.info("Downloading required ML models...")

    models = [
        (settings.EMBEDDING_MODEL, "sentence_transformer"),
        (settings.NLI_MODEL, "transformer"),
        (settings.CLAIM_DETECTOR_MODEL, "transformer"),
    ]

    for model_name, model_type in models:
        download_model(model_name, model_type)

    logger.info("All models downloaded successfully!")


if __name__ == "__main__":
    main()
