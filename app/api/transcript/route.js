import { fetchTranscript } from 'youtube-transcript-plus';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    const transcript = await fetchTranscript(videoId);
    if (!transcript || transcript.length === 0) {
      return NextResponse.json({ error: 'No transcript found' }, { status: 404 });
    }
    return NextResponse.json(transcript);
  } catch (error) {
    return NextResponse.json({ error: 'Could not fetch transcript' }, { status: 500 });
  }
}