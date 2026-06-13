'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Moon, Sun, Loader2, LogOut, Heart, BookOpen, Wind, X, CheckSquare, Square } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { USERS, User } from '@/lib/db';
import Image from 'next/image';

// Types for Blogs
interface Blog {
  title: string;
  link: string;
  source: string;
}

// Sub-components for Exercises
function BreathingExercise({ onClose }: { onClose: () => void }) {
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
    <div className="glass animate-fade-in-up" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', width: '100%', maxWidth: '500px' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}>
        <X size={24} />
      </button>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>4-7-8 Breathing</h2>
      
      <div className="breathing-circle" style={{ 
        width: '200px', height: '200px', 
        animationDuration: phase === 'Inhale' ? '4s' : phase === 'Exhale' ? '8s' : '0s',
        animationPlayState: phase === 'Hold' ? 'paused' : 'running',
        transform: phase === 'Hold' ? 'scale(1.2)' : undefined
      }}>
        <div style={{ position: 'absolute', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '2rem', fontWeight: 600 }}>{phase}</span>
          <span style={{ fontSize: '3rem', fontWeight: 300 }}>{timer}</span>
        </div>
      </div>
      <p style={{ marginTop: '2rem', opacity: 0.8 }}>Focus on your breath. Let go of the exam stress.</p>
    </div>
  );
}

