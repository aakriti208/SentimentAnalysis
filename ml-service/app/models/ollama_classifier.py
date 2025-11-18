"""
Ollama-based sentiment and theme classifier for journal entries
"""
import ollama
import json
import re
from typing import List, Dict


class OllamaClassifier:
    def __init__(self, model_name: str = "llama3.2", use_ollama: bool = False):
        """
        Initialize Ollama classifier

        Args:
            model_name: Name of the Ollama model to use (e.g., 'llama3.2', 'mistral', 'phi')
            use_ollama: Whether to use Ollama or fallback to fast keyword matching (default: False for speed)
        """
        self.model_name = model_name
        self.use_ollama = use_ollama
        self.themes = [
            'gratitude', 'personal_growth', 'relationships', 'work',
            'health', 'creativity', 'daily_life', 'reflection',
            'challenges', 'achievements', 'emotions', 'future_planning'
        ]

    def predict_sentiment(self, text: str) -> str:
        """
        Predict sentiment of journal entry

        Args:
            text: Journal entry text

        Returns:
            Sentiment: 'positive', 'negative', or 'neutral'
        """
        # Use fast keyword matching if Ollama is disabled
        if not self.use_ollama:
            return self._fast_sentiment(text)

        prompt = f"""Analyze the sentiment of this journal entry.
Respond with ONLY one word: positive, negative, or neutral.

Journal entry:
{text}

Sentiment:"""

        try:
            response = ollama.generate(
                model=self.model_name,
                prompt=prompt,
                options={
                    'temperature': 0.1,  # Low temperature for consistent results
                    'num_predict': 5,    # Very short response
                    'top_k': 1,          # Only consider most likely token
                }
            )

            sentiment = response['response'].strip().lower()

            # Extract sentiment from response
            if 'positive' in sentiment:
                return 'positive'
            elif 'negative' in sentiment:
                return 'negative'
            else:
                return 'neutral'

        except Exception as e:
            print(f"Error in sentiment prediction: {e}")
            return self._fast_sentiment(text)

    def _fast_sentiment(self, text: str) -> str:
        """Fast sentiment detection using keyword matching"""
        text_lower = text.lower()

        positive_words = ['happy', 'great', 'amazing', 'wonderful', 'grateful', 'thankful',
                         'excited', 'love', 'proud', 'accomplished', 'blessed', 'joy',
                         'fantastic', 'excellent', 'perfect', 'beautiful', 'good']

        negative_words = ['sad', 'angry', 'frustrated', 'upset', 'difficult', 'hard',
                         'struggle', 'worry', 'anxious', 'stress', 'bad', 'terrible',
                         'awful', 'hate', 'pain', 'hurt', 'disappointed']

        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)

        if positive_count > negative_count + 1:
            return 'positive'
        elif negative_count > positive_count + 1:
            return 'negative'
        else:
            return 'neutral'

    def predict(self, text: str, top_k: int = 3) -> List[Dict[str, any]]:
        """
        Predict themes from journal entry

        Args:
            text: Journal entry text
            top_k: Number of top themes to return

        Returns:
            List of theme predictions with confidence scores
        """
        # Use fast keyword matching if Ollama is disabled
        if not self.use_ollama:
            return self._fallback_themes(text, top_k)

        themes_str = ', '.join(self.themes)

        prompt = f"""Analyze this journal entry and identify the top {top_k} themes.
Choose ONLY from these themes: {themes_str}

For each theme, provide a confidence score between 0 and 1.

Respond in this EXACT JSON format:
[
  {{"theme": "theme_name", "confidence": 0.85}},
  {{"theme": "theme_name", "confidence": 0.72}}
]

Journal entry:
{text}

Themes (JSON only):"""

        try:
            response = ollama.generate(
                model=self.model_name,
                prompt=prompt,
                options={
                    'temperature': 0.3,
                    'num_predict': 100,  # Reduced for faster response
                    'top_k': 10,
                }
            )

            response_text = response['response'].strip()

            # Extract JSON from response
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if json_match:
                themes_data = json.loads(json_match.group())

                # Validate and clean themes
                valid_themes = []
                for item in themes_data[:top_k]:
                    if isinstance(item, dict) and 'theme' in item and 'confidence' in item:
                        theme = item['theme'].lower().replace(' ', '_')
                        if theme in self.themes:
                            valid_themes.append({
                                'theme': theme,
                                'confidence': float(item['confidence'])
                            })

                # If we got valid themes, return them
                if valid_themes:
                    return valid_themes

            # Fallback: return default themes
            return self._fallback_themes(text, top_k)

        except Exception as e:
            print(f"Error in theme prediction: {e}")
            return self._fallback_themes(text, top_k)

    def _fallback_themes(self, text: str, top_k: int = 3) -> List[Dict[str, any]]:
        """Fallback theme detection using simple keyword matching"""
        text_lower = text.lower()

        theme_keywords = {
            'gratitude': ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate'],
            'personal_growth': ['learn', 'grow', 'improve', 'develop', 'progress'],
            'relationships': ['friend', 'family', 'love', 'relationship', 'together'],
            'work': ['work', 'job', 'career', 'project', 'meeting', 'colleague'],
            'health': ['health', 'exercise', 'fitness', 'sleep', 'workout'],
            'creativity': ['create', 'art', 'music', 'write', 'design', 'idea'],
            'daily_life': ['day', 'morning', 'evening', 'routine', 'daily'],
            'reflection': ['reflect', 'think', 'realize', 'understand', 'discover'],
            'challenges': ['challenge', 'difficult', 'struggle', 'hard', 'problem'],
            'achievements': ['achieve', 'accomplish', 'success', 'goal', 'proud'],
            'emotions': ['feel', 'emotion', 'happy', 'sad', 'angry', 'excited'],
            'future_planning': ['plan', 'future', 'goal', 'hope', 'dream', 'will']
        }

        theme_scores = {}
        for theme, keywords in theme_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                theme_scores[theme] = score

        # Get top themes
        sorted_themes = sorted(theme_scores.items(), key=lambda x: x[1], reverse=True)

        results = []
        for theme, score in sorted_themes[:top_k]:
            confidence = min(0.5 + (score * 0.1), 0.9)  # Scale to 0.5-0.9
            results.append({
                'theme': theme,
                'confidence': confidence
            })

        # If no themes found, return daily_life
        if not results:
            results = [{'theme': 'daily_life', 'confidence': 0.6}]

        return results


# Create a singleton instance
classifier = OllamaClassifier()
