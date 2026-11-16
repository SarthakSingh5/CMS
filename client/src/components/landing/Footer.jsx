export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050507] text-white pt-16 pb-12 relative overflow-hidden border-t border-white/5">
      {/* Accent gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col items-center pt-8 pb-4">
          {/* Large stylized watermarked text */}
          <div className="relative w-full flex justify-center select-none overflow-hidden">
            <span
              className="text-[52px] sm:text-[90px] md:text-[140px] font-bold tracking-tight leading-none text-center"
              style={{
                WebkitTextFillColor: "#050507",
                WebkitTextStroke: "1px rgba(255,255,255,0.18)",
                letterSpacing: "-0.04em",
              }}
            >
              FORGED.DEV
            </span>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5 w-full text-xs text-zinc-500">
            <p className="tracking-widest uppercase">
              (C) {currentYear} FORGED STUDIO // ARCHITECTED FOR DEVELOPERS
            </p>
            <p className="tracking-wider uppercase">
              BUILT WITH NODE.JS, EXPRESS, MONGO & REACT
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

