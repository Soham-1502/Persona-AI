import { NextResponse } from 'next/server';
import { CATEGORY_MAP } from '@/lib/data';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');

    if (!category || !keyword) {
        return NextResponse.json(
            { error: 'Category and keyword are required' },
            { status: 400 }
        );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        console.error('YouTube API key missing');
        return NextResponse.json(
            { error: 'Server configuration error: API key missing' },
            { status: 500 }
        );
    }

    const playlistIdsString = CATEGORY_MAP[category];
    if (!playlistIdsString) {
        return NextResponse.json(
            { error: 'Invalid category' },
            { status: 400 }
        );
    }

    // Pick a random playlist from the category map to ensure variety
    const playlistIds = playlistIdsString.split(',').map(id => id.trim());
    const randomPlaylistId = playlistIds[Math.floor(Math.random() * playlistIds.length)];

    // Fetch playlistItems for the selected playlist
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${randomPlaylistId}&maxResults=50&key=${apiKey}`;

    try {
        const res = await fetch(url, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) {
            console.error(`YouTube API error: ${res.status} ${res.statusText}`);
            return NextResponse.json({ error: 'Failed to fetch from YouTube API' }, { status: res.status });
        }

        const data = await res.json();

        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
            const searchTerms = keyword.toLowerCase().split(' ');

            // Score each video based on keyword matches in title or description
            const scoredItems = data.items.map(item => {
                let score = 0;
                const title = (item.snippet.title || '').toLowerCase();
                const desc = (item.snippet.description || '').toLowerCase();

                searchTerms.forEach(term => {
                    if (title.includes(term)) score += 3; // Title matches are weighted heavier
                    if (desc.includes(term)) score += 1;
                });

                return { item, score };
            });

            // Sort by highest score
            scoredItems.sort((a, b) => b.score - a.score);

            // If none match specific keywords, return the first one as fallback, otherwise return highest scored
            const bestMatch = scoredItems[0].score > 0 ? scoredItems[0].item : scoredItems[Math.floor(Math.random() * Math.min(5, scoredItems.length))].item;

            return NextResponse.json({ video: bestMatch });
        } else {
            return NextResponse.json({ error: 'No items found in playlist' }, { status: 404 });
        }
    } catch (error) {
        console.error(`Fetch API error:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
