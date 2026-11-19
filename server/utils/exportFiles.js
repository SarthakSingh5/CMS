import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { activeSandboxes } from '../controllers/sandboxController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_MAP = {
  template1: { dir: 'portfolio-1', component: 'Portfolio1.tsx', css: 'Portfolio1.module.css' },
  template2: { dir: 'portfolio-2', component: 'Portfolio2.tsx', css: 'Portfolio2.module.css' },
  template3: { dir: 'portfolio-3', component: 'Portfolio3.tsx', css: 'Portfolio3.module.css' },
  template4: { dir: 'portfolio-4', component: 'Portfolio4.tsx', css: 'Portfolio4.module.css' },
  template5: { dir: 'portfolio-5', component: 'Portfolio5.tsx', css: 'Portfolio5.module.css' },
  template6: { dir: 'portfolio-6', component: 'Portfolio6.tsx', css: 'Portfolio6.module.css' },
  template7: { dir: 'portfolio-7', component: 'Portfolio7.tsx', css: 'Portfolio7.module.css' },
  template8: { dir: 'portfolio-8', component: 'Portfolio8.tsx', css: 'Portfolio8.module.css' },
  template9: { dir: 'portfolio-9', component: 'Portfolio9.tsx', css: 'Portfolio9.module.css' },
};

function normalizeTemplateId(id) {
  if (!id) return 'template1';
  return id.toString().startsWith('template') ? id.toString() : `template${id}`;
}

export function generateLayoutTsx() {
  return `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forged Portfolio",
  description: "Built with Forged Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}
`;
}

export function generateGlobalsCss() {
  return `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  min-height: 100%;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #09090b;
}
::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}
`;
}

export function generateSandboxPageTsx(componentName, portfolioData) {
  const importName = componentName.replace(/\.tsx?$/, '');
  return `import ${importName} from "./${importName}";
import type { PortfolioProps } from "./PortfolioTypes";

const data: PortfolioProps = ${JSON.stringify(portfolioData, null, 2)};

export default function Page() {
  return <${importName} {...data} />;
}
`;
}

export function generatePackageJson(name = 'forged-portfolio') {
  return JSON.stringify(
    {
      name: name.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
      },
      dependencies: {
        next: '^15.1.0',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        'lucide-react': '^0.468.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/node': '^20.0.0',
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
      },
    },
    null,
    2
  );
}

export function generateTsConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        paths: {
          '@/*': ['./*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
      exclude: ['node_modules'],
    },
    null,
    2
  );
}

export function generateNextConfig() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
`;
}

export function generateGitignore() {
  return `node_modules/
.next/
out/
.env
.env.local
`;
}

export function generateReadme(name = 'Developer Portfolio') {
  return `# ${name}

Crafted with [Forged](https://forged.dev) — The Developer Portfolio & CV Platform.

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view your live portfolio.
`;
}

/**
 * Generate project files directly from a template + portfolioData
 */
export async function getFilesFromTemplate(templateId, portfolioData) {
  const normId = normalizeTemplateId(templateId);
  const templateInfo = TEMPLATE_MAP[normId] || TEMPLATE_MAP.template1;

  const files = new Map();
  const templateBaseDir = path.resolve(__dirname, '../../client/src/portfolio-templates');

  let typesContent = '';
  let componentContent = '';
  let cssContent = '';

  try {
    typesContent = fs.readFileSync(path.join(templateBaseDir, 'PortfolioTypes.ts'), 'utf-8');
  } catch {
    typesContent = `export interface PortfolioProps { name: string; title: string; bio: string; [key: string]: any; }`;
  }

  try {
    componentContent = fs.readFileSync(
      path.join(templateBaseDir, templateInfo.dir, templateInfo.component),
      'utf-8'
    );
  } catch {
    componentContent = `export default function ${templateInfo.component.replace('.tsx', '')}(props) { return <div>{props.name}</div>; }`;
  }

  try {
    cssContent = fs.readFileSync(
      path.join(templateBaseDir, templateInfo.dir, templateInfo.css),
      'utf-8'
    );
  } catch {
    cssContent = `/* ${templateInfo.css} */\n.container { padding: 2rem; }`;
  }

  const adaptedComponent = componentContent.replace(
    /from\s+["']\.\.\/PortfolioTypes["']/g,
    'from "./PortfolioTypes"'
  );

  const pageTsx = generateSandboxPageTsx(templateInfo.component, portfolioData);
  const layoutTsx = generateLayoutTsx();
  const globalsCss = generateGlobalsCss();
  const packageJson = generatePackageJson(portfolioData.name || 'My Portfolio');
  const tsconfigJson = generateTsConfig();
  const nextConfig = generateNextConfig();
  const gitignore = generateGitignore();
  const readmeMd = generateReadme(portfolioData.name || 'My Portfolio');
  const dataJson = JSON.stringify(portfolioData, null, 2);

  files.set('app/page.tsx', pageTsx);
  files.set('app/layout.tsx', layoutTsx);
  files.set('app/globals.css', globalsCss);
  files.set(`app/${templateInfo.component}`, adaptedComponent);
  files.set(`app/${templateInfo.css}`, cssContent);
  files.set('app/PortfolioTypes.ts', typesContent);
  files.set('app/data.json', dataJson);

  files.set('package.json', packageJson);
  files.set('tsconfig.json', tsconfigJson);
  files.set('next.config.mjs', nextConfig);
  files.set('.gitignore', gitignore);
  files.set('README.md', readmeMd);

  return files;
}

/**
 * Collect files from an active virtual sandbox
 */
export async function getFilesFromSandbox(sandboxId) {
  const sandbox = activeSandboxes.get(sandboxId);
  if (!sandbox) {
    throw new Error(`Sandbox session "${sandboxId}" not found or expired`);
  }

  const files = new Map();
  for (const [rawPath, content] of sandbox.files) {
    // Strip /home/user/ prefix if present
    const cleanPath = rawPath.replace(/^\/home\/user\//, '').replace(/^\//, '');
    files.set(cleanPath, content);
  }

  // Ensure config files exist
  if (!files.has('next.config.mjs')) {
    files.set('next.config.mjs', generateNextConfig());
  }
  if (!files.has('.gitignore')) {
    files.set('.gitignore', generateGitignore());
  }

  return files;
}
