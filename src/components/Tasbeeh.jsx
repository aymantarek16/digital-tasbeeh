/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable no-undef */
// src/components/Tasbeeh.jsx
import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/useStore";
import Confetti from "./Confetti";
import { RotateCcw } from "lucide-react";

function useClickSound() {
  // Try to load file at /sounds/click.mp3 — fallback to WebAudio beep
  const audioRef = useRef(null);
  useEffect(() => {
    try {
      const a = new Audio("/sounds/click.mp3");
      a.volume = 0.6;
      audioRef.current = a;
      a.addEventListener("error", () => {
        audioRef.current = null;
      });
    } catch (e) {
      audioRef.current = null;
    }
  }, []);
  const play = () => {
    if (!audioRef.current) {
      // simple beep via WebAudio
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 880;
        g.gain.value = 0.02;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setTimeout(() => {
          o.stop();
          ctx.close();
        }, 40);
      } catch (e) {}
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };
  return { play };
}

export default function Tasbeeh() {
  const count = useStore((s) => s.count);
  const target = useStore((s) => s.target);
  const increment = useStore((s) => s.increment);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const toggleSound = useStore((s) => s.toggleSound);
  const modalOpen = useStore((s) => s.modalOpen);

  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const { play } = useClickSound();

  // persist count in localStorage
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("tasbeeh_count") || 0);
      if (!isNaN(saved) && saved > 0) {
        // set directly into zustand by replace state (no public setter) -> use reset/increment to reach value
        // quick hack: set via hydration by direct assignment (ok in this small app)
        const store = require("../store/useStore").useStore;
        store.setState({ count: saved });
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tasbeeh_count", String(count));
    } catch (e) {}
  }, [count]);

  // when modal opens (i.e., reached target), trigger confetti once
  useEffect(() => {
    if (modalOpen) {
      setConfettiTrigger(true);
    }
  }, [modalOpen]);

  const handleTap = () => {
    increment();
    if (soundEnabled) play();
  };

  // Circular progress percent
  const percent = Math.min(100, Math.round((count / target) * 100));

  return (
    <div className="max-w-3xl mx-auto p-6 mt-[-20px] md:mt-0">
      <div className="flex justify-between items-center mb-6">
        <div className="text-center mb-5 w-full">
          <h1 className="text-2xl font-bold counter-digital">السبحة الرقمية</h1>
          <p className="text-sm text-[var(--muted)]"> اضغط على الزر وابدأ</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="p-2 rounded-full glass cursor-pointer"
            aria-label="Toggle sound"
          >
            {soundEnabled ? "🔊" : "🔈"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: big circular counter */}
        <div className="flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            {/* glowing circle background */}
            <div
              style={{
                background:
                  "conic-gradient(from 0deg, var(--accent-start), var(--accent-end) 60%, rgba(255,255,255,0.04) 100%)",
                boxShadow: "0 30px 70px rgba(6,182,212,0.08)",
              }}
              className="absolute inset-0 rounded-full opacity-90 blur-[18px] -z-10"
            />
            {/* glass card */}
            <div
              className="glass rounded-full w-full h-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-center">
                <div
                  className="text-6xl md:text-[6.5rem] counter-digital"
                  style={{ lineHeight: 1 }}
                >
                  {count}
                </div>
                <div className="text-sm text-[var(--muted)] mt-2">
                  من {target} تسبيحات
                </div>

                {/* circular progress ring (SVG) */}
                <div className="mt-4 flex justify-center">
                  <svg width="140" height="140" viewBox="0 0 120 120">
                    <defs />
                    <g transform="rotate(-90 60 60)">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="9"
                        fill="none"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="url(#grad)"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={`${(Math.PI * 2 * 50 * percent) / 100} ${Math.PI * 2 * 50}`}
                        fill="none"
                        style={{ transition: "stroke-dasharray 300ms ease" }}
                      />
                      <linearGradient id="grad" x1="0" x2="1">
                        <stop offset="0%" stopColor="var(--accent-start)" />
                        <stop offset="100%" stopColor="var(--accent-end)" />
                      </linearGradient>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: big tasbeeh button and controls */}
        <div className="flex flex-col gap-5 items-center">
          <div
            className="w-56 h-56 md:w-72 md:h-72 rounded-full flex items-center justify-center cursor-pointer transform active:scale-95 transition"
            onClick={handleTap}
          >
            <div
              className="rounded-full w-full h-full flex items-center justify-center shadow-[inset_0_10px_30px_rgba(0,0,0,0.12)]"
              style={{
                background:
                  "radial-gradient(circle at 30% 10%, rgba(255,255,255,0.06), transparent 25%), linear-gradient(135deg, var(--accent-start), var(--accent-end))",
                boxShadow: "0 20px 60px rgba(7,17,34,0.12)",
              }}
            >
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-full glass flex flex-col items-center justify-center">
                <div className="text-3xl md:text-4xl font-semibold">سبح</div>
                <div className="text-sm text-[var(--muted)] mt-1">اضغط هنا</div>
              </div>
            </div>
          </div>

          <div className="w-full text-center">
            <div className="text-sm text-[var(--muted)] mb-2">
              التقدّم: {percent}%
            </div>
            <div className="h-2 w-full rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percent}%`,
                  background:
                    "linear-gradient(90deg,var(--accent-start),var(--accent-end))",
                  transition: "width 300ms ease",
                }}
              />
            </div>
            <div className="mt-3 text-xs text-[var(--muted)]">
              التغيّر بيحفظ أوتوماتيكي
            </div>

            {/* 👇 زرار إعادة التصفير */}
            <button
              onClick={() => useStore.getState().reset()}
              className="mt-5 mx-auto px-6 py-2 rounded-full glass text-sm font-semibold shadow-md 
             transition hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg,var(--accent-start),var(--accent-end))",
                color: "white",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              }}
            >
              <RotateCcw size={18} strokeWidth={2.2} />
              <span>إعادة التصفير</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confetti from top when target reached */}
      <Confetti
        trigger={confettiTrigger}
        count={50}
        onDone={() => setConfettiTrigger(false)}
      />
    </div>
  );
}
