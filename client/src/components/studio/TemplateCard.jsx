import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function TemplateCard({
  id,
  name,
  category,
  description,
  price,
  originalPrice,
  tags = [],
  accentColor = "#6366f1",
  previewContent,
  featured,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/studio/templates/${id}`)}
      className="group relative w-full h-[430px] p-3 border border-dashed border-black/10 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 flex flex-col cursor-pointer bg-white dark:bg-[#0a0a0f] rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      {/* Corner crosshairs matching architect aesthetic */}
      <div className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-transparent group-hover:border-indigo-500 transition-colors duration-300" />
      <div className="absolute -top-px -right-px w-2.5 h-2.5 border-t border-r border-transparent group-hover:border-indigo-500 transition-colors duration-300" />
      <div className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b border-l border-transparent group-hover:border-indigo-500 transition-colors duration-300" />
      <div className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-transparent group-hover:border-indigo-500 transition-colors duration-300" />

      {/* Featured Chip */}
      {featured && (
        <div className="absolute top-5 right-5 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-md shadow-indigo-600/30">
          <Sparkles size={11} /> Featured
        </div>
      )}

      {/* Preview Viewport */}
      <div
        className="w-full grow bg-zinc-100 dark:bg-black/50 rounded-xl overflow-hidden relative mb-4 border border-black/5 dark:border-white/5"
        style={{ contain: "layout style paint" }}
      >
        {previewContent ? (
          previewContent
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Themed background glow */}
            <div
              className="absolute inset-0 opacity-15 blur-2xl pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />
            {/* Mock layout wireframe */}
            <div className="w-full max-w-[200px] space-y-2 opacity-60">
              <div className="h-4 w-2/3 bg-zinc-400 dark:bg-zinc-600 rounded mx-auto" />
              <div className="h-2 w-full bg-zinc-300 dark:bg-zinc-700 rounded" />
              <div className="h-2 w-4/5 bg-zinc-300 dark:bg-zinc-700 rounded mx-auto" />
              <div className="pt-2 flex justify-center gap-1.5">
                <div className="h-5 w-12 bg-zinc-300 dark:bg-zinc-700 rounded" />
                <div className="h-5 w-12 bg-zinc-300 dark:bg-zinc-700 rounded" />
              </div>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-4 tracking-wider uppercase">
              {category} Style
            </span>
          </div>
        )}
      </div>

      {/* Card Info Details */}
      <div className="px-1.5 pb-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-zinc-900 dark:text-white font-bold text-base tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {name}
            </h2>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
              {category}
            </span>
          </div>

          {/* Price Badges */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {originalPrice && (
              <span className="text-zinc-400 line-through text-[11px]">
                {originalPrice}
              </span>
            )}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs px-2 py-0.5 rounded-full bg-emerald-500/10">
              {price}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-3">
          {description}
        </p>

        {/* Footer: Tags + Arrow button */}
        <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded-md truncate"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
            <span>Customize</span>
            <ArrowUpRight size={13} strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
