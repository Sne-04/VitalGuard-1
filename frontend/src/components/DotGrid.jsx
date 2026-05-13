import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const DotGrid = ({ className = '' }) => {
    const canvasRef = useRef(null);
    const { isDark } = useTheme();
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const animRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const COLS = 28;
        const ROWS = 18;
        const PERSPECTIVE = 500;
        let W = 0, H = 0;

        const resize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const onMouseMove = (e) => {
            const r = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: (e.clientX - r.left) / r.width,
                y: (e.clientY - r.top) / r.height,
            };
        };
        window.addEventListener('mousemove', onMouseMove);

        // Build dot grid
        const dots = [];
        for (let c = 0; c < COLS; c++) {
            for (let r2 = 0; r2 < ROWS; r2++) {
                dots.push({
                    gx: (c / (COLS - 1)) - 0.5,   // -0.5 to 0.5
                    gy: (r2 / (ROWS - 1)) - 0.5,
                    baseR: 1.8,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.4 + Math.random() * 0.4,
                });
            }
        }

        const draw = (t) => {
            ctx.clearRect(0, 0, W, H);

            const mx = mouseRef.current.x - 0.5;  // -0.5 to 0.5
            const my = mouseRef.current.y - 0.5;

            // Tilt the plane based on mouse
            const tiltX = my * 20 * (Math.PI / 180);  // up-down tilt
            const tiltY = mx * -25 * (Math.PI / 180); // left-right tilt

            const cx = W / 2;
            const cy = H / 2;
            const spreadX = W * 0.85;
            const spreadY = H * 0.75;

            for (const d of dots) {
                // 3D coords on tilted plane
                const x3 = d.gx * spreadX;
                const y3 = d.gy * spreadY;
                const z3 = 0;

                // Rotate around X axis (tiltX)
                const y3r = y3 * Math.cos(tiltX) - z3 * Math.sin(tiltX);
                const z3r = y3 * Math.sin(tiltX) + z3 * Math.cos(tiltX);

                // Rotate around Y axis (tiltY)
                const x3r = x3 * Math.cos(tiltY) + z3r * Math.sin(tiltY);
                const z3rr = -x3 * Math.sin(tiltY) + z3r * Math.cos(tiltY);

                // Perspective projection
                const scale = PERSPECTIVE / (PERSPECTIVE + z3rr + 120);
                const sx = cx + x3r * scale;
                const sy = cy + y3r * scale;

                // Distance from mouse (screen space)
                const dx = (mouseRef.current.x) - (sx / W);
                const dy = (mouseRef.current.y) - (sy / H);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const influence = Math.max(0, 1 - dist * 3.5);

                // Pulse wave
                const wave = Math.sin(t * 0.0008 * d.speed + d.phase + d.gx * 4 + d.gy * 3);
                const waveFactor = (wave + 1) / 2; // 0-1

                const r = (d.baseR + influence * 4 + waveFactor * 1.2) * scale;

                // Color
                const baseOpacity = isDark ? 0.12 : 0.18;
                const opacity = baseOpacity + influence * 0.65 + waveFactor * 0.06;
                const [colR, colG, colB] = isDark
                    ? [59 + influence * 40, 130 + influence * 20, 246]
                    : [37, 99, 235];

                ctx.beginPath();
                ctx.arc(sx, sy, Math.max(0.5, r), 0, Math.PI * 2);

                if (influence > 0.1) {
                    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
                    grad.addColorStop(0, `rgba(${colR},${colG},${colB},${opacity})`);
                    grad.addColorStop(1, `rgba(${colR},${colG},${colB},0)`);
                    ctx.fillStyle = grad;
                } else {
                    ctx.fillStyle = `rgba(${colR},${colG},${colB},${opacity})`;
                }
                ctx.fill();
            }

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animRef.current);
            ro.disconnect();
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full ${className}`}
            style={{ pointerEvents: 'none' }}
        />
    );
};

export default DotGrid;
