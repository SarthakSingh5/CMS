import { Check, DeviceMobile, Cube } from "@phosphor-icons/react";

const features = [
  {
    Icon: Check,
    title: "Instant visual feedback",
    desc: "Changes to typography, colors, and layout update in real time. Zero page reloads required.",
  },
  {
    Icon: DeviceMobile,
    title: "Multi-device responsive preview",
    desc: "Toggle between desktop, tablet, and mobile viewports seamlessly to verify pixel-perfection.",
  },
  {
    Icon: Cube,
    title: "Intelligent template styling",
    desc: "Scoped CSS modules ensure portfolio layouts adapt flawlessly without leaking styles.",
  },
];

export function LiveEditor() {
  return (
    <section className="py-24 border-b border-black/5 dark:border-white/[0.06] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Feature Highlights */}
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 font-semibold block mb-4">
              Real-Time Visual Engine
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight mb-8 text-zinc-900 dark:text-white leading-tight">
              What you type is exactly what you get.
            </h2>

            <div className="flex flex-col gap-6">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-indigo-500/15">
                    <f.Icon weight="bold" className="text-indigo-600 dark:text-indigo-400 w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                      {f.title}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Isometric Preview Mockup */}
          <div className="relative h-[480px] w-full flex items-center justify-center" style={{ perspective: "1000px" }}>
            <div className="relative w-[380px] h-[300px] sm:w-[460px] sm:h-[340px]">
              {/* Back Card (Form / Editor Mockup) */}
              <div
                className="glass-card absolute inset-0 z-10 p-4 flex flex-col gap-3"
                style={{
                  transform: "rotateY(-8deg) rotateX(4deg) translateZ(-40px) translateX(-20px)",
                  opacity: 0.75,
                }}
              >
                <div className="w-full h-7 bg-black/5 dark:bg-white/5 rounded flex items-center px-3 border border-black/5 dark:border-white/5">
                  <div className="w-1/3 h-2 bg-indigo-500/30 rounded" />
                </div>
                <div className="flex gap-3 h-full">
                  <div className="w-1/3 h-full bg-black/5 dark:bg-white/5 rounded border border-black/5 dark:border-white/5 flex flex-col gap-2 p-2">
                    <div className="w-full h-3 bg-zinc-400/20 rounded" />
                    <div className="w-3/4 h-3 bg-zinc-400/20 rounded" />
                    <div className="w-full h-3 bg-zinc-400/20 rounded mt-3" />
                  </div>
                  <div className="flex-1 h-full bg-black/5 dark:bg-white/5 rounded border border-black/5 dark:border-white/5 p-3 flex flex-col gap-3">
                    <div className="w-1/2 h-6 bg-zinc-400/20 rounded" />
                    <div className="w-full h-24 bg-zinc-400/10 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Front Card (Rendered Portfolio Mockup) */}
              <div
                className="glass-card absolute inset-0 z-20 overflow-hidden shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
                style={{
                  transform: "rotateY(-8deg) rotateX(4deg) translateZ(35px) translateX(35px) translateY(15px)",
                }}
              >
                <div className="h-9 bg-white/70 dark:bg-black/70 border-b border-black/5 dark:border-white/10 flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <div className="ml-2 text-[10px] text-zinc-400 font-mono">alex_vance // portfolio</div>
                </div>
                <div className="h-full bg-gradient-to-br from-indigo-950 via-zinc-950 to-black p-6 flex flex-col gap-4 text-white">
                  <div className="w-2/3 h-7 bg-white/90 rounded shadow" />
                  <div className="w-full h-28 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xs text-zinc-400 font-mono">
                    // live_component_render
                  </div>
                  <div className="w-3/4 h-3 bg-white/30 rounded" />
                  <div className="w-1/2 h-3 bg-white/20 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

