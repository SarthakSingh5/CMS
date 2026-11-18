import { useState, useCallback, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  Code2,
  Check,
  Loader2,
  Sparkles,
  GripVertical,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { BrowserPreview } from "../../components/studio/BrowserPreview";
import { DEFAULT_PORTFOLIO_DATA } from "../../lib/default-portfolio-data";
import { getTemplateConfig } from "../../lib/templates";

// Template 1–9 Forms and Previews
import Portfolio1Form from "../../portfolio-templates/portfolio-1/Portfolio1Form";
import Portfolio1 from "../../portfolio-templates/portfolio-1/Portfolio1";
import Portfolio2Form from "../../portfolio-templates/portfolio-2/Portfolio2Form";
import Portfolio2 from "../../portfolio-templates/portfolio-2/Portfolio2";
import Portfolio3Form from "../../portfolio-templates/portfolio-3/Portfolio3Form";
import Portfolio3 from "../../portfolio-templates/portfolio-3/Portfolio3";
import Portfolio4Form from "../../portfolio-templates/portfolio-4/Portfolio4Form";
import Portfolio4 from "../../portfolio-templates/portfolio-4/Portfolio4";
import Portfolio5Form from "../../portfolio-templates/portfolio-5/Portfolio5Form";
import Portfolio5 from "../../portfolio-templates/portfolio-5/Portfolio5";
import Portfolio6Form from "../../portfolio-templates/portfolio-6/Portfolio6Form";
import Portfolio6 from "../../portfolio-templates/portfolio-6/Portfolio6";
import Portfolio7Form from "../../portfolio-templates/portfolio-7/Portfolio7Form";
import Portfolio7 from "../../portfolio-templates/portfolio-7/Portfolio7";
import Portfolio8Form from "../../portfolio-templates/portfolio-8/Portfolio8Form";
import Portfolio8 from "../../portfolio-templates/portfolio-8/Portfolio8";
import Portfolio9Form from "../../portfolio-templates/portfolio-9/Portfolio9Form";
import Portfolio9 from "../../portfolio-templates/portfolio-9/Portfolio9";

const TEMPLATE_REGISTRY = {
  template1: { name: "Brutalist", Form: Portfolio1Form, Preview: Portfolio1 },
  template2: { name: "Cyberpunk", Form: Portfolio2Form, Preview: Portfolio2 },
  template3: { name: "Designer", Form: Portfolio3Form, Preview: Portfolio3 },
  template4: { name: "Minimal", Form: Portfolio4Form, Preview: Portfolio4 },
  template5: { name: "Creative", Form: Portfolio5Form, Preview: Portfolio5 },
  template6: { name: "Professional", Form: Portfolio6Form, Preview: Portfolio6 },
  template7: { name: "Terminal", Form: Portfolio7Form, Preview: Portfolio7 },
  template8: { name: "Bold", Form: Portfolio8Form, Preview: Portfolio8 },
  template9: { name: "Luxury", Form: Portfolio9Form, Preview: Portfolio9 },
};

const STORAGE_PREFIX = "forged_template_";

function storageKey(userId, templateId) {
  return `${STORAGE_PREFIX}${userId || "guest"}_${templateId}`;
}

export default function TemplateEditorPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const { addToast } = useToast();

  const entry = TEMPLATE_REGISTRY[templateId];
  const templateConfig = getTemplateConfig(templateId);

  const [portfolioData, setPortfolioData] = useState(DEFAULT_PORTFOLIO_DATA);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved

  // Resizable panel splitter state
  const [formWidth, setFormWidth] = useState(500);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  // Resize handler for draggable splitter
  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.min(Math.max(e.clientX - rect.left, 320), rect.width - 340);
      setFormWidth(newWidth);
    }

    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function startDragging(e) {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  // Load saved data on mount
  useEffect(() => {
    if (authLoading) return;

    const userId = user?._id || user?.id || "guest";
    const key = storageKey(userId, templateId);

    // 1. Instant local restore
    try {
      const local = localStorage.getItem(key);
      if (local) {
        setPortfolioData(JSON.parse(local));
      }
    } catch (e) {
      console.warn("Failed reading local template storage:", e);
    }

    // 2. Fetch from MongoDB Atlas API
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`/api/portfolio?templateId=${encodeURIComponent(templateId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data && res.data.data) {
            const merged = { ...DEFAULT_PORTFOLIO_DATA, ...res.data.data };
            setPortfolioData(merged);
            localStorage.setItem(key, JSON.stringify(merged));
            setFormKey((k) => k + 1);
          }
        })
        .catch((err) => {
          console.warn("No cloud portfolio found, using current data", err);
        })
        .finally(() => {
          setDataLoaded(true);
        });
    } else {
      setDataLoaded(true);
    }
  }, [authLoading, user, templateId]);

  // Handle form change
  const handleChange = useCallback(
    (newData) => {
      setPortfolioData(newData);
      setSaveStatus("unsaved");
      const userId = user?._id || user?.id || "guest";
      try {
        localStorage.setItem(storageKey(userId, templateId), JSON.stringify(newData));
      } catch (e) {}
    },
    [user, templateId]
  );

  // Handle Cloud Save (MongoDB Atlas)
  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus("saving");

    const userId = user?._id || user?.id || "guest";
    localStorage.setItem(storageKey(userId, templateId), JSON.stringify(portfolioData));

    const token = localStorage.getItem("token");
    if (!token) {
      setSaving(false);
      setSaveStatus("saved");
      addToast("Saved locally to your browser.", "info");
      return;
    }

    try {
      await axios.post(
        "/api/portfolio",
        {
          templateId,
          portfolioData,
          name: portfolioData.name ? `${portfolioData.name}'s Portfolio` : "My Portfolio",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSaveStatus("saved");
      addToast("Saved successfully to MongoDB Atlas!", "success");
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("error");
      addToast("Cloud save failed. Data preserved in browser.", "error");
    } finally {
      setSaving(false);
    }
  }, [user, templateId, portfolioData, addToast]);

  if (!entry) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Template Not Found</h2>
          <p className="text-sm text-zinc-500 mb-4">The requested template identity does not exist.</p>
          <Link
            to="/studio/templates"
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 transition-colors"
          >
            Back to Templates Gallery
          </Link>
        </div>
      </div>
    );
  }

  const { name, Form, Preview } = entry;

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-color)] select-none" ref={containerRef}>
      {/* Top Action Bar */}
      <div className="h-14 px-4 border-b border-[var(--sidebar-border)] bg-white dark:bg-[#09090d] flex items-center justify-between shrink-0 z-20">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/studio/templates")}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Back to Templates"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
              {name}
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {templateConfig?.category || "Live Editor"}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Save status chip */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-medium mr-1">
            {saveStatus === "saving" && (
              <>
                <Loader2 size={12} className="animate-spin text-indigo-500" />
                <span className="text-zinc-400">Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check size={12} className="text-emerald-500" />
                <span className="text-emerald-500">Saved to cloud</span>
              </>
            )}
            {saveStatus === "unsaved" && (
              <span className="text-amber-500 text-[11px]">Unsaved changes</span>
            )}
          </div>

          {/* Cloud Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save</span>
          </button>

          {/* Cloud Sandbox IDE Button */}
          <button
            type="button"
            onClick={async () => {
              if (saveStatus === "unsaved") {
                await handleSave();
              }
              navigate(`/editor?templateId=${normalizedId}`);
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Open in In-Browser Cloud Sandbox IDE"
          >
            <Code2 size={13} />
            <span>Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Form Controls Panel */}
        <div
          style={{ width: `${formWidth}px` }}
          className="h-full overflow-y-auto border-r border-[var(--sidebar-border)] bg-white dark:bg-[#07070a] shrink-0 p-4 sm:p-6"
        >
          <div className="mb-4 pb-3 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Content & Settings
            </span>
            <span className="text-[10px] text-zinc-400">Real-time sync</span>
          </div>

          <Form key={formKey} initialData={portfolioData} onChange={handleChange} />
        </div>

        {/* Draggable Splitter Divider */}
        <div
          onMouseDown={startDragging}
          className="w-1.5 hover:w-2 bg-transparent hover:bg-indigo-500/50 cursor-col-resize transition-all shrink-0 flex items-center justify-center group relative z-10"
          title="Drag to resize panels"
        >
          <div className="w-1 h-8 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-indigo-400 transition-colors" />
        </div>

        {/* Right: Live Interactive Browser Preview */}
        <div className="flex-1 h-full overflow-hidden bg-[var(--bg-color)]">
          <BrowserPreview username={user?.username || portfolioData?.name?.toLowerCase().replace(/\s+/g, "")}>
            <Preview {...portfolioData} />
          </BrowserPreview>
        </div>
      </div>
    </div>
  );
}

