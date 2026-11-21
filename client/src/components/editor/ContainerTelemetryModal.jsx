import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  X,
  Activity,
  Cpu,
  HardDrive,
  Clock,
  Layers,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
} from "lucide-react";

export function ContainerTelemetryModal({
  open,
  onClose,
  sandboxId,
  initialMode = "virtual_sandbox",
}) {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchTelemetry = useCallback(async () => {
    if (!sandboxId) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/sandbox/telemetry?id=${sandboxId}`);
      if (res.data?.telemetry) {
        setTelemetry(res.data.telemetry);
      }
    } catch (err) {
      console.warn("Failed to fetch sandbox telemetry:", err);
    } finally {
      setLoading(false);
    }
  }, [sandboxId]);

  useEffect(() => {
    if (open && sandboxId) {
      fetchTelemetry();
      const interval = setInterval(fetchTelemetry, 10000);
      return () => clearInterval(interval);
    }
  }, [open, sandboxId, fetchTelemetry]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const mode = telemetry?.mode || initialMode;
  const isE2B = mode === "e2b_cloud";

  const formatUptime = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const copyId = () => {
    if (!sandboxId) return;
    navigator.clipboard.writeText(sandboxId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#111116] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#15151c]">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isE2B
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
              }`}
            >
              <Activity size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Container Telemetry & Runtime
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isE2B
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isE2B ? "bg-emerald-400 animate-pulse" : "bg-indigo-400"
                    }`}
                  />
                  {isE2B ? "E2B Cloud Micro-VM" : "Forged Virtual Sandbox"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Real-time execution telemetry and container specs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchTelemetry}
              disabled={loading}
              className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Refresh telemetry"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-indigo-400" : ""} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body Metrics Grid */}
        <div className="p-5 space-y-4">
          {/* Top Status Banner */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Server size={15} className="text-zinc-400" />
              <div>
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">
                  Container Session ID
                </span>
                <span className="text-zinc-200 font-mono text-xs">{sandboxId || "Initializing..."}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={copyId}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors cursor-pointer"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Metric Cards 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#14141a] border border-zinc-800/80 space-y-1">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[10px] uppercase tracking-wider font-semibold">
                  Runtime Engine
                </span>
                <Cpu size={14} className="text-indigo-400" />
              </div>
              <p className="text-zinc-100 font-bold text-xs truncate">
                {telemetry?.runtime || (isE2B ? "Linux Micro-VM (Next.js 15)" : "In-Memory VFS (React 19)")}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {isE2B ? "Dedicated Firecracker micro-VM" : "Client-side virtual execution"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#14141a] border border-zinc-800/80 space-y-1">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[10px] uppercase tracking-wider font-semibold">
                  Memory Allocation
                </span>
                <HardDrive size={14} className="text-amber-400" />
              </div>
              <p className="text-zinc-100 font-bold text-xs truncate">
                {telemetry?.memoryUsage || (isE2B ? "512 MB reserved" : "24 KB VFS")}
              </p>
              <p className="text-[10px] text-zinc-500">
                {isE2B ? "Dedicated RAM slice" : "VFS buffer allocation"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#14141a] border border-zinc-800/80 space-y-1">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[10px] uppercase tracking-wider font-semibold">
                  Filesystem Nodes
                </span>
                <Layers size={14} className="text-emerald-400" />
              </div>
              <p className="text-zinc-100 font-bold text-xs">
                {telemetry?.filesCount ?? 9} files / {telemetry?.directoriesCount ?? 2} dirs
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {isE2B ? "Cloud disk mount /home/user" : "In-memory virtual tree"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#14141a] border border-zinc-800/80 space-y-1">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[10px] uppercase tracking-wider font-semibold">
                  Container Uptime
                </span>
                <Clock size={14} className="text-purple-400" />
              </div>
              <p className="text-zinc-100 font-bold text-xs">
                {formatUptime(telemetry?.uptimeSeconds || 0)}
              </p>
              <p className="text-[10px] text-zinc-500">Auto-terminates on page unload</p>
            </div>
          </div>

          {/* Infrastructure Details */}
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-[11px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Host Infrastructure:</span>
              <span className="text-zinc-300 font-medium">
                {telemetry?.host || (isE2B ? "e2b.dev cloud infrastructure" : "Forged Virtual Container Runtime")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Isolation Layer:</span>
              <span className="text-zinc-300 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>{isE2B ? "KVM / Firecracker micro-VM" : "Browser Sandboxed VFS"}</span>
              </span>
            </div>
            {telemetry?.previewUrl && (
              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                <span className="text-zinc-500">Active Preview Route:</span>
                <a
                  href={telemetry.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono text-[10px]"
                >
                  <span className="truncate max-w-[220px]">{telemetry.previewUrl}</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-[#15151c] flex items-center justify-between text-xs">
          <span className="text-[11px] text-zinc-500">
            {isE2B
              ? "⚡ Running on remote E2B cloud micro-VM"
              : "💡 Add E2B_API_KEY in server/.env for remote micro-VM execution"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContainerTelemetryModal;

