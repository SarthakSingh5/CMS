import { useState, useEffect } from "react";
import axios from "axios";
import {
  Github,
  Loader2,
  ExternalLink,
  Globe,
  Lock,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

function sanitizeRepoName(name = "my-portfolio") {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "my-portfolio"
  );
}

export function GitHubUploadDialog({
  open,
  onOpenChange,
  source = "template",
  templateId = "template1",
  portfolioData = {},
  sandboxId,
  portfolioName = "My Portfolio",
}) {
  const { addToast } = useToast();
  const [repoName, setRepoName] = useState(sanitizeRepoName(portfolioName));
  const [isPrivate, setIsPrivate] = useState(false);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saveToken, setSaveToken] = useState(true);
  const [hasStoredToken, setHasStoredToken] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [repoUrl, setRepoUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (open) {
      setRepoName(sanitizeRepoName(portfolioName || portfolioData.name || "my-portfolio"));
      axios
        .get("/api/github/status")
        .then((res) => setHasStoredToken(res.data.connected))
        .catch(() => setHasStoredToken(false));
    }
  }, [open, portfolioName, portfolioData]);

  if (!open) return null;

  async function handleUpload() {
    if (!repoName.trim()) return;

    setUploading(true);
    setErrorMessage(null);

    try {
      const res = await axios.post("/api/github/upload", {
        repoName: repoName.trim(),
        isPrivate,
        templateId,
        portfolioData,
        sandboxId,
        source,
        token: token.trim() || undefined,
        saveToken,
      });

      if (res.data?.repoUrl) {
        setRepoUrl(res.data.repoUrl);
        addToast("Successfully created repository on GitHub!", "success");
      }
    } catch (err) {
      console.error("GitHub upload error:", err);
      const data = err.response?.data;
      if (data?.error === "REPO_EXISTS") {
        setErrorMessage(`Repository "${repoName}" already exists on your GitHub.`);
      } else if (data?.error === "INSUFFICIENT_SCOPE") {
        setErrorMessage("Token lacks 'repo' permissions. Please ensure repo scope is enabled.");
      } else if (data?.error === "NO_GITHUB_ACCOUNT" || data?.error === "INVALID_TOKEN") {
        setHasStoredToken(false);
        setErrorMessage("Please enter a valid GitHub Personal Access Token.");
      } else {
        setErrorMessage(data?.message || "Failed to upload to GitHub. Please check your token.");
      }
    } finally {
      setUploading(false);
    }
  }

  // Direct ZIP download fallback for instant zero-token export
  async function handleDownloadZip() {
    setDownloadingZip(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      // Read files from sandbox or template
      let filesMap = new Map();
      if (source === "sandbox" && sandboxId) {
        // Read file list from sandbox
        const listRes = await axios.get(`/api/sandbox/files?id=${sandboxId}&path=/home/user`);
        const rootEntries = listRes.data.entries || [];

        // Recursive reader
        async function readDir(dirPath) {
          const res = await axios.get(
            `/api/sandbox/files?id=${sandboxId}&path=${encodeURIComponent(dirPath)}`
          );
          for (const item of res.data.entries || []) {
            if (item.type === "file") {
              const fileRes = await axios.get(
                `/api/sandbox/files/read?id=${sandboxId}&path=${encodeURIComponent(item.path)}`
              );
              const cleanRelPath = item.path.replace(/^\/home\/user\//, "");
              filesMap.set(cleanRelPath, fileRes.data.content || "");
            } else if (item.type === "dir") {
              await readDir(item.path);
            }
          }
        }

        for (const entry of rootEntries) {
          if (entry.type === "file") {
            const fRes = await axios.get(
              `/api/sandbox/files/read?id=${sandboxId}&path=${encodeURIComponent(entry.path)}`
            );
            const cleanRelPath = entry.path.replace(/^\/home\/user\//, "");
            filesMap.set(cleanRelPath, fRes.data.content || "");
          } else if (entry.type === "dir") {
            await readDir(entry.path);
          }
        }
      }

      // If sandbox read empty or source is template, generate files
      if (filesMap.size === 0) {
        const dataJson = JSON.stringify(portfolioData, null, 2);
        zip.file("app/data.json", dataJson);
        zip.file(
          "README.md",
          `# ${portfolioData.name || "Portfolio"}\n\nBuilt with [Forged](https://forged.dev)\n\n## Quick Start\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`
        );
        zip.file(
          "package.json",
          JSON.stringify(
            {
              name: sanitizeRepoName(portfolioName),
              version: "0.1.0",
              private: true,
              scripts: { dev: "next dev", build: "next build", start: "next start" },
              dependencies: { next: "^15.1.0", react: "^19.0.0", "react-dom": "^19.0.0" },
            },
            null,
            2
          )
        );
      } else {
        for (const [p, c] of filesMap) {
          zip.file(p, c);
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sanitizeRepoName(repoName)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast("Project ZIP downloaded successfully!", "success");
    } catch (err) {
      console.error("ZIP download error:", err);
      addToast("Failed to package project ZIP.", "error");
    } finally {
      setDownloadingZip(false);
    }
  }

  function handleClose() {
    setRepoUrl(null);
    setErrorMessage(null);
    setUploading(false);
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111116] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-sans select-none text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#16161c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white">
              <Github size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Export to GitHub</h2>
              <p className="text-xs text-zinc-400">Push full standalone Next.js repo to GitHub</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Repo Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Repository Name</label>
            <div className="flex items-center rounded-xl border border-zinc-700/80 bg-zinc-900/90 px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <span className="text-xs text-zinc-500 font-mono select-none mr-1.5">github.com/</span>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="my-portfolio"
                disabled={uploading || !!repoUrl}
                className="flex-1 bg-transparent text-xs text-white outline-none font-mono disabled:opacity-50"
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Visibility</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                disabled={uploading || !!repoUrl}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  !isPrivate
                    ? "border-indigo-500 bg-indigo-600/10 text-indigo-400"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <Globe size={14} />
                <span>Public</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                disabled={uploading || !!repoUrl}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  isPrivate
                    ? "border-indigo-500 bg-indigo-600/10 text-indigo-400"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <Lock size={14} />
                <span>Private</span>
              </button>
            </div>
          </div>

          {/* Personal Access Token (if not stored or wants to override) */}
          {hasStoredToken === false && !repoUrl && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">GitHub Personal Access Token</span>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=Forged-App"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 text-[11px] underline underline-offset-2 flex items-center gap-1"
                >
                  Generate token <ExternalLink size={10} />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  disabled={uploading}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 pr-8 text-xs font-mono text-zinc-200 outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  {showToken ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToken}
                  onChange={(e) => setSaveToken(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0"
                />
                <span>Remember token for future exports</span>
              </label>
            </div>
          )}

          {/* Error notice */}
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success card */}
          {repoUrl && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 text-center">
              <CheckCircle2 size={24} className="mx-auto text-emerald-400" />
              <h3 className="text-xs font-bold text-emerald-300">Repository Live on GitHub!</h3>
              <p className="text-[11px] text-zinc-300 truncate font-mono">{repoUrl}</p>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <span>View on GitHub</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-[#16161c]">
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={downloadingZip || uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors disabled:opacity-50"
            title="Download full project folder as ZIP"
          >
            {downloadingZip ? (
              <Loader2 size={13} className="animate-spin text-zinc-400" />
            ) : (
              <Download size={13} />
            )}
            <span>Download ZIP</span>
          </button>

          <div className="flex items-center gap-2">
            {!repoUrl ? (
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !repoName.trim() || (hasStoredToken === false && !token.trim())}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Pushing code...</span>
                  </>
                ) : (
                  <>
                    <Github size={14} />
                    <span>Upload to GitHub</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GitHubUploadDialog;

