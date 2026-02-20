'use client';
import Link from 'next/link';

const categories = [
  { name: 'Communication', slug: 'communication', icon: '🗣️', description: 'Vocal variety and storytelling.' },
  { name: 'Posture', slug: 'posture', icon: '🕴️', description: 'Commanding physical presence.' },
  { name: 'Confidence', slug: 'confidence', icon: '🖐️', description: 'Master the art of self-assurance.' }
];

export default function CategoriesPage() {
  return (
    <main className="container" style={styles.page}>
      <h2 style={styles.title}>Select a <span style={{color: '#a855f7'}}>Category</span></h2>
      <div style={styles.grid}>
        {categories.map((cat) => (
          <Link href={`/category/${cat.slug}`} key={cat.slug} style={{textDecoration: 'none'}}>
            <div style={styles.card}>
              <div style={styles.icon}>{cat.icon}</div>
              <h3 style={styles.name}>{cat.name}</h3>
              <p style={styles.desc}>{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

const styles = {
  page: { 
    padding: '120px 5% 50px 5%', // Increased top padding so title doesn't hide
    textAlign: 'center', 
    minHeight: '100vh',
    display: 'flex',            // Added flex to center the content
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100vw',          // Prevents horizontal scroll
    boxSizing: 'border-box'     // Important for padding calculation
  },
  title: { 
    fontSize: '3.5rem',         // Slightly larger for better hierarchy
    marginBottom: '60px', 
    fontWeight: '800',
    color: '#fff'
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Keeps items horizontal longer
    gap: '30px',
    width: '100%',
    maxWidth: '1200px'          // Keeps the grid from stretching too wide
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '40px 20px',
    borderRadius: '24px',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    cursor: 'pointer',
    height: '100%',             // Ensures all cards are equal height
    transition: 'transform 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  icon: { fontSize: '4rem', marginBottom: '20px' }, // Made icon bigger for style
  name: { fontSize: '1.6rem', color: '#fff', fontWeight: '700' },
  desc: { color: '#ccc', fontSize: '1rem', marginTop: '12px', lineHeight: '1.4' }
};