import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Handle high-DPI screens
    const dpr = window.devicePixelRatio || 1;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    setCanvasSize();

    // Pre-render glow particles in multiple colors to OffscreenCanvas for huge performance gains
    const createGlowCanvas = (r: number, g: number, b: number) => {
      const canvas = document.createElement('canvas');
      const size = 32;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`); // Core color
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.3)`); // Soft transition
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`); // Edge transparency
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      return canvas;
    };

    // Color palette: 80% primary orange, 10% yellow, 10% rose (balanced theme with a touch of vibrancy)
    const palettes = [
      { canvas: createGlowCanvas(249, 115, 22), color: '#F97316', weight: 80 }, // Primary Orange
      { canvas: createGlowCanvas(250, 204, 21), color: '#FACC15', weight: 10 }, // Yellow/Amber
      { canvas: createGlowCanvas(244, 63, 94), color: '#F43F5E', weight: 10 }, // Soft Rose
    ];

    // High-density particle configuration
    const particleCount = width < 768 ? 400 : 1500;

    class Particle {
      x: number;
      y: number;
      z: number; // Depth 0-100
      vx: number;
      vy: number;
      baseSize: number;
      colorIdx: number; // Color index

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 100; // 0 = farthest, 100 = nearest
        this.vx = 0;
        this.vy = 0;
        this.baseSize = Math.random() * 1.5 + 0.5; // Base size
        
        // Assign color randomly by weight
        const rand = Math.random() * 100;
        if (rand < palettes[0].weight) {
          this.colorIdx = 0;
        } else if (rand < palettes[0].weight + palettes[1].weight) {
          this.colorIdx = 1;
        } else {
          this.colorIdx = 2;
        }
      }

      update(time: number, mouseX: number, mouseY: number, mouseVx: number, mouseVy: number, mouseSpeed: number) {
        // 1. Fluid Space Flow (pseudo Perlin noise via trigonometric layering)
        // Vary wave frequency by Z-axis to create depth illusion
        const zFactor = (100 - this.z) * 0.01;
        const noiseAngle = (
          Math.sin(this.x * 0.001 + time * 0.2) +
          Math.cos(this.y * 0.002 - time * 0.15) +
          Math.sin((this.x + this.y) * 0.001 + time * 0.1)
        ) * Math.PI * 2;

        // Far particles are less affected by flow field, near ones more
        const flowForce = 0.015 + (1 - zFactor) * 0.02;
        this.vx += Math.cos(noiseAngle) * flowForce;
        this.vy += Math.sin(noiseAngle) * flowForce;

        // 2. Mouse gravity well & wake effect
        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 90000) { // Radius 300px
            const dist = Math.sqrt(distSq);
            // The closer the distance, the stronger the gravity
            const gravity = 200 / (distSq + 1000);

            // Pull force
            this.vx += (dx / dist) * gravity;
            this.vy += (dy / dist) * gravity;

            // Magnetic orbit (spring force)
            // Make particles orbit around cursor instead of colliding with center
            const tangentX = -dy / dist;
            const tangentY = dx / dist;
            this.vx += tangentX * gravity * 1.5;
            this.vy += tangentY * gravity * 1.5;

            // Wake effect
            // Drag nearby particles when cursor moves fast
            if (mouseSpeed > 3) {
              const wakeForce = Math.min(mouseSpeed * 0.01, 0.5);
              this.vx += mouseVx * wakeForce * gravity;
              this.vy += mouseVy * wakeForce * gravity;
            }
          }
        }

        // Inertial damping for fluid-like feel
        this.vx *= 0.94;
        this.vy *= 0.94;

        this.x += this.vx;
        this.y += this.vy;

        // Infinite wrap-around at edges
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
      }
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle());

    let mouseX = -1000;
    let mouseY = -1000;
    let prevMouseX = -1000;
    let prevMouseY = -1000;
    let mouseVx = 0;
    let mouseVy = 0;
    let mouseSpeed = 0;

    const handleMouseMove = (e: MouseEvent) => {
      prevMouseX = mouseX === -1000 ? e.clientX : mouseX;
      prevMouseY = mouseY === -1000 ? e.clientY : mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      mouseVx = mouseX - prevMouseX;
      mouseVy = mouseY - prevMouseY;
      mouseSpeed = Math.sqrt(mouseVx * mouseVx + mouseVy * mouseVy);
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      // Spatial shockwave (gravity explosion)
      const ex = e.clientX;
      const ey = e.clientY;
      const explosionRadius = 400;

      particles.forEach(p => {
        const dx = p.x - ex;
        const dy = p.y - ey;
        const distSq = dx * dx + dy * dy;
        if (distSq < explosionRadius * explosionRadius) {
          const dist = Math.sqrt(distSq);
          const force = (explosionRadius - dist) / explosionRadius;
          // Rapid outward push
          p.vx += (dx / dist) * force * 15;
          p.vy += (dy / dist) * force * 15;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);

      // Performance: pause rendering when page is hidden
      if (document.hidden) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Decay mouse velocity
      mouseSpeed *= 0.9;
      mouseVx *= 0.9;
      mouseVy *= 0.9;

      const time = timestamp * 0.001;

      particles.forEach(p => {
        p.update(time, mouseX, mouseY, mouseVx, mouseVy, mouseSpeed);

        const speedSq = p.vx * p.vx + p.vy * p.vy;

        // Z-axis depth of field
        const depthFactor = p.z / 100; // 0 = farthest, 1 = nearest
        const renderOpacity = 0.1 + depthFactor * 0.6;
        const renderSize = p.baseSize * (0.5 + depthFactor * 1.5);

        ctx.globalAlpha = renderOpacity;

        // If particle is moving fast (e.g. repelled by cursor or in shockwave), render as motion trail
        if (speedSq > 2.0) {
          ctx.beginPath();
          // Stretch trail by velocity, clamped to prevent excessive length
          const trailLength = Math.min(Math.sqrt(speedSq) * 1.5, 15);
          const nx = p.vx / Math.sqrt(speedSq);
          const ny = p.vy / Math.sqrt(speedSq);

          ctx.moveTo(p.x - nx * trailLength, p.y - ny * trailLength);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = palettes[p.colorIdx].color;
          ctx.lineWidth = renderSize;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          // In normal state, render soft glow
          const drawSize = renderSize * 4; // Glow area larger than core
          ctx.drawImage(palettes[p.colorIdx].canvas, p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize);
        }
      });
    };

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-multiply"
    />
  );
}
