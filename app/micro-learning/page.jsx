'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function SplashPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 3-second timer to redirect to the separate categories page
    const timer = setTimeout(() => {
      router.push('/micro-learning/categories');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  if (!mounted) return null;

  const isLight = resolvedTheme === 'light';

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
              ${isLight ? '#9067C6' : '#6b21a8'} 0%, 
              ${isLight ? '#8D86C9' : '#a855f7'} 25%, 
              ${isLight ? '#242038' : '#ffffff'} 50%, 
              ${isLight ? '#8D86C9' : '#a855f7'} 75%, 
              ${isLight ? '#9067C6' : '#6b21a8'} 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            /* Animation set to 3s to match the redirect timer */
            animation: scanLight 3s linear forwards;
            text-shadow: 0 0 30px ${isLight ? 'rgba(144, 103, 198, 0.2)' : 'rgba(168, 85, 247, 0.4)'};
          }
           @media (max-width: 768px) {
            .purple-feature-name {
              font-size: 2.5rem;
              letter-spacing: 2px;
            }
          }
        `}
      </style>

      <div className="container px-4">
        <h1 className="purple-feature-name">AI-Led Microlearning</h1>
        <div style={{
          ...styles.descriptionBox,
          borderLeftColor: isLight ? '#9067C6' : '#a855f7',
          background: isLight ? 'rgba(144, 103, 198, 0.05)' : 'rgba(168, 85, 247, 0.05)',
        }}>
          <p style={{
            ...styles.descriptionText,
            color: isLight ? '#242038' : '#e9d5ff',
          }}>
            LEARN. TEST. EXPLAIN.<br />
            Watch, Validate, and Articulate your Understanding
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  splashWrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
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
