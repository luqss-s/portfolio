"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, moved: false, lastX: 0, lastY: 0 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.lastX = mouseRef.current.x;
      mouseRef.current.lastY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;

      // Spawn particles on movement
      const speed = Math.hypot(
        mouseRef.current.x - mouseRef.current.lastX,
        mouseRef.current.y - mouseRef.current.lastY
      );

      // Only spawn particles if mouse speed is significant
      if (speed > 2) {
        const particleCount = Math.min(Math.floor(speed / 3), 4);
        for (let i = 0; i < particleCount; i++) {
          const size = Math.random() * 3 + 1.5;
          const angle = Math.random() * Math.PI * 2;
          const velocity = Math.random() * 1.5 + 0.2;
          
          // Interpolate between cyan and blue
          const isCyan = Math.random() > 0.4;
          const color = isCyan ? "34, 211, 238" : "96, 165, 250"; // tailwind cyan-400 / blue-400

          particlesRef.current.push({
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity - 0.5, // Drift slightly upward
            size,
            color,
            alpha: 0.9,
            decay: Math.random() * 0.015 + 0.01,
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Spawn ambient floating background particles occasionally
      if (frameCount % 45 === 0 && particlesRef.current.length < 50) {
        const size = Math.random() * 2 + 1;
        const color = Math.random() > 0.5 ? "148, 163, 184" : "59, 130, 246"; // slate-400 / blue-500
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.6 - 0.2, // Float up slowly
          size,
          color,
          alpha: Math.random() * 0.3 + 0.1,
          decay: Math.random() * 0.003 + 0.001,
        });
      }

      // 2. Draw and update particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.x < 0 || p.x > canvas.width || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle with glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        gradient.addColorStop(0.5, `rgba(${p.color}, ${p.alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
