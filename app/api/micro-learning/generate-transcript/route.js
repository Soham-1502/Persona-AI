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
    // 2. No fallback available — YouTube URLs can't be sent to Gladia
    //    (Gladia requires a direct audio/video file URL, not a YouTube page)
    // ────────────────────────────────────────────────
    console.warn(`[Transcript] No captions available for ${videoId}. Gladia fallback not supported for YouTube URLs.`);
    return NextResponse.json(
      { error: 'Transcript unavailable: This video does not have captions. Please try a video with auto-generated or manual captions.' },
      { status: 422 }
    );

  } catch (error) {
    console.error('[Gladia API Route Error]:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Internal server error during transcription' },
      { status: 500 }
    );
  }
}
