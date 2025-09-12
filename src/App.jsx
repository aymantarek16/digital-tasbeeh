/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
// src/App.jsx
import React from "react";
import ThemeToggle from "./components/ThemeToggle";
import Tasbeeh from "./components/Tasbeeh";
import CongratsModal from "./components/CongratsModal";
import { useStore } from "./store/useStore";

function useCelebrateSound() {
  const play = () => {
    // try playing /sounds/celebrate.mp3 else play a short tone sequence
    const audio = new Audio("/sounds/celebrate.mp3");
    audio.volume = 0.8;
    audio.play().catch(() => {
      // fallback melody using WebAudio
      try {
        const ctx = new (window.AudioContext || window.AudioContext)();
        const notes = [660, 880, 990, 1320];
        let t = 0;
        notes.forEach((n, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.value = n;
          g.gain.value = 0.02;
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + t);
          o.stop(ctx.currentTime + t + 0.15);
          t += 0.17;
        });
        setTimeout(() => ctx.close(), 700);
      } catch (e) {}
    });
  };
  return play;
}

export default function App() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  // ensure theme sync if first load (script in index.html already set it)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored && stored !== theme) setTheme(stored);
    } catch (e) {}
  }, []);

  const celebrate = useCelebrateSound();

  return (
    <div className="min-h-screen">
      <nav className="py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold counter-digital">سبحة • Digital</div>
          <div className="text-sm text-[var(--muted)] ">By Ayman Tarek</div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </nav>

      <main className="py-6 px-4">
        <Tasbeeh />
      </main>

      <CongratsModal onCelebrateSound={celebrate} />
    </div>
  );
}
