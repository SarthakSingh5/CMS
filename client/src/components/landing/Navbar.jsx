import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import ThemeContext from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";
import { Sun, Moon } from "@phosphor-icons/react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-16 flex items-center transition-all duration-300 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#fdfbf9]/80 dark:bg-[#050507]/80 backdrop-blur-xl ${
        scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.6)]" : ""
      }`}
    >
      <div className="max-w-[1280px] w-full mx-auto px-6 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Forged<span className="font-serif italic text-indigo-500 font-normal">.studio</span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={toggleTheme}
            type="button"
            className="w-9 h-9 !bg-transparent !p-0 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 !border-none cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun weight="bold" className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon weight="bold" className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hidden sm:block whitespace-nowrap transition-colors"
              >
                Log in
              </Link>
              <div className="rounded-[13px] border border-dashed border-zinc-900/20 dark:border-white/20 p-[2px] shrink-0">
                <Link
                  to="/register"
                  className="block bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-sm font-semibold px-4 py-2 rounded-[11px] whitespace-nowrap hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-[13px] border border-dashed border-indigo-500/30 p-[2px]">
              <Link
                to="/studio"
                className="block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-[11px] transition-colors"
              >
                Open Studio
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

