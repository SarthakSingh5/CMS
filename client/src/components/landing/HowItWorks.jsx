import { Layout, MagicWand, RocketLaunch } from "@phosphor-icons/react";

const steps = [
  {
    num: "1",
    Icon: Layout,
    title: "Choose a foundation",
    desc: "Select from our gallery of 9 developer templates engineered for aesthetics and speed.",
  },
  {
    num: "2",
    Icon: MagicWand,
    title: "Customize with live feedback",
    desc: "Update bio, skills, and projects in the split-screen form with real-time visual rendering.",
  },
  {
    num: "3",
    Icon: RocketLaunch,
    title: "Deploy or edit code",
    desc: "Launch an in-browser cloud container to edit actual code, or export directly to GitHub and Vercel.",
  },
];

export function HowItWorks() {
  return (
    <section id="features" className="py-24 border-b border-black/5 dark:border-white/[0.06] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 font-semibold block mb-4">
            Simple Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-tight text-zinc-900 dark:text-white">
            From empty canvas to deployed site.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-zinc-300 dark:border-zinc-800 z-0" />

          {steps.map((step) => (
            <div key={step.num} className="relative flex flex-col items-center text-center z-10">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-[120px] font-bold text-zinc-900/[0.04] dark:text-white/[0.05] leading-none select-none z-[-1]">
                {step.num}
              </div>
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-sm">
                <step.Icon weight="fill" className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">{step.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-[280px] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

