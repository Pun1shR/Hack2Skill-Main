import React from 'react';

interface ExamSelectionModalProps {
  availableExams: string[];
  selectedExams: string[];
  onToggleExam: (exam: string) => void;
  onSave: () => void;
}

/**
 * Onboarding modal to select exams before entering the sanctuary.
 */
export default function ExamSelectionModal({ availableExams, selectedExams, onToggleExam, onSave }: ExamSelectionModalProps) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
      <div className="glass animate-fade-in-up" style={{ padding: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 600 }}>Welcome to the Sanctuary.</h2>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Which paths are you preparing for? Select all that apply.</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {availableExams.map(exam => (
            <button 
              key={exam}
              onClick={() => onToggleExam(exam)}
              style={{ 
                padding: '0.8rem 1.5rem', 
                borderRadius: '24px', 
                border: '1px solid var(--border)',
                background: selectedExams.includes(exam) ? 'var(--primary)' : 'var(--input-bg)',
                color: selectedExams.includes(exam) ? 'white' : 'var(--foreground)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: 500
              }}
            >
              {exam}
            </button>
          ))}
        </div>

        <button 
          className="btn" 
          onClick={onSave}
          disabled={selectedExams.length === 0}
          style={{ width: '100%', padding: '1rem', borderRadius: '12px', opacity: selectedExams.length === 0 ? 0.5 : 1 }}
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  );
}
