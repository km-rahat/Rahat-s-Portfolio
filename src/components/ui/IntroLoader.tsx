import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFading(true);
          setTimeout(() => {
            onComplete();
          }, 450);
          return 100;
        }
        const step = Math.floor(Math.random() * 15) + 10;
        return Math.min(prev + step, 100);
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-xs w-full px-6 text-center">
        {/* Glowing Geometric Monogram */}
        <div className="relative mb-8 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] p-[2px] shadow-2xl shadow-[var(--primary)]/30 animate-spin"
            style={{ animationDuration: '8s' }}
          >
            <div className="w-full h-full bg-[var(--bg)] rounded-2xl flex items-center justify-center">
              <span className="text-xl font-bold font-heading text-gradient-cosmic">
                KV
              </span>
            </div>
          </div>
          <div className="absolute -inset-4 bg-[var(--secondary)]/20 blur-xl rounded-full pointer-events-none" />
        </div>

        {/* Progress Display */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)]">
            <span className="flex items-center gap-1.5 text-[var(--secondary)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>INITIALIZING 3D ENVIRONMENT</span>
            </span>
            <span className="text-[var(--text)] tabular-nums">{progress}%</span>
          </div>

          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[11px] text-[var(--muted)] font-mono tracking-wider">
            SCROLL-CONTROLLED 3D CYBER CORE
          </p>
        </div>
      </div>
    </div>
  );
};
