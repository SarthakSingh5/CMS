import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  Sparkles,
  GitFork,
  Code2,
  ExternalLink,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Check,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { DEFAULT_PORTFOLIO_DATA } from "../lib/default-portfolio-data";

// Import all 9 template previews
import Portfolio1 from "../portfolio-templates/portfolio-1/Portfolio1";
import Portfolio2 from "../portfolio-templates/portfolio-2/Portfolio2";
import Portfolio3 from "../portfolio-templates/portfolio-3/Portfolio3";
import Portfolio4 from "../portfolio-templates/portfolio-4/Portfolio4";
import Portfolio5 from "../portfolio-templates/portfolio-5/Portfolio5";
import Portfolio6 from "../portfolio-templates/portfolio-6/Portfolio6";
import Portfolio7 from "../portfolio-templates/portfolio-7/Portfolio7";
import Portfolio8 from "../portfolio-templates/portfolio-8/Portfolio8";
import Portfolio9 from "../portfolio-templates/portfolio-9/Portfolio9";

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

export default function PublicPortfolioPage() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remixing, setRemixing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchPublic() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/portfolio/public/${identifier}`);
        if (isMounted) {
          setPortfolio(res.data);
        }
      } catch (err) {
        console.warn("Public portfolio fetch error:", err);
        // If it starts with template, fallback to default template preview
        if (identifier && identifier.startsWith("template")) {
          if (isMounted) {
            setPortfolio({
              templateId: identifier,
              name: "Preview",
              views: 1,
              author: "Forged Showcase",
              data: DEFAULT_PORTFOLIO_DATA,
            });
          }
        } else {
          if (isMounted) setError("Portfolio not found or has been set to private.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPublic();

    return () => {
      isMounted = false;
    };
  }, [identifier]);

  async function handleRemix() {
    if (!user) {
      addToast("Please sign in to remix this portfolio into your workspace.", "info");
      navigate(`/login?redirect=/p/${identifier}`);
      return;
    }

    if (!portfolio?.portfolioId) {
      // Just navigate to template editor
      navigate(`/studio/templates/${portfolio?.templateId || "template1"}`);
      return;
    }

    setRemixing(true);
    try {
      const res = await axios.post(`/api/portfolio/remix/${portfolio.portfolioId}`);
      addToast("Portfolio successfully remixed to your studio!", "success");
      navigate(`/studio/templates/${res.data.templateId}`);
    } catch (err) {
      console.error("Remix error:", err);
      addToast("Failed to remix portfolio. Opening template instead.", "error");
      navigate(`/studio/templates/${portfolio.templateId}`);
    } finally {
      setRemixing(false);
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast("Link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2500);
  }

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#09090c] text-zinc-400 font-mono">
        <Loader2 size={32} className="animate-spin text-indigo-500 mb-3" />
        <span className="text-xs uppercase tracking-wider text-zinc-400">Loading Portfolio...</span>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#09090c] text-zinc-100 font-sans text-center">
        <div className="max-w-md w-full bg-[#111116] border border-zinc-800 rounded-2xl p-8 space-y-4 shadow-2xl">
          <AlertCircle size={36} className="mx-auto text-amber-400" />
          <h2 className="text-lg font-bold text-white">Portfolio Unavailable</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {error || "The portfolio you requested could not be located."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/studio/templates"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-medium transition-colors"
            >
              <span>Explore Templates</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const normId = portfolio.templateId?.startsWith("template")
    ? portfolio.templateId
    : `template${portfolio.templateId || 1}`;

  const TemplateComponent = TEMPLATE_COMPONENTS[normId] || Portfolio1;
  const portfolioData = portfolio.data || DEFAULT_PORTFOLIO_DATA;

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-white">
      {/* The Rendered Public Portfolio */}
      <main className="w-full min-h-screen">
        <TemplateComponent {...portfolioData} />
      </main>

      {/* Floating Action Dock (discreet bottom pill) */}
      <aside
        aria-label="Forged Platform Navigation"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#111116]/90 backdrop-blur-md border border-white/10 shadow-2xl font-mono text-xs select-none"
      >
        {/* Left: Branding badge */}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors pr-2 border-r border-white/10"
          title="Built with Forged"
        >
          <span className="font-extrabold tracking-tight text-white flex items-center gap-1">
            ⚡ Forged
          </span>
        </Link>

        {/* Center: View counter */}
        <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 text-[11px] px-1">
          <Eye size={12} className="text-zinc-500" />
          <span>{portfolio.views || 1} views</span>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-1.5 pl-1">
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Copy share link"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
          </button>

          <Link
            to={`/editor?templateId=${normId}`}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 text-[11px] font-medium transition-colors"
            title="Inspect source code in Cloud IDE"
          >
            <Code2 size={12} />
            <span>Code</span>
          </Link>

          <button
            type="button"
            onClick={handleRemix}
            disabled={remixing}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shadow-sm shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            title="Fork this template into your workspace"
          >
            {remixing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <GitFork size={12} />
            )}
            <span>Remix</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

