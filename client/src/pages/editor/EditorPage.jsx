import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Loader2,
  Save,
  Github,
  Check,
  AlertCircle,
  Code2,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import CodeEditor from "../../components/editor/CodeEditor";
import FileTabs from "../../components/editor/FileTabs";
import FileTree from "../../components/editor/FileTree";
import EditorPreview from "../../components/editor/EditorPreview";
import GitHubUploadDialog from "../../components/dialogs/GitHubUploadDialog";
import VercelDeployDialog from "../../components/dialogs/VercelDeployDialog";
import { DEFAULT_PORTFOLIO_DATA } from "../../lib/default-portfolio-data";
import { getTemplateConfig } from "../../lib/templates";

// Binary file extensions that shouldn't open as text
const BINARY_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".ico", ".woff", ".woff2", ".ttf"];

function isBinaryFile(path = "") {
  return BINARY_EXTENSIONS.some((ext) => path.toLowerCase().endsWith(ext));
}

// Resizable drag handle
function ResizeHandle({ onDrag }) {
  const dragging = useRef(false);
  const lastX = useRef(0);

  const onPointerDown = useCallback((e) => {
    dragging.current = true;
    lastX.current = e.clientX;
    e.target.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const delta = e.clientX - lastX.current;
    lastX.current = e.clientX;
    onDrag(delta);
  }, [onDrag]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="w-1 shrink-0 cursor-col-resize bg-zinc-800/80 hover:bg-indigo-500 active:bg-indigo-600 transition-colors z-10"
    />
  );
}

