import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Loader2,
  ExternalLink,
  CheckCircle2,
  Circle,
  XCircle,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

function VercelIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 76 65"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function sanitizeProjectName(name = "my-portfolio") {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "my-portfolio"
  );
}

export function VercelDeployDialog({
  open,
  onOpenChange,
  source = "template",
  templateId = "template1",
  portfolioData = {},
  sandboxId,
  portfolioName = "My Portfolio",
}) {
  const { addToast } = useToast();
  const [projectName, setProjectName] = useState(sanitizeProjectName(portfolioName));
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saveToken, setSaveToken] = useState(true);
  const [hasVercelToken, setHasVercelToken] = useState(null);

  const [status, setStatus] = useState("idle"); // 'idle' | 'deploying' | 'building' | 'ready' | 'error'
  const [deploymentUrl, setDeploymentUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const pollingRef = useRef(null);
  const failCountRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (open) {
      setProjectName(sanitizeProjectName(portfolioName || portfolioData.name || "my-portfolio"));
      axios
        .get("/api/vercel/status?check=connection")
        .then((res) => setHasVercelToken(res.data.connected))
        .catch(() => setHasVercelToken(false));
    } else {
      stopPolling();
      setStatus("idle");
      setDeploymentUrl(null);
      setErrorMessage(null);
    }
  }, [open, portfolioName, portfolioData, stopPolling]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  function startPolling(deploymentId, deployToken) {
    failCountRef.current = 0;
    pollingRef.current = setInterval(async () => {
      try {
        const queryParams = new URLSearchParams({ deploymentId });
        if (deployToken) queryParams.set("token", deployToken);

        const res = await axios.get(`/api/vercel/status?${queryParams.toString()}`);
        const data = res.data;

        failCountRef.current = 0;

        if (data.readyState === "READY") {
          stopPolling();
          const finalUrl = `https://${data.url}`;
          setDeploymentUrl(finalUrl);
          setStatus("ready");
          addToast("Deployment successfully published to Vercel!", "success");
        } else if (data.readyState === "ERROR" || data.readyState === "CANCELED") {
          stopPolling();
          setStatus("error");
          setErrorMessage(
            data.errorMessage || "Vercel build failed. Please check project configuration."
          );
        }
      } catch (err) {
        failCountRef.current++;
        if (failCountRef.current >= 4) {
          stopPolling();
          setStatus("error");
          setErrorMessage("Lost connection while checking deployment status.");
        }
      }
    }, 3000);
  }

  async function handleDeploy() {
    if (!projectName.trim()) return;

    setStatus("deploying");
    setErrorMessage(null);

    try {
      const deployToken = token.trim() || undefined;
      const res = await axios.post("/api/vercel/deploy", {
        projectName: projectName.trim(),
        templateId,
        portfolioData,
        sandboxId,
        source,
        token: deployToken,
        saveToken,
      });

      const data = res.data;
      if (data.deploymentId) {
        setStatus("building");
        startPolling(data.deploymentId, deployToken);
      } else if (data.url) {
        setDeploymentUrl(`https://${data.url}`);
        setStatus("ready");
        addToast("Deployed to Vercel!", "success");
      }
    } catch (err) {
      setStatus("error");
      const errData = err.response?.data;
      if (errData?.error === "NO_VERCEL_ACCOUNT" || errData?.error === "TOKEN_EXPIRED") {
        setHasVercelToken(false);
        setErrorMessage("Please enter a valid Vercel API personal access token.");
      } else {
        setErrorMessage(errData?.message || "Deployment failed. Please verify your credentials.");
      }
    }
  }

  function handleClose() {
    stopPolling();
    setStatus("idle");
    setDeploymentUrl(null);
    setErrorMessage(null);
    onOpenChange(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111116] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-sans select-none text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#16161c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white">
              <VercelIcon size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Deploy to Vercel</h2>
              <p className="text-xs text-zinc-400">One-click production deployment with global CDN</p>
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
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Project Name</label>
            <div className="flex items-center rounded-xl border border-zinc-700/80 bg-zinc-900/90 px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-portfolio"
                disabled={status !== "idle"}
                className="flex-1 bg-transparent text-xs text-white outline-none font-mono disabled:opacity-50"
              />
              <span className="text-xs text-zinc-500 font-mono select-none">.vercel.app</span>
            </div>
          </div>

          {/* Vercel API Token (shown if not stored or user wants to provide) */}
          {hasVercelToken === false && status === "idle" && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">Vercel Personal Access Token</span>
                <a
                  href="https://vercel.com/account/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 text-[11px] underline underline-offset-2 flex items-center gap-1"
                >
                  Create token <ExternalLink size={10} />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your Vercel token..."
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
                <span>Remember token for future deployments</span>
              </label>
            </div>
          )}

          {/* Progress tracker */}
          {(status === "deploying" || status === "building" || status === "ready") && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3 font-mono text-xs">
              {/* Step 1 */}
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-zinc-200">Files packaged & uploaded to Vercel</span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-2.5">
                {status === "building" ? (
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                ) : status === "ready" ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <Circle size={16} className="text-zinc-600" />
                )}
                <span className={status === "building" ? "text-indigo-300 font-semibold" : "text-zinc-400"}>
                  {status === "building" ? "Building Next.js production bundle..." : "Build completed"}
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-2.5">
                {status === "ready" ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <Circle size={16} className="text-zinc-600" />
                )}
                <span className={status === "ready" ? "text-emerald-300 font-semibold" : "text-zinc-500"}>
                  Published to edge network
                </span>
              </div>
            </div>
          )}

          {/* Success card */}
          {status === "ready" && deploymentUrl && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 text-center">
              <Zap size={24} className="mx-auto text-emerald-400" />
              <h3 className="text-xs font-bold text-emerald-300">Deployment Live on Vercel!</h3>
              <p className="text-[11px] text-zinc-300 truncate font-mono">{deploymentUrl}</p>
              <a
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Visit Live Site</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Error notice */}
          {status === "error" && errorMessage && (
            <div className="flex items-start gap-2 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-semibold text-red-300">Deployment failed</p>
                <p className="text-[11px] text-red-400 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-zinc-800 bg-[#16161c]">
          {status === "idle" && (
            <button
              type="button"
              onClick={handleDeploy}
              disabled={!projectName.trim() || (hasVercelToken === false && !token.trim())}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <VercelIcon size={14} />
              <span>Deploy Now</span>
            </button>
          )}

          {status === "deploying" && (
            <button disabled className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-medium">
              <Loader2 size={14} className="animate-spin" />
              <span>Initiating deployment...</span>
            </button>
          )}

          {status === "building" && (
            <button disabled className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium">
              <Loader2 size={14} className="animate-spin text-indigo-400" />
              <span>Building on Vercel...</span>
            </button>
          )}

          {status === "ready" && (
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          )}

          {status === "error" && (
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setErrorMessage(null);
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VercelDeployDialog;

