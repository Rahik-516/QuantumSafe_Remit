import { NextRequest, NextResponse } from 'next/server';

/**
 * Emotion Analysis API Route
 * 
 * This endpoint calls the Python sentiment analyzer service for advanced emotion detection.
 * If Python service is unavailable, falls back to keyword-based analysis.
 * 
 * Expected Request: { text: string }
 * Response: { success: boolean, emotions: { pride, nostalgia, love, hope }, confidence: number }
 */

// Fallback keyword-based analysis (used if Python service is down)
const emotionKeywords: Record<string, Record<string, { weight: number; negatable: boolean }>> = {
  pride: {
    'proud': { weight: 0.9, negatable: true },
    'proud of': { weight: 1.0, negatable: true },
    'achievement': { weight: 0.8, negatable: true },
    'accomplished': { weight: 0.9, negatable: true },
    'success': { weight: 0.7, negatable: true },
    'successful': { weight: 0.8, negatable: true },
    'triumph': { weight: 0.95, negatable: true },
    'excel': { weight: 0.8, negatable: true },
    'excellence': { weight: 0.85, negatable: true },
    'honor': { weight: 0.9, negatable: true },
    'dignity': { weight: 0.85, negatable: true },
    'strong': { weight: 0.6, negatable: true },
    'strong tradition': { weight: 0.85, negatable: true },
    'heritage': { weight: 0.75, negatable: false },
    'legacy': { weight: 0.8, negatable: false },
    'succeed': { weight: 0.8, negatable: true },
    'superior': { weight: 0.75, negatable: true },
  },
  nostalgia: {
    'remember': { weight: 0.75, negatable: true },
    'childhood': { weight: 0.85, negatable: false },
    'past': { weight: 0.6, negatable: false },
    'old days': { weight: 0.9, negatable: false },
    'memories': { weight: 0.85, negatable: false },
    'miss': { weight: 0.85, negatable: true },
    'missing': { weight: 0.85, negatable: true },
    'bygone': { weight: 0.9, negatable: false },
    'reminisce': { weight: 0.9, negatable: false },
    'homesick': { weight: 0.95, negatable: true },
    'home': { weight: 0.5, negatable: false },
    'hometown': { weight: 0.8, negatable: false },
    'back home': { weight: 0.9, negatable: false },
    'roots': { weight: 0.75, negatable: false },
    'old times': { weight: 0.85, negatable: false },
    'the good old days': { weight: 0.95, negatable: false },
    'used to': { weight: 0.7, negatable: false },
    'once': { weight: 0.6, negatable: false },
    'childhood days': { weight: 0.95, negatable: false },
  },
  love: {
    'love': { weight: 0.95, negatable: true },
    'loving': { weight: 0.85, negatable: true },
    'care': { weight: 0.75, negatable: true },
    'caring': { weight: 0.75, negatable: true },
    'family': { weight: 0.6, negatable: false },
    'dear': { weight: 0.8, negatable: true },
    'affection': { weight: 0.9, negatable: true },
    'affectionate': { weight: 0.9, negatable: true },
    'cherish': { weight: 0.9, negatable: true },
    'heart': { weight: 0.7, negatable: false },
    'support': { weight: 0.7, negatable: true },
    'compassion': { weight: 0.85, negatable: true },
    'empathy': { weight: 0.85, negatable: true },
    'tender': { weight: 0.8, negatable: true },
    'devotion': { weight: 0.95, negatable: true },
    'devoted': { weight: 0.95, negatable: true },
    'adore': { weight: 0.95, negatable: true },
    'beloved': { weight: 0.95, negatable: false },
    'warmth': { weight: 0.85, negatable: false },
    'close to': { weight: 0.75, negatable: true },
    'bond': { weight: 0.8, negatable: false },
  },
  hope: {
    'hope': { weight: 0.9, negatable: true },
    'hopeful': { weight: 0.9, negatable: true },
    'future': { weight: 0.6, negatable: false },
    'better': { weight: 0.65, negatable: true },
    'improve': { weight: 0.7, negatable: true },
    'improvement': { weight: 0.75, negatable: true },
    'dream': { weight: 0.75, negatable: false },
    'aspire': { weight: 0.85, negatable: true },
    'aspiring': { weight: 0.8, negatable: true },
    'believe': { weight: 0.65, negatable: true },
    'possibility': { weight: 0.7, negatable: false },
    'achieve': { weight: 0.75, negatable: true },
    'tomorrow': { weight: 0.7, negatable: false },
    'positive': { weight: 0.65, negatable: true },
    'optimistic': { weight: 0.85, negatable: true },
    'optimism': { weight: 0.85, negatable: true },
    'change': { weight: 0.6, negatable: false },
    'progress': { weight: 0.75, negatable: true },
    'new beginning': { weight: 0.9, negatable: false },
    'opportunities': { weight: 0.75, negatable: false },
    'potential': { weight: 0.7, negatable: false },
  },
};

