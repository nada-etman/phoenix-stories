
import React, { useEffect, useRef } from 'react';

export default function EmberParticles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createEmber = () => {
      const ember = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const duration = Math.random() * 10 + 8;
      const delay = Math.random() * 5;

      ember.style.cssText = `
        position: absolute;
        bottom: -5px;
        left: ${x}%;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #F4D03F, #D4AF37);
        border-radius: 50%;
        opacity: 0;
        pointer-events: none;
        animation: float-up ${duration}s ${delay}s ease-out infinite;
        box-shadow: 0 0 ${size * 2}px ${size}px rgba(212, 175, 55, 0.3);
        will-change: transform, opacity;
      `;

      container.appendChild(ember);

      setTimeout(() => {
        if (container.contains(ember)) {
          container.removeChild(ember);
        }
      }, (duration + delay) * 1000);
    };

    const interval = setInterval(() => {
      if (container.childNodes.length < 15) {
        createEmber();
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      aria-hidden="true"
    />
  );
} 