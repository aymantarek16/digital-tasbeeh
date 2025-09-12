// src/components/Confetti.jsx
import React, { useEffect, useState } from "react";

/**
 * Confetti that drops from top.
 * trigger: boolean (when true, spawn confetti)
 * count: how many pieces
 */
export default function Confetti({ trigger, count = 40, onDone = () => {} }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    let timer;
    if (trigger) {
      const emojis = ["✨", "🎉", "🌟", "💫", "🎊", "❤️", "🕊️"];
      const arr = Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = 3 + Math.random() * 2.5;
        const size = 14 + Math.random() * 28;
        const rotate = Math.random() * 360;
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        return { id: `${Date.now()}-${i}`, left, delay, duration, size, rotate, emoji };
      });
      setPieces(arr);
      // cleanup after animations
      timer = setTimeout(() => {
        setPieces([]);
        onDone();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [trigger, count, onDone]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            top: `-10%`,
            fontSize: p.size,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
          className="absolute animate-confetti-fall will-change-transform"
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          30% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation-name: confettiFall;
          animation-timing-function: cubic-bezier(.2,.7,.2,1);
        }
      `}</style>
    </div>
  );
}
