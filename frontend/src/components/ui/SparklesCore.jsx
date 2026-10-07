'use client';

import React, { useId, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Aceternity UI — Sparkles Core
 * Lightweight, high-performance HTML5 canvas particle background.
 */
export function SparklesCore({
  id,
  background = 'transparent',
  minSize = 0.6,
  maxSize = 2.4,
  particleDensity = 60,
  className = '',
  particleColor = '#D4B45A', // Champagne gold default
  speed = 1,
}) {
  const defaultId = useId();
  const canvasId = id || defaultId;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((width * height) / 10000) * (particleDensity / 50);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedY: (Math.random() * 0.4 + 0.1) * speed,
          speedX: (Math.random() - 0.5) * 0.2 * speed,
          opacity: Math.random() * 0.8 + 0.2,
          pulse: Math.random() * 0.02 + 0.005,
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    initParticles();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Animate pulse opacity
        p.opacity += p.pulse * p.pulseDirection;
        if (p.opacity >= 0.9) p.pulseDirection = -1;
        if (p.opacity <= 0.15) p.pulseDirection = 1;

        // Move upwards gently
        p.y -= p.speedY;
        p.x += p.speedX;

        // Wrap around borders
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.shadowBlur = 6;
        ctx.shadowColor = particleColor;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [maxSize, minSize, particleColor, particleDensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      id={canvasId}
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ background }}
      aria-hidden="true"
    />
  );
}

export default SparklesCore;
