"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CATEGORY_MAP, ACADEMIC_PLAYLIST_MAP } from "@/lib/data";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function CategoryPlaylistsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ ...styles.main, display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      }
    >
      <CategoryPlaylists />
    </Suspense>
  );
}

function CategoryPlaylists() {
  const { slug } = useParams();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") || "personality";
  const isAcademic = mode === "academic";

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const ids = isAcademic ? ACADEMIC_PLAYLIST_MAP[slug] : CATEGORY_MAP[slug];

    if (!ids) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    fetch(`/api/playlists?ids=${ids}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setPlaylists(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPlaylists([]);
        setLoading(false);
      });
  }, [slug, isAcademic]);

  const displayTitle = isAcademic
    ? `${slug.replace(/-/g, " ")} Playlists & Courses`
    : `${slug.charAt(0).toUpperCase() + slug.slice(1)} Specialists`;

  return (
    <main className={spaceGrotesk.className} style={styles.main}>
      {/* ── Scanline overlay ── */}
      <div className="scanline" />

      {/* ── Background orbs ── */}
      <div className="orb" style={{ background: '#6B21A8', width: 800, height: 800, top: -384, left: -192 }} />
      <div className="orb" style={{ background: '#4F46E5', width: 900, height: 900, bottom: -192, right: -192 }} />
      <div className="orb" style={{ background: '#934CF0', width: 400, height: 400, top: '50%', left: '33%', opacity: 0.1 }} />

      <h1 style={styles.title}>{displayTitle}</h1>

      {loading ? (
        <div style={styles.loading}>Loading playlists...</div>
      ) : playlists.length === 0 ? (
        <div style={styles.empty}>
          No playlists found for this {isAcademic ? "subject" : "category"}.
        </div>
      ) : (
        <div style={styles.grid}>
          {playlists.map((pl) => (
            <Link
              key={pl.id}
              href={`/playlist/${pl.id}${isAcademic ? "?mode=academic" : ""}`}
              style={styles.linkReset}
            >
              <div className="glass-card group" style={styles.card}>
                <div style={styles.thumbnailWrapper}>
                  <img
                    src={
                      pl.snippet.thumbnails?.high?.url ||
                      pl.snippet.thumbnails?.medium?.url
                    }
                    alt={pl.snippet.title}
                    style={styles.thumbnail}
                  />
                  {/* Gradient overlay on thumbnail */}
                  <div style={styles.thumbnailOverlay} />
                  {/* Video count badge */}
                  {pl.contentDetails?.itemCount != null && (
                    <div style={styles.videoBadge}>
                      {String(pl.contentDetails.itemCount).padStart(2, "0")} Videos
                    </div>
                  )}
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{pl.snippet.title}</h3>
                  <p style={styles.channelName}>{pl.snippet.channelTitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

// ────────────────────────────────────────────────
// Styles — EXACT same sizes, alignment, padding, grid as original.
// Only visual skin values changed to match glass theme.
const styles = {
  main: {
    minHeight: "100vh",
    backgroundColor: "#181022",                        // ← upgraded from #050505
    color: "#ffffff",
    padding:
      "clamp(80px, 10vh, 140px) clamp(16px, 5vw, 80px) clamp(40px, 8vh, 80px)",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  },

  title: {
    fontSize: "clamp(2rem, 6vw, 3.5rem)",              // ← KEPT exact same
    fontWeight: 800,
    color: "#fff",
    textAlign: "center",
    marginBottom: "clamp(32px, 6vh, 60px)",             // ← KEPT exact same
    lineHeight: 1.2,
    textTransform: "capitalize",
    textShadow: "0 0 25px rgba(147, 76, 240, 0.6)",    // ← glass theme glow
    position: "relative",
    zIndex: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",              // ← KEPT exact same 4 columns
    gap: "clamp(16px, 2vw, 28px)",                      // ← KEPT exact same
    width: "100%",
    maxWidth: "1600px",                                 // ← KEPT exact same
    margin: "0 auto",
    justifyContent: "center",                           // ← KEPT exact same
    position: "relative",
    zIndex: 10,
  },

  linkReset: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    height: "100%",
  },

  card: {
    borderRadius: "24px",                               // ← upgraded to rounded-3xl
    overflow: "hidden",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "420px",                                  // ← KEPT exact same
    // glass-card CSS class handles: background, border, backdrop-filter, hover
  },

  thumbnailWrapper: {
    width: "100%",
    aspectRatio: "16 / 9",                              // ← KEPT exact same
    overflow: "hidden",
    position: "relative",
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
    background: "linear-gradient(to top, #181022, transparent, transparent)",
    opacity: 0.6,
    pointerEvents: "none",
  },

  videoBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(12px)",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
  },

  cardContent: {
    padding: "clamp(14px, 2vw, 20px)",                  // ← KEPT exact same
    paddingTop: "clamp(20px, 3vw, 32px)",               // ← slightly more top for glass style
    flex: 1,
  },

  cardTitle: {
    fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",        // ← KEPT exact same
    fontWeight: 600,
    lineHeight: 1.35,
    margin: "0 0 8px 0",                                // ← KEPT exact same
    color: "#fff",
    transition: "color 0.3s ease",
  },

  channelName: {
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",           // ← KEPT exact same
    color: "#934CF0",                                    // ← upgraded to theme primary
    margin: 0,
    opacity: 0.9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },

  loading: {
    textAlign: "center",
    fontSize: "1.3rem",
    color: "#888",
    padding: "80px 20px",
    position: "relative",
    zIndex: 10,
  },

  empty: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#777",
    padding: "80px 20px",
    position: "relative",
    zIndex: 10,
  },
};