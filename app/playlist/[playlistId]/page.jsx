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
        <div className="scanline" />
        <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -200, right: -100 }} />
        <div className="orb" style={{ background: '#4F46E5', width: 500, height: 500, bottom: -150, left: -100 }} />
        <h1 style={styles.pageTitle}>Configuration Error</h1>
        <p style={{ textAlign: "center", color: '#94A3B8' }}>API Key is missing from environment variables.</p>
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
          <div className="scanline" />
          <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -200, right: -100 }} />
          <div className="orb" style={{ background: '#4F46E5', width: 500, height: 500, bottom: -150, left: -100 }} />
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
        {/* ── Theme overlays ── */}
        <div className="scanline" />
        <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -200, right: -100 }} />
        <div className="orb" style={{ background: '#4F46E5', width: 500, height: 500, bottom: -150, left: -100 }} />

        <h1 style={styles.pageTitle}>Course Content</h1>
        <p style={styles.subtitle}>Select a lesson to begin your self-development journey</p>

        <div style={styles.videoGrid}>
          {videos.map((video, index) => (
            <a
              key={video.id}
              href={`/video/${video.id}?list=${playlistId}`}
              style={styles.cardLink}
            >
              <div
                className="video-card-item"
                style={{
                  ...styles.videoCard,
                  animationDelay: `${300 + index * 100}ms`,
                }}
              >
                <div style={styles.thumbnailContainer}>
                  <img
                    src={video.snippet.thumbnails.medium?.url}
                    style={styles.thumbnail}
                    alt={video.snippet.title}
                  />
                  {/* Thumbnail gradient overlay */}
                  <div style={styles.thumbnailOverlay} />
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
                    <p style={styles.channelText}>{video.snippet.channelTitle}</p>
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

        {/* CSS-only entrance animations + hover effects */}
        <style>{`
          @keyframes cardEntrance {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes headerEntrance {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .video-card-item {
            animation: cardEntrance 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            opacity: 0;
          }
          .video-card-item:hover {
            transform: scale(1.03) translateY(-5px) !important;
            border-color: #934CF0 !important;
            box-shadow: 0 10px 40px -10px rgba(147, 76, 240, 0.4) !important;
          }
          .video-card-item:hover h3 {
            color: #934CF0 !important;
          }
        `}</style>
      </div>
    );
  } catch (error) {
    console.error("Playlist Page Error:", error);
    return (
      <div style={styles.container}>
        <div className="scanline" />
        <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -200, right: -100 }} />
        <div className="orb" style={{ background: '#4F46E5', width: 500, height: 500, bottom: -150, left: -100 }} />
        <h1 style={styles.pageTitle}>Error</h1>
        <p style={{ textAlign: "center", color: '#94A3B8' }}>{error.message || "Something went wrong while loading the playlist."}</p>
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "#181022",
    minHeight: "100vh",
    padding: "80px 4% 40px 4%",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
  },
  pageTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "10px",
    fontWeight: "800",
    letterSpacing: "-0.02em",
    background: "linear-gradient(to right, #FFFFFF 30%, #934CF0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    position: "relative",
    zIndex: 10,
    animation: "headerEntrance 0.8s ease-out forwards",
  },
  subtitle: {
    textAlign: "center",
    color: "#94A3B8",
    marginBottom: "50px",
    fontSize: "1.1rem",
    fontWeight: "500",
    position: "relative",
    zIndex: 10,
    animation: "headerEntrance 0.8s ease-out 0.15s forwards",
    opacity: 0,
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    position: "relative",
    zIndex: 10,
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  videoCard: {
    width: "100%",
    cursor: "pointer",
    background: "rgba(147, 76, 240, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "16px",
    backgroundColor: "#1a1a2e",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
  },
  thumbnailOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(24, 16, 34, 0.6), transparent 50%)",
    pointerEvents: "none",
    borderRadius: "inherit",
  },
  duration: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    background: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
  },
  details: {
    display: "flex",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
    border: "2px solid #934CF0",
  },
  textContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  videoTitle: {
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "4px",
    color: "#fff",
    transition: "color 0.3s ease",
  },
  channelText: {
    color: "#94A3B8",
    fontSize: "12px",
    margin: "0 0 2px 0",
  },
  metaText: {
    color: "#94A3B8",
    fontSize: "11px",
    margin: 0,
  },
};