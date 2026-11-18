import { useState } from "react";
import axios from "axios";
import {
  FileText,
  FileCode,
  FileJson,
  Folder,
  FolderOpen,
  ChevronRight,
  Trash2,
  Loader2,
} from "lucide-react";

function getFileIcon(fileName = "") {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".json")) {
    return <FileJson size={14} className="text-amber-400 shrink-0" />;
  }
  if (lower.endsWith(".css")) {
    return <FileCode size={14} className="text-purple-400 shrink-0" />;
  }
  if (lower.endsWith(".tsx") || lower.endsWith(".ts") || lower.endsWith(".jsx") || lower.endsWith(".js")) {
    return <FileCode size={14} className="text-indigo-400 shrink-0" />;
  }
  return <FileText size={14} className="text-zinc-400 shrink-0" />;
}

export function FileTreeItem({
  entry,
  depth = 0,
  sandboxId,
  selectedPath,
  onFileSelect,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(depth === 0 || entry.name === "app");
  const [children, setChildren] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isDir = entry.type === "dir";
  const isSelected = entry.path === selectedPath;

  async function toggleFolder() {
    if (!isDir) return;

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (!children) {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `/api/sandbox/files?id=${sandboxId}&path=${encodeURIComponent(entry.path)}`
        );
        const sorted = (res.data.entries || []).sort((a, b) => {
          if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
        setChildren(sorted);
      } catch (err) {
        console.error("Failed to load folder contents:", err);
        setChildren([]);
      } finally {
        setIsLoading(false);
      }
    }

    setIsOpen(true);
  }

  function handleClick() {
    if (isDir) {
      toggleFolder();
    } else {
      onFileSelect(entry.path);
    }
  }

  function handleDelete(e) {
    e.stopPropagation();
    if (window.confirm(`Delete ${entry.name}?`)) {
      onDelete(entry.path);
    }
  }

  return (
    <div>
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 14 + 10}px` }}
        className={`group flex items-center gap-1.5 py-1 px-2 text-xs font-mono cursor-pointer transition-colors select-none ${
          isSelected
            ? "bg-indigo-600/20 text-white font-medium border-l-2 border-indigo-500"
            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 border-l-2 border-transparent"
        }`}
      >
        {/* Chevron for directories */}
        {isDir ? (
          <ChevronRight
            size={12}
            className={`shrink-0 text-zinc-500 transition-transform duration-150 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {/* Folder or File icon */}
        {isDir ? (
          isOpen ? (
            <FolderOpen size={14} className="text-amber-400 shrink-0" />
          ) : (
            <Folder size={14} className="text-amber-400 shrink-0" />
          )
        ) : (
          getFileIcon(entry.name)
        )}

        <span className="truncate flex-1">{entry.name}</span>

        {/* Delete icon on hover */}
        <button
          type="button"
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 rounded p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-all shrink-0"
          title={`Delete ${entry.name}`}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Expanded directory children */}
      {isDir && isOpen && (
        <div>
          {isLoading ? (
            <div
              className="py-1 flex items-center gap-2 text-[11px] text-zinc-500 font-mono"
              style={{ paddingLeft: `${(depth + 1) * 14 + 10}px` }}
            >
              <Loader2 size={11} className="animate-spin text-zinc-400" />
              <span>Loading...</span>
            </div>
          ) : (
            children?.map((child) => (
              <FileTreeItem
                key={child.path}
                entry={child}
                depth={depth + 1}
                sandboxId={sandboxId}
                selectedPath={selectedPath}
                onFileSelect={onFileSelect}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default FileTreeItem;

