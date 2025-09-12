/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
// src/store/useStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      count: 0,
      target: 100,
      soundEnabled: true,
      theme: document.documentElement.getAttribute("data-theme") || "light",
      modalOpen: false,

      increment: () =>
        set((state) => {
          const next = state.count + 1;
          const hit = next >= state.target;
          if (hit) {
            // cap at target so we don't overshoot visually
            set({ count: state.target, modalOpen: true });
          } else {
            set({ count: next });
          }
          return {};
        }),

      reset: () => {
        set({ count: 0, modalOpen: false });
        window.location.reload();
      },

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      setTheme: (t) => {
        try {
          document.documentElement.setAttribute("data-theme", t);
          localStorage.setItem("theme", t);
        } catch (e) {}
        set({ theme: t });
      },

      closeModal: () => set({ modalOpen: false }),
    }),
    {
      name: "tasbeeh-storage", // المفتاح في localStorage
      partialize: (state) => ({
        count: state.count,
        target: state.target,
        soundEnabled: state.soundEnabled,
        theme: state.theme,
      }),
    }
  )
);
