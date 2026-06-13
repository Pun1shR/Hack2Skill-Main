'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { USERS, MOCK_PASSWORDS } from '@/lib/db';

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (MOCK_PASSWORDS[username] && MOCK_PASSWORDS[username] === password) {
      localStorage.setItem('guru_user_id', username);
      router.push('/chat');
    } else {
      setError('Invalid cosmic credentials. Try "med" or "eng".');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      
      {theme === 'dark' && (
        <>
          <div className="cosmic-particle" style={{ top: '10%', left: '20%', width: '4px', height: '4px', '--duration': '3s' } as any}></div>
          <div className="cosmic-particle" style={{ top: '30%', left: '80%', width: '3px', height: '3px', '--duration': '5s' } as any}></div>
          <div className="cosmic-particle" style={{ top: '70%', left: '40%', width: '5px', height: '5px', '--duration': '4s' } as any}></div>
        </>
      )}

      <button 
        onClick={toggleTheme} 
        className="glass p-3 rounded-full flex items-center justify-center transition-transform hover:scale-110"
        style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', cursor: 'pointer' }}
      >
        {theme === 'light' ? <Moon size={20} className="text-[var(--foreground)]" /> : <Sun size={20} className="text-[var(--foreground)]" />}
      </button>

      <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 600 }}>Cosmic Guru AI</h1>
        <p style={{ marginBottom: '2rem', opacity: 0.8 }}>Login to begin your preparation journey.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Username (e.g. med or eng)" 
            className="input-field" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            Enter the Cosmos
          </button>
        </form>
      </div>
    </div>
  );
}
