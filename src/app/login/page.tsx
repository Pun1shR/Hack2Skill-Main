'use client';

import { supabase } from '@/lib/supabase';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function Login() {
  const { theme, toggleTheme } = useTheme();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`
      }
    });
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
        <p style={{ marginBottom: '2rem', opacity: 0.8 }}>Your personal guide to calm, focus, and exam preparation.</p>
        
        <button className="btn" onClick={handleGoogleLogin} style={{ width: '100%' }}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
