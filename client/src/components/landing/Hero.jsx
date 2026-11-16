import { Link } from "react-router-dom";
import { ArrowRight, Sparkle } from "@phosphor-icons/react";

export function Hero({ isLoggedIn }) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center border-b border-black/5 dark:border-white/[0.06]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid opacity-60 dark:opacity-30 z-0 pointer-events-none" />

      {/* Atmospheric Glow in Dark Mode */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-transparent dark:bg-indigo-600/15 blur-[130px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col items-center text-center w-full">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-dashed border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 backdrop-blur-sm mb-8 animate-fade-in">
          <Sparkle weight="fill" className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">
            Forged Studio v2.0
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-[52px] sm:text-[68px] md:text-[80px] font-bold tracking-tight leading-[1.08] max-w-[840px] mb-6 text-zinc-900 dark:text-white">
          <span>Craft your developer portfolio</span>{" "}
          <span className="font-serif italic font-normal text-indigo-600 dark:text-indigo-400">
            effortlessly.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-[560px] leading-relaxed mb-10">
          Build, customize, and deploy developer portfolios and ATS-optimized CVs in minutes. Form-driven live previews and in-browser cloud sandboxes.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="rounded-[14px] border border-dashed border-zinc-900/30 dark:border-white/20 p-[2px] w-full sm:w-auto">
            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-base font-semibold px-7 py-3.5 rounded-[12px] shadow-lg shadow-zinc-900/10 dark:shadow-white/5 transition-all duration-200"
            >
              Start building free
              <ArrowRight weight="bold" className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-[14px] border border-dashed border-zinc-300 dark:border-zinc-800 p-[2px] w-full sm:w-auto">
            <a
              href="#templates"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-zinc-700 dark:text-zinc-300 text-base font-semibold px-7 py-3.5 rounded-[12px] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              Explore 9 Templates
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

