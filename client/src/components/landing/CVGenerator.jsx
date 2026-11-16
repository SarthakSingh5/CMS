import { FilePdf, Faders, Palette } from "@phosphor-icons/react";

const features = [
  {
    Icon: FilePdf,
    title: "Instant ATS-Ready PDF export",
    desc: "Extract all your portfolio data into a clean, formatted, printable A4 resume instantly.",
  },
  {
    Icon: Faders,
    title: "Customizable sections",
    desc: "Toggle projects, work experience, certifications, and technical skills to match specific roles.",
  },
  {
    Icon: Palette,
    title: "Unified developer branding",
    desc: "Your CV matches the fonts, typography scales, and aesthetics of your live portfolio.",
  },
];

export function CVGenerator() {
  return (
    <section className="py-24 border-b border-black/5 dark:border-white/[0.06] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: CV Preview Mockup */}
          <div className="relative h-[480px] w-full flex items-center justify-center lg:order-2">
            <div className="w-[320px] sm:w-[380px] bg-white text-zinc-900 rounded-2xl shadow-2xl p-7 border border-zinc-200/80 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Header */}
              <div className="flex items-center gap-5 mb-6 border-b border-zinc-200 pb-5">
                <div className="w-14 h-14 rounded-full bg-indigo-600/15 flex items-center justify-center font-bold text-indigo-600 text-lg">
                  AV
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="w-2/3 h-5 bg-zinc-800 rounded font-bold text-xs flex items-center px-2 text-white">
                    Alex Vance
                  </div>
                  <div className="w-1/2 h-3 bg-zinc-400 rounded" />
                </div>
              </div>

              {/* Sections Mock */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="w-1/3 h-3 bg-indigo-600 rounded mb-2" />
                  <div className="w-full h-2 bg-zinc-200 rounded mb-1.5" />
                  <div className="w-5/6 h-2 bg-zinc-200 rounded mb-1.5" />
                  <div className="w-4/6 h-2 bg-zinc-200 rounded" />
                </div>
                <div>
                  <div className="w-1/3 h-3 bg-indigo-600 rounded mb-2" />
                  <div className="w-full h-2 bg-zinc-200 rounded mb-1.5" />
                  <div className="w-3/4 h-2 bg-zinc-200 rounded" />
                </div>
                <div>
                  <div className="w-1/4 h-3 bg-indigo-600 rounded mb-2" />
                  <div className="flex gap-2">
                    <span className="text-[9px] bg-zinc-100 px-2 py-0.5 rounded font-mono">React</span>
                    <span className="text-[9px] bg-zinc-100 px-2 py-0.5 rounded font-mono">Node.js</span>
                    <span className="text-[9px] bg-zinc-100 px-2 py-0.5 rounded font-mono">TypeScript</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Explanation */}
          <div className="lg:order-1">
            <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 font-semibold block mb-4">
              Integrated CV Suite
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight mb-8 text-zinc-900 dark:text-white leading-tight">
              One dataset. Portfolio site and CV in sync.
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
        </div>
      </div>
    </section>
  );
}

