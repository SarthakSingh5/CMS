export function DocsNav({ sections, activeSection, onSectionClick }) {
  return (
    <nav className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-[var(--sidebar-border)] h-full overflow-y-auto bg-[var(--bg-color)] select-none">
      <div className="px-5 pt-8 pb-3">
        <p className="text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">
          On this page
        </p>
      </div>
      <ul className="px-3 space-y-0.5 pb-8">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const Icon = section.icon;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onSectionClick(section.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg transition-colors text-left cursor-pointer ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-l-2 border-indigo-600 dark:border-indigo-400 font-medium"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <Icon size={14} strokeWidth={1.5} className={isActive ? "text-indigo-600 dark:text-indigo-400" : ""} />
                <span className="truncate">{section.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
