import { X, FileCode, FileText, FileJson } from "lucide-react";

function getFileName(path = "") {
  return path.split("/").pop() || path;
}

function getFileIcon(fileName = "") {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".json")) {
    return <FileJson size={13} className="text-amber-400 shrink-0" />;
  }
  if (lower.endsWith(".css")) {
    return <FileCode size={13} className="text-purple-400 shrink-0" />;
  }
  if (lower.endsWith(".tsx") || lower.endsWith(".ts") || lower.endsWith(".jsx") || lower.endsWith(".js")) {
    return <FileCode size={13} className="text-indigo-400 shrink-0" />;
  }
  return <FileText size={13} className="text-zinc-400 shrink-0" />;
}

export function FileTabs({ openFiles = [], activeFile = null, onSelectTab, onCloseTab }) {
  if (openFiles.length === 0) return null;

  return (
    <div className="flex items-center overflow-x-auto border-b border-zinc-800 bg-[#141418] scrollbar-none select-none shrink-0 h-9">
      {openFiles.map((filePath) => {
        const isActive = filePath === activeFile;
        const name = getFileName(filePath);

        return (
          <div
            key={filePath}
            onClick={() => onSelectTab(filePath)}
            className={`group flex items-center gap-2 border-r border-zinc-800 px-3.5 h-full text-xs font-mono cursor-pointer transition-colors shrink-0 ${
              isActive
                ? "bg-[#1e1e24] text-white border-t-2 border-t-indigo-500 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border-t-2 border-t-transparent"
            }`}
          >
            {getFileIcon(name)}
            <span className="truncate max-w-[140px]">{name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(filePath);
              }}
              className="rounded p-0.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60 opacity-60 group-hover:opacity-100 transition-opacity ml-1"
              title="Close tab"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default FileTabs;

