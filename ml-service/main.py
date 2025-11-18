"""
ML Service Entry Point
Run with: python -m uvicorn main:app --reload --port 8000
"""
from app.main import app

__all__ = ["app"]
