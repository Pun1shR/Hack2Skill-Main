'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We create the audio element in useEffect to avoid hydration errors
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'); // NCS/Chill Lofi Track
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Soft background volume
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      onClick={togglePlay} 
      className="glass p-3 rounded-full flex items-center justify-center transition-transform hover:scale-110"
      title={isPlaying ? "Pause soothing music" : "Play soothing music"}
      style={{ border: 'none', cursor: 'pointer' }}
    >
      {isPlaying ? (
        <Volume2 size={20} className="text-[var(--foreground)]" />
      ) : (
        <VolumeX size={20} className="text-[var(--foreground)] opacity-50" />
      )}
    </button>
  );
}
