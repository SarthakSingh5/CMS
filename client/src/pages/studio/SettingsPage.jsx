import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import ThemeContext from "../../context/ThemeContext";
import { Settings, Sun, Moon, User, Bell, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const initial = user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U";
  const avatarUrl = user?.avatar && user.avatar.length > 0 ? user.avatar : null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Settings size={24} strokeWidth={1.5} className="text-zinc-500" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        </div>

        {/* Profile Section */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3 flex items-center gap-2">
            <User size={14} strokeWidth={1.5} />
            Profile Information
          </h2>
          <div className="bg-white dark:bg-[#0d0d12] border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-5">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.username || "User"}
                  className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-indigo-500/20"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  {initial}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {user?.username || user?.name || "Forged Creator"}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user?.email || "user@forged.studio"}
                </p>
                <span className="inline-block mt-2 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {user?.role ? user.role.toUpperCase() : "CREATOR"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3 flex items-center gap-2">
            <Sun size={14} strokeWidth={1.5} />
            Interface Theme
          </h2>
          <div className="bg-white dark:bg-[#0d0d12] border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Select your studio theme preference.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (theme === "dark") toggleTheme();
                }}
                className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border transition-all cursor-pointer ${
                  theme === "light"
                    ? "border-indigo-600 bg-indigo-500/5 text-indigo-600 shadow-sm"
                    : "border-black/5 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-indigo-500/40"
                }`}
              >
                <Sun size={22} strokeWidth={1.5} className={theme === "light" ? "text-indigo-600" : ""} />
                <span className="text-sm font-semibold">Light Theme</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== "dark") toggleTheme();
                }}
                className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border transition-all cursor-pointer ${
                  theme === "dark"
                    ? "border-indigo-400 bg-indigo-500/10 text-indigo-400 shadow-sm"
                    : "border-black/5 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-indigo-500/40"
                }`}
              >
                <Moon size={22} strokeWidth={1.5} className={theme === "dark" ? "text-indigo-400" : ""} />
                <span className="text-sm font-semibold">Dark Theme</span>
              </button>
            </div>
          </div>
        </section>

        {/* Security & Authentication */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3 flex items-center gap-2">
            <Shield size={14} strokeWidth={1.5} />
            Security & Authentication
          </h2>
          <div className="bg-white dark:bg-[#0d0d12] border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">JWT Token Session</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Authenticated REST calls with bearer tokens to MongoDB Atlas backend.
                </p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Active
              </span>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3 flex items-center gap-2">
            <Bell size={14} strokeWidth={1.5} />
            Notifications
          </h2>
          <div className="bg-white dark:bg-[#0d0d12] border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Deployment Alerts</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Get notified when your live portfolio or sandbox deployment is updated.
                </p>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full">
                Enabled
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

