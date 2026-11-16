import { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import ThemeContext from "../../context/ThemeContext";
import {
  PanelLeftClose,
  PanelLeft,
  FileText,
  LayoutTemplate,
  FileUser,
  Settings,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

export function AppSidebar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const pathname = location.pathname;

  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isExpanded = !collapsed;
  const initial = user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U";
  const avatarUrl = user?.avatar && user.avatar.length > 0 ? user.avatar : null;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside
      className={`h-full bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col shrink-0 transition-all duration-200 ease-in-out relative select-none z-30 ${
        isExpanded ? "w-[220px]" : "w-[56px]"
      }`}
    >
      {/* Top bar — Brand + collapse button */}
      <div className="h-14 px-3.5 flex items-center justify-between border-b border-[var(--sidebar-border)]">
        {isExpanded ? (
          <>
            <Link to="/" className="flex items-center gap-2 group overflow-hidden">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                F
              </div>
              <span className="text-[15px] font-bold tracking-tight text-[var(--sidebar-fg)] whitespace-nowrap">
                Forged<span className="font-serif italic text-indigo-500 font-normal">.studio</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={18} strokeWidth={1.5} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="w-8 h-8 mx-auto rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <PanelLeft size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Documentation Section */}
      <div className="mt-3 px-2">
        <Link
          to="/studio/docs"
          className={`flex items-center ${isExpanded ? "gap-2.5 px-2.5" : "justify-center"} py-2 text-[13px] rounded-lg transition-colors ${
            pathname.startsWith("/studio/docs")
              ? "text-indigo-400 font-medium bg-indigo-500/10 border-l-2 border-indigo-500"
              : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
          }`}
          title="Documentation"
        >
          <FileText size={15} strokeWidth={1.5} className="shrink-0" />
          {isExpanded && <span className="whitespace-nowrap overflow-hidden">Documentation</span>}
        </Link>
      </div>

      <div className="mx-3.5 my-2.5 border-t border-[var(--sidebar-border)]" />

      {/* Tools Section */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {isExpanded && (
          <h3 className="px-2.5 mb-1.5 text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">
            Tools
          </h3>
        )}

        <Link
          to="/studio/templates"
          className={`flex items-center ${isExpanded ? "gap-2.5 px-2.5" : "justify-center"} py-2 text-[13px] rounded-lg transition-colors ${
            pathname.startsWith("/studio/templates")
              ? "text-indigo-400 font-medium bg-indigo-500/10 border-l-2 border-indigo-500"
              : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
          }`}
          title="Templates"
        >
          <LayoutTemplate size={15} strokeWidth={1.5} className="shrink-0" />
          {isExpanded && <span className="whitespace-nowrap overflow-hidden">Templates</span>}
        </Link>

        <Link
          to="/studio/cv-maker"
          className={`flex items-center ${isExpanded ? "gap-2.5 px-2.5" : "justify-center"} py-2 text-[13px] rounded-lg transition-colors ${
            pathname.startsWith("/studio/cv-maker")
              ? "text-indigo-400 font-medium bg-indigo-500/10 border-l-2 border-indigo-500"
              : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
          }`}
          title="CV Maker"
        >
          <FileUser size={15} strokeWidth={1.5} className="shrink-0" />
          {isExpanded && <span className="whitespace-nowrap overflow-hidden">CV Maker</span>}
        </Link>
      </div>

      {/* Support Section */}
      <div className="px-2 pb-2">
        <div className="mx-1.5 mb-2 border-t border-[var(--sidebar-border)]" />
        {isExpanded && (
          <h3 className="px-2.5 mb-1.5 text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">
            Support
          </h3>
        )}
        <div className="space-y-1">
          <Link
            to="/studio/help"
            className={`flex items-center ${isExpanded ? "gap-2.5 px-2.5" : "justify-center"} py-1.5 text-[12px] rounded-lg transition-colors ${
              pathname.startsWith("/studio/help")
                ? "text-indigo-400 font-medium bg-indigo-500/10"
                : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
            }`}
            title="Help & Support"
          >
            <HelpCircle size={14} strokeWidth={1.5} className="shrink-0" />
            {isExpanded && <span className="whitespace-nowrap overflow-hidden">Help & Support</span>}
          </Link>

          <Link
            to="/studio/feedback"
            className={`flex items-center ${isExpanded ? "gap-2.5 px-2.5" : "justify-center"} py-1.5 text-[12px] rounded-lg transition-colors ${
              pathname.startsWith("/studio/feedback")
                ? "text-indigo-400 font-medium bg-indigo-500/10"
                : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
            }`}
            title="Feedback"
          >
            <MessageSquare size={14} strokeWidth={1.5} className="shrink-0" />
            {isExpanded && <span className="whitespace-nowrap overflow-hidden">Feedback</span>}
          </Link>
        </div>
      </div>

      {/* Bottom User Profile + Dropdown */}
      <div className="relative border-t border-[var(--sidebar-border)] p-2" ref={dropdownRef}>
        {/* Dropdown popup */}
        {dropdownOpen && (
          <div
            className={`absolute bottom-full mb-2 bg-[#0d0d12] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 text-zinc-300 ${
              isExpanded ? "left-2 right-2" : "left-2 w-52"
            }`}
          >
            {/* User header */}
            <div className="px-3.5 py-3 border-b border-white/10 flex items-center gap-2.5 bg-white/[0.02]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {initial}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-[13px] font-semibold text-white truncate">
                  {user?.username || user?.name || "Forged Creator"}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {user?.email || "user@forged.studio"}
                </p>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-1 space-y-0.5">
              <Link
                to="/studio/settings"
                onClick={() => setDropdownOpen(false)}
                className="w-full px-3 py-2 flex items-center gap-2.5 text-[12px] text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
              >
                <Settings size={14} strokeWidth={1.5} />
                Settings
              </Link>

              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full px-3 py-2 flex items-center gap-2.5 text-[12px] text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors cursor-pointer text-left"
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={14} strokeWidth={1.5} className="text-amber-400" />
                    <span>Light mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} strokeWidth={1.5} className="text-indigo-400" />
                    <span>Dark mode</span>
                  </>
                )}
              </button>

              <Link
                to="/studio/feedback"
                onClick={() => setDropdownOpen(false)}
                className="w-full px-3 py-2 flex items-center gap-2.5 text-[12px] text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
              >
                <MessageSquare size={14} strokeWidth={1.5} />
                Submit feedback
              </Link>

              <Link
                to="/studio/help"
                onClick={() => setDropdownOpen(false)}
                className="w-full px-3 py-2 flex items-center gap-2.5 text-[12px] text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
              >
                <HelpCircle size={14} strokeWidth={1.5} />
                Help & support
              </Link>
            </div>

            {/* Logout button */}
            <div className="border-t border-white/10 p-1">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full px-3 py-2 flex items-center gap-2.5 text-[12px] text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors cursor-pointer text-left"
              >
                <LogOut size={14} strokeWidth={1.5} />
                Log out
              </button>
            </div>
          </div>
        )}

        {/* User button trigger */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`w-full py-2 flex items-center rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer text-left ${
            isExpanded ? "px-2 gap-2.5" : "justify-center px-0"
          }`}
          title={user?.username || user?.name || "Account"}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
              {initial}
            </div>
          )}

          {isExpanded && (
            <div className="overflow-hidden flex-1 flex items-center justify-between gap-1.5">
              <div className="overflow-hidden">
                <p className="text-[12px] font-semibold text-[var(--sidebar-fg)] truncate">
                  {user?.username || user?.name || "Creator"}
                </p>
                <p className="text-[10px] text-zinc-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
              <ChevronDown
                size={13}
                strokeWidth={1.5}
                className={`text-zinc-400 transition-transform duration-200 shrink-0 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}

