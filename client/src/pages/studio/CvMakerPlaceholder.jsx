import { FileUser, Sparkles, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function CvMakerPlaceholder() {
  return (
    <div className="h-full overflow-auto px-6 sm:px-10 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              CV & Resume Maker
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold">
              <Sparkles size={11} /> ATS Optimized
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Generate printable, ATS-compliant A4 developer CVs directly synced with your portfolio profile.
          </p>
        </div>

        <div className="border border-dashed border-black/10 dark:border-white/10 rounded-2xl p-12 text-center bg-white/[0.02]">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <FileUser size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
            Automated Resume Generator
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
            Automatically formats your technical skills, work history, projects, and education into high-density single-page and two-page layouts.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/studio/docs#cv-maker"
              className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
