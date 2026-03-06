'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export default function TranscriptPage() {
  const params = useParams()
  const videoId = params.videoId
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [transcript, setTranscript] = useState('Loading transcript...')
  const [error, setError] = useState(null)

  useEffect(() => {
    setMounted(true)
    if (!videoId) {
      setError('No video ID found')
      return
    }

    // Try to load from localStorage (where the background generation saved it)
    const storedTranscript = localStorage.getItem(`transcript_${videoId}`)

    if (storedTranscript) {
      setTranscript(storedTranscript)
    } else {
      setTranscript('Transcript not yet available or generation failed.')
      setError('No transcript found in storage for this video.')
    }
  }, [videoId])

  if (!mounted) return null
  const isLight = resolvedTheme === 'light'

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'transparent',
        color: isLight ? '#242038' : '#ffffff',
        padding: '40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1
          className="gradient-text"
          style={{
            fontSize: '2.2rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
          }}
        >
          Video Transcript – {videoId}
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: isLight ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              color: isLight ? '#b91c1c' : '#fecaca',
            }}
          >
            {error}
          </div>
        )}

        <div
          className="glass-card"
          style={{
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(147, 76, 240, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${isLight ? 'rgba(144, 103, 198, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
            whiteSpace: 'pre-wrap',
            lineHeight: '1.7',
            fontSize: '1.05rem',
            minHeight: '300px',
            color: isLight ? '#475569' : '#cbd5e1',
          }}
        >
          {transcript}
        </div>

        <div style={{ marginTop: '32px', color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.95rem' }}>
          <p>
            Note: This transcript is generated automatically in the background when the video reaches ~70% playback.
          </p>
          <p>
            If it's not available yet, try again later or check if the video has been watched far enough.
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          style={{
            marginTop: '32px',
            padding: '12px 28px',
            backgroundColor: isLight ? '#9067C6' : '#a855f7',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: isLight ? '0 4px 12px rgba(144, 103, 198, 0.2)' : '0 4px 12px rgba(168, 85, 247, 0.3)',
          }}
        >
          ← Back to Video
        </button>
      </div>
    </div>
  )
}
