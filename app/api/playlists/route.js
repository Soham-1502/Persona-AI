import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids'); 
  const apiKey = process.env.YOUTUBE_API_KEY;

  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${ids}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data.items || []);
}