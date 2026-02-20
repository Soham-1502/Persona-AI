import { formatDistanceToNow } from "date-fns";

// Helper to convert ISO 8601 duration (PT#M#S) to readable text
function formatYouTubeDuration(duration) {
  if (!duration) return "";
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const hours = match[1];
  const minutes = match[2];
  const seconds = match[3];

  let result = "";
  if (hours) result += `${hours}h `;
  if (minutes) result += `${minutes}m `;
  if (seconds) result += `${seconds}s`;
  return result.trim() || "0s";
}

export default async function PlaylistVideos({ params }) {
  // 1. Correctly await params for Next.js 15 compatibility
  const resolvedParams = await params;
  const playlistId = resolvedParams.playlistId;
  const apiKey = process.env.YOUTUBE_API_KEY;

  // Safety check for API Key
  if (!apiKey) {
    return (
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Configuration Error</h1>
        <p style={{ textAlign: "center" }}>API Key is missing from environment variables.</p>
      </div>
    );
  }

  try {
    // 2. Fetch Playlist Items
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=20&playlistId=${playlistId}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Playlist fetch failed: ${res.status}`);
    const playlistData = await res.json();
    const items = playlistData.items || [];

    if (items.length === 0) {
      return (
        <div style={styles.container}>
          <h1 style={styles.pageTitle}>No videos found in this playlist.</h1>
        </div>
      );
    }

    // 3. Extract Video IDs and Fetch Detailed Stats (Duration, ViewCount)
    const videoIds = items
      .map((item) => item.contentDetails?.videoId)
      .filter(Boolean)
      .join(",");

    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`
    );

    if (!videoRes.ok) throw new Error("Detailed video fetch failed");
    const videoData = await videoRes.json();
    const videos = videoData.items || [];

    // 4. Fetch Channel Logos
    const channelIds = [...new Set(videos.map((v) => v.snippet.channelId))].join(",");
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${apiKey}`
    );

    const channelData = await channelRes.json();
    const channelLogos = {};
    channelData.items?.forEach((channel) => {
      channelLogos[channel.id] = channel.snippet.thumbnails.default.url;
    });

    return (
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Course Content</h1>
        <p style={styles.subtitle}>Select a lesson to begin your self-development journey</p>

        <div style={styles.videoGrid}>
          {videos.map((video) => (
            <a
              key={video.id}
              href={`/video/${video.id}?list=${playlistId}`}
              style={styles.cardLink}
            >
              <div style={styles.videoCard}>
                <div style={styles.thumbnailContainer}>
                  <img
                    src={video.snippet.thumbnails.medium?.url}
                    style={styles.thumbnail}
                    alt={video.snippet.title}
                  />
                  <span style={styles.duration}>
                    {formatYouTubeDuration(video.contentDetails.duration)}
                  </span>
                </div>

                <div style={styles.details}>
                  <img
                    src={channelLogos[video.snippet.channelId] || ""}
                    alt="channel logo"
                    style={styles.avatar}
                  />
                  <div style={styles.textContainer}>
                    <h3 style={styles.videoTitle}>{video.snippet.title}</h3>
                    <p style={styles.metaText}>{video.snippet.channelTitle}</p>
                    <p style={styles.metaText}>
                      {parseInt(video.statistics.viewCount || 0).toLocaleString()} views •{" "}
                      {formatDistanceToNow(new Date(video.snippet.publishedAt))} ago
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Playlist Page Error:", error);
    return (
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Error</h1>
        <p style={{ textAlign: "center" }}>{error.message || "Something went wrong while loading the playlist."}</p>
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "#050505", // Deep black for professional look
    minHeight: "100vh",
    padding: "80px 4% 40px 4%",
    color: "#fff",
  },
  pageTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "10px",
    color: "#a855f7",
    fontWeight: "800",
  },
  subtitle: {
    textAlign: "center",
    color: "#888",
    marginBottom: "50px",
    fontSize: "1.1rem",
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '20px',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  cardLink: { 
    textDecoration: "none", 
    color: "inherit", 
    display: "block",
    transition: "transform 0.2s ease",
  },
  videoCard: { 
    width: "100%",
    cursor: "pointer",
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
  },
  thumbnail: { width: "100%", aspectRatio: "16/9", objectFit: "cover" },
  duration: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    backgroundColor: "rgba(0,0,0,0.8)",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
  details: { display: "flex", marginTop: "14px", gap: "12px" },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
    border: "1px solid #444",
  },
  textContainer: { flex: 1 },
  videoTitle: {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "1.3",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "6px",
    color: "#f1f1f1",
  },
  metaText: { color: "#909090", fontSize: "13px", margin: "1px 0" },
};