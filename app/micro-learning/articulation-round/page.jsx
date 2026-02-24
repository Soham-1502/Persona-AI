'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArticulationRound() {
  const router = useRouter();

  const [text, setText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Get transcript from localStorage (set by quiz page)
  const transcript = typeof window !== 'undefined'
    ? localStorage.getItem('quizTranscript') || ''
    : '';

  const theme = {
    accent: '#a855f7',
    bg: '#0a0a0a',
    card: '#111111',
    border: '#262626',
    textMuted: '#94a3b8',
    error: '#f43f5e',
    success: '#10b981'
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setText((prev) => prev + ' ' + event.results[i][0].transcript);
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }
        setInterimText(currentInterim);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/m4a' });
        await sendToWhisper(audioBlob);
      };

      mediaRecorderRef.current.start();

      if (recognitionRef.current) {
        setInterimText('');
        recognitionRef.current.start();
      }

      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied. Please enable permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) recognitionRef.current.stop();

      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setInterimText('');
    }
  };

  const sendToWhisper = async (blob) => {
    setIsTranscribing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'recording.m4a');

      const res = await fetch('/api/micro-learning/whisper', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.text) {
        setText(data.text);
      }
    } catch (err) {
      setError("Transcription service unreachable. Using local draft.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (text.length < 20) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/micro-learning/analyze-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          userExplanation: text
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Store analysis + user text for the results page
        localStorage.setItem('articulationResult', JSON.stringify({
          analysis: data.analysis,
          userText: text
        }));

        // Redirect to results page
        router.push('/micro-learning/articulation-results');
      } else {
        throw new Error(data.error || "Cognitive Audit failed.");
      }
    } catch (err) {
      console.error("Final Analysis Error:", err);
      setError(err.message.includes('Connection')
        ? "Network Unstable: The Neural Audit server is unreachable. Please try again."
        : "Neural Audit Timeout: Check your connection and retry.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease', width: '100%', maxWidth: '800px', margin: '0 auto' }}>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>
          Neural <span style={{ color: theme.accent }}>Articulation</span>
        </h2>
        <p style={{ color: theme.textMuted, marginTop: '10px', fontSize: '1.1rem' }}>
          Explain the concept in your own words.
        </p>
      </div>

      {/* ERROR ALERT BANNER */}
      {error && (
        <div style={{
          backgroundColor: `${theme.error}15`,
          border: `1px solid ${theme.error}44`,
          color: theme.error,
          padding: '15px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'shake 0.4s ease'
        }}>
          <span><strong>⚠️ Connection Alert:</strong> {error}</span>
          <button
            onClick={() => setError(null)}
            style={{ background: 'transparent', border: 'none', color: theme.error, cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ backgroundColor: theme.card, borderRadius: '24px', border: `1px solid ${theme.border}`, padding: '30px', position: 'relative' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: isRecording ? theme.error : theme.success,
              boxShadow: isRecording ? `0 0 10px ${theme.error}` : 'none'
            }} />
            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: theme.textMuted, letterSpacing: '1px' }}>
              {isRecording ? 'LIVE RECORDING...' : isTranscribing ? 'FINALIZING TEXT...' : 'READY FOR INPUT'}
            </label>
          </div>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              padding: '10px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer',
              backgroundColor: isRecording ? theme.error : '#222', color: '#fff',
              fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <span>{isRecording ? '●' : '🎤'}</span>
            {isRecording ? 'Stop Recording' : 'Start Mic'}
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <textarea
            value={text + (interimText ? (text ? ' ' : '') + interimText : '')}
            onChange={(e) => setText(e.target.value)}
            disabled={isAnalyzing}
            placeholder="Your explanation will appear here..."
            style={{
              width: '100%', height: '320px', backgroundColor: '#050505', color: '#fff',
              border: `1px solid ${error ? theme.error : isRecording ? theme.error : theme.border}`,
              borderRadius: '16px', padding: '25px', fontSize: '1.1rem', lineHeight: '1.7', outline: 'none', resize: 'none',
              transition: 'border 0.3s ease'
            }}
          />
        </div>

        <button
          onClick={handleFinalSubmit}
          disabled={text.length < 20 || isAnalyzing || isRecording}
          style={{
            width: '100%', marginTop: '25px', padding: '20px', borderRadius: '14px',
            background: error ? theme.error : theme.accent,
            color: '#fff', fontWeight: '800', border: 'none',
            cursor: 'pointer', fontSize: '1rem',
            opacity: (text.length < 20 || isAnalyzing || isRecording) ? 0.3 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          {isAnalyzing ? 'Processing Audit...' : error ? 'Retry Audit' : 'Analyze My Explanation'}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}