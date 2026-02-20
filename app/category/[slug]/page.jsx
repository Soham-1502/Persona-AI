'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // ✅ Import Link for navigation
import { CATEGORY_MAP } from '@/lib/data';

export default function CategoryPlaylists() {
  const { slug } = useParams();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const ids = CATEGORY_MAP[slug];

    if (ids) {
      fetch(`/api/playlists?ids=${ids}`)
        .then(res => res.json())
        .then(data => setPlaylists(data));
    }
  }, [slug]);

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>
        <span style={{textTransform: 'capitalize'}}>{slug}</span> Specialists
      </h1>
      
      <div style={styles.grid}>
        {playlists.map((pl) => (
          /* ✅ Wrap the entire card in a Link */
          <Link 
            href={`/playlist/${pl.id}`} 
            key={pl.id} 
            style={{ textDecoration: 'none' }}
          >
            <div style={styles.card}>
              <img src={pl.snippet.thumbnails.high.url} style={styles.thumb} alt="YouTuber" />
              <div style={{padding: '20px'}}>
                <h3 style={styles.plTitle}>{pl.snippet.title}</h3>
                <p style={styles.channel}>{pl.snippet.channelTitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

const styles = {
  page: { padding: '100px 5%', backgroundColor: '#000', minHeight: '100vh', color: '#fff' },
  title: { fontSize: '3rem', color: '#a855f7', marginBottom: '40px', textAlign: 'center' }, // Added textAlign
  grid: { 
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '20px',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: { 
    background: '#111', 
    borderRadius: '20px', 
    overflow: 'hidden', 
    border: '1px solid #222',
    height: '100%', // Ensures all cards in the row are same height
    transition: 'transform 0.2s ease', // Smooth hover effect
    cursor: 'pointer'
  },
  thumb: { width: '100%', aspectRatio: '16/9', objectFit: 'cover' },
  plTitle: { fontSize: '1.2rem', marginBottom: '10px', color: '#fff' },
  channel: { color: '#a855f7', fontWeight: 'bold' }
};