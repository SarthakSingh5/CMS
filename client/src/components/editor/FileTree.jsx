import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FilePlus, FolderPlus, RotateCw, Loader2, FolderTree } from "lucide-react";
import FileTreeItem from "./FileTreeItem";

export function FileTree({
  sandboxId,
  selectedPath,
  onFileSelect,
  onTreeChange,
}) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemType, setNewItemType] = useState(null); // 'file' | 'dir' | null
  const [newItemName, setNewItemName] = useState("");

  const fetchEntries = useCallback(async () => {
    if (!sandboxId) return;
    try {
      const res = await axios.get(`/api/sandbox/files?id=${sandboxId}&path=/home/user`);
      const sorted = (res.data.entries || []).sort((a, b) => {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      setEntries(sorted);
    } catch (err) {
      console.error("Failed to load root files:", err);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [sandboxId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleCreateItem() {
    if (!newItemName.trim() || !newItemType || !sandboxId) return;

    const cleanName = newItemName.trim().replace(/^\/+/, "");
    const targetPath = `/home/user/${cleanName}`;

    try {
      if (newItemType === "file") {
        await axios.post("/api/sandbox/files/write", {
          id: sandboxId,
          path: targetPath,
          content: "// New file created in Forged IDE\n",
        });
      } else {
        await axios.post("/api/sandbox/files/mkdir", {
          id: sandboxId,
          path: targetPath,
        });
      }

      setNewItemType(null);
      setNewItemName("");
      await fetchEntries();
      if (onTreeChange) onTreeChange();
      if (newItemType === "file") {
        onFileSelect(targetPath);
      }
    } catch (err) {
      console.error("Failed to create file/folder:", err);
    }
  }

  async function handleDelete(path) {
    if (!sandboxId) return;
    try {
      await axios.post("/api/sandbox/files/delete", {
        id: sandboxId,
        path,
      });
      await fetchEntries();
      if (onTreeChange) onTreeChange();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#111115] border-r border-zinc-800 select-none overflow-hidden font-mono text-xs">
      {/* Explorer Header */}
      <div className="flex items-center justify-between px-3 h-9 border-b border-zinc-800 bg-[#16161c] shrink-0">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <FolderTree size={13} className="text-indigo-400" />
          <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-300">
            Explorer
          </span>
        </div>

        <div className="flex items-center gap-1 text-zinc-400">
          <button
            type="button"
            onClick={() => setNewItemType("file")}
            className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="New File"
          >
            <FilePlus size={13} />
          </button>
          <button
            type="button"
            onClick={() => setNewItemType("dir")}
            className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="New Folder"
          >
            <FolderPlus size={13} />
          </button>
          <button
            type="button"
            onClick={fetchEntries}
            className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="Refresh Explorer"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* New Item Prompt */}
      {newItemType && (
        <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900/80 p-2 shrink-0">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateItem();
              if (e.key === "Escape") {
                setNewItemType(null);
                setNewItemName("");
              }
            }}
            placeholder={newItemType === "file" ? "app/custom.tsx" : "components"}
            className="flex-1 rounded bg-zinc-950 px-2 py-1 text-xs text-zinc-200 outline-none ring-1 ring-indigo-500/50 focus:ring-indigo-500"
            autoFocus
          />
          <button
            type="button"
            onClick={handleCreateItem}
            className="rounded bg-indigo-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setNewItemType(null);
              setNewItemName("");
            }}
            className="rounded px-1.5 py-1 text-[11px] text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </button>
        </div>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-1 scrollbar-none">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-zinc-500 text-xs">
            <Loader2 size={13} className="animate-spin text-indigo-400" />
            <span>Reading project tree...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center text-zinc-600 text-xs">
            No files found in workspace
          </div>
        ) : (
          entries.map((entry) => (
            <FileTreeItem
              key={entry.path}
              entry={entry}
              depth={0}
              sandboxId={sandboxId}
              selectedPath={selectedPath}
              onFileSelect={onFileSelect}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FileTree;

