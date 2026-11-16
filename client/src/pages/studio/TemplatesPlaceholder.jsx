import { LayoutTemplate, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function TemplatesPlaceholder() {
  return (
    <div className="h-full overflow-auto px-6 sm:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Templates Gallery
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Select any of the 9 curated developer visual identities to launch your customizer.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Sparkles size={14} />
            9 Templates Active
          </div>
        </div>

        {/* Quick card preview banner */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl p-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
              Template Engine Ready
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
              Template 1 (Brutalist Architecture) is compiled and ready for live preview and real-time form editing.
            </p>
          </div>
          <Link
            to="/studio/docs"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 whitespace-nowrap transition-colors"
          >
            Read Template Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