export function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();

  const rawTemplateId = searchParams.get("templateId") || "1";
  const templateId = rawTemplateId.startsWith("template")
    ? rawTemplateId
    : `template${rawTemplateId}`;
  const templateConfig = getTemplateConfig(templateId);

  // Sandbox state
  const [sandboxId, setSandboxId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState(DEFAULT_PORTFOLIO_DATA);
  const [refreshKey, setRefreshKey] = useState(0);

  // Editor file management
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContents, setFileContents] = useState(new Map());

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saving' | 'saved' | 'unsaved'
  const [showGitHubDialog, setShowGitHubDialog] = useState(false);
  const [showVercelDialog, setShowVercelDialog] = useState(false);

  // Layout resizing
  const containerRef = useRef(null);
  const [treeWidth, setTreeWidth] = useState(240);
  const [editorFraction, setEditorFraction] = useState(0.48);

  const sandboxIdRef = useRef(null);
  useEffect(() => {
    sandboxIdRef.current = sandboxId;
  }, [sandboxId]);

  // Kill sandbox on page unload
  const killCurrentSandbox = useCallback(() => {
    const id = sandboxIdRef.current;
    if (!id) return;
    navigator.sendBeacon(
      "/api/sandbox/kill",
      new Blob([JSON.stringify({ sandboxId: id })], { type: "application/json" })
    );
  }, []);

  useEffect(() => {
    const handleUnload = () => killCurrentSandbox();
    window.addEventListener("pagehide", handleUnload);
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("pagehide", handleUnload);
      window.removeEventListener("beforeunload", handleUnload);
      killCurrentSandbox();
    };
  }, [killCurrentSandbox]);

  const handleTreeResize = useCallback((delta) => {
    setTreeWidth((w) => Math.max(160, Math.min(420, w + delta)));
  }, []);

  const handleEditorResize = useCallback(
    (delta) => {
      if (!containerRef.current) return;
      const available = containerRef.current.offsetWidth - treeWidth - 8;
      if (available <= 0) return;
      setEditorFraction((f) => Math.max(0.2, Math.min(0.8, f + delta / available)));
    },
    [treeWidth]
  );

  // Initialize sandbox with template data
  useEffect(() => {
    let isMounted = true;

    async function initSandbox() {
      try {
        setIsInitializing(true);
        setError(null);

        // Fetch current portfolio data if logged in
        let initialData = DEFAULT_PORTFOLIO_DATA;
        if (user) {
          try {
            const res = await axios.get(`/api/portfolio?templateId=${templateId}`);
            if (res.data?.data) {
              initialData = { ...DEFAULT_PORTFOLIO_DATA, ...res.data.data };
            }
          } catch {
            // Fallback to default data
          }
        }

        if (isMounted) setPortfolioData(initialData);

        // Deploy template to sandbox
        const deployRes = await axios.post("/api/sandbox/deploy-template", {
          templateId,
          portfolioData: initialData,
        });

        const newId = deployRes.data.sandboxId;
        const newUrl = deployRes.data.previewUrl;

        if (isMounted) {
          setSandboxId(newId);
          setPreviewUrl(newUrl);

          // Open default page.tsx
          const defaultPath = "/home/user/app/page.tsx";
          setOpenFiles([defaultPath]);
          setActiveFile(defaultPath);

          // Read content
          const readRes = await axios.get(
            `/api/sandbox/files/read?id=${newId}&path=${encodeURIComponent(defaultPath)}`
          );
          setFileContents(new Map([[defaultPath, readRes.data.content || ""]]));
        }
      } catch (err) {
        console.error("Sandbox deployment failed:", err);
        if (isMounted) setError("Failed to launch cloud sandbox container.");
        addToast("Sandbox deployment failed. Using local fallback.", "error");
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    }

    initSandbox();

    return () => {
      isMounted = false;
    };
  }, [templateId, user, addToast]);

  // Open a file
  async function handleFileSelect(path) {
    if (isBinaryFile(path)) return;

    if (!openFiles.includes(path)) {
      setOpenFiles((prev) => [...prev, path]);
    }
    setActiveFile(path);

    if (!fileContents.has(path) && sandboxId) {
      try {
        const res = await axios.get(
          `/api/sandbox/files/read?id=${sandboxId}&path=${encodeURIComponent(path)}`
        );
        setFileContents((prev) => new Map(prev).set(path, res.data.content || ""));
      } catch (err) {
        console.error("Failed to read file:", err);
        setFileContents((prev) => new Map(prev).set(path, "// Error reading file"));
      }
    }
  }

  // Close a tab
  function handleCloseTab(path) {
    const updated = openFiles.filter((p) => p !== path);
    setOpenFiles(updated);

    if (activeFile === path) {
      setActiveFile(updated.length > 0 ? updated[updated.length - 1] : null);
    }
  }

  // Code change in CodeMirror
  const writeTimerRef = useRef(null);

  function handleCodeChange(newVal) {
    if (!activeFile) return;

    setFileContents((prev) => new Map(prev).set(activeFile, newVal));
    setSaveStatus("unsaved");

    // Live update portfolio data if editing page.tsx or data.json
    if (activeFile.endsWith("page.tsx")) {
      const match = newVal.match(/const data(?::\s*\w+)?\s*=\s*(\{[\s\S]*?\});/);
      if (match && match[1]) {
        try {
          const parsed = JSON.parse(match[1]);
          setPortfolioData(parsed);
          setRefreshKey((k) => k + 1);
        } catch {
          // Ignore JSON parse errors while actively typing
        }
      }
    } else if (activeFile.endsWith("data.json")) {
      try {
        const parsed = JSON.parse(newVal);
        setPortfolioData(parsed);
        setRefreshKey((k) => k + 1);
      } catch {
        // Ignore while typing
      }
    }

    // Debounced write to sandbox backend
    if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
    writeTimerRef.current = setTimeout(async () => {
      if (!sandboxId) return;
      try {
        await axios.post("/api/sandbox/files/write", {
          id: sandboxId,
          path: activeFile,
          content: newVal,
        });
        setSaveStatus("saved");
      } catch (err) {
        console.error("Failed auto-writing file:", err);
      }
    }, 800);
  }

  // Save to MongoDB Atlas
  async function handleSave() {
    if (!sandboxId) return;
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      // Flush pending write
      if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
      if (activeFile && fileContents.has(activeFile)) {
        await axios.post("/api/sandbox/files/write", {
          id: sandboxId,
          path: activeFile,
          content: fileContents.get(activeFile),
        });
      }

      // Extract portfolio data
      const extractRes = await axios.post("/api/sandbox/extract-data", { sandboxId });
      const extractedData = extractRes.data.portfolioData || portfolioData;

      if (user) {
        await axios.post("/api/portfolio", {
          templateId,
          portfolioData: extractedData,
        });
        addToast("Portfolio successfully saved to cloud!", "success");
      } else {
        addToast("Draft updated in memory (sign in to persist)", "info");
      }

      setSaveStatus("saved");
    } catch (err) {
      console.error("Save error:", err);
      addToast("Failed to save changes to cloud", "error");
      setSaveStatus("unsaved");
    } finally {
      setIsSaving(false);
    }
  }

  // Save and navigate back to Template customizer
  async function handleBack() {
    await handleSave();
    navigate(`/studio/templates/${templateId}`);
  }

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#09090c] text-zinc-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500" />
          <span className="text-xs tracking-wider uppercase text-zinc-400">
            Spinning up Forged Cloud Sandbox...
          </span>
          <span className="text-[11px] text-zinc-600">Mounting Next.js template runtime</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#09090c] text-zinc-200 font-mono p-4">
        <div className="max-w-md w-full bg-[#111115] border border-zinc-800 rounded-2xl p-6 text-center shadow-xl">
          <AlertCircle size={36} className="mx-auto text-red-400 mb-3" />
          <h2 className="text-base font-bold text-white mb-2">Sandbox Launch Error</h2>
          <p className="text-xs text-zinc-400 mb-5">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => navigate("/studio/templates")}
              className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-xs hover:bg-zinc-800 transition-colors"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex h-screen w-screen flex-col bg-[#09090c] font-mono text-zinc-100 overflow-hidden select-none"
    >
      {/* Top Application Bar */}
      <div className="h-12 border-b border-zinc-800 bg-[#121216] px-3 flex items-center justify-between shrink-0 z-20">
        {/* Left: Back & Template identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Save & return to visual editor"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-indigo-400" />
            <h1 className="text-xs font-bold text-zinc-100 tracking-tight">
              {templateConfig?.name || "Brutalist"}
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              In-Browser IDE
            </span>
          </div>
        </div>

        {/* Center: Save state indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-400">
          {saveStatus === "saving" && (
            <>
              <Loader2 size={12} className="animate-spin text-indigo-400" />
              <span>Syncing with cloud...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Autosaved</span>
            </>
          )}
          {saveStatus === "unsaved" && (
            <span className="text-amber-400">Unsaved edits</span>
          )}
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Save to MongoDB Atlas"
          >
            {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGitHubDialog(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Export to GitHub"
          >
            <Github size={13} />
            <span className="hidden md:inline">GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVercelDialog(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Deploy to Vercel"
          >
            <svg width={12} height={12} viewBox="0 0 76 65" fill="currentColor">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <span className="hidden md:inline">Vercel</span>
          </button>
        </div>
      </div>

      {/* Main 3-Panel Workspace: [FileTree] | [CodeEditor] | [Preview] */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Panel: File Tree Explorer */}
        <div
          className="flex flex-col shrink-0 overflow-hidden h-full"
          style={{ width: `${treeWidth}px` }}
        >
          {sandboxId && (
            <FileTree
              sandboxId={sandboxId}
              selectedPath={activeFile}
              onFileSelect={handleFileSelect}
              onTreeChange={() => {}}
            />
          )}
        </div>

        <ResizeHandle onDrag={handleTreeResize} />

        {/* Center Panel: File Tabs + CodeMirror Editor */}
        <div
          className="flex flex-col overflow-hidden h-full min-w-0"
          style={{ width: `calc((100% - ${treeWidth}px - 8px) * ${editorFraction})` }}
        >
          <FileTabs
            openFiles={openFiles}
            activeFile={activeFile}
            onSelectTab={(path) => setActiveFile(path)}
            onCloseTab={handleCloseTab}
          />

          <div className="flex-1 overflow-hidden min-h-0 bg-[#1e1e24]">
            {activeFile && fileContents.has(activeFile) ? (
              <CodeEditor
                content={fileContents.get(activeFile)}
                filePath={activeFile}
                onChange={handleCodeChange}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-xs text-zinc-500 font-mono">
                <span>Select a file from the explorer to inspect and edit code</span>
              </div>
            )}
          </div>
        </div>

        <ResizeHandle onDrag={handleEditorResize} />

        {/* Right Panel: Live Execution Preview */}
        <div className="flex flex-1 flex-col overflow-hidden h-full min-w-0">
          <EditorPreview
            url={previewUrl}
            templateId={templateId}
            portfolioData={portfolioData}
            refreshKey={refreshKey}
          />
        </div>
      </div>

      {/* GitHub & Vercel Integration Dialogs */}
      <GitHubUploadDialog
        open={showGitHubDialog}
        onOpenChange={setShowGitHubDialog}
        source="sandbox"
        templateId={templateId}
        sandboxId={sandboxId || undefined}
        portfolioData={portfolioData}
        portfolioName={portfolioData.name || "My Portfolio"}
      />

      <VercelDeployDialog
        open={showVercelDialog}
        onOpenChange={setShowVercelDialog}
        source="sandbox"
        templateId={templateId}
        sandboxId={sandboxId || undefined}
        portfolioData={portfolioData}
        portfolioName={portfolioData.name || "My Portfolio"}
      />
    </div>
  );
}

export default EditorPage;

