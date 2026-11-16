import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const templates = [
  { name: "Brutalist Developer", tag: "Template 1", gradient: "from-purple-600 to-indigo-950" },
  { name: "Cyberpunk Terminal", tag: "Template 2", gradient: "from-emerald-500 to-slate-950" },
  { name: "Product Designer", tag: "Template 3", gradient: "from-rose-500 to-amber-950" },
  { name: "Minimalist Clean", tag: "Template 4", gradient: "from-zinc-400 to-zinc-900" },
  { name: "Creative Agency", tag: "Template 5", gradient: "from-cyan-500 to-blue-950" },
  { name: "Executive Suite", tag: "Template 6", gradient: "from-violet-600 to-fuchsia-950" },
];

export function TemplateShowcase() {
  return (
    <section id="templates" className="py-24 border-b border-black/5 dark:border-white/[0.06]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 font-semibold block mb-4">
              Curated Developer Themes
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-tight text-zinc-900 dark:text-white">
              Start with an architected template.
            </h2>
          </div>
          <Link
            to="/studio/templates"
            className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors"
          >
            Explore all 9 templates in Studio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <Link
              to="/studio/templates"
              key={t.name}
              className="glass-card group relative h-64 overflow-hidden rounded-2xl cursor-pointer flex flex-col justify-end p-2 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-2 bg-gradient-to-br ${t.gradient} rounded-xl z-0 opacity-80 group-hover:opacity-100 transition-opacity`}
              />

              {/* Tag Pill */}
              <div
                className="absolute top-4 right-4 z-10 rounded-full px-3 py-1"
                style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
              >
                <span className="text-[11px] text-white font-medium">{t.tag}</span>
              </div>

              {/* Name */}
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-base font-semibold text-white tracking-tight">{t.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

