// app/api/transcript/route.js
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(req) {
  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return new Response(JSON.stringify({ error: 'No videoId' }), { status: 400 });
    }

    const raw = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });

    const formatted = raw.map(item => ({
      start: item.offset / 1000,
      text: item.text
    }));

    return new Response(JSON.stringify({ transcript: formatted }), { status: 200 });
  } catch (err) {
    console.error('Server transcript error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed' }), { status: 500 });
  }
}