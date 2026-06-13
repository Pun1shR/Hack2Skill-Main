'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Moon, Sun, LogOut, Heart, BookOpen, Wind } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import AudioPlayer from '@/components/AudioPlayer';
import { USERS, User } from '@/lib/db';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

// Extracted Dashboard Components
import CheckinTracker from '@/components/dashboard/CheckinTracker';
import BreathingExercise from '@/components/dashboard/BreathingExercise';
import GroundingExercise from '@/components/dashboard/GroundingExercise';
import RewardModal from '@/components/dashboard/RewardModal';
import ExamSelectionModal from '@/components/dashboard/ExamSelectionModal';
import IframeModal from '@/components/dashboard/IframeModal';

// Types for Blogs scraped from the web
interface Blog {
  title: string;
  link: string;
  source: string;
}

const AVAILABLE_EXAMS = ['NEET', 'JEE', 'GATE', 'CAT', 'CUET', 'UPSC'];

/**
 * Main Dashboard interface for the Cosmic Guru application.
 * Manages chat state, local storage synchronization, exercise modals, and the daily streak tracker.
 */
export default function Dashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  // --- Chat & UI States ---
  const [messages, setMessages] = useState<{role: string, content: string}[]>([{
    role: 'model',
    content: 'Welcome, young seeker. I am your cosmic guide. How may I assist you on your journey today?'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStressed, setIsStressed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- User & App Data States ---
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  
  // --- Modal & Tracking States ---
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [checkins, setCheckins] = useState<string[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  /**
   * Initializes user profile and check-in streak data from localStorage upon mounting.
   * If the user doesn't have 5 days of check-ins, dummy data is injected to demonstrate the reward UI.
   */
  useEffect(() => {
    const userId = localStorage.getItem('guru_user_id');
    if (!userId || !USERS[userId]) {
      router.push('/login');
      return;
    } 

    const profile = { ...USERS[userId] };
    
    // Check if exams were already selected in local storage
    const savedExams = localStorage.getItem('guru_selected_exams');
    if (savedExams) {
      profile.exams = JSON.parse(savedExams);
      setUserProfile(profile);
    } else {
      setUserProfile(profile);
      setShowExamModal(true);
    }

    // Load Checkins from localStorage
    let checkinArray = [];
    const savedCheckins = localStorage.getItem('guru_checkin_dates');
    if (savedCheckins) {
      checkinArray = JSON.parse(savedCheckins);
    }

    // FORCE DUMMY DATA FOR TESTING 5 DAY STREAK
    // Injects 5 consecutive days of check-ins so the reward UI is immediately testable.
    if (checkinArray.length < 5 || !localStorage.getItem('guru_claimed_reward')) {
      const today = new Date();
      checkinArray = [];
      for(let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const targetDate = new Date();
        targetDate.setDate(today.getDate() - dayOffset);
        checkinArray.push(targetDate.toISOString().split('T')[0]);
      }
      localStorage.setItem('guru_checkin_dates', JSON.stringify(checkinArray));
    }
    
    setCheckins(checkinArray);
  }, [router]);

  /**
   * Scrapes mental health and wellness blogs dynamically from the API route.
   */
  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setBlogs(data);
        setLoadingBlogs(false);
      })
      .catch(() => setLoadingBlogs(false));
  }, []);

  /**
   * Auto-scrolls the chat window to the bottom when new messages arrive.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStressed]);

  /**
   * Clears session data and redirects the user to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('guru_user_id');
    localStorage.removeItem('guru_selected_exams');
    router.push('/login');
  };

  /**
   * Saves the user's selected exams to localStorage and updates the profile state.
   */
  const handleSaveExams = () => {
    if (selectedExams.length === 0) return;
    localStorage.setItem('guru_selected_exams', JSON.stringify(selectedExams));
    if (userProfile) {
      setUserProfile({ ...userProfile, exams: selectedExams });
    }
    setShowExamModal(false);
  };

  /**
   * Toggles exam selection state in the onboarding modal.
   */
  const toggleExam = (exam: string) => {
    if (selectedExams.includes(exam)) {
      setSelectedExams(selectedExams.filter(e => e !== exam));
    } else {
      setSelectedExams([...selectedExams, exam]);
    }
  };

  /**
   * Checks if the user has maintained a continuous 5-day check-in streak.
   * @param newCheckins Array of ISO date strings representing days the user checked in.
   * @returns boolean true if the last 5 days exist in the array.
   */
  const checkStreak = (newCheckins: string[]) => {
    const today = new Date();
    for(let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - dayOffset);
      if (!newCheckins.includes(targetDate.toISOString().split('T')[0])) {
        return false;
      }
    }
    return true;
  };
  
  const hasReward = checkStreak(checkins);

  /**
   * Opens the Reward modal when the golden gift box is clicked.
   */
  const handleRewardClick = () => {
    setShowRewardModal(true);
    localStorage.setItem('guru_claimed_reward', 'true');
  };

  /**
   * Submits the user's message to the Gemini Generative AI backend.
   * Handles local storage check-in persistence, simple stress keyword detection, and real-time text streaming.
   */
  const handleSend = async () => {
    if (!input.trim() || !userProfile) return;
    
    const userMessage = input.trim();
    setInput('');

    // --- Record Check-in Logic ---
    const todayStr = new Date().toISOString().split('T')[0];
    if (!checkins.includes(todayStr)) {
      const updatedCheckins = [...checkins, todayStr];
      setCheckins(updatedCheckins);
      localStorage.setItem('guru_checkin_dates', JSON.stringify(updatedCheckins));
    }
    
    // --- Stress Detection ---
    // Simple heuristic to detect if the user is overwhelmed, triggering a subtle UI reminder to breathe.
    const stressWords = ['stress', 'anxious', 'panic', 'overwhelm', 'scared', 'nervous'];
    if (stressWords.some(word => userMessage.toLowerCase().includes(word))) {
      setIsStressed(true);
      setTimeout(() => setIsStressed(false), 24000); // 24s corresponds to exactly 3 cycles of 4-7-8 breathing
    }

    // --- Prepare Messages ---
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Connect to the Next.js API route that interfaces with the Google Generative AI SDK
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(1), 
          preferredName: userProfile.preferredName,
          exams: userProfile.exams
        }),
      });

      if (!response.body) throw new Error("No response body received from the cosmic API.");

      // Read the streamed response chunk by chunk to create a real-time typing effect
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = '';

      // Append an empty model message block that we will continuously update as chunks arrive
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        text += chunkValue;
        
        // Update the last message in the array with the accumulated text
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

  // Render a loading state if the user profile hasn't initialized from local storage yet.
  if (!userProfile) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Connecting to the cosmos...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Modals & Overlays */}
      {iframeUrl && <IframeModal url={iframeUrl} onClose={() => setIframeUrl(null)} />}
      {showRewardModal && <RewardModal onClose={() => setShowRewardModal(false)} />}
      
      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          {activeModal === 'breathing' && <BreathingExercise onClose={() => setActiveModal(null)} />}
          {activeModal === 'grounding' && <GroundingExercise onClose={() => setActiveModal(null)} />}
        </div>
      )}

      {showExamModal && (
        <ExamSelectionModal 
          availableExams={AVAILABLE_EXAMS} 
          selectedExams={selectedExams} 
          onToggleExam={toggleExam} 
          onSave={handleSaveExams} 
        />
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

      {/* Global Header */}
      <header className="glass animate-fade-in-up" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Sanctuary</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AudioPlayer />
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
        
        {/* Left Sanctuary Area: Mascot, Affirmations, Exercises, and Blogs */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
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
            {/* Mind Control Exercises Wrapper */}
            <div className="glass animate-fade-in-up delay-200" style={{ flex: 1, padding: '2rem', minWidth: '250px' }}>
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

            {/* Mental Health Wisdom Blogs Wrapper */}
            <div className="glass animate-fade-in-up delay-300" style={{ flex: 1, padding: '2rem', minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <BookOpen size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>
                  Wisdom for {userProfile.exams.join(' & ')} Students
                </h3>
              </div>
              
              {loadingBlogs ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <div className="cosmic-loader"><span></span><span></span><span></span></div>
                </div>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {blogs.map((blog, blogIndex) => (
                    <li key={blogIndex}>
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

        {/* Right Area: Embedded AI Chat Widget */}
        <div className="animate-slide-in-right delay-400" style={{ flex: '0 0 400px' }}>
          <div className="glass" style={{ height: '70vh', position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Chat Header */}
            <div style={{ padding: '1rem 1.5rem', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <Image src="/guru-mascot.png" alt="Guru" width={30} height={30} style={{ borderRadius: '50%', background: 'white' }} />
              <span style={{ fontWeight: 500 }}>Your Cosmic Guide</span>
            </div>

            {/* Chat Body */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg)' }}>
              {messages.map((chatMessage, messageIndex) => (
                <div key={messageIndex} style={{ 
                  alignSelf: chatMessage.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '1rem',
                  borderRadius: '16px',
                  backgroundColor: chatMessage.role === 'user' ? 'var(--user-bubble)' : 'var(--guru-bubble)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  border: '1px solid var(--border)',
                  lineHeight: 1.5,
                  fontSize: '0.95rem'
                }}>
                  {/* Markdown Renderer ensures URLs open in new tabs and render safely */}
                  <div className="markdown-body">
                    {chatMessage.role === 'user' ? chatMessage.content : (
                      <ReactMarkdown 
                        components={{
                          a: ({node, href, children, ...props}) => (
                            <a 
                              href={href}
                              onClick={(e) => {
                                e.preventDefault();
                                if(href) setIframeUrl(href);
                              }}
                              style={{ color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}
                              {...props}
                            >
                              {children}
                            </a>
                          )
                        }}
                      >
                        {chatMessage.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div style={{ alignSelf: 'flex-start', padding: '1rem' }}>
                  <div className="cosmic-loader"><span></span><span></span><span></span></div>
                </div>
              )}

              {/* Stress animation appears briefly if anxious keywords are detected */}
              {isStressed && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
                  <p style={{ opacity: 0.7, marginBottom: '1rem', fontSize: '0.9rem' }}>Breathe with me...</p>
                  <div className="breathing-circle" style={{ width: '100px', height: '100px', margin: '1rem auto' }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </main>

            {/* Chat Input Field */}
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
        
        {/* Far Right Area: Habit & Check-in Tracker */}
        <CheckinTracker 
          checkins={checkins} 
          hasReward={hasReward} 
          onRewardClick={handleRewardClick} 
        />

      </div>
    </div>
  );
}
