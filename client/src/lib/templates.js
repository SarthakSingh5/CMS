export const TEMPLATES = [
  {
    id: "template1",
    name: "Brutalist",
    category: "Technical",
    description: "Monospaced typography, bold architectural borders, high-density engineering layouts.",
    price: "Free",
    tags: ["Monospace", "Architect", "Dark Mode"],
    accentColor: "#6366f1",
    featured: true,
  },
  {
    id: "template2",
    name: "Cyberpunk",
    category: "Dark",
    description: "High-contrast neon cyan & emerald, HUD scanlines, dark tech cyber aesthetic.",
    price: "Free",
    tags: ["Neon", "HUD", "Terminal"],
    accentColor: "#10b981",
  },
  {
    id: "template3",
    name: "Designer",
    category: "Creative",
    description: "Refined editorial serif headlines, spacious card grids, visual case studies.",
    price: "Free",
    tags: ["Editorial", "Serif", "Visual"],
    accentColor: "#f43f5e",
  },
  {
    id: "template4",
    name: "Minimal",
    category: "Minimal",
    description: "Ultra-clean monochrome typography, Swiss grid alignment, distraction-free.",
    price: "Free",
    tags: ["Swiss", "Clean", "Monochrome"],
    accentColor: "#71717a",
  },
  {
    id: "template5",
    name: "Creative",
    category: "Creative",
    description: "Vibrant frosted glass cards, colorful tags, playful interactive components.",
    price: "Free",
    tags: ["Glassmorphism", "Vibrant", "Modern"],
    accentColor: "#06b6d4",
  },
  {
    id: "template6",
    name: "Professional",
    category: "Technical",
    description: "Enterprise executive styling, structured career timelines, recruiter-first focus.",
    price: "Free",
    originalPrice: "$29",
    tags: ["Enterprise", "Executive", "Corporate"],
    accentColor: "#8b5cf6",
  },
  {
    id: "template7",
    name: "Terminal",
    category: "Technical",
    description: "Interactive bash CLI terminal, CRT phosphor glow, command-line history.",
    price: "Free",
    originalPrice: "$29",
    tags: ["Bash", "CLI", "Retro"],
    accentColor: "#22c55e",
  },
  {
    id: "template8",
    name: "Bold",
    category: "Minimal",
    description: "Maximum typographic punch, high-contrast black & white, modern tech startup.",
    price: "Free",
    originalPrice: "$29",
    tags: ["Punchy", "High Contrast", "Impact"],
    accentColor: "#f59e0b",
  },
  {
    id: "template9",
    name: "Luxury",
    category: "Dark",
    description: "Deep obsidian backdrop with warm champagne gold accents, senior staff presence.",
    price: "Free",
    originalPrice: "$29",
    tags: ["Gold", "Obsidian", "Prestige"],
    accentColor: "#eab308",
  },
];

export const CATEGORIES = ["All", "Technical", "Minimal", "Creative", "Dark"];

export function getTemplateConfig(templateId) {
  return TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
}

export function isFreeTemplate(templateId) {
  const t = getTemplateConfig(templateId);
  return t?.price === "Free";
}

