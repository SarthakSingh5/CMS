import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Mail,
  ExternalLink,
  LayoutTemplate,
  FileUser,
  Rocket,
} from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How do I create and customize my portfolio?",
    a: "Navigate to Templates in the sidebar, pick any of the 9 developer templates, and customize your experience, skills, and projects in the real-time form customizer.",
  },
  {
    q: "How does the cloud code sandbox work?",
    a: "From any template customizer, click 'Open Sandbox'. Forged boots an in-browser CodeMirror 6 code editor with live HMR (Hot Module Replacement) and file tree navigation.",
  },
  {
    q: "Can I export my code to GitHub?",
    a: "Yes! Click the 'GitHub' button in the editor top bar to push your portfolio directly into a new repository under your GitHub account.",
  },
  {
    q: "What is the CV Maker?",
    a: "The CV Maker syncs with your portfolio data to automatically generate an ATS-compliant, printable A4 resume that exports cleanly to PDF.",
  },
];

const quickLinks = [
  {
    title: "Templates",
    description: "Browse 9 customized developer portfolio designs",
    href: "/studio/templates",
    icon: LayoutTemplate,
  },
  {
    title: "CV Maker",
    description: "Create and download your ATS-ready resume",
    href: "/studio/cv-maker",
    icon: FileUser,
  },
  {
    title: "Documentation",
    description: "Read the comprehensive architecture guide",
    href: "/studio/docs",
    icon: BookOpen,
  },
];

export default function HelpPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle size={24} strokeWidth={1.5} className="text-zinc-500" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Help & Support</h1>
        </div>

        {/* Quick Links */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3 flex items-center gap-2">
            <Rocket size={14} strokeWidth={1.5} />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block bg-white dark:bg-[#0d0d12] border border-black/5 dark:border-white/10 rounded-2xl p-4 hover:border-indigo-500/50 transition-all group shadow-sm"
              >
                <link.icon
                  size={20}
                  strokeWidth={1.5}
                  className="text-zinc-500 group-hover:text-indigo-500 transition-colors mb-2.5"
                />
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{link.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3 flex items-center gap-2">
            <MessageSquare size={14} strokeWidth={1.5} />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0d0d12] border border-black/5 dark:border-white/10 rounded-2xl p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                  {faq.q}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3 flex items-center gap-2">
            <Mail size={14} strokeWidth={1.5} />
            Direct Support
          </h2>
          <div className="bg-white dark:bg-[#0d0d12] border border-black/5 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Have questions or need technical assistance with your templates or exports?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/studio/feedback"
                className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                <MessageSquare size={16} strokeWidth={1.5} />
                Submit feedback
              </Link>
              <a
                href="mailto:support@forged.studio"
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors"
              >
                <Mail size={16} strokeWidth={1.5} />
                support@forged.studio
                <ExternalLink size={12} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