function GroundingExercise({ onClose }: { onClose: () => void }) {
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
        {steps.map((step, i) => (
          <div key={i} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: checked.includes(i) ? 'var(--primary-glow)' : 'var(--input-bg)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            {checked.includes(i) ? <CheckSquare color="var(--primary)" /> : <Square opacity={0.5} />}
            <span style={{ textDecoration: checked.includes(i) ? 'line-through' : 'none', opacity: checked.includes(i) ? 0.6 : 1 }}>{step.label}</span>
          </div>
        ))}
      </div>
      {checked.length === 5 && <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>You are safe. You are grounded.</p>}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  const [messages, setMessages] = useState<{role: string, content: string}[]>([{
    role: 'model',
    content: 'Welcome, young seeker. I am your cosmic guide. How may I assist you on your journey today?'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStressed, setIsStressed] = useState(false);
  
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New states for Advanced Features
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('guru_user_id');
    if (!userId || !USERS[userId]) {
      router.push('/login');
    } else {
      setUserProfile(USERS[userId]);
    }
  }, [router]);

  // Scrape blogs on load
  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setBlogs(data);
        setLoadingBlogs(false);
      })
      .catch(() => setLoadingBlogs(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStressed]);

  const handleLogout = () => {
    localStorage.removeItem('guru_user_id');
    router.push('/login');
  };

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
          messages: newMessages.slice(1), 
          preferredName: userProfile.preferredName,
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Interactive Modal Overlay */}
      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          {activeModal === 'breathing' && <BreathingExercise onClose={() => setActiveModal(null)} />}
          {activeModal === 'grounding' && <GroundingExercise onClose={() => setActiveModal(null)} />}
        </div>
      )}

      {/* Serene Landscape Banner */}
      <div className="animate-fade-in-up" style={{ width: '100%', height: '35vh', position: 'absolute', top: 0, left: 0, zIndex: -1, overflow: 'hidden', opacity: theme === 'dark' ? 0.3 : 0.8 }}>
        <Image src="/serene-landscape.png" alt="Serene Landscape" fill style={{ objectFit: 'cover' }} priority />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, var(--background), transparent)' }}></div>
      </div>

      {theme === 'dark' && (
        <>
          <div className="cosmic-particle" style={{ top: '15%', left: '10%', width: '3px', height: '3px', '--duration': '4s' } as any}></div>
          <div className="cosmic-particle" style={{ top: '45%', left: '85%', width: '4px', height: '4px', '--duration': '6s' } as any}></div>
        </>
      )}

      {/* Header */}
      <header className="glass animate-fade-in-up" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Sanctuary</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '2rem', flex: 1, position: 'relative', zIndex: 10 }}>
        
        {/* Left Sanctuary (Mascot, Affirmations, Exercises) */}
        <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="animate-fade-in-up delay-100" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Image src="/guru-mascot.png" alt="Cosmic Guru Mascot" width={180} height={180} style={{ borderRadius: '50%', background: 'var(--card-bg)', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }} />
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.5rem' }}>Welcome back, {userProfile.preferredName.split(' ')[0]}.</h2>
              <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.5 }}>
                "Your worth is not measured by the {userProfile.exams.join(' or ')} exam. It is measured by the light you bring to the world."
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Mind Control / Exercises Wrapper */}
            <div className="glass animate-fade-in-up delay-200" style={{ flex: 1, padding: '2rem', minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Wind size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Mind Control Exercises</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li onClick={() => setActiveModal('breathing')} style={{ padding: '1rem', background: 'var(--input-bg)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid var(--border)' }}>
                  <span>4-7-8 Breathing Timer</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Interactive</span>
                </li>
                <li onClick={() => setActiveModal('grounding')} style={{ padding: '1rem', background: 'var(--input-bg)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid var(--border)' }}>
                  <span>Grounding (5-4-3-2-1)</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Interactive</span>
                </li>
              </ul>
            </div>

            {/* Mental Health Blogs */}
            <div className="glass animate-fade-in-up delay-300" style={{ flex: 1, padding: '2rem', minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <BookOpen size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Wisdom & Reading</h3>
              </div>
              
              {loadingBlogs ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <Loader2 className="animate-spin" size={24} opacity={0.5} />
                </div>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {blogs.map((blog, idx) => (
                    <li key={idx}>
                      <a href={blog.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '1rem', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--border)', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <Heart size={16} color="#ff6b6b" style={{ flexShrink: 0, marginTop: '4px' }} />
                          <div>
                            <span style={{ display: 'block', fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{blog.title}</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>via {blog.source}</span>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                  {blogs.length === 0 && <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Check back later for new articles.</p>}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Embedded Chat Widget */}
        <div className="animate-slide-in-right delay-400" style={{ flex: '0 0 400px' }}>
          <div className="glass" style={{ height: '70vh', position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Chat Header */}
            <div style={{ padding: '1rem 1.5rem', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <Image src="/guru-mascot.png" alt="Guru" width={30} height={30} style={{ borderRadius: '50%', background: 'white' }} />
              <span style={{ fontWeight: 500 }}>Your Cosmic Guide</span>
            </div>

            {/* Chat Body */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg)' }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{ 
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '1rem',
                  borderRadius: '16px',
                  backgroundColor: m.role === 'user' ? 'var(--user-bubble)' : 'var(--guru-bubble)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  border: '1px solid var(--border)',
                  lineHeight: 1.5,
                  fontSize: '0.95rem'
                }}>
                  {m.content}
                </div>
              ))}
              
              {loading && (
                <div style={{ alignSelf: 'flex-start', padding: '1rem' }}>
                  <Loader2 className="animate-spin" size={18} style={{ animation: 'spin 2s linear infinite', opacity: 0.5 }} />
                </div>
              )}

              {isStressed && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
                  <p style={{ opacity: 0.7, marginBottom: '1rem', fontSize: '0.9rem' }}>Breathe with me...</p>
                  <div className="breathing-circle" style={{ width: '100px', height: '100px', margin: '1rem auto' }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </main>

            {/* Chat Input */}
            <footer style={{ padding: '1rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="input-field"
                  style={{ flex: 1, padding: '10px 14px', fontSize: '0.9rem' }}
                  placeholder="Ask for guidance..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  className="btn" 
                  style={{ padding: '10px', borderRadius: '12px' }}
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                >
                  <Send size={16} />
                </button>
              </div>
            </footer>

          </div>
        </div>

      </div>
    </div>
  );
}
