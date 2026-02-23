'use client'

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import DigitalSmartNotesTab from '@/components/DigitalSmartNotesTab';
import { segmentTranscript } from '@/lib/segmenter';

export default function VideoPlayerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const videoId = params.videoId;
  const playlistId = searchParams.get('list');

  const [videos, setVideos] = useState([]);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoDetails, setVideoDetails] = useState(null);
  const [activeRightTab, setActiveRightTab] = useState('course');
  
  // Video end state
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  // Transcript states
  const hasTriggeredGladia = useRef(false);
  const [transcriptStatus, setTranscriptStatus] = useState('not_started');

  // MCQ states
  const hasSentToMCQ = useRef(false);
  const [mcqStatus, setMcqStatus] = useState('not_started');

  const theme = {
    accent: '#a855f7',
    bg: '#050505',
    border: '#262626',
    sidebar: '#0a0a0a',
    textMuted: '#94a3b8',
    success: '#10b981'
  };

  // Reset everything on video change
  useEffect(() => {
    hasTriggeredGladia.current = false;
    hasSentToMCQ.current = false;
    setTranscriptStatus('not_started');
    setMcqStatus('not_started');
  }, [videoId]);

  // Progress checking + Gladia + auto-MCQ
  useEffect(() => {
    if (!player || !videoId) return;

    const interval = setInterval(async () => {
      if (player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        
        if (duration > 0) {
          const progress = (currentTime / duration) * 100;

          if (progress >= 70 && !hasTriggeredGladia.current && transcriptStatus === 'not_started') {
            hasTriggeredGladia.current = true;
            setTranscriptStatus('generating');
            console.log("70% reached → Starting Gladia transcript");

            try {
              const response = await fetch('/api/generate-transcript', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId }),
              });

              if (!response.ok) throw new Error(`Gladia failed: ${response.status}`);

              const data = await response.json();
              if (data.transcript) {
                localStorage.setItem(`transcript_${videoId}`, data.transcript);
                setTranscriptStatus('ready');
                console.log("Gladia transcript ready");
              } else {
                throw new Error('No transcript data');
              }
            } catch (err) {
              console.error("Gladia error:", err);
              setTranscriptStatus('error');
            }
          }

          if (transcriptStatus === 'ready' && !hasSentToMCQ.current) {
            hasSentToMCQ.current = true;
            setMcqStatus('generating');
            console.log("Transcript ready → Starting MCQ generation");

            const storedTranscript = localStorage.getItem(`transcript_${videoId}`);
            if (storedTranscript) {
              try {
                const segments = segmentTranscript(storedTranscript, 1);

                const mcqResponse = await fetch('/api/mcq', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ segments, videoId }),
                });

                if (mcqResponse.ok) {
                  setMcqStatus('ready');
                  console.log("MCQs generated and cached");
                } else {
                  console.error("MCQ failed:", mcqResponse.status);
                  setMcqStatus('error');
                }
              } catch (err) {
                console.error("MCQ generation error:", err);
                setMcqStatus('error');
              }
            }
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [player, videoId, transcriptStatus]);

  // Fetch playlist
  useEffect(() => {
    async function fetchPlaylist() {
      if (!playlistId) return;
      try {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
        );
        if (!res.ok) throw new Error(`Playlist fetch failed: ${res.status}`);
        const data = await res.json();
        const items = data.items?.map(item => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
        })) || [];
        setVideos(items);
        setLoading(false);
      } catch (err) {
        console.error("Playlist error:", err);
        setLoading(false);
      }
    }
    fetchPlaylist();
  }, [playlistId, router]);

  // Fetch video details
  useEffect(() => {
    if (!videoId) return;
    setIsVideoEnded(false);

    async function fetchVideoDetails() {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!apiKey) return;

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        );
        if (!res.ok) throw new Error(`Video fetch failed: ${res.status}`);
        const data = await res.json();
        if (data.items?.[0]?.snippet) {
          const item = data.items[0].snippet;
          setVideoDetails({
            title: item.title,
            description: item.description || "No description available."
          });
        }
      } catch (err) {
        console.error("Video details error:", err);
      }
    }
    fetchVideoDetails();
  }, [videoId]);

  // YouTube player init
  useEffect(() => {
    if (!videoId || player) return;

    let intervalId = null;

    const initPlayer = () => {
      const playerElement = document.getElementById('youtube-player');
      if (!playerElement) return;

      const newPlayer = new window.YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: { 
          autoplay: 1, 
          modestbranding: 1, 
          rel: 0,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
          disablekb: 1
        },
        events: {
          onReady: () => console.log("YouTube Player ready"),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsVideoEnded(true);
              handleAutoNext();
            }
          }
        }
      });

      setPlayer(newPlayer);
      clearInterval(intervalId);
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    intervalId = setInterval(() => {
      if (window.YT && window.YT.Player) initPlayer();
    }, 100);

    return () => clearInterval(intervalId);
  }, [videoId, player]);

  // Keyboard controls: Space = play/pause, Left = -5s, Right = +5s
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent action when typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (!player) return;

      // Space → Play/Pause
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault(); // prevent page scroll
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      }

      // Arrow Left → -5 seconds
      else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const current = player.getCurrentTime();
        player.seekTo(Math.max(0, current - 5), true); // true = allow seek during buffering
      }

      // Arrow Right → +5 seconds
      else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const current = player.getCurrentTime();
        const duration = player.getDuration() || 999999;
        player.seekTo(Math.min(duration, current + 5), true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player]);

  const switchVideo = (newId) => {
    if (player && player.loadVideoById) {
      player.loadVideoById(newId);
      router.push(`/video/${newId}?list=${playlistId}`);
    }
  };

  const handleAutoNext = () => {
    const currentIndex = videos.findIndex(v => v.id === videoId);
    if (currentIndex !== -1 && currentIndex < videos.length - 1) {
      // Optional auto-next – you can implement switchVideo(videos[currentIndex + 1].id) here
    }
  };

  if (loading && videos.length === 0) {
    return <div style={{ background: theme.bg, color: '#fff', height: '100vh', padding: '40px' }}>Loading...</div>;
  }

  const isAssessmentEnabled = isVideoEnded && mcqStatus === 'ready';

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: theme.bg, color: '#fff', overflow: 'hidden' }}>
      
      {/* Left: Video + Info */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ 
          position: 'relative',
          width: '100%', 
          aspectRatio: '16/9', 
          backgroundColor: '#000', 
          borderRadius: '24px', 
          overflow: 'hidden',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '20%', zIndex: 10, background: 'transparent' }} />
          <div id="youtube-player" style={{ width: '100%', height: '100%' }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '30px', gap: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, flex: 1 }}>
            {videoDetails?.title || "Loading..."}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {transcriptStatus === 'generating' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.9rem', fontWeight: '600' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                <span>Transcript Processing</span>
              </div>
            )}

            {transcriptStatus === 'ready' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.success, fontSize: '0.9rem', fontWeight: '600' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Transcript Ready</span>
              </div>
            )}

            <button 
              disabled={!isAssessmentEnabled}
              onClick={() => router.push(`/quiz?videoId=${videoId}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: '16px',
                whiteSpace: 'nowrap',
                fontSize: '0.95rem',
                fontWeight: '800',
                letterSpacing: '0.5px',
                cursor: isAssessmentEnabled ? 'pointer' : 'not-allowed',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: isAssessmentEnabled ? theme.accent : 'rgba(255, 255, 255, 0.03)',
                color: isAssessmentEnabled ? '#fff' : 'rgba(148, 163, 184, 0.4)',
                border: isAssessmentEnabled ? `1px solid ${theme.accent}` : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isAssessmentEnabled ? `0 10px 25px -5px ${theme.accent}66, inset 0 1px 0 rgba(255,255,255,0.3)` : 'none',
              }}
            >
              {isAssessmentEnabled ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              )}
              <span>{isAssessmentEnabled ? "TAKE ASSESSMENT" : "LOCKED"}</span>
            </button>
          </div>
        </div>
        
        <p style={{ color: theme.textMuted, marginTop: '16px', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {videoDetails?.description || "Loading description..."}
        </p>
      </div>

      {/* Right: Sidebar */}
      <div style={{ 
        width: '400px', 
        backgroundColor: theme.sidebar, 
        borderLeft: `1px solid ${theme.border}`, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div style={{ 
          padding: '25px', 
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h2 style={{ fontSize: '0.9rem', letterSpacing: '2px', color: theme.accent, fontWeight: '900', margin: 0 }}>
            {activeRightTab === 'course' ? 'COURSE CONTENT' : 'DIGITAL SMART NOTES'}
          </h2>

          <button
            onClick={() => setActiveRightTab(activeRightTab === 'course' ? 'notes' : 'course')}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.accent}`,
              color: theme.accent,
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            {activeRightTab === 'course' ? 'Notes' : 'Back to Course'}
          </button>
        </div>
        
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '15px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.accent}80 #1a1a2e`
        }}>
          <style jsx global>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #1a1a2e;
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb {
              background: ${theme.accent}80;
              border-radius: 10px;
              border: 2px solid #1a1a2e;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: ${theme.accent};
            }
          `}</style>

          {activeRightTab === 'course' ? (
            videos.map((v, index) => (
              <div 
                key={`${v.id}-${index}`} 
                onClick={() => switchVideo(v.id)}
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  padding: '12px', 
                  borderRadius: '14px', 
                  cursor: 'pointer', 
                  marginBottom: '8px',
                  backgroundColor: videoId === v.id ? `${theme.accent}15` : 'transparent',
                  border: `1px solid ${videoId === v.id ? theme.accent : 'transparent'}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={v.thumbnail} alt="" style={{ width: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: '600', lineHeight: '1.4', color: videoId === v.id ? '#fff' : '#ccc' }}>
                  {v.title}
                </div>
              </div>
            ))
          ) : (
            <DigitalSmartNotesTab 
              player={player} 
              videoId={videoId} 
              theme={theme} 
              videoTitle={videoDetails?.title}   
            />
          )}
        </div>
      </div>
    </div>
  );
}