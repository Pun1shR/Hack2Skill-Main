import React from 'react';
import { X } from 'lucide-react';

interface IframeModalProps {
  url: string;
  onClose: () => void;
}

/**
 * A pop-up wrapper that displays an external website or image link inside an iframe.
 * Allows users to view resources without leaving the Sanctuary dashboard.
 */
export default function IframeModal({ url, onClose }: IframeModalProps) {
  // Try to convert youtube URLs to embed format so they don't get blocked by X-Frame-Options
  let safeUrl = url;
  if (safeUrl.includes('youtube.com/watch?v=')) {
    const videoId = safeUrl.split('v=')[1]?.split('&')[0];
    if (videoId) {
      safeUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (safeUrl.includes('youtu.be/')) {
    const videoId = safeUrl.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      safeUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return (
    <div 
      data-testid="iframe-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="iframe-modal-title"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', padding: '2rem' }}
    >
      <div className="glass animate-fade-in-up" style={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '80vh', display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'var(--primary-glow)' }}>
          <span id="iframe-modal-title" data-testid="iframe-url-display" style={{ fontSize: '0.9rem', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
            Viewing: {url}
          </span>
          <button data-testid="iframe-close-btn" aria-label="Close Resource Viewer" onClick={onClose} style={{ background: 'var(--primary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body (Iframe) */}
        <div style={{ flex: 1, position: 'relative' }}>
          <iframe 
            data-testid="iframe-content"
            src={safeUrl} 
            title={`Resource Wrapper for ${url}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
      </div>
    </div>
  );
}
