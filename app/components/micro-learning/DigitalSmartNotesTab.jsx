'use client'

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export default function DigitalSmartNotesTab({ 
  player, 
  videoId, 
  theme,
  videoTitle   // ← Now received from parent (page.jsx)
}) {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Load notes
  useEffect(() => {
    if (!videoId) return;
    try {
      const saved = localStorage.getItem(`video-notes-${videoId}`);
      setNotes(saved ? JSON.parse(saved) : []);
    } catch (err) {
      console.error("Failed to load notes", err);
      setNotes([]);
    }
  }, [videoId]);

  // Save notes
  useEffect(() => {
    if (!videoId) return;
    try {
      localStorage.setItem(`video-notes-${videoId}`, JSON.stringify(notes));
    } catch (err) {
      console.error("Failed to save notes", err);
    }
  }, [notes, videoId]);

  // Ctrl+N hotkey
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && 
          e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setShowInput(true);
        setEditingId(null);
        setNoteText('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getCurrentFormattedTime = () => {
    if (!player?.getCurrentTime) return "00:00";
    const secTotal = Math.floor(player.getCurrentTime());
    const min = Math.floor(secTotal / 60).toString().padStart(2, '0');
    const sec = (secTotal % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleAddOrUpdateNote = () => {
    const text = editingId ? editingText.trim() : noteText.trim();
    if (!text) return;

    if (editingId) {
      setNotes(prev => prev.map(n => 
        n.id === editingId ? { ...n, content: text, updatedAt: new Date().toISOString() } : n
      ));
      setEditingId(null);
      setEditingText('');
    } else {
      const timeSec = Math.floor(player?.getCurrentTime?.() ?? 0);
      const newNote = {
        id: Date.now().toString(),
        timestampSec: timeSec,
        timeFormatted: getCurrentFormattedTime(),
        content: text,
        createdAt: new Date().toISOString(),
      };
      setNotes(prev => [...prev, newNote].sort((a, b) => a.timestampSec - b.timestampSec));
      setNoteText('');
    }
    setShowInput(false);
  };

  const handleStartEdit = (note) => {
    setEditingId(note.id);
    setEditingText(note.content);
    setShowInput(true);
  };

  const handleDelete = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleSeek = (seconds) => {
    player?.seekTo?.(seconds, true);
  };

  const exportToPDF = () => {
    if (!notes.length) return;

    const title = videoTitle || `Video Notes - ${videoId}`;
    const date = new Date().toLocaleDateString();

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Video: ${title}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Exported: ${date}`, 20, 30);

    let y = 45;
    notes.forEach(note => {
      const line = `${note.timeFormatted}   ${note.content}`;
      const lines = doc.splitTextToSize(line, 170); // wrap long lines
      doc.text(lines, 20, y);
      y += lines.length * 8 + 4; // spacing

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`notes-${videoId}.pdf`);
  };

  const exportToDOCX = async () => {
    if (!notes.length) return;

    const title = videoTitle || `Video Notes - ${videoId}`;
    const date = new Date().toLocaleDateString();

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: `Video: ${title}`, bold: true, size: 32 })] }),
          new Paragraph({ children: [new TextRun(`Exported: ${date}\n\n`)] }),
          ...notes.map(note => 
            new Paragraph({
              children: [new TextRun(`${note.timeFormatted}   ${note.content}`)],
              spacing: { after: 160 },
            })
          ),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `notes-${videoId}.docx`);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#e2e8f0' }}>
      {/* New Note Button */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 10, 
        padding: '12px 16px', 
        background: theme.sidebar,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => {
            setShowInput(true);
            setEditingId(null);
            setNoteText('');
          }}
          style={{
            background: theme.accent,
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(168,85,247,0.35)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(168,85,247,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(168,85,247,0.35)'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Note
        </button>
      </div>

      {/* Input / Edit Area */}
      {showInput && (
        <div style={{
          background: 'rgba(40,40,60,0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '20px',
          margin: '16px',
          border: `1px solid ${theme.accent}30`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}>
          <textarea
            value={editingId ? editingText : noteText}
            onChange={e => editingId ? setEditingText(e.target.value) : setNoteText(e.target.value)}
            placeholder={editingId ? "Edit your note..." : "Type your note here... (timestamp added automatically)"}
            style={{
              width: '100%',
              minHeight: '120px',
              background: '#111827',
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '14px',
              color: '#f1f5f9',
              fontSize: '1rem',
              resize: 'vertical',
              outline: 'none',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)'
            }}
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={() => { setShowInput(false); setEditingId(null); setNoteText(''); setEditingText(''); }}
              style={{
                background: 'transparent',
                border: `1px solid ${theme.textMuted}`,
                color: theme.textMuted,
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddOrUpdateNote}
              disabled={!(editingId ? editingText.trim() : noteText.trim())}
              style={{
                background: theme.accent,
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '10px',
                cursor: (editingId ? editingText.trim() : noteText.trim()) ? 'pointer' : 'not-allowed',
                opacity: (editingId ? editingText.trim() : noteText.trim()) ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
            >
              {editingId ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        {notes.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: theme.textMuted, 
            padding: '80px 20px', 
            fontSize: '1.1rem',
            fontStyle: 'italic'
          }}>
            No notes yet. Click "New Note" to begin.
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              style={{
                background: 'linear-gradient(145deg, rgba(30,30,50,0.9), rgba(20,20,40,0.9))', // ← improved visibility
                border: `1px solid ${theme.border}`,
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '20px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
                transition: 'all 0.25s ease',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 28px rgba(${theme.accent.replace('#', '').match(/.{2}/g).map(n=>parseInt(n,16)).join(',')},0.25)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div 
                  onClick={() => handleSeek(note.timestampSec)}
                  style={{
                    color: '#fff',
                    fontWeight: '700',
                    background: `${theme.accent}30`,
                    padding: '6px 12px',
                    borderRadius: '10px',
                    minWidth: '64px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {note.timeFormatted}
                </div>
                <div style={{ 
                  flex: 1, 
                  fontSize: '0.97rem', 
                  lineHeight: '1.6', 
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {note.content}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '14px' }}>
                <button
                  onClick={() => handleStartEdit(note)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.12)'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.12)'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Export Buttons */}
      {notes.length > 0 && (
        <div style={{
          position: 'sticky',
          bottom: 0,
          padding: '16px',
          background: theme.sidebar,
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          gap: '16px',
          zIndex: 10
        }}>
          <button
            onClick={exportToPDF}
            style={{
              flex: 1,
              background: `${theme.accent}20`,
              border: `1px solid ${theme.accent}50`,
              color: theme.accent,
              padding: '12px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${theme.accent}35`}
            onMouseLeave={e => e.currentTarget.style.background = `${theme.accent}20`}
          >
            Export to PDF
          </button>
          <button
            onClick={exportToDOCX}
            style={{
              flex: 1,
              background: `${theme.accent}20`,
              border: `1px solid ${theme.accent}50`,
              color: theme.accent,
              padding: '12px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${theme.accent}35`}
            onMouseLeave={e => e.currentTarget.style.background = `${theme.accent}20`}
          >
            Export to Word
          </button>
        </div>
      )}
    </div>
  );
}