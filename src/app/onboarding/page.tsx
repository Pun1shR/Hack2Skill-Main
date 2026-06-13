'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const EXAMS = ['NEET', 'CUET', 'JEE', 'CAT', 'GATE', 'UPSC'];

export default function Onboarding() {
  const router = useRouter();
  const [preferredName, setPreferredName] = useState('');
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUserId(session.user.id);
        
        // Check if already onboarded
        const { data } = await supabase
          .from('users')
          .select('preferred_name, exams')
          .eq('id', session.user.id)
          .single();
          
        if (data && data.preferred_name) {
          router.push('/chat');
        }
      }
    };
    fetchUser();
  }, [router]);

  const toggleExam = (exam: string) => {
    setSelectedExams(prev => 
      prev.includes(exam) ? prev.filter(e => e !== exam) : [...prev, exam]
    );
  };

  const handleSave = async () => {
    if (!preferredName || selectedExams.length === 0 || !userId) return;
    setLoading(true);

    const { error } = await supabase
      .from('users')
      .upsert({ 
        id: userId, 
        preferred_name: preferredName, 
        exams: selectedExams 
      });

    setLoading(false);
    
    if (!error) {
      router.push('/chat');
    } else {
      console.error(error);
      alert('Failed to save profile. Please try again.');
    }
  };

  if (!userId) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass" style={{ padding: '3rem', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 600 }}>Welcome, seeker of knowledge</h1>
        <p style={{ marginBottom: '2rem', opacity: 0.8 }}>Before we begin our journey, tell me how I should address you and what mountains you are preparing to climb.</p>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>What is your preferred name?</label>
          <input 
            type="text" 
            className="input-field" 
            style={{ width: '100%' }}
            placeholder="e.g. Arjun"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select your entrance exams:</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {EXAMS.map(exam => (
              <button
                key={exam}
                onClick={() => toggleExam(exam)}
                style={{
                  background: selectedExams.includes(exam) ? 'var(--primary)' : 'var(--input-bg)',
                  color: selectedExams.includes(exam) ? '#fff' : 'inherit',
                  border: `1px solid var(--border)`,
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {exam}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="btn" 
          onClick={handleSave} 
          disabled={!preferredName || selectedExams.length === 0 || loading}
          style={{ width: '100%', opacity: (!preferredName || selectedExams.length === 0 || loading) ? 0.5 : 1 }}
        >
          {loading ? 'Aligning the stars...' : 'Begin Journey'}
        </button>
      </div>
    </div>
  );
}
