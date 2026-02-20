'use client'

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import GeminiChatTab from '@/components/GeminiChatTab';
// NEW IMPORTS FOR AUTOMATION
import { segmentTranscript } from '@/lib/segmenter';
import { getVideoTranscript } from '@/lib/youtube-transcript';

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
  
  // NEW STATE FOR BUTTON LOCK
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  // TRIGGER TRACKER
  const hasTriggeredTranscript = useRef(false);

  const theme = {
    accent: '#a855f7',
    bg: '#050505',
    border: '#262626',
    sidebar: '#0a0a0a',
    textMuted: '#94a3b8'
  };

  // --- AUTOMATION TRIGGER: 80% PROGRESS ---
  useEffect(() => {
    if (!player || !videoId) return;
    hasTriggeredTranscript.current = false; 

    const interval = setInterval(async () => {
      if (player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        
        if (duration > 0) {
          const progress = (currentTime / duration) * 100;
          
          if (progress >= 80 && !hasTriggeredTranscript.current) {
            hasTriggeredTranscript.current = true;
            
            console.log("🚀 80% Milestone: Starting automated MCQ generation...");

            try {
              const rawXml = await getVideoTranscript(videoId);
              if (rawXml) {
                const cleanText = rawXml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                const segments = segmentTranscript(cleanText, 1);
                const response = await fetch('/api/mcq', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ segments, videoId }) 
                });
                
                if (response.ok) {
                  console.log("✅ Neural Assessment generated silently in the background.");
                }
              }
            } catch (err) {
              console.error("Auto-Automation Error:", err);
            }
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [player, videoId]);

  // Fetch playlist for sidebar
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
        console.error("Playlist fetch error:", err);
        setLoading(false);
      }
    }
    fetchPlaylist();
  }, [playlistId, router]);

  // Fetch current video details
  useEffect(() => {
    if (!videoId) return;
    setIsVideoEnded(false); // Reset lock when switching videos

    async function fetchVideoDetails() {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!apiKey) return;

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        );
        if (!res.ok) throw new Error(`Video details fetch failed: ${res.status}`);
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

  // Initialize YouTube player
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
          onReady: () => {
            console.log("YouTube Player is fully ready!");
          },
          onStateChange: (event) => {
            // Check if video has ended
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
      if (window.YT && window.YT.Player) {
        initPlayer();
      }
    }, 100);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoId, player]);

  // Spacebar to play/pause
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!player) return;
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
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
      // Auto-next logic could go here if desired
    }
  };

  if (loading && videos.length === 0) {
    return <div style={{ background: theme.bg, color: '#fff', height: '100vh', padding: '40px' }}>Loading...</div>;
  }

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
        
        {/* TITLE BAR WITH REVISED MCQ BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '30px', gap: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, flex: 1 }}>
            {videoDetails?.title || "Loading..."}
          </h1>
          
          <button 
            disabled={!isVideoEnded}
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
              cursor: isVideoEnded ? 'pointer' : 'not-allowed',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              
              // Conditional Design
              backgroundColor: isVideoEnded ? theme.accent : 'rgba(255, 255, 255, 0.03)',
              color: isVideoEnded ? '#fff' : 'rgba(148, 163, 184, 0.4)',
              border: isVideoEnded 
                ? `1px solid ${theme.accent}` 
                : '1px solid rgba(255, 255, 255, 0.08)',
              
              // Visual Effects
              boxShadow: isVideoEnded 
                ? `0 10px 25px -5px ${theme.accent}66, inset 0 1px 0 rgba(255,255,255,0.3)` 
                : 'none',
              filter: isVideoEnded ? 'grayscale(0)' : 'grayscale(1)',
              backdropFilter: isVideoEnded ? 'none' : 'blur(8px)',
            }}
            onMouseOver={(e) => {
              if (isVideoEnded) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 15px 30px -5px ${theme.accent}88, inset 0 1px 0 rgba(255,255,255,0.4)`;
              }
            }}
            onMouseOut={(e) => {
              if (isVideoEnded) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 10px 25px -5px ${theme.accent}66, inset 0 1px 0 rgba(255,255,255,0.3)`;
              }
            }}
          >
            {isVideoEnded ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            )}
            <span>{isVideoEnded ? "TAKE ASSESSMENT" : "LOCKED"}</span>
          </button>
        </div>
        
        <p style={{ color: theme.textMuted, marginTop: '16px', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {videoDetails?.description || "Loading description..."}
        </p>
      </div>

      {/* Right: Sidebar with Tabs */}
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
            {activeRightTab === 'course' ? 'COURSE CONTENT' : 'VIDEO INSIGHTS'}
          </h2>

          <button
            onClick={() => setActiveRightTab(activeRightTab === 'course' ? 'gemini' : 'course')}
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
            {activeRightTab === 'course' ? 'Open Insights' : 'Back to Course'}
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
            <GeminiChatTab player={player} videoId={videoId} theme={theme} />
          )}
        </div>
      </div>
    </div>
  );
}