// File: app/api/generate-transcript/route.js
// For App Router (Next.js 13+)

import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript-plus';

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

    console.log(`[Transcript] Starting extraction/transcription for video: ${videoId}`);

    // ────────────────────────────────────────────────
    // 1. Try fetching transcript quickly directly from YouTube
    // ────────────────────────────────────────────────
    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      if (transcriptData && transcriptData.length > 0) {
        let transcript = transcriptData.map(t => t.text).join(' ');

        // Decode common HTML entities and clean up
        transcript = transcript
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&#34;/g, '"')
          .replace(/\s+/g, ' ')
          .replace(/\[(?:inaudible|music|applause)\]/gi, '')
          .replace(/\b(um|uh|ah)\b/gi, '')
          .replace(/\s*,\s*/g, ', ')
          .replace(/\s*\.\s*/g, '. ')
          .trim();

        console.log(`[Transcript Success] Fast extracted for ${videoId} (${transcript.length} chars)`);
        return NextResponse.json({ transcript });
      }
    } catch (ytError) {
      console.warn(`[Transcript] Fast extraction failed: ${ytError.message}. Falling back to Gladia...`);
    }

    // ────────────────────────────────────────────────
    // 2. Gladia V2 Fallback (for videos without captions)
    // ────────────────────────────────────────────────
    console.log(`[Transcript] Falling back to Gladia V2 for video: ${videoId}`);

    try {
      // Step A: Initiate transcription
      const initiateResponse = await fetch('https://api.gladia.io/v2/transcription', {
        method: 'POST',
        headers: {
          'x-gladia-key': gladiaKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: videoUrl,
          diarization: true,
        }),
      });

      if (!initiateResponse.ok) {
        const errorData = await initiateResponse.json();
        throw new Error(`Gladia initiation failed: ${errorData.message || initiateResponse.statusText}`);
      }

      const { result_url } = await initiateResponse.json();
      console.log(`[Transcript] Gladia task initiated. Result URL: ${result_url}`);

      // Step B: Polling for completion
      let status = 'queued';
      let resultData = null;
      let attempts = 0;
      const maxAttempts = 60; // Up to 5 minutes (5s * 60)

      while (status !== 'completed' && attempts < maxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s between polls

        const pollResponse = await fetch(result_url, {
          headers: { 'x-gladia-key': gladiaKey },
        });

        if (!pollResponse.ok) {
          console.error(`[Transcript] Gladia poll failed (Attempt ${attempts}): ${pollResponse.status}`);
          continue;
        }

        resultData = await pollResponse.json();
        status = resultData.status;
        console.log(`[Transcript] Gladia status (Attempt ${attempts}): ${status}`);

        if (status === 'error') {
          throw new Error('Gladia transcription failed with status: error');
        }
      }

      if (status !== 'completed') {
        throw new Error('Gladia transcription timed out');
      }

      // Step C: Format transcription with diarization
      if (resultData?.result?.transcription?.utterances) {
        const utterances = resultData.result.transcription.utterances;
        const formattedTranscript = utterances
          .map(u => `Speaker ${u.speaker !== undefined ? u.speaker : '?'}: ${u.text}`)
          .join('\n');

        console.log(`[Transcript Success] Gladia processed ${videoId} (${formattedTranscript.length} chars)`);
        return NextResponse.json({ transcript: formattedTranscript });
      } else if (resultData?.result?.transcription?.full_transcript) {
        return NextResponse.json({ transcript: resultData.result.transcription.full_transcript });
      } else {
        throw new Error('Gladia returned no transcription content');
      }

    } catch (gladiaError) {
      console.error(`[Transcript] Gladia fallback failed: ${gladiaError.message}`);
      return NextResponse.json(
        { error: `Transcription failed: ${gladiaError.message}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[Gladia API Route Error]:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Internal server error during transcription' },
      { status: 500 }
    );
  }
}
