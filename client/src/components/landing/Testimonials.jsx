const testimonials = [
  {
    initials: "SM",
    name: "Sarah Miller",
    role: "Full-Stack Engineer",
    color: "bg-indigo-600",
    quote:
      "“I rebuilt my portfolio in a single evening. The templates look incredible, and the instant form preview makes iteration effortless.”",
  },
  {
    initials: "JD",
    name: "James Doe",
    role: "DevOps & Cloud Architect",
    color: "bg-emerald-600",
    quote:
      "“Forged gave me the exact portfolio result I wanted. Being able to jump into the code sandbox and tweak raw components is unmatched.”",
  },
  {
    initials: "EL",
    name: "Elena Rostova",
    role: "Creative Developer",
    color: "bg-rose-600",
    quote:
      "“Finally, a portfolio platform designed specifically for engineers. Typography, spacing, and CSS isolation are executed with excellence.”",
  },
  {
    initials: "MW",
    name: "Marcus Wright",
    role: "Backend Specialist",
    color: "bg-amber-600",
    quote:
      "“The synchronized CV generator saved me hours of reformatting. Exporting to PDF while keeping the styling consistent landed me interviews.”",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 border-b border-black/5 dark:border-white/[0.06]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 font-semibold block mb-4">
            Developer Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-tight text-zinc-900 dark:text-white">
            Engineered for developers who care about craft.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass-card p-6 flex flex-col justify-between rounded-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 italic">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                <div
                  className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
                >
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

