'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // 3-second timer to redirect to the separate categories page
    const timer = setTimeout(() => {
      router.push('/categories');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={styles.splashWrapper}>
      <style>
        {`
          @keyframes scanLight {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .purple-feature-name {
            font-size: 5rem;
            font-weight: 800;
            letter-spacing: 4px;
            background: linear-gradient(
              90deg, 
              #6b21a8 0%, 
              #a855f7 25%, 
              #ffffff 50%, 
              #a855f7 75%, 
              #6b21a8 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            /* Animation set to 3s to match the redirect timer */
            animation: scanLight 3s linear forwards;
            text-shadow: 0 0 30px rgba(168, 85, 247, 0.4);
          }
        `}
      </style>
      
      <div className="container">
        <h1 className="purple-feature-name">AI-Led Microlearning</h1>
        <div style={styles.descriptionBox}>
          <p style={styles.descriptionText}>
            LEARN. TEST. EXPLAIN.<br/>
            Watch, Validate, and Articulate your Understanding
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  splashWrapper: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100vw',
    backgroundColor: '#000'
  },
  descriptionBox: {
    maxWidth: '700px',
    margin: '30px auto',
    padding: '20px',
    borderLeft: '4px solid #a855f7',
    background: 'rgba(168, 85, 247, 0.05)',
  },
  descriptionText: {
    fontSize: '1.4rem',
    lineHeight: '1.6',
    color: '#e9d5ff',
  
  }
};