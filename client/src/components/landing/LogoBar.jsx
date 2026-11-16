import {
  FigmaLogo,
  StripeLogo,
  FramerLogo,
  GithubLogo,
  NotionLogo,
} from "@phosphor-icons/react";

const logos = [
  { Icon: FigmaLogo, name: "Figma" },
  { Icon: StripeLogo, name: "Stripe" },
  { Icon: FramerLogo, name: "Framer" },
  { Icon: GithubLogo, name: "GitHub" },
  { Icon: NotionLogo, name: "Notion" },
];

export function LogoBar() {
  return (
    <section className="py-12 border-b border-black/5 dark:border-white/[0.06]">
      <div className="max-w-[1280px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 text-center mb-8 font-medium">
          Powering portfolios for developers from top engineering teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
          {logos.map(({ Icon, name }) => (
            <div key={name} className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <Icon weight="fill" className="w-7 h-7" />
              <span className="text-sm font-semibold tracking-tight">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

