"use client";
import React, { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";

export default function ArticulationResults() {
  const [analysisData, setAnalysisData] = useState(null);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(true);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
  const [diagnosticSubmitted, setDiagnosticSubmitted] = useState(false);
  const [mainMcqPoints, setMainMcqPoints] = useState(0);

  // Read main MCQ points saved from the previous quiz page (SSR-safe)
  useEffect(() => {
    setMainMcqPoints(Number(localStorage.getItem('mainMcqPoints') || '0'));
  }, []);

  // Theme constants from HTML
  const t = {
    bg: '#181022',
    accent: '#934CF0',
    accentGlow: 'rgba(147, 76, 240, 0.3)',
    glass: 'rgba(147, 76, 240, 0.05)',
    glassBorder: 'rgba(147, 76, 240, 0.1)',
    border: 'rgba(255, 255, 255, 0.1)',
    textMuted: '#94A3B8',
    success: '#10b981',
    error: '#f43f5e',
    warning: '#fbbf24',
  };

  useEffect(() => {
    // Load data from localStorage (saved by articulation-round page)
    const savedData = localStorage.getItem('articulationResult');
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAnalysisData(parsed.analysis);
        setUserText(parsed.userText || "");
        
        // Optional: clean up after loading to avoid stale data
        localStorage.removeItem('articulationResult');
      } catch (err) {
        console.error("Failed to parse saved articulation result:", err);
      }
    }
    
    setLoading(false);
  }, []);

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
        <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -100, right: -100 }} />
        <p style={{ position: 'relative', zIndex: 10, fontWeight: '600', fontSize: '1.1rem' }}>Loading results...</p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.bg,
        color: '#fff',
        textAlign: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="scanline" />
        <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -100, right: -100 }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontWeight: '800', fontSize: '1.5rem' }}>No Results Available</h2>
          <p style={{ color: t.textMuted, marginTop: '16px' }}>
            Please complete an articulation round first.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              marginTop: '24px',
              padding: '16px 32px',
              background: `linear-gradient(135deg, ${t.accent}, #4338CA)`,
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: `0 10px 25px ${t.accentGlow}`,
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    accuracy,
    linguisticMarkers = [],
    feedback,
    diagnosticMCQs = [],
    advancedRecommendations = [],
  } = analysisData;

  const getStatus = () => {
    if (accuracy < 50) return { label: "Articulation Deficit", color: t.error };
    if (accuracy >= 90) return { label: "Explanatory Mastery", color: t.success };
    return { label: "Linguistic Alignment Stable", color: t.accent };
  };

  const status = getStatus();

  const disfluencyCount = linguisticMarkers.length;

  const highlightWords = linguisticMarkers
    .map((item) => {
      const quotedMatch = item.match(/['""]([^'""]+)['"]/);
      if (quotedMatch) return quotedMatch[1];

      const afterColon = item.split(/:\s*/)[1]?.trim();
      return afterColon || "";
    })
    .filter(Boolean);

  const diagnosticCorrectCount = diagnosticMCQs.filter(
    (m, i) => diagnosticAnswers[i] === m.answer
  ).length;

  const totalMCQs = diagnosticMCQs.length || 1;
  const diagnosticScore = (diagnosticCorrectCount / totalMCQs) * 100;

  // ────────────────────────────────────────────────
  // Articulation Points based on accuracy %
  // ────────────────────────────────────────────────
  let articulationPoints = 5; // default/middle
  if (accuracy < 50) articulationPoints = 4;
  else if (accuracy >= 90) articulationPoints = 8;
  else if (accuracy >= 70) articulationPoints = 6;

  // Total points = articulation points + main MCQ points from previous quiz
  const totalPoints = articulationPoints + mainMcqPoints;

  const getVerdict = () => {
    if (diagnosticScore < 40 && accuracy < 40) {
      return "Critical Misalignment: Foundational logic and verbal delivery both require fundamental restructuring.";
    }
    if (diagnosticScore >= 70 && accuracy < 50) {
      return "Conceptual mastery confirmed, but verbal delivery framework requires structural reorganization.";
    }
    if (diagnosticScore < 50 && accuracy >= 50) {
      return "High verbal fluency detected, but underlying conceptual nodes are misaligned with source logic.";
    }
    return "Balanced articulation and conceptual alignment achieved.";
  };

  return (
    <div style={{
      backgroundColor: t.bg,
      color: '#fff',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Theme overlays */}
      <div className="scanline" />
      <div className="orb" style={{ background: '#6B21A8', width: 600, height: 600, top: -100, right: -100 }} />
      <div className="orb" style={{ background: '#4F46E5', width: 800, height: 800, bottom: -200, left: -200 }} />

      <main style={{
        position: 'relative',
        zIndex: 20,
        padding: '48px 5% 80px 5%',
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeSlideIn 1s ease forwards',
      }}>

        {/* ═══ 1. HERO SCORE SECTION ═══ */}
        <section style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '64px',
          paddingTop: '32px',
        }}>
          {/* Left XP badge: Articulation */}
          <div style={{
            position: 'absolute',
            left: '15%',
            top: '50%',
            transform: 'translateY(-50%)',
          }}>
            <div style={{
              background: t.glass,
              backdropFilter: 'blur(12px)',
              border: `1px solid ${t.glassBorder}`,
              borderLeft: `4px solid ${t.accent}`,
              borderRadius: '24px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <span style={{ fontSize: '1.5rem', animation: 'pulse 2s infinite' }}>✦</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  fontFamily: 'monospace',
                  color: t.accent,
                }}>{articulationPoints} XP</span>
                <span style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: t.textMuted,
                  fontWeight: '700',
                }}>Articulation</span>
              </div>
            </div>
          </div>

          {/* Center score */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{
              fontSize: 'clamp(5rem, 12vw, 10rem)',
              fontWeight: '900',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: t.accent,
              margin: 0,
              filter: `drop-shadow(0 0 45px ${t.accentGlow})`,
            }}>
              {accuracy}%
            </h1>
            <div style={{ marginTop: '24px' }}>
              <span style={{
                background: t.glass,
                backdropFilter: 'blur(12px)',
                border: `1px solid ${t.accentGlow}`,
                borderRadius: '24px',
                padding: '8px 32px',
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: t.accent,
              }}>
                {status.label}
              </span>
            </div>
          </div>

          {/* Right XP badge: MCQ */}
          <div style={{
            position: 'absolute',
            right: '15%',
            top: '50%',
            transform: 'translateY(-50%)',
          }}>
            <div style={{
              background: t.glass,
              backdropFilter: 'blur(12px)',
              border: `1px solid ${t.glassBorder}`,
              borderLeft: `4px solid ${t.warning}`,
              borderRadius: '24px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <span style={{ fontSize: '1.5rem', color: t.warning, animation: 'pulse 2s infinite' }}>★</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  fontFamily: 'monospace',
                  color: t.warning,
                }}>{mainMcqPoints} XP</span>
                <span style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: t.textMuted,
                  fontWeight: '700',
                }}>MCQ Logic</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ GRID LAYOUT ═══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '7fr 5fr',
          gap: '32px',
          width: '100%',
          maxWidth: '1400px',
        }}>

          {/* ═══ 2. SPEECH MAP (left, spans full height) ═══ */}
          <div style={{
            background: t.glass,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${t.glassBorder}`,
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gridRow: '1 / 2',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
            }}>
              <h4 style={{
                fontSize: '10px',
                fontWeight: '900',
                color: t.textMuted,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                margin: 0,
              }}>
                Speech & Logic Map
              </h4>
              <span style={{
                background: disfluencyCount > 0 ? t.error : t.success,
                color: '#fff',
                fontSize: '10px',
                fontWeight: '900',
                padding: '6px 16px',
                borderRadius: '999px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: disfluencyCount > 0 ? '0 4px 15px rgba(244, 63, 94, 0.2)' : undefined,
              }}>
                {disfluencyCount} Markers Detected
              </span>
            </div>

            <div style={{
              background: '#050505',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '32px',
              flex: 1,
            }}>
              <div style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: '#cbd5e1',
                fontWeight: '500',
              }}>
                <Highlighter
                  searchWords={highlightWords}
                  autoEscape={true}
                  textToHighlight={userText || ""}
                  highlightStyle={{
                    backgroundColor: "transparent",
                    color: t.error,
                    borderBottom: `2px solid ${t.error}`,
                    fontWeight: "600",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN (Feedback + Recommendations stacked) ═══ */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}>
            {/* 3. EXPLANATORY AUDIT */}
            <div style={{
              background: t.glass,
              backdropFilter: 'blur(12px)',
              border: `1px solid ${t.glassBorder}`,
              borderRadius: '24px',
              padding: '32px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '24px',
              }}>
                <span style={{ color: t.accent, fontSize: '14px' }}>📊</span>
                <h4 style={{
                  fontSize: '10px',
                  fontWeight: '900',
                  color: t.textMuted,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}>
                  Explanatory Audit
                </h4>
              </div>
              <p style={{
                color: '#fff',
                fontSize: '1.05rem',
                lineHeight: '1.7',
                fontWeight: '500',
                margin: 0,
              }}>
                {feedback || "No detailed feedback available."}
              </p>
            </div>

            {/* 4. NEURAL ENHANCEMENTS */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(147, 76, 240, 0.08), transparent)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${t.glassBorder}`,
              borderLeft: `4px solid ${t.accent}`,
              borderRadius: '24px',
              padding: '32px',
            }}>
              <h4 style={{
                fontSize: '10px',
                fontWeight: '900',
                color: t.accent,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                Neural Enhancements
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {advancedRecommendations.slice(0, 3).map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{
                      color: t.accent,
                      fontWeight: '900',
                      fontSize: '1.2rem',
                      fontFamily: 'monospace',
                      flexShrink: 0,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p style={{
                      color: t.textMuted,
                      fontSize: '0.875rem',
                      lineHeight: '1.6',
                      margin: 0,
                    }}>
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ 5. VERDICT BANNER (full width) ═══ */}
          <div style={{
            gridColumn: '1 / -1',
            background: t.glass,
            backdropFilter: 'blur(12px)',
            border: `2px solid ${t.accent}`,
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '48px',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h2 style={{
                fontSize: '1.6rem',
                fontWeight: '800',
                marginBottom: '12px',
                lineHeight: '1.3',
              }}>
                {!diagnosticSubmitted && accuracy < 60 && diagnosticMCQs.length > 0
                  ? "Complete diagnostic below for full verdict."
                  : diagnosticSubmitted ? getVerdict() : getVerdict()}
              </h2>
              <p style={{
                color: t.textMuted,
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}>
                Linguistic Verification Status: {diagnosticSubmitted || accuracy >= 60 ? 'Verified' : 'Pending'}
              </p>
            </div>
            <div style={{
              display: 'flex',
              gap: '1px',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '16px',
              padding: '8px',
            }}>
              <div style={{
                padding: '24px 48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <span style={{
                  fontSize: '10px',
                  color: t.textMuted,
                  letterSpacing: '0.15em',
                  fontWeight: '900',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}>Synthesis</span>
                <span style={{
                  fontSize: '2.8rem',
                  fontWeight: '900',
                  fontFamily: 'monospace',
                  color: t.accent,
                }}>
                  {diagnosticSubmitted ? `${Math.round(diagnosticScore)}%` : '—'}
                </span>
              </div>
              <div style={{
                width: '1px',
                background: 'rgba(255,255,255,0.1)',
                margin: '16px 0',
              }} />
              <div style={{
                padding: '24px 48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <span style={{
                  fontSize: '10px',
                  color: t.textMuted,
                  letterSpacing: '0.15em',
                  fontWeight: '900',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}>Articulation</span>
                <span style={{
                  fontSize: '2.8rem',
                  fontWeight: '900',
                  fontFamily: 'monospace',
                  color: t.accent,
                }}>{accuracy}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* ═══ 6. DIAGNOSTIC MCQs (conditional) ═══ */}
        {accuracy < 60 && diagnosticMCQs.length > 0 && (
          <div style={{ width: '100%', maxWidth: '1200px', marginTop: '48px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '900',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}>
                Deep Synthesis Diagnostic
              </h3>
              <p style={{
                color: t.textMuted,
                fontSize: '11px',
                letterSpacing: '0.3em',
                fontWeight: '700',
              }}>
                COMPLEXITY LEVEL: EXPERT
              </p>
            </div>

            {!diagnosticSubmitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {diagnosticMCQs.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    style={{
                      background: t.glass,
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${t.glassBorder}`,
                      borderRadius: '24px',
                      padding: '48px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: t.glass,
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${t.glassBorder}`,
                      borderRadius: '0 0 0 24px',
                      padding: '8px 16px',
                      color: t.accent,
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                    }}>
                      CHALLENGE {String(qIdx + 1).padStart(2, '0')}
                    </span>
                    <p style={{
                      fontSize: '1.35rem',
                      fontWeight: '700',
                      marginTop: '10px',
                      marginBottom: '32px',
                      lineHeight: '1.4',
                    }}>
                      {q.question}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}>
                      {Object.entries(q.options).map(([key, value]) => {
                        const isSelected = diagnosticAnswers[qIdx] === key;
                        return (
                          <button
                            key={key}
                            onClick={() =>
                              setDiagnosticAnswers((prev) => ({
                                ...prev,
                                [qIdx]: key,
                              }))
                            }
                            className="diagnostic-option"
                            style={{
                              textAlign: 'left',
                              padding: '24px',
                              borderRadius: '24px',
                              background: isSelected ? t.accentGlow : t.glass,
                              backdropFilter: 'blur(12px)',
                              border: `1px solid ${isSelected ? t.accent : 'rgba(255,255,255,0.05)'}`,
                              color: isSelected ? '#fff' : '#cbd5e1',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '24px',
                              fontSize: '0.95rem',
                              lineHeight: '1.5',
                            }}
                          >
                            <div style={{
                              width: '48px',
                              height: '48px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isSelected ? t.accentGlow : t.glass,
                              border: `1px solid ${isSelected ? t.accent : 'rgba(255,255,255,0.1)'}`,
                              borderRadius: '24px',
                              fontWeight: '900',
                              fontFamily: 'monospace',
                              fontSize: '1.1rem',
                              color: isSelected ? t.accent : t.textMuted,
                              flexShrink: 0,
                            }}>
                              {key}
                            </div>
                            <span style={{ fontWeight: '500' }}>{value}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setDiagnosticSubmitted(true)}
                  disabled={Object.keys(diagnosticAnswers).length < diagnosticMCQs.length}
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${t.accent}, #4338CA)`,
                    color: '#fff',
                    fontWeight: '900',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    boxShadow: `0 20px 40px ${t.accentGlow}`,
                    opacity: Object.keys(diagnosticAnswers).length < diagnosticMCQs.length ? 0.3 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  Execute Neural Verification
                </button>
              </div>
            ) : (
              <div style={{
                background: t.glass,
                backdropFilter: 'blur(12px)',
                border: `2px solid ${t.accent}`,
                borderRadius: '40px',
                padding: '50px',
                animation: 'fadeSlideIn 0.5s ease',
              }}>
                <h4 style={{
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '1.5rem',
                  marginBottom: '30px',
                  lineHeight: '1.4',
                }}>
                  {getVerdict()}
                </h4>
                <div style={{
                  display: 'flex',
                  gap: '40px',
                  padding: '30px',
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '20px',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '10px',
                      color: t.textMuted,
                      letterSpacing: '0.15em',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                    }}>
                      SYNTHESIS SCORE
                    </p>
                    <p style={{
                      fontSize: '3rem',
                      fontWeight: '900',
                      fontFamily: 'monospace',
                      color: t.accent,
                      margin: 0,
                    }}>
                      {Math.round(diagnosticScore)}%
                    </p>
                    <p style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: t.textMuted,
                      marginTop: '5px',
                    }}>
                      ({diagnosticCorrectCount} / {diagnosticMCQs.length} CORRECT)
                    </p>
                  </div>
                  <div style={{
                    flex: 1,
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                    paddingLeft: '40px',
                  }}>
                    <p style={{
                      fontSize: '10px',
                      color: t.textMuted,
                      letterSpacing: '0.15em',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                    }}>
                      ARTICULATION SCORE
                    </p>
                    <p style={{
                      fontSize: '3rem',
                      fontWeight: '900',
                      fontFamily: 'monospace',
                      color: t.accent,
                    }}>
                      {accuracy}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ 7. RESTART BUTTON ═══ */}
        <button
          onClick={() => {
            // ────────────────────────────────────────────────
            // When next page is ready, uncomment and use one of these:
            // Option A: Query param (simple)
            // window.location.href = `/next-page?totalPoints=${totalPoints}`;

            // Option B: Save to localStorage + redirect (cleaner)
            // localStorage.setItem('sessionTotalPoints', totalPoints.toString());
            // window.location.href = '/next-page';

            // For now — going to categories as before
            window.location.href = '/categories';
          }}
          className="restart-btn"
          style={{
            marginTop: '64px',
            width: '100%',
            maxWidth: '1400px',
            padding: '24px',
            borderRadius: '16px',
            background: 'transparent',
            border: `1px solid ${t.glassBorder}`,
            color: t.textMuted,
            cursor: 'pointer',
            fontWeight: '900',
            fontSize: '10px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <span style={{ fontSize: '1rem' }}>↻</span>
          Start New Analysis Session
        </button>
      </main>

      {/* Scoped CSS */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .diagnostic-option:hover {
          background: rgba(147, 76, 240, 0.15) !important;
          border-color: #934CF0 !important;
        }
        .restart-btn:hover {
          color: #fff !important;
          border-color: #934CF0 !important;
        }
      `}</style>
    </div>
  );
}