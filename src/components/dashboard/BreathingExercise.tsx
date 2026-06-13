import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
}

/**
 * Interactive 4-7-8 Breathing Timer component.
 * Cycles through Inhale (4s), Hold (7s), and Exhale (8s).
 */
export default function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [phase, setPhase] = useState('Inhale');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    let currentPhase = 'Inhale';
    let timeLeft = 4;
    
    const interval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        if (currentPhase === 'Inhale') {
          currentPhase = 'Hold';
          timeLeft = 7;
        } else if (currentPhase === 'Hold') {
          currentPhase = 'Exhale';
          timeLeft = 8;
        } else {
          currentPhase = 'Inhale';
          timeLeft = 4;
        }
        setPhase(currentPhase);
      }
      setTimer(timeLeft);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      data-testid="breathing-exercise-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breathing-title"
      className="glass animate-fade-in-up" 
      style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', width: '100%', maxWidth: '500px' }}
    >
      <button data-testid="breathing-close-btn" aria-label="Close Breathing Exercise" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}>
        <X size={24} aria-hidden="true" />
      </button>
      <h2 id="breathing-title" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>4-7-8 Breathing</h2>
      
      <div data-testid="breathing-circle-animation" className="breathing-circle" style={{ 
        width: '200px', height: '200px', 
        animationDuration: phase === 'Inhale' ? '4s' : phase === 'Exhale' ? '8s' : '0s',
        animationPlayState: phase === 'Hold' ? 'paused' : 'running',
        transform: phase === 'Hold' ? 'scale(1.2)' : undefined
      }}>
        <div style={{ position: 'absolute', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span data-testid="breathing-phase" aria-live="polite" style={{ fontSize: '2rem', fontWeight: 600 }}>{phase}</span>
          <span data-testid="breathing-timer" aria-hidden="true" style={{ fontSize: '3rem', fontWeight: 300 }}>{timer}</span>
        </div>
      </div>
      <p style={{ marginTop: '2rem', opacity: 0.8 }}>Focus on your breath. Let go of the exam stress.</p>
    </div>
  );
}
