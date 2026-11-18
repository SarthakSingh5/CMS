import { useState, useCallback, useEffect, useRef, useContext } from "react";
import axios from "axios";
import {
  FileUser,
  Save,
  Printer,
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
  Sliders,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { DEFAULT_CV_DATA } from "../../lib/default-cv-data";
import CvForm from "../../components/cv/CvForm";
import CvPreview from "../../components/cv/CvPreview";
import { A4Preview } from "../../components/cv/A4Preview";

const CV_STORAGE_PREFIX = "forged_cv_";

function storageKey(userId) {
  return `${CV_STORAGE_PREFIX}${userId || "guest"}`;
}

export default function CvMakerPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { addToast } = useToast();

  const [cvData, setCvData] = useState(DEFAULT_CV_DATA);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | unsaved
  const [importing, setImporting] = useState(false);

  // Resizable panel splitter
  const [formWidth, setFormWidth] = useState(500);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

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

  // Load CV data on mount
  useEffect(() => {
    if (authLoading) return;

    const userId = user?._id || user?.id || "guest";
    const key = storageKey(userId);

    // 1. Instant local restore
    try {
      const local = localStorage.getItem(key);
      if (local) {
        setCvData(JSON.parse(local));
      }
    } catch (e) {
      console.warn("Failed reading local CV storage:", e);
    }

    // 2. Query MongoDB Atlas
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/cv", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data && res.data.data) {
            const merged = {
              ...DEFAULT_CV_DATA,
              ...res.data.data,
              personalInfo: {
                ...DEFAULT_CV_DATA.personalInfo,
                ...(res.data.data.personalInfo || {}),
              },
              colors: {
                ...DEFAULT_CV_DATA.colors,
                ...(res.data.data.colors || {}),
              },
            };
            setCvData(merged);
            localStorage.setItem(key, JSON.stringify(merged));
            setFormKey((k) => k + 1);
          }
        })
        .catch((err) => {
          console.warn("No cloud CV found, using local default:", err);
        })
        .finally(() => {
          setDataLoaded(true);
        });
    } else {
      setDataLoaded(true);
    }
  }, [authLoading, user]);

  const handleChange = useCallback(
    (newData) => {
      setCvData(newData);
      setSaveStatus("unsaved");
      const userId = user?._id || user?.id || "guest";
      try {
        localStorage.setItem(storageKey(userId), JSON.stringify(newData));
      } catch (e) {}
    },
    [user]
  );

  // Cloud Save
  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus("saving");

    const userId = user?._id || user?.id || "guest";
    localStorage.setItem(storageKey(userId), JSON.stringify(cvData));

    const token = localStorage.getItem("token");
    if (!token) {
      setSaving(false);
      setSaveStatus("saved");
      addToast("Saved locally to your browser.", "info");
      return;
    }

    try {
      await axios.post(
        "/api/cv",
        {
          cvData,
          title: cvData.personalInfo?.fullName
            ? `${cvData.personalInfo.fullName}'s CV`
            : "My Developer CV",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSaveStatus("saved");
      addToast("CV saved to MongoDB Atlas!", "success");
    } catch (err) {
      console.error("Save CV error:", err);
      setSaveStatus("error");
      addToast("Cloud save failed. Data preserved locally.", "error");
    } finally {
      setSaving(false);
    }
  }, [user, cvData, addToast]);

  // Import from Portfolio Data
  const handleImportFromPortfolio = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      addToast("Please log in to import your portfolio data.", "info");
      return;
    }

    setImporting(true);
    try {
      const res = await axios.get("/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const portfolios = res.data?.data;
      if (!portfolios || portfolios.length === 0) {
        addToast("No saved portfolio found to import from.", "info");
        return;
      }

      // Grab the most recently updated portfolio
      const source = portfolios[0]?.content || portfolios[0];
      if (!source) {
        addToast("Portfolio content was empty.", "info");
        return;
      }

      // Map portfolio fields to CVData
      const imported = {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          fullName: source.name || cvData.personalInfo.fullName,
          jobTitle: source.title || cvData.personalInfo.jobTitle,
          email: source.socials?.find((s) => s.platform === "email")?.url || cvData.personalInfo.email,
          location: source.location || cvData.personalInfo.location,
          linkedIn: source.socials?.find((s) => s.platform === "linkedin")?.url || cvData.personalInfo.linkedIn,
          website: source.socials?.find((s) => s.platform === "website")?.url || cvData.personalInfo.website,
        },
        summary: source.bio || cvData.summary,
        experience: source.experiences && source.experiences.length > 0
          ? source.experiences.map((exp) => ({
              company: exp.company || "",
              role: exp.role || "",
              location: exp.location || "",
              startDate: exp.startDate || "",
              endDate: exp.endDate || "",
              current: !!exp.current,
              bullets: exp.description ? [exp.description] : [],
            }))
          : cvData.experience,
        education: source.education && source.education.length > 0
          ? source.education.map((edu) => ({
              institution: edu.institution || "",
              degree: edu.degree || "",
              field: edu.field || "",
              startDate: edu.startDate || "",
              endDate: edu.endDate || "",
              gpa: edu.gpa || "",
              description: edu.description || "",
            }))
          : cvData.education,
        skillGroups: source.skills && source.skills.length > 0
          ? [
              {
                category: "Technical Stack",
                skills: source.skills.map((s) => (typeof s === "string" ? s : s.name)),
              },
            ]
          : cvData.skillGroups,
      };

      setCvData(imported);
      setFormKey((k) => k + 1);
      setSaveStatus("unsaved");
      addToast("Successfully imported data from your portfolio!", "success");
    } catch (err) {
      console.error("Import error:", err);
      addToast("Failed to import portfolio data.", "error");
    } finally {
      setImporting(false);
    }
  }, [cvData, addToast]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-color)] select-none" ref={containerRef}>
      {/* Top Header Bar */}
      <div className="h-14 px-4 border-b border-[var(--sidebar-border)] bg-white dark:bg-[#09090d] flex items-center justify-between shrink-0 z-20 print:hidden">
        {/* Left Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileUser size={18} strokeWidth={1.5} />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
              A4 CV & Resume Builder
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              ATS Optimized
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Save Status Chip */}
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

          {/* Import from Portfolio Button */}
          <button
            type="button"
            onClick={handleImportFromPortfolio}
            disabled={importing}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            title="Import information from your portfolio"
          >
            <RefreshCw size={13} className={importing ? "animate-spin" : ""} />
            <span>Sync Portfolio</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save</span>
          </button>

          {/* Print / Export PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Print or export as PDF"
          >
            <Printer size={13} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: CV Form Controls */}
        <div
          style={{ width: `${formWidth}px` }}
          className="h-full overflow-y-auto border-r border-[var(--sidebar-border)] bg-white dark:bg-[#07070a] shrink-0 p-4 sm:p-6 print:hidden"
        >
          <div className="mb-4 pb-3 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Resume Sections
            </span>
            <span className="text-[10px] text-zinc-400">Real-time update</span>
          </div>

          <CvForm key={formKey} initialData={cvData} onChange={handleChange} />
        </div>

        {/* Draggable Divider */}
        <div
          onMouseDown={startDragging}
          className="w-1.5 hover:w-2 bg-transparent hover:bg-indigo-500/50 cursor-col-resize transition-all shrink-0 flex items-center justify-center group relative z-10 print:hidden"
          title="Drag to resize panels"
        >
          <div className="w-1 h-8 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-indigo-400 transition-colors" />
        </div>

        {/* Right: Printable A4 Live Sheet */}
        <div className="flex-1 h-full overflow-hidden bg-[var(--bg-color)]">
          <A4Preview>
            <CvPreview data={cvData} />
          </A4Preview>
        </div>
      </div>
    </div>
  );
}

