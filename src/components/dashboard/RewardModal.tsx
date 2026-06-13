import React from 'react';
import { X } from 'lucide-react';

interface RewardModalProps {
  onClose: () => void;
}

/**
 * Reward modal that appears when the user hits a 5-day checkin streak.
 */
export default function RewardModal({ onClose }: RewardModalProps) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
      <div className="glass animate-fade-in-up" style={{ padding: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center', background: 'linear-gradient(135deg, var(--card-bg), var(--primary-glow))' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}>
          <X size={24} />
        </button>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, color: 'var(--primary)' }}>5-Day Streak! 🌟</h2>
        <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>Your dedication to your mental wellbeing is inspiring. The cosmos rewards consistency!</p>
        
        <div style={{ background: 'var(--input-bg)', padding: '1.5rem', borderRadius: '12px', border: '2px dashed var(--primary)', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>Use this code for 5% off stationary at Faber-Castell India:</p>
          <h3 style={{ fontSize: '2rem', letterSpacing: '4px', fontFamily: 'monospace', margin: 0 }}>GURU5OFF</h3>
        </div>

        <button 
          className="btn" 
          onClick={onClose}
          style={{ width: '100%', padding: '1rem', borderRadius: '12px' }}
        >
          Accept Cosmic Reward
        </button>
      </div>
    </div>
  );
}
