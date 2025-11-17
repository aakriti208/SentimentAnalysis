# type: ignore

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.models.bert_classifier import classifier
from app.utils.prompts import prompt_library

router = APIRouter()

class EntryRequest(BaseModel):
    text: str

class AnalysisRequest(BaseModel):
    entries: List[str]

@router.post("/classify-entry")
async def classify_entry(request: EntryRequest):
    """Classify a single journal entry"""
    try:
        themes = classifier.predict(request.text)
        sentiment = classifier.predict_sentiment(request.text)
        
        return {
            "success": True,
            "themes": themes,
            "sentiment": sentiment
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-patterns")
async def analyze_patterns(request: AnalysisRequest):
    """Analyze multiple entries for patterns"""
    try:
        all_themes = {}
        sentiments = []
        
        for entry in request.entries:
            themes = classifier.predict(entry)
            sentiment = classifier.predict_sentiment(entry)
            
            # Count themes
            for theme_obj in themes:
                theme = theme_obj['theme']
                all_themes[theme] = all_themes.get(theme, 0) + 1
            
            sentiments.append(sentiment)
        
        # Get top themes
        top_themes = sorted(all_themes.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return {
            "success": True,
            "top_themes": [t[0] for t in top_themes],
            "sentiment_distribution": {
                "positive": sentiments.count('positive'),
                "negative": sentiments.count('negative'),
                "neutral": sentiments.count('neutral')
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggest-prompt")
async def suggest_prompt(request: dict):
    """Suggest writing prompt based on themes"""
    try:
        themes = request.get('recent_themes', ['daily_life'])
        prompts = prompt_library.get_prompts_by_themes(themes)
        
        return {
            "success": True,
            "prompts": prompts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/random-prompt")
async def random_prompt():
    """Get a random prompt"""
    import random
    themes = list(prompt_library.prompts.keys())
    theme = random.choice(themes)
    prompt = prompt_library.get_prompt_by_theme(theme)
    
    return {
        "success": True,
        "theme": theme,
        "prompt": prompt
    }