"use client";
import React, { useState } from "react";
import Highlighter from "react-highlight-words";

export default function ArticulationResults({ analysis, userText, theme }) {
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
  const [diagnosticSubmitted, setDiagnosticSubmitted] = useState(false);

  const {
    accuracy,
    linguisticMarkers = [],
    clutterFound = [],
    feedback,
    diagnosticMCQs,
    advancedRecommendations,
  } = analysis;

  const getStatus = () => {
    if (accuracy < 50)
      return { label: "Articulation Deficit", color: theme.error };
    if (accuracy >= 90)
      return { label: "Explanatory Mastery", color: theme.success };
    return { label: "Linguistic Alignment Stable", color: theme.accent };
  };
  const status = getStatus();

  // FIX: Merge markers safely and ensure it's an array
  const allMarkers = [...(linguisticMarkers || []), ...(clutterFound || [])];
  const disfluencyCount = allMarkers.length;

  // FIX: Provide clean strings to the highlighter. 
  // We use strings here because react-highlight-words handles the regex creation internally.
  const highlightWords = allMarkers
    .map((item) => {
      // Extract word from quotes or after a colon
      const match = item.match(/['"]([^'"]+)['"]/);
      const word = match ? match[1] : item.replace(/.*:\s*/, "").trim();
      return word; 
    })
    .filter(Boolean); // Remove null/empty entries

  const diagnosticCorrectCount =
    diagnosticMCQs?.filter((m, i) => diagnosticAnswers[i] === m.answer)
      .length || 0;
  
  const totalMCQs = diagnosticMCQs?.length || 1;
  const diagnosticScore = (diagnosticCorrectCount / totalMCQs) * 100;

  const getVerdict = () => {
    if (diagnosticScore < 40 && accuracy < 40) {
      return "Critical Misalignment: Foundational logic and verbal delivery both require fundamental restructuring.";
    }
    if (diagnosticScore >= 70 && accuracy < 50) {
      return "Conceptual mastery confirmed, but verbal delivery framework requires structural reorganization.";
    } else if (diagnosticScore < 50 && accuracy >= 50) {
      return "High verbal fluency detected, but underlying conceptual nodes are misaligned with source logic.";
    }
    return "Balanced articulation and conceptual alignment achieved.";
  };

  return (
    <div
      style={{
        animation: "fadeIn 1s ease",
        width: "98dvw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50dvw",
        marginRight: "-50dvw",
        padding: "40px 10% 80px 10%",
        boxSizing: "border-box",
      }}
    >
      {/* 1. HERO SCORE SECTION */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1
          style={{
            fontSize: "6rem",
            fontWeight: "900",
            color: status.color,
            textShadow: `0 0 40px ${status.color}33`,
            margin: 0,
            letterSpacing: "-4px",
          }}
        >
          {accuracy}%
        </h1>
        <div style={{ marginTop: "10px" }}>
          <span
            style={{
              padding: "8px 24px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontWeight: "900",
              letterSpacing: "3px",
              textTransform: "uppercase",
              border: `1px solid ${status.color}33`,
              color: status.color,
              background: `${status.color}10`,
              backdropFilter: "blur(10px)",
            }}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "30px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* 2. SPEECH MAP */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            padding: "40px",
            borderRadius: "32px",
            border: `1px solid ${theme.border}`,
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "25px",
              alignItems: "center",
            }}
          >
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: "900",
                color: theme.textMuted,
                letterSpacing: "2px",
              }}
            >
              SPEECH & LOGIC MAP
            </h4>
            <span
              style={{
                padding: "6px 16px",
                background: disfluencyCount > 0 ? theme.error : theme.success,
                color: "#fff",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: "900",
              }}
            >
              {disfluencyCount} MARKERS DETECTED
            </span>
          </div>

          <div
            style={{
              lineHeight: "1.8",
              color: "#eee",
              fontSize: "1.2rem",
              backgroundColor: "rgba(0,0,0,0.4)",
              padding: "35px",
              borderRadius: "20px",
              border: `1px solid rgba(255,255,255,0.05)`,
            }}
          >
            <Highlighter
              searchWords={highlightWords}
              autoEscape={true}
              textToHighlight={userText}
              highlightStyle={{
                backgroundColor: "transparent",
                color: theme.error,
                borderBottom: `2px solid ${theme.error}`,
                fontWeight: "600",
              }}
            />
          </div>
        </div>

        {/* 3. STACKED ANALYSIS SECTION */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}
        >
          <div
            style={{
              backgroundColor: theme.card,
              padding: "40px",
              borderRadius: "32px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: "900",
                color: theme.textMuted,
                letterSpacing: "2px",
                marginBottom: "20px",
              }}
            >
              EXPLANATORY AUDIT
            </h4>
            <p
              style={{
                color: "#fff",
                fontSize: "1.1rem",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {feedback}
            </p>
          </div>

          <div
            style={{
              padding: "40px",
              background: `linear-gradient(145deg, ${theme.card}, transparent)`,
              borderRadius: "32px",
              border: `1px solid ${theme.accent}22`,
            }}
          >
            <p
              style={{
                color: theme.accent,
                fontWeight: "900",
                fontSize: "0.75rem",
                marginBottom: "25px",
                letterSpacing: "1px",
              }}
            >
              ENHANCEMENTS:
            </p>
            {advancedRecommendations?.slice(0, 3).map((rec, i) => (
              <div
                key={i}
                style={{
                  color: "#ccc",
                  fontSize: "1rem",
                  marginBottom: "15px",
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: theme.accent, fontWeight: "900" }}>
                  0{i + 1}
                </span>
                <span style={{ lineHeight: "1.5" }}>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. DEEP SYNTHESIS DIAGNOSTIC */}
        {accuracy < 60 && diagnosticMCQs?.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h3
                style={{
                  fontSize: "2rem",
                  fontWeight: "900",
                  marginBottom: "10px",
                }}
              >
                Deep Synthesis Diagnostic
              </h3>
              <p
                style={{
                  color: theme.textMuted,
                  fontSize: "0.8rem",
                  letterSpacing: "1px",
                }}
              >
                COMPLEXITY LEVEL: EXPERT
              </p>
            </div>

            {!diagnosticSubmitted ? (
              <div style={{ display: "grid", gap: "25px" }}>
                {diagnosticMCQs.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    style={{
                      backgroundColor: theme.card,
                      padding: "45px",
                      borderRadius: "32px",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <span
                      style={{
                        color: theme.accent,
                        fontSize: "0.7rem",
                        fontWeight: "900",
                        letterSpacing: "2px",
                      }}
                    >
                      CHALLENGE 0{qIdx + 1}
                    </span>
                    <p
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "700",
                        marginTop: "10px",
                        marginBottom: "30px",
                        lineHeight: "1.4",
                      }}
                    >
                      {q.question}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "15px",
                      }}
                    >
                      {Object.entries(q.options).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() =>
                            setDiagnosticAnswers({
                              ...diagnosticAnswers,
                              [qIdx]: key,
                            })
                          }
                          style={{
                            textAlign: "left",
                            padding: "25px",
                            borderRadius: "16px",
                            backgroundColor:
                              diagnosticAnswers[qIdx] === key
                                ? `${theme.accent}15`
                                : "rgba(255,255,255,0.02)",
                            border: `1px solid ${diagnosticAnswers[qIdx] === key ? theme.accent : "rgba(255,255,255,0.08)"}`,
                            color:
                              diagnosticAnswers[qIdx] === key ? "#fff" : "#aaa",
                            cursor: "pointer",
                            transition: "0.3s",
                            fontSize: "1.05rem",
                            lineHeight: "1.5",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "900",
                              marginRight: "20px",
                              color: theme.accent,
                            }}
                          >
                            {key}
                          </span>{" "}
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setDiagnosticSubmitted(true)}
                  disabled={
                    Object.keys(diagnosticAnswers).length <
                    diagnosticMCQs.length
                  }
                  style={{
                    padding: "30px",
                    borderRadius: "20px",
                    background: theme.accent,
                    color: "#fff",
                    fontWeight: "900",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    boxShadow: `0 20px 40px ${theme.accent}33`,
                    opacity:
                      Object.keys(diagnosticAnswers).length <
                      diagnosticMCQs.length
                        ? 0.4
                        : 1,
                  }}
                >
                  Execute Neural Verification
                </button>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: theme.card,
                  padding: "50px",
                  borderRadius: "40px",
                  border: `2px solid ${theme.accent}`,
                  animation: "fadeIn 0.5s ease",
                }}
              >
                <h4
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: "1.6rem",
                    marginBottom: "30px",
                    lineHeight: "1.4",
                  }}
                >
                  {getVerdict()}
                </h4>
                <div
                  style={{
                    display: "flex",
                    gap: "40px",
                    padding: "30px",
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: "20px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: theme.textMuted,
                        letterSpacing: "1px",
                      }}
                    >
                      SYNTHESIS SCORE
                    </p>
                    <p
                      style={{
                        fontSize: "3rem",
                        fontWeight: "900",
                        color: theme.accent,
                        margin: 0,
                      }}
                    >
                      {Math.round(diagnosticScore)}%
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        color: theme.textMuted,
                        marginTop: "5px",
                      }}
                    >
                      ({diagnosticCorrectCount} / {diagnosticMCQs.length} CORRECT)
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      borderLeft: `1px solid rgba(255,255,255,0.1)`,
                      paddingLeft: "40px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: theme.textMuted,
                        letterSpacing: "1px",
                      }}
                    >
                      ARTICULATION SCORE
                    </p>
                    <p
                      style={{
                        fontSize: "3rem",
                        fontWeight: "900",
                        color: theme.accent,
                      }}
                    >
                      {accuracy}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "60px",
          width: "100%",
          maxWidth: "1200px",
          display: "block",
          margin: "60px auto 0 auto",
          padding: "25px",
          borderRadius: "20px",
          border: `1px solid ${theme.border}`,
          background: "transparent",
          color: theme.textMuted,
          cursor: "pointer",
          fontWeight: "900",
          fontSize: "0.9rem",
          letterSpacing: "3px",
        }}
      >
        START NEW ANALYSIS
      </button>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}