'use client'

import { useState, useEffect } from 'react' // Added useEffect
import { segmentTranscript } from '@/lib/segmenter';
import ArticulationRound from './ArticulationRound';
import ArticulationResults from './ArticulationResults';

export default function MCQRound() {
  const [videoText, setVideoText] = useState('')
  const [mcqs, setMcqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [userAnswers, setUserAnswers] = useState({}) 
  const [skippedQuestions, setSkippedQuestions] = useState([]) 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // NEW STATES FOR ARTICULATION REDIRECT
  const [showArticulation, setShowArticulation] = useState(false);
  const [articulationAnalysis, setArticulationAnalysis] = useState(null);
  const [userSpeechText, setUserSpeechText] = useState('');

  const theme = {
    bg: '#0a0a0a',
    card: '#141414',
    cardHover: '#1c1c1c',
    accent: '#a855f7',
    accentMuted: 'rgba(168, 85, 247, 0.15)',
    text: '#f9fafb',
    textMuted: '#94a3b8',
    border: '#262626',
    success: '#10b981',
    error: '#f43f5e',
    warning: '#f59e0b' 
  }

  // --- NEW: AUTOMATION SENSOR ---
  useEffect(() => {
    const fetchCachedQuiz = async () => {
      // 1. Get the videoId from the URL (e.g., /mcq?videoId=XYZ)
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get('videoId');
      
      if (!videoId) return;

      setLoading(true);
      try {
        // 2. Ask the API for the cached quiz
        const response = await fetch(`/api/mcq?videoId=${videoId}`);
        const data = await response.json();
        
        if (data.success && data.mcqs) {
          setMcqs(data.mcqs);
          console.log("✅ Automated Assessment Loaded Successfully");
        }
      } catch (err) {
        console.error("Failed to load automated quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCachedQuiz();
  }, []);

  const totalQuestions = mcqs.length;
  const interactionCount = Object.keys(userAnswers).length + skippedQuestions.filter(i => !userAnswers[i]).length;
  const progressPercent = totalQuestions > 0 ? (interactionCount / totalQuestions) * 100 : 0;

  const generateMCQ = async () => {
    if (!videoText.trim()) return;
    setLoading(true);
    try {
      const segments = segmentTranscript(videoText, 1);
      const response = await fetch('/api/mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segments })
      });
      const data = await response.json();
      if (data.success) setMcqs(data.mcqs);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (!userAnswers[currentQuestionIndex]) {
      setSkippedQuestions(prev => [...new Set([...prev, currentQuestionIndex])]);
    }
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }

  const handleFinalSubmit = () => {
    if (!userAnswers[currentQuestionIndex]) {
      setSkippedQuestions(prev => [...new Set([...prev, currentQuestionIndex])]);
    }
    setSubmitted(true);
  }

  // Handle completion of Articulation Round
  const onArticulationComplete = (analysis, text) => {
    setArticulationAnalysis(analysis);
    setUserSpeechText(text);
  }

  const attemptedCount = Object.keys(userAnswers).length;
  const correctCount = mcqs.filter((m, i) => userAnswers[i] === m.answer).length;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: theme.bg, color: theme.text, fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      
      {/* SIDEBAR NAVIGATION - Hidden when Articulation Round Starts */}
      {!showArticulation && (
        <aside style={{ width: '280px', borderRight: `1px solid ${theme.border}`, padding: '40px 24px', display: 'flex', flexDirection: 'column', backgroundColor: '#070707' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '1px', color: '#fff' }}>Progress Board</h2>
          </div>
          
          {submitted ? (
            <div style={{ marginBottom: '32px', padding: '20px', borderRadius: '16px', background: theme.card, border: `1px solid ${theme.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <p style={{ color: theme.textMuted, fontSize: '0.65rem', fontWeight: '700', marginBottom: '16px', letterSpacing: '1.5px' }}>PERFORMANCE SUMMARY</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: theme.textMuted }}>Accuracy</span>
                  <span style={{ color: theme.success, fontWeight: '700' }}>{totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: theme.textMuted }}>Attempted</span>
                  <span style={{ color: theme.accent, fontWeight: '700' }}>{attemptedCount}/{totalQuestions}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                <p style={{ color: theme.textMuted, fontSize: '0.7rem', fontWeight: '600' }}>PROGRESS</p>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: theme.accent }}>{Math.round(progressPercent)}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#1a1a1a', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: theme.accent, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 10px ${theme.accent}` }} />
              </div>
            </div>
          )}

          <nav style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {mcqs.map((_, i) => {
              const isAttempted = userAnswers[i];
              const isSkipped = skippedQuestions.includes(i) && !isAttempted;
              const isActive = currentQuestionIndex === i;
              
              return (
                <div key={i} onClick={() => !submitted && setCurrentQuestionIndex(i)} style={{ 
                  padding: '14px 16px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '8px', cursor: submitted ? 'default' : 'pointer',
                  backgroundColor: isActive ? theme.accentMuted : 'transparent',
                  color: isActive ? theme.accent : (isAttempted ? theme.text : theme.textMuted),
                  border: `1px solid ${isActive ? theme.accent : 'transparent'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}>
                  <span style={{ fontWeight: isActive ? '700' : '500' }}>Segment {i + 1}</span>
                  {isAttempted && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.success, boxShadow: `0 0 8px ${theme.success}` }} />}
                  {isSkipped && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.warning, boxShadow: `0 0 8px ${theme.warning}` }} />}
                </div>
              );
            })}
          </nav>
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <main style={{ 
        flex: 1, 
        padding: '60px 40px', 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: showArticulation ? '100vw' : 'auto' 
      }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          
          {/* STEP 1: INITIAL STATE (MANUAL PASTE) */}
          {!mcqs.length && !loading && (
            <div style={{ animation: 'fadeIn 0.8s ease' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '15px', letterSpacing: '-1.5px' }}>Knowledge <span style={{ color: theme.accent }}>Engine.</span></h1>
              <p style={{ color: theme.textMuted, marginBottom: '40px', fontSize: '1.1rem', lineHeight: '1.6' }}>Convert raw transcripts into precision assessments using Llama 4 Scout.</p>
              <textarea
                value={videoText}
                onChange={(e) => setVideoText(e.target.value)}
                placeholder="Paste your transcript segments here..."
                style={{
                  width: '100%', height: '320px', backgroundColor: theme.card, color: '#fff',
                  border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '30px',
                  fontSize: '1.05rem', outline: 'none', marginBottom: '30px', resize: 'none',
                  transition: 'border 0.3s ease', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                }}
              />
              <button onClick={generateMCQ} style={{ width: '100%', padding: '20px', borderRadius: '14px', backgroundColor: theme.accent, color: '#fff', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'transform 0.2s ease' }}>
                Generate Neural Assessment
              </button>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div style={{ textAlign: 'center', marginTop: '15vh' }}>
              <div className="shimmer-box" style={{ width: '100%', height: '400px', backgroundColor: theme.card, borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="spinner" />
                  <p style={{ marginTop: '24px', color: theme.textMuted, fontWeight: '600', letterSpacing: '1px' }}>SYNCHRONIZING SEGMENTS</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACTIVE QUIZ */}
          {mcqs.length > 0 && !submitted && (
            <div style={{ animation: 'slideUp 0.5s ease' }}>
              <div style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: theme.accent, letterSpacing: '2px' }}>QUESTION {currentQuestionIndex + 1} OF {totalQuestions}</span>
                <h2 style={{ fontSize: '2rem', marginTop: '12px', lineHeight: '1.3', fontWeight: '700' }}>
                  {mcqs[currentQuestionIndex].question}
                </h2>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {Object.entries(mcqs[currentQuestionIndex].options).map(([key, value]) => {
                  const isSelected = userAnswers[currentQuestionIndex] === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: key })}
                      style={{
                        textAlign: 'left', padding: '24px 30px', borderRadius: '16px',
                        backgroundColor: isSelected ? theme.accentMuted : theme.card,
                        border: `2px solid ${isSelected ? theme.accent : 'transparent'}`,
                        color: isSelected ? theme.accent : theme.text,
                        cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1.05rem',
                        display: 'flex', alignItems: 'center'
                      }}
                    >
                      <span style={{ marginRight: '20px', width: '30px', height: '30px', borderRadius: '8px', background: isSelected ? theme.accent : '#262626', color: isSelected ? '#fff' : theme.textMuted, display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '0.8rem', transition: '0.2s' }}>{key}</span> 
                      {value}
                    </button>
                  )
                })}
              </div>

              <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => setCurrentQuestionIndex(p => p - 1)}
                  disabled={currentQuestionIndex === 0}
                  style={{ padding: '16px 32px', borderRadius: '12px', background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, opacity: currentQuestionIndex === 0 ? 0 : 1, cursor: 'pointer', fontWeight: '600' }}
                >
                  Previous
                </button>
                <button 
                  onClick={currentQuestionIndex === totalQuestions - 1 ? handleFinalSubmit : handleNext} 
                  style={{ padding: '16px 48px', borderRadius: '12px', background: theme.accent, color: '#fff', fontWeight: '800', border: 'none', cursor: 'pointer', boxShadow: `0 8px 20px ${theme.accent}44` }}
                >
                  {currentQuestionIndex === totalQuestions - 1 ? "Complete Verification" : "Next Segment →"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: HIGH-PRECISION RESULTS + REDIRECT BUTTON */}
          {submitted && !showArticulation && (
            <div style={{ animation: 'fadeIn 0.8s ease' }}>
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Review & <span style={{ color: theme.accent }}>Insights</span></h3>
                <p style={{ color: theme.textMuted, marginTop: '8px' }}>Detailed breakdown of your cognitive alignment.</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {mcqs.map((m, i) => {
                  const userKey = userAnswers[i];
                  const correctKey = m.answer;
                  const isCorrect = userKey === correctKey;

                  return (
                    <div key={i} style={{ padding: '30px', borderRadius: '24px', backgroundColor: theme.card, border: `1px solid ${theme.border}`, transition: 'transform 0.3s ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: theme.textMuted }}>MODULE {i + 1}</span>
                        <span style={{ 
                          fontSize: '0.7rem', padding: '6px 12px', borderRadius: '50px', 
                          backgroundColor: isCorrect ? `${theme.success}22` : userKey ? `${theme.error}22` : `${theme.warning}22`,
                          color: isCorrect ? theme.success : userKey ? theme.error : theme.warning,
                          fontWeight: '800', border: `1px solid ${isCorrect ? theme.success : userKey ? theme.error : theme.warning}44`
                        }}>
                          {isCorrect ? 'CORRECT' : userKey ? 'INCORRECT' : 'SKIPPED'}
                        </span>
                      </div>
                      
                      <p style={{ marginBottom: '24px', fontWeight: '700', fontSize: '1.2rem', lineHeight: '1.5' }}>{m.question}</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '20px', borderLeft: `2px solid ${theme.border}` }}>
                        <div style={{ fontSize: '0.95rem' }}>
                          <span style={{ color: theme.textMuted, display: 'block', fontSize: '0.7rem', fontWeight: '800', marginBottom: '4px' }}>YOUR SELECTION</span>
                          <span style={{ color: isCorrect ? theme.success : theme.error }}>
                            {userKey ? `${userKey}: ${m.options[userKey]}` : "No answer provided"}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div style={{ fontSize: '0.95rem' }}>
                            <span style={{ color: theme.textMuted, display: 'block', fontSize: '0.7rem', fontWeight: '800', marginBottom: '4px' }}>VALIDATED ANSWER</span>
                            <span style={{ color: theme.success }}>{correctKey}: {m.options[correctKey]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* REDIRECT TO ARTICULATION BUTTON */}
              <button 
                onClick={() => setShowArticulation(true)} 
                style={{ marginTop: '50px', width: '100%', padding: '20px', borderRadius: '16px', background: theme.accent, color: '#fff', fontWeight: '800', cursor: 'pointer', border: 'none', boxShadow: `0 8px 20px ${theme.accent}44` }}
              >
                Proceed to Neural Articulation Round →
              </button>

              <button onClick={() => window.location.reload()} style={{ marginTop: '16px', width: '100%', padding: '20px', borderRadius: '16px', border: `1px solid ${theme.accent}`, color: theme.accent, background: 'transparent', fontWeight: '800', cursor: 'pointer', transition: '0.3s' }}>
                Restart Neural Assessment
              </button>
            </div>
          )}

          {/* STEP 4: ARTICULATION ROUND (POST-REDIRECT) */}
          {showArticulation && !articulationAnalysis && (
            <ArticulationRound 
              transcript={videoText} 
              onAnalysisComplete={onArticulationComplete} 
            />
          )}

          {/* STEP 5: ARTICULATION RESULTS */}
          {articulationAnalysis && (
            <ArticulationResults 
              analysis={articulationAnalysis} 
              userText={userSpeechText}
              theme={theme} 
            />
          )}

        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .spinner { width: 50px; height: 50px; border: 4px solid #1a1a1a; border-top-color: #a855f7; border-radius: 50%; animation: spin 1s linear infinite; }
        .shimmer-box::after { content: ""; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent); animation: shimmer 2s infinite; }
        @keyframes shimmer { to { left: 200%; } }
      `}</style>
    </div>
  )
}