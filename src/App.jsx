/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
// src/App.jsx
import React from "react";
import { Helmet } from "react-helmet";
import ThemeToggle from "./components/ThemeToggle";
import Tasbeeh from "./components/Tasbeeh";
import CongratsModal from "./components/CongratsModal";
import { useStore } from "./store/useStore";

function useCelebrateSound() {
  const play = () => {
    const audio = new Audio("/sounds/celebrate.mp3");
    audio.volume = 0.8;
    audio.play().catch(() => {
      try {
        const ctx = new (window.AudioContext || window.AudioContext)();
        const notes = [660, 880, 990, 1320];
        let t = 0;
        notes.forEach((n) => {
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

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored && stored !== theme) setTheme(stored);
    } catch (e) {}
  }, []);

  const celebrate = useCelebrateSound();

  return (
    <>
      {/* 🧠 SEO META TAGS */}
      <Helmet>
        <html lang="ar" />
        <title>تسابيح رقمية | Digital Tasbeeh by Ayman Tarek</title>

        <meta
          name="description"
          content="سبّح بسهولة وعد تسبيحاتك إلكترونيًا مع Digital Tasbeeh. سبحة رقمية مجانية وسهلة الاستخدام للمسلمين لذكر الله في أي وقت وأي مكان. تصميم أنيق وواجهة بسيطة من تنفيذ أيمن طارق."
        />

        <meta
          name="keywords"
          content="تسابيح, تسبيح, تسابيح رقمية, تسبيح رقمي, tasabih, digital tasabih, tasbeeh digital, tasabih by ayman tarek, سبحة, السبحه, سبحه رقمية, سبحه ايمن طارق, Tasbeeh, ذكر الله, استغفار, سبحان الله, الحمد لله, الله أكبر, مسلم, أذكار, تسبيح إلكتروني"
        />

        <meta name="author" content="Ayman Tarek" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://digital-tasbeeh-flax.vercel.app/" />

        {/* 🌍 Open Graph (Facebook / WhatsApp Preview) */}
        <meta
          property="og:title"
          content="تسابيح رقمية | Digital Tasbeeh by Ayman Tarek"
        />
        <meta
          property="og:description"
          content="سبّح بسهولة وعد تسبيحاتك إلكترونيًا مع Digital Tasbeeh. موقع تسابيح رقمي مجاني وسهل الاستخدام للمسلمين في كل مكان."
        />
        <meta
          property="og:image"
          content="https://digital-tasbeeh-flax.vercel.app/og-image.png"
        />
        <meta
          property="og:url"
          content="https://digital-tasbeeh-flax.vercel.app/"
        />
        <meta property="og:type" content="website" />

        {/* 🐦 Twitter Preview */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="تسابيح رقمية | Digital Tasbeeh by Ayman Tarek"
        />
        <meta
          name="twitter:description"
          content="سبّح بسهولة وعد تسبيحاتك إلكترونيًا عبر موقع Digital Tasbeeh. عداد تسبيح رقمي من تصميم أيمن طارق."
        />
        <meta
          name="twitter:image"
          content="https://digital-tasbeeh-flax.vercel.app/og-image.png"
        />

        {/* 📱 Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
      </Helmet>

      {/* 🕌 الموقع */}
      <div className="min-h-screen">
        <nav className="py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold counter-digital">
              سبحة • Digital
            </div>
            <div className="text-sm text-[var(--muted)]">By Ayman Tarek</div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </nav>

        {/* 👇 الهيدر الجديد اللي فيه النص بتاعك */}
        <header className="px-2 pb-3 text-center border-b border-[var(--muted)]/20">
          <h1 className="text-2xl font-bold mb-2">🌿 سبحتك الرقمية اليومية</h1>
          <p className="text-[var(--muted)] leading-relaxed">
            تجربة هادئة لتسبيح الله واستغفاره بسهولة وسرعة.
            <br />
            صُممت بواسطة{" "}
            <span className="font-semibold">المهندس أيمن طارق</span> لترافقك في
            ذكرك لله في أي وقت وأي مكان.
          </p>
        </header>

        <main className="py-6 px-4">
          <Tasbeeh />
        </main>

        <CongratsModal onCelebrateSound={celebrate} />
      </div>
    </>
  );
}
