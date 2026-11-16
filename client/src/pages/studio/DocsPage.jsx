import { useState, useEffect, useRef, useCallback } from "react";
import {
  Rocket,
  LayoutTemplate,
  Code2,
  Globe,
  Database,
  FileText,
  Sparkles,
} from "lucide-react";
import { DocsNav } from "../../components/studio/DocsNav";

const SECTIONS = [
  { id: "getting-started", title: "Getting Started", icon: Rocket },
  { id: "templates", title: "Templates", icon: LayoutTemplate },
  { id: "sandbox", title: "Sandbox & Code Editor", icon: Code2 },
  { id: "deploying", title: "Deploying", icon: Globe },
  { id: "portfolio-api", title: "Portfolio API", icon: Database },
  { id: "cv-maker", title: "CV Maker", icon: FileText },
];

function InlineCode({ children }) {
  return (
    <code className="font-mono text-[13px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-zinc-900 dark:text-zinc-100">
      {children}
    </code>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="bg-black/5 dark:bg-[#0d0d12] rounded-xl p-4 overflow-x-auto border border-black/5 dark:border-white/10 my-4">
      <code className="font-mono text-[13px] text-zinc-800 dark:text-zinc-200 whitespace-pre">{children}</code>
    </pre>
  );
}

function Tip({ children }) {
  return (
    <div className="border-l-2 border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-r-xl px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300 my-4">
      {children}
    </div>
  );
}

function ComingSoon() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-medium ml-2">
      <Sparkles size={10} />
      Coming soon
    </span>
  );
}

function SectionHeading({ id, icon: Icon, children }) {
  return (
    <h2
      id={id}
      data-section
      className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4 flex items-center gap-2.5 scroll-mt-10"
    >
      <Icon size={20} strokeWidth={1.7} className="text-indigo-600 dark:text-indigo-400" />
      {children}
    </h2>
  );
}

function SubHeading({ children }) {
  return (
    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-3">{children}</h3>
  );
}

function Paragraph({ children }) {
  return <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{children}</p>;
}

