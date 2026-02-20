// components/GeminiChatTab.jsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function GeminiChatTab({ player, videoId, theme }) {
  const [messages, setMessages] = useState([]); // { role: 'user'|'ai', content: string, timestamp?: string }
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const chatContainerRef = useRef(null);

  // Format seconds → MM:SS
  const formatTimestamp = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current timestamp from player
  const getCurrentTimestamp = () => {
    if (!player) return '00:00';
    try {
      const time = player.getCurrentTime();
      return formatTimestamp(time);
    } catch {
      return '00:00';
    }
  };

  // Fetch video info (title + description) once — gives Gemini full context
  useEffect(() => {
    async function fetchVideoInfo() {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!apiKey || !videoId) return;

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        );
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0].snippet;
          setVideoInfo({
            title: item.title,
            description: item.description || '',
          });
        }
      } catch (err) {
        console.error('YouTube Data API error:', err);
      }
    }
    fetchVideoInfo();
  }, [videoId]);

  // Ask Gemini — always includes current timestamp for real-time context
  const askGemini = async (customQuestion = null) => {
    const currentTs = getCurrentTimestamp();
    const userQ = customQuestion || question.trim();

    if (!userQ) return;

    // Show user's question in chat
    setMessages((prev) => [...prev, { role: 'user', content: userQ, timestamp: currentTs }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini-realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          timestamp: currentTs,          // Real-time sync: current time is always sent
          userQuestion: userQ,
          videoInfo,
        }),
      });

      const data = await res.json();

      if (data.insight) {
        setMessages((prev) => [...prev, { role: 'ai', content: data.insight, timestamp: currentTs }]);
      } else {
        setMessages((prev) => [...prev, { role: 'ai', content: 'No response received. Try again.', timestamp: currentTs }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'ai', content: 'Error connecting to Gemini.', timestamp: currentTs }]);
    }

    setIsLoading(false);
    setQuestion('');
  };

  // Full video summary (start to end)
  const generateSummary = async () => {
    await askGemini('Provide a detailed, structured summary of the entire video from start to end with key timestamps.');
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #0a0a14 100%)',
        color: '#e0e0ff',
        overflow: 'hidden',
      }}
    >
      {/* Header with Summary Button */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid rgba(168, 85, 247, 0.15)`,
          background: 'rgba(10, 10, 20, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#a855f7' }}>
          Video Intelligence
        </div>
        <button
          onClick={generateSummary}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.25)',
            transition: 'all 0.2s ease',
          }}
        >
          Generate Summary
        </button>
      </div>

      {/* Scrollable Chat Area */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.accent}40 #1a1a2e`,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.4)',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '0 20px',
            }}
          >
            Ask anything about the video — current timestamp is automatically included when you ask.
            <br />
            Example: "What is meant by the things explained from 1:00 to 1:43?"
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className="message-fade-in"
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: '16px',
              background:
                msg.role === 'user'
                  ? 'linear-gradient(135deg, #6b46c1, #a855f7)'
                  : 'rgba(30, 30, 50, 0.9)',
              color: msg.role === 'user' ? '#ffffff' : '#e0e0ff',
              boxShadow:
                msg.role === 'user'
                  ? '0 4px 20px rgba(168, 85, 247, 0.3)'
                  : '0 2px 12px rgba(0,0,0,0.3)',
              border:
                msg.role === 'user'
                  ? '1px solid rgba(255,255,255,0.15)'
                  : `1px solid ${theme.border}`,
              position: 'relative',
              animation: 'fadeInUp 0.4s ease-out',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                opacity: 0.7,
                marginBottom: '6px',
                textAlign: msg.role === 'user' ? 'right' : 'left',
              }}
            >
              {msg.role === 'user' ? 'You' : 'Gemini'} • {msg.timestamp || '—'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '12px 16px',
              background: 'rgba(30, 30, 50, 0.8)',
              borderRadius: '16px',
              color: 'rgba(255,255,255,0.6)',
              fontStyle: 'italic',
            }}
          >
            Thinking...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: `1px solid rgba(168, 85, 247, 0.15)`,
          background: 'rgba(10, 10, 20, 0.6)',
          backdropFilter: 'blur(8px)',
          flexShrink: 0,
          display: 'flex',
          gap: '12px',
        }}
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about the video..."
          style={{
            flex: 1,
            padding: '14px 16px',
            background: 'rgba(30, 30, 50, 0.8)',
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            color: '#ffffff',
            resize: 'none',
            height: '56px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s',
            boxShadow: question.trim()
              ? '0 0 0 2px rgba(168, 85, 247, 0.2)'
              : 'none',
          }}
          onFocus={(e) => (e.target.style.height = '80px')}
          onBlur={(e) => (e.target.style.height = '56px')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (question.trim()) askGemini();
            }
          }}
        />

        <button
          onClick={() => question.trim() && askGemini()}
          disabled={isLoading || !question.trim()}
          style={{
            width: '56px',
            height: '56px',
            background: question.trim()
              ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
              : 'rgba(168, 85, 247, 0.3)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: question.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: question.trim()
              ? '0 6px 20px rgba(168, 85, 247, 0.4)'
              : 'none',
            transform: question.trim() ? 'scale(1)' : 'scale(0.95)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* Animations & scrollbar */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .message-fade-in {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f0f1a; }
        ::-webkit-scrollbar-thumb { background: #a855f7; border-radius: 3px; }
      `}</style>
    </div>
  );
}