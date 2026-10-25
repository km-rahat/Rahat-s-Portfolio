import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch screens or if reduced motion is preferred
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let frameId: number;
    const updateTrail = () => {
      setTrail((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.2,
        y: prev.y + (pos.y - prev.y) * 0.2,
      }));
      frameId = requestAnimationFrame(updateTrail);
    };
    frameId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(frameId);
    };
  }, [pos.x, pos.y, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Outer Glow Halo Ring */}
      <div
        className="fixed rounded-full border border-[var(--secondary)]/70 transition-transform duration-150 ease-out will-change-transform"
        style={{
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
          transform: `translate3d(${trail.x - (isHovered ? 24 : 16)}px, ${trail.y - (isHovered ? 24 : 16)}px, 0)`,
          boxShadow: isHovered
            ? '0 0 20px 2px rgba(34, 211, 238, 0.4), inset 0 0 12px rgba(124, 58, 237, 0.3)'
            : '0 0 10px rgba(124, 58, 237, 0.25)',
          background: isHovered ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
        }}
      />

      {/* Inner Pin Dot */}
      <div
        className="fixed rounded-full bg-[var(--secondary)] transition-transform duration-75 ease-out will-change-transform"
        style={{
          width: isHovered ? '6px' : '4px',
          height: isHovered ? '6px' : '4px',
          transform: `translate3d(${pos.x - (isHovered ? 3 : 2)}px, ${pos.y - (isHovered ? 3 : 2)}px, 0)`,
        }}
      />
    </div>
  );
};