function SectionDivider() {
  return <div className="border-t border-black/5 dark:border-white/10 mt-12 pt-12" />;
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          );
          setActiveSection(topmost.target.id);
        }
      },
      {
        root: container,
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      }
    );

    const sectionEls = container.querySelectorAll("[data-section]");
    sectionEls.forEach((el) => observer.observe(el));

    function handleScroll() {
      if (!container) return;
      const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
      if (atBottom) {
        const lastSection = SECTIONS[SECTIONS.length - 1];
        setActiveSection(lastSection.id);
      }
    }

    container.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el && scrollRef.current) {
      const container = scrollRef.current;
      const top = el.offsetTop - container.offsetTop - 40;
      container.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="flex h-full w-full">
      <DocsNav
        sections={SECTIONS}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      <div ref={scrollRef} className="flex-1 h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
              Documentation
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Everything you need to know about building, customizing, and deploying developer portfolios with Forged.
            </p>
          </div>

          {/* 1. Getting Started */}
          <SectionHeading id="getting-started" icon={Rocket}>
            Getting Started
          </SectionHeading>

          <Paragraph>
            Forged helps developers create, customize, and deploy modern personal portfolios and ATS-optimized CVs in minutes.
            Pick from 9 tailored templates, tweak your content in the form editor or code sandbox, and publish.
          </Paragraph>

          <SubHeading>Studio Workspace</SubHeading>
          <Paragraph>
            Once logged in, you enter the <strong className="text-zinc-900 dark:text-white">Studio</strong> — your command center for managing all portfolio templates, live preview customizers, and ATS CV documents.
          </Paragraph>

          <SubHeading>Quick Start Checklist</SubHeading>
          <ol className="list-none space-y-3 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {[
              "Sign in to your account with JWT authentication",
              "Explore the 9 curated developer templates in the Gallery",
              "Enter your experience, projects, and skills in the live form",
              "Watch your portfolio update in real time with CSS Module isolation",
              "Switch to the in-browser cloud Sandbox for direct CodeMirror customization",
              "Export to GitHub or deploy directly to production",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          <Tip>
            All your portfolio data is backed up directly in MongoDB Atlas and mirrored in browser storage for instantaneous offline responsiveness.
          </Tip>

          {/* 2. Templates */}
          <SectionDivider />
          <SectionHeading id="templates" icon={LayoutTemplate}>
            Templates
          </SectionHeading>

          <Paragraph>
            Forged features 9 specialized visual identities tailored for developers, engineers, and tech leads:
          </Paragraph>

          <ul className="list-disc pl-5 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            <li><strong className="text-zinc-900 dark:text-zinc-200">Brutalist (Template 1)</strong> — Monospaced typography, bold borders, architect aesthetic.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-200">Cyberpunk (Template 2)</strong> — High-contrast neon accents, HUD scanlines, dark tech vibe.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-200">Designer (Template 3)</strong> — Editorial serif typography, spacious gallery cards, visual focus.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-200">Minimal (Template 4)</strong> — Ultra-clean monochrome, crisp hierarchy, Swiss grid layout.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-200">Creative (Template 5)</strong> — Vibrant glassmorphism, playful badges, interactive cards.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-200">Professional (Template 6)</strong> — Enterprise executive aesthetic, structured timeline, clean badges.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-200">Terminal (Template 7)</strong> — Interactive bash shell interface, green phosphor CRT styling.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-200">Bold (Template 8)</strong> — High-impact punchy headings, vibrant contrast, modern startup vibe.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-200">Luxury (Template 9)</strong> — Premium dark gold accents, refined typography, senior tech presence.</li>
          </ul>

          <SubHeading>Template Editor</SubHeading>
          <Paragraph>
            The customizer offers a split-screen view: a structured form panel on the left and a live real-time preview on the right. You can drag the splitter to resize the workspace.
          </Paragraph>

          {/* 3. Sandbox & Code Editor */}
          <SectionDivider />
          <SectionHeading id="sandbox" icon={Code2}>
            Sandbox & Code Editor
          </SectionHeading>

          <Paragraph>
            For complete freedom beyond form fields, Forged integrates a full in-browser code editor powered by CodeMirror 6 and connected to cloud execution sandboxes.
          </Paragraph>

          <SubHeading>Three-Panel Architecture</SubHeading>
          <CodeBlock>{`┌──────────────┬────────────────────────┬──────────────────────┐
│ File Tree    │ CodeMirror 6 Editor    │ Live Preview Frame   │
│              │                        │                      │
│ - page.tsx   │ import Portfolio1 from │                      │
│ - styles.css │ export default ...     │ (Interactive HMR)    │
│ - data.json  │                        │                      │
└──────────────┴────────────────────────┴──────────────────────┘`}</CodeBlock>

          <Paragraph>
            Files auto-save with debounce. When you switch back to the form editor, your changes synchronize seamlessly with MongoDB Atlas.
          </Paragraph>

          {/* 4. Deploying */}
          <SectionDivider />
          <SectionHeading id="deploying" icon={Globe}>
            Deploying
          </SectionHeading>

          <Paragraph>
            Forged gives you native pathways to share your work with recruiters and clients:
          </Paragraph>

          <SubHeading>GitHub Repository Export</SubHeading>
          <Paragraph>
            Push your customized portfolio code directly to a brand new repository under your GitHub account with a single click.
          </Paragraph>

          <SubHeading>Vercel Production Deployment<ComingSoon /></SubHeading>
          <Paragraph>
            Connect your Vercel account to publish to global edge CDN with automatic SSL certificates and custom domain mapping.
          </Paragraph>

          {/* 5. Portfolio API */}
          <SectionDivider />
          <SectionHeading id="portfolio-api" icon={Database}>
            Portfolio API
          </SectionHeading>

          <Paragraph>
            Forged backend runs on Node.js, Express, and MongoDB Atlas with authenticated REST endpoints:
          </Paragraph>

          <SubHeading>Fetch Portfolio by Template</SubHeading>
          <CodeBlock>{`GET /api/portfolio?templateId=template1
Authorization: Bearer <jwt_token>

// Response:
{
  "success": true,
  "data": {
    "templateId": "template1",
    "content": {
      "name": "Alex Mercer",
      "title": "Full Stack Architect",
      "bio": "...",
      "skills": ["React 19", "Node.js", "TypeScript", "Tailwind CSS"],
      "projects": [...]
    }
  }
}`}</CodeBlock>

          <SubHeading>Save / Auto-save Portfolio</SubHeading>
          <CodeBlock>{`POST /api/portfolio
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "templateId": "template1",
  "content": {
    "name": "Alex Mercer",
    "title": "Full Stack Architect",
    ...
  }
}`}</CodeBlock>

          {/* 6. CV Maker */}
          <SectionDivider />
          <SectionHeading id="cv-maker" icon={FileText}>
            CV Maker
          </SectionHeading>

          <Paragraph>
            The integrated CV Maker formats your projects, education, and technical experience into an ATS-friendly, printable A4 sheet that exports cleanly to PDF.
          </Paragraph>

          <div className="h-20" />
        </div>
      </div>
    </div>
  );
}

