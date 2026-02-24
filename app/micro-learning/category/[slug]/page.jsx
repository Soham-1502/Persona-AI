"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CATEGORY_MAP, ACADEMIC_PLAYLIST_MAP } from "@/lib/data";

export default function CategoryPlaylists() {
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

    fetch(`/api/micro-learning/playlists?ids=${ids}`)
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
    <main style={styles.main}>
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
              href={`/micro-learning/playlist/${pl.id}${isAcademic ? "?mode=academic" : ""}`}
              style={styles.linkReset}
            >
              <div style={styles.card}>
                <div style={styles.thumbnailWrapper}>
                  <img
                    src={
                      pl.snippet.thumbnails?.high?.url ||
                      pl.snippet.thumbnails?.medium?.url
                    }
                    alt={pl.snippet.title}
                    style={styles.thumbnail}
                  />
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
// Styles (only border changed to purple)
const styles = {
  main: {
    minHeight: "100vh",
    backgroundColor: "#050505",
    color: "#ffffff",
    padding:
      "clamp(80px, 10vh, 140px) clamp(16px, 5vw, 80px) clamp(40px, 8vh, 80px)",
    boxSizing: "border-box",
  },

  title: {
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    fontWeight: 800,
    color: "#a855f7",
    textAlign: "center",
    marginBottom: "clamp(32px, 6vh, 60px)",
    lineHeight: 1.2,
    textTransform: "capitalize",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", // ← forces 4 columns
    gap: "clamp(16px, 2vw, 28px)",
    width: "100%",
    maxWidth: "1600px", // gives room for 4 cards + gaps
    margin: "0 auto",
    justifyContent: "center", // centers if container is narrower
  },

  linkReset: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    height: "100%",
  },

  card: {
    background: "rgba(20,20,25,0.9)",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #a855f7",          // ← changed to solid purple border
    transition: "all 0.28s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "420px", // prevents cards from becoming too wide
  },

  thumbnailWrapper: {
    width: "100%",
    aspectRatio: "16 / 9",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  cardContent: {
    padding: "clamp(14px, 2vw, 20px)",
    flex: 1,
  },

  cardTitle: {
    fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
    fontWeight: 600,
    lineHeight: 1.35,
    margin: "0 0 8px 0",
  },

  channelName: {
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    color: "#a855f7",
    margin: 0,
    opacity: 0.9,
  },

  loading: {
    textAlign: "center",
    fontSize: "1.3rem",
    color: "#888",
    padding: "80px 20px",
  },

  empty: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#777",
    padding: "80px 20px",
  },
};