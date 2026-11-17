import { useState, useMemo } from "react";
import { Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { TEMPLATES, CATEGORIES } from "../../lib/templates";
import { TemplateCard } from "../../components/studio/TemplateCard";
import { TemplatePreview } from "../../components/studio/TemplatePreview";
import { DEFAULT_PORTFOLIO_DATA } from "../../lib/default-portfolio-data";

// Live Preview Components
import Portfolio1 from "../../portfolio-templates/portfolio-1/Portfolio1";
import Portfolio2 from "../../portfolio-templates/portfolio-2/Portfolio2";
import Portfolio3 from "../../portfolio-templates/portfolio-3/Portfolio3";
import Portfolio4 from "../../portfolio-templates/portfolio-4/Portfolio4";
import Portfolio5 from "../../portfolio-templates/portfolio-5/Portfolio5";
import Portfolio6 from "../../portfolio-templates/portfolio-6/Portfolio6";
import Portfolio7 from "../../portfolio-templates/portfolio-7/Portfolio7";
import Portfolio8 from "../../portfolio-templates/portfolio-8/Portfolio8";
import Portfolio9 from "../../portfolio-templates/portfolio-9/Portfolio9";

// Live preview map for all 9 developer templates
const TEMPLATE_PREVIEWS = {
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

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === "All" || template.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="h-full overflow-y-auto px-6 sm:px-10 py-10 bg-[var(--bg-color)]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Developer Templates
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                <Sparkles size={12} /> 9 Identities Active
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
              Choose from 9 developer identities. Customize data with live form previews, tweak scoped CSS modules, or boot the cloud sandbox.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search
              size={15}
              strokeWidth={1.8}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates or tags..."
              className="w-full bg-white dark:bg-[#0a0a0f] border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mr-2 shrink-0">
            <SlidersHorizontal size={13} />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Filter:</span>
          </div>

          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "bg-white dark:bg-[#0a0a0f] border border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-black/20 dark:hover:border-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const PreviewComponent = TEMPLATE_PREVIEWS[template.id];
              return (
                <TemplateCard
                  key={template.id}
                  id={template.id}
                  name={template.name}
                  category={template.category}
                  description={template.description}
                  price={template.price}
                  originalPrice={template.originalPrice}
                  tags={template.tags}
                  accentColor={template.accentColor}
                  featured={template.featured}
                  previewContent={
                    PreviewComponent ? (
                      <TemplatePreview>
                        <PreviewComponent {...DEFAULT_PORTFOLIO_DATA} />
                      </TemplatePreview>
                    ) : null
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-white/[0.02]">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
              No matching templates found
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Try adjusting your search query or switching categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Bottom breathing space */}
        <div className="h-16" />
      </div>
    </div>
  );
}

