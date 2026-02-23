'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MCQRound() {
  const router = useRouter()

  const [mcqs, setMcqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [skippedQuestions, setSkippedQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

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

  // Fetch pre-generated MCQs
  useEffect(() => {
    const fetchCachedQuiz = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const videoId = urlParams.get('videoId')

      if (!videoId) {
        console.error("No videoId in URL")
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/mcq?videoId=${videoId}`)
        const data = await response.json()

        if (data.success && data.mcqs && data.mcqs.length > 0) {
          setMcqs(data.mcqs)
          localStorage.removeItem('quizTranscript')
          console.log("✅ Loaded", data.mcqs.length, "MCQs from cache")
        } else {
          console.warn("No cached MCQs found")
        }
      } catch (err) {
        console.error("Failed to load MCQs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCachedQuiz()
  }, [])

  const totalQuestions = mcqs.length
  const interactionCount = Object.keys(userAnswers).length + skippedQuestions.filter(i => !userAnswers[i]).length
  const progressPercent = totalQuestions > 0 ? (interactionCount / totalQuestions) * 100 : 0

  const attemptedCount = Object.keys(userAnswers).length

  const correctCount = mcqs.filter((m, i) => {
    const selectedValue = userAnswers[i] !== undefined ? m.options[parseInt(userAnswers[i])] : null
    return selectedValue === m.answer
  }).length

  // XP = number of correct answers
  const xpEarned = submitted ? correctCount : 0

  const handleNext = () => {
    if (!userAnswers[currentQuestionIndex]) {
      setSkippedQuestions(prev => [...new Set([...prev, currentQuestionIndex])])
    }
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleFinalSubmit = () => {
    if (!userAnswers[currentQuestionIndex]) {
      setSkippedQuestions(prev => [...new Set([...prev, currentQuestionIndex])])
    }
    setSubmitted(true)
  }

  const getLetter = (index) => String.fromCharCode(65 + index)

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg, color: theme.text }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '24px', color: theme.textMuted, fontWeight: '600', letterSpacing: '1px' }}>
            Loading Neural Assessment...
          </p>
        </div>
      </div>
    )
  }

  if (mcqs.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg, color: theme.text }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>No Assessment Available</h2>
          <p style={{ color: theme.textMuted, marginBottom: '24px' }}>
            MCQs not generated yet or cache expired.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{ padding: '16px 32px', background: theme.accent, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
          >
            ← Back to Video
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: theme.bg, color: theme.text, fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>

      {/* SIDEBAR */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: theme.textMuted }}>Growth Points</span>
                <span style={{ color: '#fbbf24', fontWeight: '700' }}>{xpEarned} XP</span>
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
            const isAttempted = userAnswers[i] !== undefined
            const isSkipped = skippedQuestions.includes(i) && !isAttempted
            const isActive = currentQuestionIndex === i

            return (
              <div
                key={i}
                onClick={() => !submitted && setCurrentQuestionIndex(i)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                  cursor: submitted ? 'default' : 'pointer',
                  backgroundColor: isActive ? theme.accentMuted : 'transparent',
                  color: isActive ? theme.accent : (isAttempted ? theme.text : theme.textMuted),
                  border: `1px solid ${isActive ? theme.accent : 'transparent'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontWeight: isActive ? '700' : '500' }}>Segment {i + 1}</span>
                {isAttempted && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.success, boxShadow: `0 0 8px ${theme.success}` }} />}
                {isSkipped && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.warning, boxShadow: `0 0 8px ${theme.warning}` }} />}
              </div>
            )
          })}
        </nav>
      </aside>

      <main style={{
        flex: 1,
        padding: '60px 40px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>

          {/* ACTIVE QUIZ */}
          {mcqs.length > 0 && !submitted && (
            <div style={{ animation: 'slideUp 0.5s ease' }}>
              <div style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: theme.accent, letterSpacing: '2px' }}>
                  QUESTION {currentQuestionIndex + 1} OF {totalQuestions}
                </span>
                <h2 style={{ fontSize: '2rem', marginTop: '12px', lineHeight: '1.3', fontWeight: '700' }}>
                  {mcqs[currentQuestionIndex].question}
                </h2>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {mcqs[currentQuestionIndex].options.map((value, index) => {
                  const letter = getLetter(index)
                  const isSelected = userAnswers[currentQuestionIndex] === index.toString()

                  return (
                    <button
                      key={index}
                      onClick={() => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: index.toString() })}
                      style={{
                        textAlign: 'left',
                        padding: '24px 30px',
                        borderRadius: '16px',
                        backgroundColor: isSelected ? theme.accentMuted : theme.card,
                        border: `2px solid ${isSelected ? theme.accent : 'transparent'}`,
                        color: isSelected ? theme.accent : theme.text,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '1.05rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{
                        marginRight: '20px',
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: isSelected ? theme.accent : '#262626',
                        color: isSelected ? '#fff' : theme.textMuted,
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        transition: '0.2s'
                      }}>
                        {letter}
                      </span>
                      {value}
                    </button>
                  )
                })}
              </div>

              <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                  disabled={currentQuestionIndex === 0}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    background: 'transparent',
                    border: `1px solid ${theme.border}`,
                    color: theme.textMuted,
                    opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                    cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={currentQuestionIndex === totalQuestions - 1 ? handleFinalSubmit : handleNext}
                  style={{
                    padding: '16px 48px',
                    borderRadius: '12px',
                    background: theme.accent,
                    color: '#fff',
                    fontWeight: '800',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: `0 8px 20px ${theme.accent}44`
                  }}
                >
                  {currentQuestionIndex === totalQuestions - 1 ? "Submit & Review" : "Next →"}
                </button>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {submitted && (
            <div style={{ animation: 'fadeIn 0.8s ease' }}>
              {/* Score Summary Card */}
              <div style={{ marginBottom: '32px', padding: '24px', borderRadius: '16px', background: theme.card, border: `1px solid ${theme.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                <h4 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#fff' }}>Your Performance</h4>
                <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '2.8rem', fontWeight: '800', color: theme.success }}>{correctCount}</div>
                    <div style={{ fontSize: '0.95rem', color: theme.textMuted }}>Correct</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2.8rem', fontWeight: '800', color: theme.accent }}>{attemptedCount}</div>
                    <div style={{ fontSize: '0.95rem', color: theme.textMuted }}>Attempted</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2.8rem', fontWeight: '800', color: theme.warning }}>
                      {totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0}%
                    </div>
                    <div style={{ fontSize: '0.95rem', color: theme.textMuted }}>Accuracy</div>
                  </div>
                </div>
              </div>

              {/* Review & Insights header with small XP badge on the right */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
                    Detailed Review & <span style={{ color: theme.accent }}>Insights</span>
                  </h3>
                  <p style={{ color: theme.textMuted, marginTop: '6px', fontSize: '0.95rem' }}>
                    See how you performed on each segment.
                  </p>
                </div>

                {/* Compact Growth Points display */}
                <div style={{
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: `1px solid ${theme.accentMuted}`,
                  borderRadius: '12px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: '700',
                  color: '#fbbf24'
                }}>
                  <span style={{ fontSize: '1.3rem' }}>★</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: theme.textMuted, lineHeight: '1' }}>GROWTH</div>
                    <div style={{ fontSize: '1.35rem', lineHeight: '1' }}>{xpEarned} XP</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {mcqs.map((m, i) => {
                  const selectedKey = userAnswers[i]
                  const selectedValue = selectedKey !== undefined ? m.options[parseInt(selectedKey)] : null
                  const correctValue = m.answer
                  const isCorrect = selectedValue === correctValue
                  const selectedLetter = selectedKey !== undefined ? getLetter(parseInt(selectedKey)) : null

                  // Calculate correct letter for VALIDATED ANSWER
                  const correctIndex = m.options.findIndex(opt => opt === correctValue)
                  const correctLetter = correctIndex !== -1 ? getLetter(correctIndex) : '?'

                  return (
                    <div key={i} style={{ padding: '30px', borderRadius: '24px', backgroundColor: theme.card, border: `1px solid ${theme.border}`, transition: 'transform 0.3s ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: theme.textMuted }}>MODULE {i + 1}</span>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '6px 12px',
                          borderRadius: '50px',
                          backgroundColor: isCorrect ? `${theme.success}22` : selectedValue ? `${theme.error}22` : `${theme.warning}22`,
                          color: isCorrect ? theme.success : selectedValue ? theme.error : theme.warning,
                          fontWeight: '800',
                          border: `1px solid ${isCorrect ? theme.success : selectedValue ? theme.error : theme.warning}44`
                        }}>
                          {isCorrect ? 'CORRECT' : selectedValue ? 'INCORRECT' : 'SKIPPED'}
                        </span>
                      </div>

                      <p style={{ marginBottom: '24px', fontWeight: '700', fontSize: '1.2rem', lineHeight: '1.5' }}>{m.question}</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '20px', borderLeft: `2px solid ${theme.border}` }}>
                        <div style={{ fontSize: '0.95rem' }}>
                          <span style={{ color: theme.textMuted, display: 'block', fontSize: '0.7rem', fontWeight: '800', marginBottom: '4px' }}>YOUR SELECTION</span>
                          <span style={{ color: isCorrect ? theme.success : theme.error }}>
                            {selectedValue ? `${selectedLetter}: ${selectedValue}` : "No answer provided"}
                          </span>
                        </div>

                        {/* Updated: Show letter + text for correct answer when wrong/skipped */}
                        {!isCorrect && selectedValue && (
                          <div style={{ fontSize: '0.95rem' }}>
                            <span style={{ color: theme.textMuted, display: 'block', fontSize: '0.7rem', fontWeight: '800', marginBottom: '4px' }}>
                              VALIDATED ANSWER
                            </span>
                            <span style={{ color: theme.success }}>
                              {correctLetter}: {correctValue}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => {
                  const transcript = mcqs
                    .map(m => m.question + " " + m.options[m.answer])
                    .join("\n\n")

                  localStorage.setItem('quizTranscript', transcript)
                  localStorage.setItem('mainMcqPoints', xpEarned.toString()) // ← SAVE XP HERE

                  router.push('/articulation-round')
                }}
                style={{
                  marginTop: '50px',
                  width: '100%',
                  padding: '20px',
                  borderRadius: '16px',
                  background: theme.accent,
                  color: '#fff',
                  fontWeight: '800',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: `0 8px 20px ${theme.accent}44`
                }}
              >
                Proceed to Neural Articulation Round →
              </button>

              <button
                onClick={() => window.history.back()}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  padding: '20px',
                  borderRadius: '16px',
                  border: `1px solid ${theme.accent}`,
                  color: theme.accent,
                  background: 'transparent',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                ← Back to Video
              </button>
            </div>
          )}

        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .spinner { width: 50px; height: 50px; border: 4px solid #1a1a1a; border-top-color: #a855f7; border-radius: 50%; animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}

function getLetter(index) {
  return String.fromCharCode(65 + index)
}