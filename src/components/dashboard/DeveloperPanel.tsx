import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCcw, Award, AlertTriangle, Trash2, X } from 'lucide-react';

interface DeveloperPanelProps {
  onClearData: () => void;
  onSetStreak: () => void;
  onResetStreak: () => void;
  onTriggerAnxiety: () => void;
}

/**
 * A hidden developer panel for QA testing.
 * Toggled via Ctrl+Shift+D (or Cmd+Shift+D on Mac).
 */
export default function DeveloperPanel({ 
  onClearData, 
  onSetStreak, 
  onResetStreak, 
  onTriggerAnxiety 
}: DeveloperPanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      data-testid="developer-panel"
      role="dialog" 
      aria-label="Developer Tools"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'var(--card-bg)',
        border: '2px solid var(--primary)',
        borderRadius: '12px',
        padding: '1.5rem',
        zIndex: 9999,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        width: '300px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
          <Terminal size={18} /> DevTools
        </div>
        <button 
          onClick={() => setIsVisible(false)} 
          aria-label="Close Developer Panel"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button 
          data-testid="dev-set-streak"
          onClick={onSetStreak}
          className="btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.85rem' }}
        >
          <Award size={14} /> Force 5-Day Streak
        </button>
        
        <button 
          data-testid="dev-reset-streak"
          onClick={onResetStreak}
          className="btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.85rem', background: 'var(--input-bg)', color: 'var(--foreground)' }}
        >
          <RefreshCcw size={14} /> Reset Streak
        </button>

        <button 
          data-testid="dev-trigger-anxiety"
          onClick={onTriggerAnxiety}
          className="btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.85rem', background: '#ff6b6b', color: 'white' }}
        >
          <AlertTriangle size={14} /> Trigger Anxiety Mode
        </button>

        <button 
          data-testid="dev-clear-data"
          onClick={onClearData}
          className="btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.85rem', background: '#e03131', color: 'white', marginTop: '1rem' }}
        >
          <Trash2 size={14} /> Hard Reset App
        </button>
      </div>
    </div>
  );
}
