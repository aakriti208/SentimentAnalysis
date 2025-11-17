import json
import os

class PromptLibrary:
    def __init__(self):
        self.prompts_path = os.getenv('PROMPT_LIBRARY_PATH', './data/prompts.json')
        self.prompts = self.load_prompts()
    
    def load_prompts(self):
        """Load prompt library"""
        try:
            with open(self.prompts_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Return default prompts if file doesn't exist
            return self.get_default_prompts()
    
    def get_default_prompts(self):
        """Default prompt library"""
        return {
            'gratitude': [
                "Describe someone in your life who you really appreciate but forget to thank.",
                "What's something small that happened today that you're grateful for?",
                "Write about a moment when someone's kindness surprised you."
            ],
            'relationships': [
                "Write about a time someone made something special for you.",
                "Describe a conversation that changed your perspective.",
                "Who in your life makes you feel most understood?"
            ],
            'personal_growth': [
                "What's a challenge you overcame recently? How did it change you?",
                "Describe a skill you'd like to develop and why it matters to you.",
                "What's one thing you learned about yourself this week?"
            ],
            'stress': [
                "What's been weighing on your mind lately? Write it all out.",
                "Describe a moment when you felt overwhelmed. What helped?",
                "What would make tomorrow easier for you?"
            ],
            'work': [
                "What's something you accomplished at work that you're proud of?",
                "Describe a work challenge and how you approached it.",
                "What energizes you most about your current projects?"
            ],
            'health': [
                "How has your body felt today? What is it telling you?",
                "Describe your ideal self-care routine.",
                "What's one healthy habit you'd like to build?"
            ],
            'daily_life': [
                "What made you smile today?",
                "Describe your perfect day from start to finish.",
                "What's something mundane that you actually enjoy?"
            ]
        }
    
    def get_prompt_by_theme(self, theme: str):
        """Get random prompt for a specific theme"""
        import random
        prompts = self.prompts.get(theme, self.prompts.get('daily_life'))
        return random.choice(prompts) if prompts else "What's on your mind today?"
    
    def get_prompts_by_themes(self, themes: list):
        """Get prompts matching multiple themes"""
        results = []
        for theme in themes[:2]:  # Top 2 themes
            prompt = self.get_prompt_by_theme(theme)
            results.append({
                'theme': theme,
                'prompt': prompt
            })
        return results

# Initialize library
prompt_library = PromptLibrary()