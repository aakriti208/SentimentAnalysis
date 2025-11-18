# Ollama Setup for ML Service

## Prerequisites

### 1. Install Ollama

**macOS:**
```bash
brew install ollama
```

Or download from: https://ollama.com/download

### 2. Start Ollama Service

```bash
ollama serve
```

Keep this running in a separate terminal window.

### 3. Pull a Model

Choose one of these models (I recommend llama3.2 or phi):

```bash
# Recommended: Fast and good quality
ollama pull llama3.2

# Alternative: Smaller and faster
ollama pull phi

# Alternative: Mistral (larger, more powerful)
ollama pull mistral
```

## Install Python Dependencies

```bash
cd "/Users/aakritidhakal/Documents/Projects/Ongoing Projects/SentimentAnalysis/ml-service"

# Activate virtual environment
source venv/bin/activate

# Install ollama package
pip install ollama
```

## Start the ML Service

```bash
# Make sure Ollama is running first (ollama serve)
python -m uvicorn main:app --reload --port 8000
```

## Test the Service

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Test Sentiment Analysis

```bash
curl -X POST http://localhost:8000/api/analyze-user-history \
  -H "Content-Type: application/json" \
  -d '{
    "entries": [
      {
        "content": "Today was amazing! I accomplished so much and felt really productive.",
        "created_at": "2025-01-15T10:00:00Z"
      },
      {
        "content": "Feeling grateful for my friends and family. They always support me.",
        "created_at": "2025-01-16T14:30:00Z"
      }
    ]
  }'
```

## Configure Model

To use a different Ollama model, edit `app/models/ollama_classifier.py`:

```python
classifier = OllamaClassifier(model_name="phi")  # or "mistral", "llama3.2"
```

## Troubleshooting

**Error: "connection refused"**
- Make sure Ollama is running: `ollama serve`

**Error: "model not found"**
- Pull the model: `ollama pull llama3.2`

**Slow responses:**
- Try a smaller model like `phi`
- Reduce `num_predict` in the classifier

## Available Themes

The classifier can identify these themes:
- gratitude
- personal_growth
- relationships
- work
- health
- creativity
- daily_life
- reflection
- challenges
- achievements
- emotions
- future_planning

## Features

- **Sentiment Analysis**: Classifies entries as positive, negative, or neutral
- **Theme Detection**: Identifies top 3 themes from each entry
- **Confidence Scores**: Provides confidence levels for each prediction
- **Fallback System**: Uses keyword matching if Ollama is unavailable