const intensityModifiers: Record<string, number> = {
  'very': 1.3,
  'extremely': 1.5,
  'deeply': 1.4,
  'truly': 1.2,
  'really': 1.25,
  'so': 1.2,
  'incredibly': 1.5,
  'absolutely': 1.3,
  'completely': 1.2,
  'totally': 1.2,
};

const negationWords = ['not', 'no', 'never', 'don\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 'can\'t', 'couldn\'t', 'isn\'t', 'aren\'t'];

function checkNegation(text: string, position: number): number {
  const beforeText = text.substring(Math.max(0, position - 30), position).toLowerCase();
  for (const negation of negationWords) {
    if (beforeText.includes(negation)) {
      return -0.5;
    }
  }
  return 1;
}

function getIntensityMultiplier(text: string, position: number): number {
  const beforeText = text.substring(Math.max(0, position - 20), position).toLowerCase();
  for (const [modifier, multiplier] of Object.entries(intensityModifiers)) {
    if (beforeText.includes(modifier)) {
      return multiplier;
    }
  }
  return 1;
}

// Fallback analysis function
function fallbackAnalyzeEmotions(text: string): Record<string, number> {
  const emotions: Record<string, number> = {
    pride: 0,
    nostalgia: 0,
    love: 0,
    hope: 0,
  };

  const sentences = text.split(/[.!?]+/).filter(s => s.trim());

  sentences.forEach((sentence) => {
    const lowerSentence = sentence.toLowerCase();

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      Object.entries(keywords).forEach(([keyword, { weight, negatable }]) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        let match;

        while ((match = regex.exec(lowerSentence)) !== null) {
          const position = match.index;
          const intensityMult = getIntensityMultiplier(sentence, position);
          let negationMult = 1;
          if (negatable) {
            negationMult = checkNegation(sentence, position);
          }

          const matchScore = weight * intensityMult * negationMult;
          emotions[emotion] += Math.max(matchScore, 0);
        }
      });
    });
  });

  const maxScore = Math.max(...Object.values(emotions), 1);
  Object.keys(emotions).forEach((key) => {
    emotions[key] = Math.min(emotions[key] / maxScore, 1);
  });

  const sentenceCount = sentences.length;
  const sentenceWeighting = Math.min(sentenceCount / 3, 1);

  Object.keys(emotions).forEach((key) => {
    emotions[key] = emotions[key] * (0.7 + sentenceWeighting * 0.3);
  });

  if (Object.values(emotions).every((s) => s === 0)) {
    return {
      pride: 0.5,
      nostalgia: 0.5,
      love: 0.6,
      hope: 0.7,
    };
  }

  return emotions;
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text field is required and must be a string' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    let emotions: Record<string, number>;
    let usedModel = 'keyword';

    // Try to call Python sentiment analyzer service
    try {
      const pythonResponse = await fetch('http://127.0.0.1:5001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (pythonResponse.ok) {
        const pythonResult = await pythonResponse.json();
        emotions = pythonResult.emotions || fallbackAnalyzeEmotions(text);
        usedModel = 'python-ml';
      } else {
        // Fallback to keyword analysis
        emotions = fallbackAnalyzeEmotions(text);
      }
    } catch (error) {
      // Python service unavailable, use fallback
      console.warn('Python sentiment analyzer unavailable, using fallback:', error instanceof Error ? error.message : String(error));
      emotions = fallbackAnalyzeEmotions(text);
    }

    return NextResponse.json({
      success: true,
      emotions,
      message: `Emotions analyzed successfully using ${usedModel} model`,
      model: usedModel,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze text',
        success: false,
      },
      { status: 500 }
    );
  }
}