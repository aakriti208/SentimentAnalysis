# type: ignore

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# Import Ollama classifier
from app.models.ollama_classifier import classifier

@router.post("/analyze-user-history")
async def analyze_user_history(request: dict):
    """
    Comprehensive analysis of all user entries
    Returns themes, sentiment trends, patterns over time
    """
    try:
        entries = request.get('entries', [])

        if not entries:
            raise HTTPException(status_code=400, detail="No entries provided")

        # Analyze each entry
        all_themes = {}
        sentiments_over_time = []
        theme_timeline = []

        for entry in entries:
            text = entry.get('content', '')
            date = entry.get('created_at', '')

            if not text:
                continue

            # Use Ollama classifier
            themes = classifier.predict(text)
            sentiment = classifier.predict_sentiment(text)
            
            # Aggregate themes
            for theme_obj in themes:
                theme = theme_obj['theme']
                confidence = theme_obj['confidence']
                
                if theme not in all_themes:
                    all_themes[theme] = {
                        'count': 0,
                        'total_confidence': 0,
                        'entries': []
                    }
                
                all_themes[theme]['count'] += 1
                all_themes[theme]['total_confidence'] += confidence
                all_themes[theme]['entries'].append({
                    'date': date,
                    'confidence': confidence
                })
            
            # Track sentiment over time
            sentiments_over_time.append({
                'date': date,
                'sentiment': sentiment
            })
            
            # Track theme timeline
            theme_timeline.append({
                'date': date,
                'themes': [t['theme'] for t in themes[:2]],  # Top 2 themes
                'sentiment': sentiment
            })
        
        # Calculate theme statistics
        theme_stats = []
        for theme, data in all_themes.items():
            avg_confidence = data['total_confidence'] / data['count']
            theme_stats.append({
                'theme': theme,
                'count': data['count'],
                'percentage': round((data['count'] / len(entries)) * 100, 1),
                'avg_confidence': round(avg_confidence, 3),
                'trend': analyze_theme_trend(data['entries'])
            })
        
        # Sort by count
        theme_stats.sort(key=lambda x: x['count'], reverse=True)
        
        # Analyze sentiment trends
        sentiment_trends = analyze_sentiment_trends(sentiments_over_time)
        
        # Find patterns
        patterns = find_writing_patterns(entries, theme_timeline)
        
        return {
            "success": True,
            "total_entries": len(entries),
            "analysis": {
                "themes": theme_stats[:7],  # Top 7 themes
                "sentiment_trends": sentiment_trends,
                "patterns": patterns,
                "timeline": theme_timeline[-10:]  # Last 10 entries
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def analyze_theme_trend(entries):
    """Determine if theme is increasing, decreasing, or stable"""
    if len(entries) < 3:
        return 'stable'
    
    # Compare first half vs second half
    mid = len(entries) // 2
    first_half = entries[:mid]
    second_half = entries[mid:]
    
    first_avg = sum(e['confidence'] for e in first_half) / len(first_half)
    second_avg = sum(e['confidence'] for e in second_half) / len(second_half)
    
    if second_avg > first_avg * 1.2:
        return 'increasing'
    elif second_avg < first_avg * 0.8:
        return 'decreasing'
    else:
        return 'stable'


def analyze_sentiment_trends(sentiments_over_time):
    """Analyze how sentiment changes over time"""
    if not sentiments_over_time:
        return {}
    
    total = len(sentiments_over_time)
    positive_count = sum(1 for s in sentiments_over_time if s['sentiment'] == 'positive')
    negative_count = sum(1 for s in sentiments_over_time if s['sentiment'] == 'negative')
    neutral_count = total - positive_count - negative_count
    
    # Recent trend (last 10 entries)
    recent = sentiments_over_time[-10:]
    recent_positive = sum(1 for s in recent if s['sentiment'] == 'positive')
    
    return {
        'overall': {
            'positive': positive_count,
            'negative': negative_count,
            'neutral': neutral_count,
            'positive_percentage': round((positive_count / total) * 100, 1)
        },
        'recent_trend': 'mostly_positive' if recent_positive >= 6 else 
                       'mostly_negative' if recent_positive <= 3 else 'mixed'
    }


def find_writing_patterns(entries, theme_timeline):
    """Find interesting patterns in writing behavior"""
    patterns = []
    
    # Writing frequency
    if len(entries) >= 30:
        patterns.append({
            'type': 'consistency',
            'message': f'You\'ve written {len(entries)} entries! You\'re building a strong journaling habit.'
        })
    
    # Theme diversity
    unique_themes = set()
    for item in theme_timeline:
        unique_themes.update(item['themes'])
    
    if len(unique_themes) >= 5:
        patterns.append({
            'type': 'diversity',
            'message': f'You explore {len(unique_themes)} different themes in your writing.'
        })
    
    # Recent activity
    if len(theme_timeline) > 0:
        recent_themes = theme_timeline[-5:]
        recent_theme_list = []
        for item in recent_themes:
            recent_theme_list.extend(item['themes'])
        
        from collections import Counter
        most_common = Counter(recent_theme_list).most_common(1)
        if most_common:
            patterns.append({
                'type': 'recent_focus',
                'message': f'Recently, you\'ve been focusing on {most_common[0][0]}.'
            })
    
    return patterns


# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from typing import List, Optional
# from app.models.bert_classifier import classifier
# from app.utils.prompts import prompt_library

# router = APIRouter()

# class EntryRequest(BaseModel):
#     text: str

# class AnalysisRequest(BaseModel):
#     entries: List[str]

# @router.post("/classify-entry")
# async def classify_entry(request: EntryRequest):
#     """Classify a single journal entry"""
#     try:
#         themes = classifier.predict(request.text)
#         sentiment = classifier.predict_sentiment(request.text)
        
#         return {
#             "success": True,
#             "themes": themes,
#             "sentiment": sentiment
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/analyze-patterns")
# async def analyze_patterns(request: AnalysisRequest):
#     """Analyze multiple entries for patterns"""
#     try:
#         all_themes = {}
#         sentiments = []
        
#         for entry in request.entries:
#             themes = classifier.predict(entry)
#             sentiment = classifier.predict_sentiment(entry)
            
#             # Count themes
#             for theme_obj in themes:
#                 theme = theme_obj['theme']
#                 all_themes[theme] = all_themes.get(theme, 0) + 1
            
#             sentiments.append(sentiment)
        
#         # Get top themes
#         top_themes = sorted(all_themes.items(), key=lambda x: x[1], reverse=True)[:3]
        
#         return {
#             "success": True,
#             "top_themes": [t[0] for t in top_themes],
#             "sentiment_distribution": {
#                 "positive": sentiments.count('positive'),
#                 "negative": sentiments.count('negative'),
#                 "neutral": sentiments.count('neutral')
#             }
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/suggest-prompt")
# async def suggest_prompt(request: dict):
#     """Suggest writing prompt based on themes"""
#     try:
#         themes = request.get('recent_themes', ['daily_life'])
#         prompts = prompt_library.get_prompts_by_themes(themes)
        
#         return {
#             "success": True,
#             "prompts": prompts
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/random-prompt")
# async def random_prompt():
#     """Get a random prompt"""
#     import random
#     themes = list(prompt_library.prompts.keys())
#     theme = random.choice(themes)
#     prompt = prompt_library.get_prompt_by_theme(theme)
    
#     return {
#         "success": True,
#         "theme": theme,
#         "prompt": prompt
#     }




