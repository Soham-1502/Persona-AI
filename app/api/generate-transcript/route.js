// File: app/api/generate-transcript/route.js
// For App Router (Next.js 13+)

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: 'Missing videoId in request body' },
        { status: 400 }
      );
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const gladiaKey = process.env.GLADIA_API_KEY;

    if (!gladiaKey) {
      return NextResponse.json(
        { error: 'Gladia API key not configured in environment variables' },
        { status: 500 }
      );
    }

    console.log(`[Gladia] Starting transcription for video: ${videoId}`);

    // ────────────────────────────────────────────────
    // 1. Initiate the pre-recorded transcription job
    // ────────────────────────────────────────────────
    const initResponse = await fetch('https://api.gladia.io/v2/pre-recorded', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gladia-key': gladiaKey,
      },
      body: JSON.stringify({
        audio_url: videoUrl,
        detect_language: true,           // auto-detect spoken language
        diarization: true,               // separate speakers (very useful)
        // translation: true,            // uncomment if you want auto-translation
        // translation_config: { target_languages: ['en'] },
        // context_prompt: "Educational programming tutorial video",
      }),
    });

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error(`[Gladia Init Failed] ${initResponse.status}: ${errorText}`);
      throw new Error(`Gladia job initiation failed (${initResponse.status}): ${errorText}`);
    }

    const { id, result_url } = await initResponse.json();
    console.log(`[Gladia] Job created - ID: ${id} | Polling: ${result_url}`);

    // ────────────────────────────────────────────────
    // 2. Poll for completion with exponential backoff
    // ────────────────────────────────────────────────
    let transcript = null;
    let attempts = 0;
    const maxAttempts = 360;           // ~36 minutes max (6s × 360)
    let delayMs = 6000;                // start with 6 seconds

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delayMs));

      const pollResponse = await fetch(result_url, {
        headers: {
          'x-gladia-key': gladiaKey,
          'Accept': 'application/json',
        },
      });

      if (!pollResponse.ok) {
        console.warn(`[Gladia Poll] Non-200 status: ${pollResponse.status}`);
        attempts++;
        delayMs = Math.min(delayMs * 1.5, 30000); // backoff, max 30s
        continue;
      }

      const data = await pollResponse.json();

      if (data.status === 'done') {
        transcript = data.result?.transcription?.full_transcript;

        if (!transcript || transcript.trim() === '') {
          throw new Error('Gladia returned empty transcript');
        }

        // ────────────────────────────────────────────────
        // CLEAN THE TRANSCRIPT HERE
        // ────────────────────────────────────────────────
        transcript = transcript
          .replace(/\s+/g, ' ')                     // collapse all whitespace
          .replace(/\[inaudible\]|\[music\]|\[applause\]/gi, '')  // remove common noise tags
          .replace(/\b(um|uh|ah|like)\b/gi, '')     // remove common fillers (optional)
          .replace(/\s*,\s*/g, ', ')                // normalize commas
          .replace(/\s*\.\s*/g, '. ')               // normalize periods
          .trim();

        // Optional: nicer formatting if diarization is enabled
        if (data.result?.transcription?.utterances) {
          transcript = data.result.transcription.utterances
            .map(u => `Speaker ${u.speaker || '?'}: ${u.text}`)
            .join('\n\n');
        }

        console.log(`[Gladia Success] Transcript ready for ${videoId} (${transcript.length} chars)`);
        break;
      }

      if (data.status === 'error') {
        const errMsg = data.error?.message || 'Unknown error';
        console.error(`[Gladia Error] Job ${id}: ${errMsg}`);
        throw new Error(`Transcription failed: ${errMsg}`);
      }

      attempts++;
      delayMs = Math.min(delayMs * 1.2, 30000); // gentle backoff
    }

    if (!transcript) {
      throw new Error(
        `Timeout after ${maxAttempts} attempts. Job ID: ${id}. Check status manually at ${result_url}`
      );
    }

    return NextResponse.json({ transcript });

  } catch (error) {
    console.error('[Gladia API Route Error]:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Internal server error during transcription' },
      { status: 500 }
    );
  }
}
