import React, { useEffect, useRef } from 'react';
import { AssistantMode } from '../types/assistant';

interface ChappieVisorProps {
  mode: AssistantMode;
  emotion: 'speaking' | 'happy' | 'alert' | 'tactical' | 'curious' | 'idle';
  isSpeaking: boolean;
  isListening: boolean;
  batteryLevel?: number;
}

export const ChappieVisor: React.FC<ChappieVisorProps> = ({
  mode,
  emotion,
  isSpeaking,
  isListening,
  batteryLevel = 92,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Deep dark canvas background
      ctx.fillStyle = '#090b11';
      ctx.fillRect(0, 0, w, h);

      if (mode === 'jarvis') {
        // ============================================
        // STARK INDUSTRIES J.A.R.V.I.S. ARC REACTOR HUD
        // ============================================
        ctx.save();
        const jarvisColor = '#00f0ff'; // Electric Stark Cyan
        const jarvisGold = '#f59e0b';
        ctx.shadowBlur = isSpeaking ? 16 : 8;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';

        // Outer rotating segmented ring
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.stroke();

        // Rotating orbital ticks
        const segments = 16;
        for (let i = 0; i < segments; i++) {
          const angle = (i * (Math.PI * 2)) / segments + t * 0.8;
          const x1 = cx + Math.cos(angle) * 34;
          const y1 = cy + Math.sin(angle) * 34;
          const x2 = cx + Math.cos(angle) * (i % 2 === 0 ? 40 : 37);
          const y2 = cy + Math.sin(angle) * (i % 2 === 0 ? 40 : 37);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = i % 4 === 0 ? jarvisGold : jarvisColor;
          ctx.stroke();
        }

        // Inner counter-rotating ring
        ctx.beginPath();
        const innerR = 24 + (isSpeaking ? Math.sin(t * 4) * 4 : 0);
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
        ctx.strokeStyle = jarvisColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Arc reactor central glowing core
        const corePulse = isSpeaking ? Math.sin(t * 6) * 3 + 10 : 8;
        ctx.beginPath();
        ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
        ctx.fillStyle = jarvisColor;
        ctx.fill();

        // Audio reactive holographic waveforms on left & right
        const sideBars = 8;
        for (let i = 0; i < sideBars; i++) {
          const barH = isSpeaking ? Math.abs(Math.sin(t * 3 + i * 0.5)) * 28 + 4 : 4;
          // Left wing
          ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
          ctx.fillRect(cx - 70 - i * 6, cy - barH / 2, 3, barH);
          // Right wing
          ctx.fillRect(cx + 70 + i * 6, cy - barH / 2, 3, barH);
        }

        // Telemetry Text
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.fillText('STARK OS // J.A.R.V.I.S.', 16, 20);
        ctx.fillText('GOOGLE LIVE: ACTIVE', w - 120, 20);
        ctx.restore();

      } else if (mode === 'tars') {
        // ============================================
        // TARS (INTERSTELLAR) MONOLITH CHASSIS DISPLAY
        // ============================================
        ctx.save();
        const tarsGreen = '#10b981'; // Tactical Military Phosphor Green
        const tarsAmber = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';

        // Draw TARS 4 articulated monolithic rectangular slabs
        const blockW = 44;
        const blockH = 68;
        const blockGap = 6;
        const startX = cx - (4 * blockW + 3 * blockGap) / 2;

        for (let b = 0; b < 4; b++) {
          const bx = startX + b * (blockW + blockGap);
          const by = cy - blockH / 2;

          // Block container
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, by, blockW, blockH);

          // Top block header
          ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
          ctx.fillRect(bx, by, blockW, 14);

          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillStyle = tarsGreen;
          ctx.fillText(`COL-${b + 1}`, bx + 6, by + 10);

          // Internal animated data bars / levels
          const numLines = 5;
          for (let l = 0; l < numLines; l++) {
            const lw = isSpeaking
              ? Math.abs(Math.sin(t * 2.5 + b * 0.8 + l * 0.6)) * (blockW - 12) + 4
              : ((b + l) % 3 + 1) * 8;
            ctx.fillStyle = b === 2 ? tarsAmber : tarsGreen;
            ctx.fillRect(bx + 6, by + 20 + l * 8, lw, 3);
          }
        }

        // TARS status footer
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = tarsGreen;
        ctx.fillText('TARS // HONESTY: 90% | HUMOR: 75%', 16, 20);
        ctx.fillText('GOOGLE VERIFIED', w - 105, 20);
        ctx.restore();

      } else if (mode === 'chappie') {
        // ============================================
        // CHAPPIE (SCOUT 22) LED VISOR DISPLAY
        // ============================================
        ctx.save();
        const mainColor = '#f59e0b'; // Amber
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';

        // Visor frame corners
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(12, 12, w - 24, h - 24);

        // Brackets
        ctx.fillStyle = mainColor;
        ctx.fillRect(10, 10, 8, 2);
        ctx.fillRect(10, 10, 2, 8);
        ctx.fillRect(w - 18, 10, 8, 2);
        ctx.fillRect(w - 12, 10, 2, 8);

        // Emotion Eyes
        if (emotion === 'alert') {
          const pulse = Math.sin(t * 3) * 0.4 + 0.6;
          ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
          ctx.fillRect(cx - 40, cy - 10, 20, 20);
          ctx.fillRect(cx + 20, cy - 10, 20, 20);
        } else if (emotion === 'happy') {
          ctx.beginPath();
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 4;
          ctx.moveTo(cx - 40, cy + 4);
          ctx.lineTo(cx - 25, cy - 12);
          ctx.lineTo(cx - 10, cy + 4);
          ctx.moveTo(cx + 10, cy + 4);
          ctx.lineTo(cx + 25, cy - 12);
          ctx.lineTo(cx + 40, cy + 4);
          ctx.stroke();
        } else if (isSpeaking) {
          const barCount = 12;
          for (let i = 0; i < barCount; i++) {
            const bh = 6 + Math.abs(Math.sin(t * 2.5 + i * 0.5)) * 26;
            ctx.fillRect(cx - 45 + i * 8, cy - bh / 2, 4, bh);
          }
        } else {
          // Normal horizontal visor beam
          const barW = 80 + Math.sin(t * 0.8) * 8;
          ctx.fillRect(cx - barW / 2, cy - 3, barW, 6);
        }

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.fillText('SCOUT-22 // CONSCIOUS', 20, 22);
        ctx.fillText(`${batteryLevel}% TI`, w - 74, 22);
        ctx.restore();

      } else {
        // ============================================
        // ALEXA ASSISTANT PULSE
        // ============================================
        ctx.save();
        const mainColor = '#06b6d4';
        const pulse = isSpeaking ? Math.sin(t * 3) * 8 : 0;
        ctx.beginPath();
        ctx.arc(cx, cy, 26 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = mainColor;
        ctx.fill();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(6, 182, 212, 0.7)';
        ctx.fillText('ALEXA VOICE // ACTIVE', 20, 22);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, emotion, isSpeaking, isListening, batteryLevel]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-[#0c0f17] shadow-xl">
      <canvas
        ref={canvasRef}
        width={340}
        height={96}
        className="w-full h-24 block"
      />
      <div className="absolute bottom-1.5 right-3 text-[10px] font-mono tracking-wider text-zinc-500 pointer-events-none uppercase">
        {mode === 'jarvis'
          ? 'MARK-L STARK PROTOCOL'
          : mode === 'tars'
          ? 'USMC TACTICAL CORE'
          : mode === 'chappie'
          ? 'TETRAVAAL MK-22'
          : 'AMAZON VOICE ENGINE'}
      </div>
    </div>
  );
};
