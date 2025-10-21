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
  const modalOpen = useStore((s) => s.modalOpen);
  const soundEnabled = useStore((s) => s.soundEnabled);

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
    <div className="max-w-3xl mx-auto p-6 mt-[-45px] md:mt-0 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-1">
        <div className="text-center w-full">
          <h2 className="text-lg md:text-xl font-semibold text-[var(--text)] mt-2">
          فَسَبِّحْ بِاسْمِ رَبِّكَ الْعَظِيمِ 
          </h2>
          <p className="text-sm text-[var(--muted)]"> ابدأ الذِّكر بلمسة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center ">
        {/* Left: big circular counter */}
        <div className="flex justify-center">
          <div className="relative w-50 h-50 md:w-100 md:h-90 flex items-center justify-center">
            {/* glowing circle background */}
            <div
              style={{
                background:
                  "conic-gradient(from 0deg, #2e5e3a, #c9a97a 60%, rgba(255,255,255,0.04) 100%)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
              }}
              className="absolute inset-0 rounded-full opacity-90 blur-[18px] -z-10"
            />
            {/* glass card */}
            <div
              className="rounded-full w-full h-full flex items-center justify-center backdrop-blur-md"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(135deg, rgba(46,94,58,0.8), rgba(201,169,122,0.75))",
                boxShadow:
                  "0 20px 40px rgba(0,0,0,0.4), inset 0 6px 20px rgba(255,255,255,0.05)",
              }}
            >
              <div className="text-center">
                <div
                  className="text-4xl md:text-[6.5rem] counter-digital"
                  style={{ lineHeight: 1, color: "#f5f5f5" }}
                >
                  {count}
                </div>
                <div className="text-xs md:text-sm text-[var(--text)] mt-2">
                  من {target} تسبيحات
                </div>

                {/* circular progress ring (SVG) */}
                <div className="mt-4 flex justify-center">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 120 120"
                    className="md:w-[140px] md:h-[140px]"
                  >
                    <defs />
                    <g transform="rotate(-90 60 60)">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="rgba(255,255,255,0.08)"
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
                        strokeDasharray={`${
                          (Math.PI * 2 * 50 * percent) / 100
                        } ${Math.PI * 2 * 50}`}
                        fill="none"
                        style={{ transition: "stroke-dasharray 300ms ease" }}
                      />
                      <linearGradient id="grad" x1="0" x2="1">
                        <stop offset="0%" stopColor="#2e5e3a" />
                        <stop offset="100%" stopColor="#c9a97a" />
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
            className="w-35 h-35 md:w-72 md:h-72 rounded-full flex items-center justify-center cursor-pointer transform active:scale-95 transition"
            onClick={handleTap}
          >
            <div
              className="rounded-full w-full h-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 30% 10%, rgba(255,255,255,0.08), transparent 25%), linear-gradient(135deg, #2e5e3a, #c9a97a)",
                boxShadow:
                  "0 25px 50px rgba(0,0,0,0.45), inset 0 8px 20px rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="w-28 h-28 md:w-56 md:h-56 rounded-full backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="text-lg md:text-4xl font-semibold text-white">
                  سبح
                </div>
                <div className="text-xs md:text-sm text-[var(--text)] mt-1">
                  اضغط هنا
                </div>
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
                  background: "linear-gradient(90deg, #2e5e3a, #c9a97a)",
                  transition: "width 300ms ease",
                }}
              />
            </div>

            {/* 👇 زرار إعادة التصفير */}
            <button
              onClick={() => useStore.getState().reset()}
              className="mt-5 mx-auto px-6 py-2 rounded-full text-sm font-semibold shadow-md 
       transition hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              style={{
                background: "linear-gradient(135deg,#2e5e3a,#c9a97a)",
                color: "white",
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
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
