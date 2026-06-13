import React from 'react';
import { CheckSquare, Calendar } from 'lucide-react';

interface CheckinTrackerProps {
  checkins: string[];
  hasReward: boolean;
  onRewardClick: () => void;
}

/**
 * Renders a vertical streak tracker for the last 15 days.
 * Highlights the 'Today' square and turns it into a golden reward box if a streak is hit.
 */
export default function CheckinTracker({ checkins, hasReward, onRewardClick }: CheckinTrackerProps) {
  // Generate an array of the last 15 days (YYYY-MM-DD format)
  const days = [];
  const today = new Date();
  for (let dayOffset = 0; dayOffset < 15; dayOffset++) {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - dayOffset);
    days.push(targetDate.toISOString().split('T')[0]);
  }
  
  return (
    <div data-testid="checkin-tracker" className="animate-slide-in-right delay-400" style={{ position: 'relative', height: '70vh', width: '100px', display: 'flex', flexDirection: 'column' }}>
      {/* Top Gradient Mask for smooth scrolling fade out */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom, var(--background), transparent)', zIndex: 10, pointerEvents: 'none', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}></div>
      
      <div data-testid="checkin-scroll-area" className="glass" style={{ flex: 1, overflowY: 'auto', padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        
        {days.map((dateStr, index) => {
          const isChecked = checkins.includes(dateStr);
          const isToday = index === 0;
          
          // Determine if today qualifies for the golden reward box
          const isGolden = isToday && hasReward && isChecked;

          return (
            <div data-testid={`tracker-day-${index}`} key={dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: isToday ? 1 : 0.8 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: isToday ? 600 : 400, color: isGolden ? '#FFD700' : 'inherit' }}>
                {isToday ? 'Today' : dateStr.slice(5).replace('-', '/')}
              </span>
              <div 
                role={isGolden ? "button" : "presentation"}
                tabIndex={isGolden ? 0 : -1}
                aria-label={isGolden ? "Claim 5-Day Reward" : (isChecked ? "Checked In" : "Missed Checkin")}
                onClick={() => isGolden && onRewardClick()}
                onKeyDown={(e) => {
                  if (isGolden && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onRewardClick();
                  }
                }}
                data-testid={isGolden ? "golden-reward-box" : `tracker-box-${index}`}
                style={{ 
                  width: '36px', height: '36px', borderRadius: '10px', 
                  background: isGolden ? 'linear-gradient(135deg, #FFD700, #FDB931)' : isChecked ? 'var(--primary)' : 'var(--input-bg)',
                  border: `1px solid ${isGolden || isChecked ? 'transparent' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isGolden ? '0 0 15px rgba(255, 215, 0, 0.6)' : isChecked ? '0 0 15px var(--primary-glow)' : 'none',
                  transform: (isToday && !isChecked) ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  cursor: isGolden ? 'pointer' : 'default'
                }}>
                {isGolden ? <span aria-hidden="true" style={{fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>🎁</span> : isChecked ? <CheckSquare size={16} color="white" aria-hidden="true" /> : <Calendar size={14} opacity={0.3} aria-hidden="true" />}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Bottom Gradient Mask */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, var(--background), transparent)', zIndex: 10, pointerEvents: 'none', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}></div>
    </div>
  );
}
