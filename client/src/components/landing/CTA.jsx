import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";

export function CTA({ isLoggedIn }) {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background radial glow in dark mode */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-transparent dark:bg-indigo-600/10 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-[768px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Ready to showcase your best engineering?
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-[500px] mx-auto leading-relaxed">
          Create your personalized portfolio and ATS-optimized resume with Forged today.
        </p>

        <Link
          to={isLoggedIn ? "/dashboard" : "/register"}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5 transition-all duration-200"
        >
          <span>Get Started Free</span>
          <ArrowRight weight="bold" className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

