import { useState } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink } from "lucide-react";

export function BrowserPreview({ url, username, children }) {
  const [device, setDevice] = useState("desktop"); // desktop | tablet | mobile

  const displayUrl = url || `forged.dev/${username || "yourname"}`;

  const deviceWidths = {
    desktop: "w-full max-w-6xl",
    tablet: "w-[768px]",
    mobile: "w-[390px]",
  };

  return (
    <div className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-zinc-100 dark:bg-black/40 p-4 sm:p-6 flex flex-col items-center">
      {/* Device Mode Switcher */}
      <div className="flex items-center gap-1 bg-white dark:bg-[#111118] border border-black/10 dark:border-white/10 rounded-xl p-1 mb-4 shadow-sm">
        <button
          type="button"
          onClick={() => setDevice("desktop")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            device === "desktop"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
          title="Desktop View"
        >
          <Monitor size={14} />
          <span className="hidden sm:inline">Desktop</span>
        </button>

        <button
          type="button"
          onClick={() => setDevice("tablet")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            device === "tablet"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
          title="Tablet View"
        >
          <Tablet size={14} />
          <span className="hidden sm:inline">Tablet</span>
        </button>

        <button
          type="button"
          onClick={() => setDevice("mobile")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            device === "mobile"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
          title="Mobile View"
        >
          <Smartphone size={14} />
          <span className="hidden sm:inline">Mobile</span>
        </button>
      </div>

      {/* Browser Chrome Container */}
      <div
        className={`${deviceWidths[device]} transition-all duration-300 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#07070a] shadow-2xl overflow-hidden mb-8`}
      >
        {/* Browser Top Bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-[#0e0e14] border-b border-black/5 dark:border-white/10 select-none">
          {/* Window control dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          {/* URL bar */}
          <div className="flex-1 mx-2 sm:mx-6">
            <div className="bg-white dark:bg-black/50 border border-black/5 dark:border-white/5 rounded-lg px-3 py-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center justify-between">
              <span className="truncate">{displayUrl}</span>
              <span className="text-[10px] text-emerald-500 font-sans font-medium flex items-center gap-1">
                ● Live
              </span>
            </div>
          </div>
        </div>

        {/* Live Content Frame */}
        <div className="w-full overflow-x-hidden min-h-[500px]">
          {children}
        </div>
      </div>
    </div>
  );
}

