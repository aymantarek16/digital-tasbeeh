/* eslint-disable no-unused-vars */
// src/components/CongratsModal.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";

export default function CongratsModal({ onCelebrateSound = () => {} }) {
  const modalOpen = useStore((s) => s.modalOpen);
  const reset = useStore((s) => s.reset);
  const close = useStore((s) => s.closeModal);

  useEffect(() => {
    if (modalOpen) {
      onCelebrateSound();
    }
  }, [modalOpen, onCelebrateSound]);

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
        >
          <motion.div
            initial={{ scale: 0.8, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[92%] max-w-md glass rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-3">🎉 مبروك! 🎉</div>
            <div className="text-lg font-semibold mb-4">خلصت 100 تسبيحة — عمل رائع ✨</div>
            <p className="mb-6 text-sm text-[var(--muted)]">
              ممكن تكمل دورة جديدة أو تعيد من أول، الخيار ليك.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  reset();
                  close();
                }}
                className="px-4 py-2 rounded-full glass"
              >
                ابدأ من أول
              </button>
              <button
                onClick={() => {
                  close();
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-white"
              >
                خلاص
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
