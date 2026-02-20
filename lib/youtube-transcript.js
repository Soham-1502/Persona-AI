// lib/youtube-transcript.js
/**
 * Get the caption track ID (prefer English)
 * @param {string} videoId
 * @param {string} apiKey
 * @returns {Promise<string|null>}
 */
export async function getCaptionTrackId(videoId, apiKey) {
  if (!apiKey || !videoId) return null;

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`
    );

    if (!res.ok) {
      console.warn(`Captions API failed: ${res.status}`);
      return null;
    }

    const data = await res.json();

    if (!data.items?.length) {
      console.log("No captions available for this video");
      return null;
    }

    // Prefer English (en or en-US)
    const english = data.items.find(t => t.snippet.language === 'en' || t.snippet.language === 'en-US');
    return english?.id || data.items[0].id;
  } catch (err) {
    console.error("Caption tracks fetch error:", err);
    return null;
  }
}

/**
 * Download transcript as plain text (TTML format with timestamps)
 * @param {string} captionId
 * @param {string} apiKey
 * @returns {Promise<string|null>}
 */
export async function downloadTranscript(captionId, apiKey) {
  if (!apiKey || !captionId) return null;

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${captionId}?tfmt=ttml&key=${apiKey}`
    );

    if (!res.ok) {
      console.warn(`Transcript download failed: ${res.status}`);
      return null;
    }

    return await res.text(); // TTML (XML) with timestamps
  } catch (err) {
    console.error("Transcript download error:", err);
    return null;
  }
}

/**
 * Main function: Get transcript for a video
 * @param {string} videoId
 * @returns {Promise<string|null>} raw TTML transcript or null
 */
export async function getVideoTranscript(videoId) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("Missing NEXT_PUBLIC_YOUTUBE_API_KEY");
    return null;
  }

  const captionId = await getCaptionTrackId(videoId, apiKey);
  if (!captionId) return null;

  return await downloadTranscript(captionId, apiKey);
}