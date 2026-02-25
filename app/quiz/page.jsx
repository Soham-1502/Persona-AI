'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoId = searchParams.get('videoId');

  const [mcqs, setMcqs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skipped, setSkipped] = useState(new Set());
  const [maxReached, setMaxReached] = useState(0);

  // Theme constants from HTML
  const t = {
    bg: '#181022',
    accent: '#934CF0',
    accentEnd: '#4338CA',
    glass: 'rgba(147, 76, 240, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#10b981',
    error: '#f43f5e',
    warning: '#eab308',
    textMuted: '#94a3b8',
  };

  useEffect(() => {
    async function fetchQuiz() {
      if (!videoId) {
        setError('No videoId found in URL');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/mcq?videoId=${videoId}`);
        const data = await res.json();

        if (data.success && data.mcqs?.length > 0) {
          setMcqs(data.mcqs);
        } else {
          setError(data.message || 'No quiz data available');
        }
      } catch (err) {
        console.error('Quiz fetch error:', err);
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [videoId]);

  const handleOptionSelect = (questionIndex, option) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: option }));
    setSkipped(prev => {
      const next = new Set(prev);
      next.delete(questionIndex);
      return next;
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (!selectedAnswers.hasOwnProperty(currentIndex)) {
      setSkipped(prev => new Set(prev).add(currentIndex));
    }
    if (currentIndex < mcqs.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setMaxReached(prev => Math.max(prev, nextIdx));
    }
  };

  const handleSubmit = () => {
    // Mark any unanswered as skipped
    const finalSkipped = new Set(skipped);
    mcqs.forEach((_, idx) => {
      if (!selectedAnswers.hasOwnProperty(idx)) {
        finalSkipped.add(idx);
      }
    });
    setSkipped(finalSkipped);
    setSubmitted(true);

    // Calculate correct count for XP
    const correctCount = mcqs.filter(
      (q, i) => selectedAnswers[i] === q.answer
    ).length;

    // Save to localStorage for articulation-results page
    localStorage.setItem('mainMcqPoints', correctCount.toString());
  };

  // ─── Loading State ───
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.bg,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="scanline" />
        <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -160, left: -160 }} />
        <div className="orb" style={{ background: '#4F46E5', width: 500, height: 500, bottom: -80, right: -80 }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '40px', height: '40px', margin: '0 auto 20px',
            border: `3px solid ${t.border}`, borderTopColor: t.accent,
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Initializing Neural Assessment...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ───
  if (error) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.bg,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="scanline" />
        <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -160, left: -160 }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <p style={{ marginBottom: '20px', color: t.error, fontWeight: '700', fontSize: '1.2rem' }}>{error}</p>
          <button
            onClick={() => router.back()}
            style={{
              padding: '14px 28px', borderRadius: '16px',
              background: `linear-gradient(135deg, ${t.accent}, ${t.accentEnd})`,
              color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(67, 56, 202, 0.3)',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQ = mcqs[currentIndex];
  const answeredOrSkipped = Object.keys(selectedAnswers).length + skipped.size;
  const progress = mcqs.length > 0 ? (answeredOrSkipped / mcqs.length) * 100 : 0;

  // Results calculations
  const correctCount = mcqs.filter((q, i) => selectedAnswers[i] === q.answer).length;
  const attemptedCount = Object.keys(selectedAnswers).length;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  const skippedCount = skipped.size;

  // ─── Results View ───
  if (submitted) {
    return (
      <div style={{
        backgroundColor: t.bg,
        minHeight: '100vh',
        color: '#fff',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="scanline" />
        <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -160, left: -160 }} />
        <div className="orb" style={{ background: '#4F46E5', width: 500, height: 500, bottom: -80, right: -80 }} />

        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Results Header */}
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '32px',
            letterSpacing: '-0.02em',
            background: `linear-gradient(to right, #fff 30%, ${t.accent} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Neural Performance Stats
          </h2>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '48px',
          }}>
            {[
              { label: 'Correct', value: `${correctCount}/${mcqs.length}`, color: t.success },
              { label: 'Attempted', value: `${attemptedCount}/${mcqs.length}`, color: t.accent },
              { label: 'Accuracy', value: `${accuracy}%`, color: '#60a5fa' },
              { label: 'Skipped', value: skippedCount, color: t.warning },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  background: t.glass,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${t.border}`,
                  borderTop: `4px solid ${stat.color}`,
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  animation: `cardEntrance 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${i * 150}ms forwards`,
                  opacity: 0,
                }}
              >
                <p style={{
                  color: t.textMuted,
                  fontSize: '10px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginBottom: '8px',
                }}>{stat.label}</p>
                <p style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  color: '#fff',
                  margin: 0,
                }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* XP Bar */}
          <div style={{
            background: t.glass,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${t.border}`,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: t.textMuted }}>XP Earned</span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: t.accent,
            }}>+{correctCount} XP</span>
          </div>

          {/* Detailed Review */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Detailed Review</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {mcqs.map((q, idx) => {
              const userAnswer = selectedAnswers[idx];
              const isCorrect = userAnswer === q.answer;
              const isSkippedQ = skipped.has(idx);
              let statusLabel, statusColor, statusBg;
              if (isSkippedQ) {
                statusLabel = 'SKIPPED'; statusColor = t.warning; statusBg = 'rgba(234, 179, 8, 0.1)';
              } else if (isCorrect) {
                statusLabel = 'CORRECT'; statusColor = t.success; statusBg = 'rgba(16, 185, 129, 0.1)';
              } else {
                statusLabel = 'INCORRECT'; statusColor = t.error; statusBg = 'rgba(244, 63, 94, 0.1)';
              }

              return (
                <div
                  key={idx}
                  style={{
                    background: t.glass,
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${t.border}`,
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    animation: `cardEntrance 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${idx * 100}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px', lineHeight: '1.4' }}>
                      Q{idx + 1}: {q.question}
                    </p>

                    {isSkippedQ ? (
                      <div style={{ fontSize: '0.85rem' }}>
                        <p style={{ color: t.warning, margin: '0 0 4px 0' }}>⚠ You skipped this question.</p>
                        <p style={{ color: t.success, margin: 0 }}>
                          ✓ Correct Answer (Option {String.fromCharCode(65 + q.options.indexOf(q.answer))}): <span style={{ color: '#fff' }}>{q.answer}</span>
                        </p>
                      </div>
                    ) : isCorrect ? (
                      <div style={{ fontSize: '0.85rem' }}>
                        <p style={{ color: t.success, margin: '0 0 4px 0' }}>
                          ✓ Your Answer (Option {String.fromCharCode(65 + q.options.indexOf(userAnswer))}): <span style={{ color: '#fff' }}>{userAnswer}</span>
                        </p>
                        {q.explanation && <p style={{ color: t.textMuted, margin: 0 }}>{q.explanation}</p>}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.85rem' }}>
                        <p style={{ color: t.error, margin: '0 0 4px 0' }}>
                          ✗ Your Answer (Option {String.fromCharCode(65 + q.options.indexOf(userAnswer))}): <span style={{ color: '#fca5a5' }}>{userAnswer}</span>
                        </p>
                        <p style={{ color: t.success, margin: '0 0 4px 0' }}>
                          ✓ Correct Answer (Option {String.fromCharCode(65 + q.options.indexOf(q.answer))}): <span style={{ color: '#fff' }}>{q.answer}</span>
                        </p>
                        {q.explanation && <p style={{ color: t.textMuted, margin: 0, marginTop: '8px' }}>{q.explanation}</p>}
                      </div>
                    )}
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: '900',
                    background: statusBg,
                    color: statusColor,
                    border: `1px solid ${statusColor}44`,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {statusLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Proceed Button */}
          <button
            onClick={() => {
              const transcript = localStorage.getItem(`transcript_${videoId}`) || '';
              localStorage.setItem('quizTranscript', transcript);
              router.push('/articulation-round');
            }}
            style={{
              width: '100%',
              padding: '20px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${t.accent}, ${t.accentEnd})`,
              color: '#fff',
              border: 'none',
              fontWeight: '900',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(67, 56, 202, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(67, 56, 202, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(67, 56, 202, 0.3)';
            }}
          >
            Proceed to Neural Articulation Round →
          </button>
        </div>

        <style>{`
          @keyframes cardEntrance {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ─── Quiz View ───
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      backgroundColor: t.bg,
      color: '#fff',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Theme overlays */}
      <div className="scanline" />
      <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -160, left: -160 }} />
      <div className="orb" style={{ background: '#4F46E5', width: 500, height: 500, bottom: -80, right: -80 }} />

      {/* ── Sidebar ── */}
      <aside style={{
        width: '280px',
        height: 'calc(100vh - 32px)',
        margin: '16px',
        marginRight: 0,
        background: t.glass,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${t.border}`,
        borderRight: 'none',
        borderRadius: '16px 0 0 16px',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Sidebar Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: `linear-gradient(135deg, ${t.accent}, ${t.accentEnd})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
          }}>🧠</div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>
            Progress Board
          </h2>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
            <p style={{
              fontSize: '10px', fontWeight: '900', letterSpacing: '0.1em',
              color: '#a5b4fc', textTransform: 'uppercase', margin: 0,
            }}>Assessment Neural Path</p>
            <span style={{ fontSize: '12px', fontWeight: '700', color: t.accent }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{
            width: '100%', height: '6px',
            background: 'rgba(0,0,0,0.3)', borderRadius: '999px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: '999px',
              background: t.accent,
              boxShadow: `0 0 10px ${t.accent}`,
              width: `${progress}%`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Segment Nav */}
        <nav style={{
          flex: 1, display: 'flex', flexDirection: 'column', gap: '12px',
          overflowY: 'auto', paddingRight: '8px',
        }} className="quiz-sidebar-scroll">
          {mcqs.map((_, idx) => {
            const isActive = idx === currentIndex;
            const isAnswered = selectedAnswers.hasOwnProperty(idx);
            const isSkippedItem = skipped.has(idx);
            const isAccessible = idx <= maxReached;

            return (
              <div
                key={idx}
                onClick={() => { if (isAccessible) setCurrentIndex(idx); }}
                className={isAccessible ? 'segment-item' : ''}
                style={{
                  background: isActive
                    ? 'rgba(147, 76, 240, 0.1)'
                    : t.glass,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${isActive ? t.accent : t.border}`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isAccessible ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: !isAccessible ? 0.4 : (!isActive && !isAnswered ? 0.7 : 1),
                }}
              >
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: isActive || isAnswered ? '#fff' : t.textMuted,
                }}>
                  Segment {String(idx + 1).padStart(2, '0')}
                </span>
                {isAnswered ? (
                  <span style={{ color: t.success, fontSize: '14px' }}>✓</span>
                ) : isSkippedItem ? (
                  <span style={{ color: t.warning, fontSize: '10px', fontWeight: '800' }}>SKIP</span>
                ) : isActive ? (
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: t.accent, animation: 'pulse 2s infinite',
                  }} />
                ) : (
                  <span style={{ fontSize: '14px', color: t.textMuted }}>🔒</span>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main style={{
        flex: 1,
        height: '100vh',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflowY: 'auto',
        zIndex: 10,
      }} className="quiz-main-scroll">
        <div style={{ width: '100%', maxWidth: '900px', paddingTop: '40px', paddingBottom: '80px' }}>
          {/* Question Header */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{
                padding: '4px 12px',
                background: t.glass,
                backdropFilter: 'blur(12px)',
                border: `1px solid rgba(147, 76, 240, 0.3)`,
                borderRadius: '16px',
                fontSize: '10px',
                fontWeight: '700',
                color: t.accent,
              }}>CORE LOGIC</span>
              <span style={{
                fontSize: '10px',
                color: t.textMuted,
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}>
                Question {String(currentIndex + 1).padStart(2, '0')} of {String(mcqs.length).padStart(2, '0')}
              </span>
            </div>
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              lineHeight: '1.3',
              letterSpacing: '-0.02em',
              margin: 0,
            }}>
              {currentQ?.question}
            </h1>
          </div>

          {/* Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            marginBottom: '64px',
          }}>
            {currentQ?.options?.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === option;
              const labels = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={optIdx}
                  onClick={() => handleOptionSelect(currentIndex, option)}
                  className="option-btn"
                  style={{
                    background: isSelected
                      ? 'rgba(147, 76, 240, 0.15)'
                      : t.glass,
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${isSelected ? t.accent : t.border}`,
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected
                      ? '0 0 30px rgba(147, 76, 240, 0.4)'
                      : 'none',
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: isSelected ? t.accent : t.glass,
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${t.border}`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}>
                    {labels[optIdx]}
                  </div>
                  <span style={{
                    fontSize: '1.05rem',
                    fontWeight: '500',
                    color: isSelected ? '#fff' : '#cbd5e1',
                    lineHeight: '1.5',
                  }}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              style={{
                padding: '16px 32px',
                background: t.glass,
                backdropFilter: 'blur(12px)',
                border: `1px solid rgba(100, 116, 139, 0.3)`,
                borderRadius: '16px',
                color: '#fff',
                fontWeight: '700',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: currentIndex === 0 ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontSize: '0.9rem',
              }}
            >
              ← Previous
            </button>

            {currentIndex === mcqs.length - 1 ? (
              <button
                onClick={handleSubmit}
                style={{
                  padding: '16px 40px',
                  background: `linear-gradient(135deg, ${t.accent}, ${t.accentEnd})`,
                  borderRadius: '16px',
                  color: '#fff',
                  fontWeight: '900',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(67, 56, 202, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Submit Assessment ✓
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  padding: '16px 40px',
                  background: `linear-gradient(135deg, ${t.accent}, ${t.accentEnd})`,
                  borderRadius: '16px',
                  color: '#fff',
                  fontWeight: '900',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(67, 56, 202, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Next Neural Segment →
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Scoped CSS */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .quiz-sidebar-scroll::-webkit-scrollbar,
        .quiz-main-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .quiz-sidebar-scroll::-webkit-scrollbar-track,
        .quiz-main-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .quiz-sidebar-scroll::-webkit-scrollbar-thumb,
        .quiz-main-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .quiz-sidebar-scroll,
        .quiz-main-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .option-btn:hover {
          box-shadow: 0 0 20px rgba(147, 76, 240, 0.2);
          border-color: #934CF0 !important;
        }
        .option-btn:hover div:first-child {
          background: #934CF0 !important;
        }
        .segment-item:hover {
          background: rgba(147, 76, 240, 0.08) !important;
        }
      `}</style>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#181022',
        color: '#fff',
      }}>
        <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Loading Assessment...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}