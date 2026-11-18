import { useState, useRef, Component } from "react";
import {
  RotateCw,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  Terminal,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// Import all 9 template components for in-browser instant execution
import Portfolio1 from "../../portfolio-templates/portfolio-1/Portfolio1";
import Portfolio2 from "../../portfolio-templates/portfolio-2/Portfolio2";
import Portfolio3 from "../../portfolio-templates/portfolio-3/Portfolio3";
import Portfolio4 from "../../portfolio-templates/portfolio-4/Portfolio4";
import Portfolio5 from "../../portfolio-templates/portfolio-5/Portfolio5";
import Portfolio6 from "../../portfolio-templates/portfolio-6/Portfolio6";
import Portfolio7 from "../../portfolio-templates/portfolio-7/Portfolio7";
import Portfolio8 from "../../portfolio-templates/portfolio-8/Portfolio8";
import Portfolio9 from "../../portfolio-templates/portfolio-9/Portfolio9";

const TEMPLATE_COMPONENTS = {
  template1: Portfolio1,
  template2: Portfolio2,
  template3: Portfolio3,
  template4: Portfolio4,
  template5: Portfolio5,
  template6: Portfolio6,
  template7: Portfolio7,
  template8: Portfolio8,
  template9: Portfolio9,
};

// Error Boundary to prevent any typing mistake from crashing the entire IDE
class PreviewErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Editor preview render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-6 text-center bg-zinc-950 text-red-400 font-mono">
          <AlertTriangle size={32} className="mb-3 text-amber-500" />
          <h3 className="text-sm font-bold text-zinc-100 mb-1">Preview Render Warning</h3>
          <p className="text-xs text-zinc-400 max-w-md mb-4">
            {this.state.error?.message || "Syntax or data error in sandbox files while typing."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Retry Render
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function EditorPreview({
  url = null,
  templateId = "template1",
  portfolioData = {},
  refreshKey = 0,
}) {
  const [device, setDevice] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'
  const [showConsole, setShowConsole] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(0);

  const normId = templateId?.startsWith("template")
    ? templateId
    : `template${templateId || 1}`;

  const TemplateComponent = TEMPLATE_COMPONENTS[normId] || Portfolio1;

  // Viewport width constraints
  const viewportStyles = {
    desktop: "w-full h-full",
    tablet: "w-[768px] max-w-full h-full my-auto rounded-xl shadow-2xl border border-zinc-800 overflow-hidden",
    mobile: "w-[375px] max-w-full h-full my-auto rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden",
  };

  return (
    <div className="flex h-full flex-col bg-[#0e0e12] font-mono select-none overflow-hidden">
      {/* Top Browser Toolbar */}
      <div className="flex items-center justify-between px-3 h-9 border-b border-zinc-800 bg-[#16161c] shrink-0 text-xs text-zinc-400">
        {/* Left: Refresh & URL */}
        <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
          <button
            type="button"
            onClick={() => setLocalRefresh((k) => k + 1)}
            className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="Reload Preview"
          >
            <RotateCw size={13} />
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0f0f13] border border-zinc-800/80 text-[11px] text-zinc-400 truncate max-w-xs sm:max-w-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">
              {url || `http://localhost:3000/preview/${normId}`}
            </span>
          </div>
        </div>

        {/* Center: Device Switchers */}
        <div className="hidden sm:flex items-center gap-1 bg-[#101014] p-0.5 rounded-lg border border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-1 rounded transition-colors ${
              device === "desktop"
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Desktop 100%"
          >
            <Monitor size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`p-1 rounded transition-colors ${
              device === "tablet"
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Tablet (768px)"
          >
            <Tablet size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-1 rounded transition-colors ${
              device === "mobile"
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Mobile (375px)"
          >
            <Smartphone size={13} />
          </button>
        </div>

        {/* Right: Console Toggle & Open in Tab */}
        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowConsole((v) => !v)}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] transition-colors ${
              showConsole
                ? "bg-zinc-800 text-indigo-400 border-indigo-500/50"
                : "border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
            title="Toggle Console / Logs"
          >
            <Terminal size={12} />
            <span className="hidden md:inline">Logs</span>
          </button>

          <a
            href={url || `/studio/templates/${normId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded border border-zinc-800 text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            title="Open preview in new tab"
          >
            <ExternalLink size={12} />
            <span className="hidden md:inline">Open</span>
          </a>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto bg-[#0a0a0d] flex justify-center p-0 relative scrollbar-none">
        <div
          key={`${refreshKey}-${localRefresh}`}
          className={`transition-all duration-200 flex flex-col ${viewportStyles[device]}`}
        >
          {url && url.startsWith("https://") ? (
            <iframe
              src={url}
              className="h-full w-full border-0 bg-zinc-950"
              title="Sandbox live preview"
            />
          ) : (
            <PreviewErrorBoundary key={localRefresh}>
              <div className="h-full w-full overflow-y-auto bg-zinc-950 select-text">
                <TemplateComponent {...portfolioData} />
              </div>
            </PreviewErrorBoundary>
          )}
        </div>
      </div>

      {/* Simulated Dev Server / Terminal Logs Drawer */}
      {showConsole && (
        <div className="h-36 border-t border-zinc-800 bg-[#0d0d10] p-3 text-xs text-zinc-400 overflow-y-auto shrink-0 font-mono select-text">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-800/60 text-[11px]">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Dev Server Terminal
            </span>
            <button
              type="button"
              onClick={() => setShowConsole(false)}
              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="space-y-1 text-[11px] leading-relaxed">
            <div className="text-zinc-500">▲ Next.js 15.1.0 (Forged Cloud IDE Runtime)</div>
            <div className="text-emerald-400">✓ Ready in 320ms</div>
            <div className="text-zinc-400">- Local: http://localhost:3000</div>
            <div className="text-zinc-400">- Environment: development (sandbox hot-reload)</div>
            <div className="text-indigo-400">✓ Compiled /page in 48ms (fast-refresh enabled)</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorPreview;

