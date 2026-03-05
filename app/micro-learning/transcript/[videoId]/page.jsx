'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TranscriptPage() {
  const params = useParams()
  const videoId = params.videoId

  const [transcript, setTranscript] = useState('Loading transcript...')
  const [error, setError] = useState(null)

  useEffect(() => {
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

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050505',
        color: '#ffffff',
        padding: '40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '2.2rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            color: '#a855f7',
          }}
        >
          Video Transcript – {videoId}
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              color: '#fecaca',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #262626',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.7',
            fontSize: '1.05rem',
            minHeight: '300px',
          }}
        >
          {transcript}
        </div>

        <div style={{ marginTop: '32px', color: '#94a3b8', fontSize: '0.95rem' }}>
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
            backgroundColor: '#a855f7',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          ← Back to Video
        </button>
      </div>
    </div>
  )
}