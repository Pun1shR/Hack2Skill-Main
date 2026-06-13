import React, { useState } from 'react';
import { X, CheckSquare, Square } from 'lucide-react';

interface GroundingExerciseProps {
  onClose: () => void;
}

/**
 * 5-4-3-2-1 Grounding checklist component for anxiety relief.
 */
export default function GroundingExercise({ onClose }: GroundingExerciseProps) {
  const [checked, setChecked] = useState<number[]>([]);
  
  const steps = [
    { label: "Find 5 things you can see around you." },
    { label: "Find 4 things you can physically feel." },
    { label: "Find 3 things you can hear right now." },
    { label: "Find 2 things you can smell." },
    { label: "Find 1 good thing you can taste or imagine tasting." }
  ];

  const toggle = (i: number) => {
    if (checked.includes(i)) setChecked(checked.filter(n => n !== i));
    else setChecked([...checked, i]);
  };

  return (
    <div className="glass animate-fade-in-up" style={{ padding: '2rem', position: 'relative', width: '100%', maxWidth: '500px' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}>
        <X size={24} />
      </button>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>5-4-3-2-1 Grounding</h2>
      <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Look away from the screen and check these off as you find them.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.map((step, index) => {
          const isChecked = checked.includes(index);
          return (
            <div 
              key={index} 
              onClick={() => toggle(index)} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                background: isChecked ? 'var(--primary-glow)' : 'var(--input-bg)', 
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease' 
              }}>
              {isChecked ? <CheckSquare color="var(--primary)" /> : <Square opacity={0.5} />}
              <span style={{ textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.6 : 1 }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {checked.length === 5 && <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>You are safe. You are grounded.</p>}
    </div>
  );
}
