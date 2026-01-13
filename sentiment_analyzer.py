#!/usr/bin/env python3
"""
Sentiment/Emotion Analysis Service using Hugging Face Transformers
Provides accurate emotion detection: pride, nostalgia, love, hope
"""

from flask import Flask, request, jsonify
from transformers import pipeline
import json
import sys

app = Flask(__name__)

# Load pre-trained emotion detection model
try:
    emotion_classifier = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        top_k=None
    )
    print("✓ Emotion model loaded successfully")
except Exception as e:
    print(f"✗ Failed to load emotion model: {e}")
    emotion_classifier = None

# Load sentiment analysis model for additional context
try:
    sentiment_classifier = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    print("✓ Sentiment model loaded successfully")
except Exception as e:
    print(f"✗ Failed to load sentiment model: {e}")
    sentiment_classifier = None


def map_emotions_to_custom(detected_emotions):
    """
    Map detected emotions from the model to our custom emotions:
    pride, nostalgia, love, hope
    """
    emotion_mapping = {
        # Mapping from model outputs to our custom emotions
        'joy': {'target': 'hope', 'weight': 0.8},
        'optimism': {'target': 'hope', 'weight': 0.95},
        'proud': {'target': 'pride', 'weight': 0.95},
        'pride': {'target': 'pride', 'weight': 1.0},
        'sadness': {'target': 'nostalgia', 'weight': 0.6},
        'love': {'target': 'love', 'weight': 0.95},
        'affection': {'target': 'love', 'weight': 0.9},
        'nostalgia': {'target': 'nostalgia', 'weight': 0.95},
        'gratitude': {'target': 'love', 'weight': 0.85},
        'neutral': None,
        'anger': None,
        'fear': None,
        'surprise': None,
    }
    
    mapped_emotions = {
        'pride': 0.0,
        'nostalgia': 0.0,
        'love': 0.0,
        'hope': 0.0,
    }
    
    for emotion_data in detected_emotions:
        emotion_name = emotion_data.get('label', '').lower()
        score = emotion_data.get('score', 0)
        
        # Find mapping
        mapping = emotion_mapping.get(emotion_name)
        if mapping:
            target = mapping['target']
            weight = mapping['weight']
            mapped_emotions[target] += score * weight
    
    # Normalize scores to 0-1 range
    max_score = max(mapped_emotions.values()) if mapped_emotions else 1
    if max_score > 0:
        for key in mapped_emotions:
            mapped_emotions[key] = min(mapped_emotions[key] / max_score, 1.0)
    
    return mapped_emotions


def analyze_text(text):
    """
    Analyze text for emotions using Hugging Face models
    """
    if not emotion_classifier:
        return None
    
    try:
        # Detect emotions
        emotions = emotion_classifier(text)
        
        # Map to our custom emotions
        custom_emotions = map_emotions_to_custom(emotions)
        
        # Add sentiment context
        sentiment_info = None
        if sentiment_classifier:
            sentiment = sentiment_classifier(text[:512])[0]  # Limit to 512 chars for BERT
            sentiment_info = {
                'label': sentiment['label'],
                'score': sentiment['score']
            }
        
        return {
            'emotions': custom_emotions,
            'raw_emotions': emotions,
            'sentiment': sentiment_info,
            'confidence': max(custom_emotions.values()) if custom_emotions else 0
        }
    
    except Exception as e:
        print(f"Error analyzing text: {e}")
        return None


@app.route('/analyze', methods=['POST'])
def analyze():
    """
    API endpoint for emotion analysis
    Expects: {"text": "user input text"}
    Returns: {"success": true, "emotions": {...}, "confidence": 0.85, ...}
    """
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({'success': False, 'error': 'Text field is required'}), 400
        
        if len(text) > 5000:
            return jsonify({'success': False, 'error': 'Text is too long (max 5000 characters)'}), 400
        
        result = analyze_text(text)
        
        if not result:
            return jsonify({'success': False, 'error': 'Failed to analyze text'}), 500
        
        return jsonify({
            'success': True,
            'emotions': result['emotions'],
            'confidence': result['confidence'],
            'sentiment': result['sentiment'],
            'message': 'Emotions analyzed successfully using ML model'
        }), 200
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'emotion_model_loaded': emotion_classifier is not None,
        'sentiment_model_loaded': sentiment_classifier is not None
    }), 200


if __name__ == '__main__':
    print("=" * 50)
    print("Sentiment Analyzer Service")
    print("=" * 50)
    print(f"Python version: {sys.version}")
    print("Starting Flask server on http://localhost:5001")
    print("=" * 50)
    
    # Run Flask app
    app.run(host='127.0.0.1', port=5001, debug=False)
