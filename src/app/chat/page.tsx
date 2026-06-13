'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Send, Moon, Sun, Loader2 } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Chat() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<{role: string, content: string}[]>([{
    role: 'model',
    content: 'Welcome, young seeker. I am your cosmic guide. Take a deep breath. What knowledge do you seek today?'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStressed, setIsStressed] = useState(false);
  
  const [userProfile, setUserProfile] = useState<{preferred_name: string, exams: string[]} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('preferred_name, exams')
        .eq('id', session.user.id)
        .single();
        
      if (data) {
        setUserProfile(data);
      } else {
        router.push('/onboarding');
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStressed]);

  const handleSend = async () => {
    if (!input.trim() || !userProfile) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Simple stress detection for UI animation
    const stressWords = ['stress', 'anxious', 'panic', 'overwhelm', 'scared', 'nervous'];
    if (stressWords.some(word => userMessage.toLowerCase().includes(word))) {
      setIsStressed(true);
      setTimeout(() => setIsStressed(false), 24000); // Show breathing for 24s (3 cycles)
    }

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(1), // omit the hardcoded welcome message
          preferredName: userProfile.preferred_name,
          exams: userProfile.exams
        }),
      });

      if (!response.body) throw new Error("No body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = '';

      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        text += chunkValue;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = text;
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: 'The cosmic connection was briefly interrupted. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Connecting to the cosmos...</div>;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {theme === 'dark' && (
        <>
          <div className="cosmic-particle" style={{ top: '15%', left: '10%', width: '3px', height: '3px', '--duration': '4s' } as any}></div>
          <div className="cosmic-particle" style={{ top: '45%', left: '85%', width: '4px', height: '4px', '--duration': '6s' } as any}></div>
          <div className="cosmic-particle" style={{ top: '80%', left: '20%', width: '5px', height: '5px', '--duration': '3s' } as any}></div>
        </>
      )}

      <header className="glass" style={{ margin: '1rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Cosmic Guru</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '75%',
            padding: '1rem 1.5rem',
            borderRadius: '20px',
            backgroundColor: m.role === 'user' ? 'var(--user-bubble)' : 'var(--guru-bubble)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            border: '1px solid var(--border)',
            lineHeight: 1.5
          }}>
            {m.content}
          </div>
        ))}
        
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '1rem 1.5rem' }}>
            <Loader2 className="animate-spin" size={20} style={{ animation: 'spin 2s linear infinite' }} />
          </div>
        )}

        {isStressed && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
            <p style={{ opacity: 0.7, marginBottom: '1rem' }}>Breathe with me...</p>
            <div className="breathing-circle"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer style={{ padding: '1.5rem 2rem' }}>
        <div className="glass" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', borderRadius: '24px' }}>
          <input 
            type="text" 
            className="input-field"
            style={{ flex: 1, border: 'none', background: 'transparent', boxShadow: 'none' }}
            placeholder="Seek guidance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="btn" 
            style={{ borderRadius: '20px', padding: '10px 20px' }}
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
