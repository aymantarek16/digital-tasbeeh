/* eslint-disable no-unused-vars */
// src/components/ThemeToggle.jsx
import { Moon, Sun } from "lucide-react";
import { useStore } from "../store/useStore";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const theme = useStore((s) => s.theme);
  const toggleSound = useStore((s) => s.toggleSound);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const setTheme = useStore((s) => s.setTheme);

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSound}
          className="p-2 rounded-full glass cursor-pointer relative"
          aria-label="Toggle sound"
        >
          {soundEnabled ? "🔊" : "🔈"}
        </button>
      </div>

      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="
    p-2 rounded-full glass shadow-sm cursor-pointer
    transition-all duration-300 ease-out
    hover:bg-[rgba(255,255,255,0.08)] hover:rotate-6 hover:scale-110
  "
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: theme === "dark" ? 0 : 180 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-8 h-8 flex items-center justify-center text-[var(--text)]"
        >
          {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
        </motion.div>
      </button>
    </div>
  );
}
