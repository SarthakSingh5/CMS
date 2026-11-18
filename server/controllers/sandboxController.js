import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory virtual sandboxes map: sandboxId -> SandboxState
const activeSandboxes = new Map();

// Template file resolution map
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

function normalizePath(p) {
  if (!p) return '/home/user';
  let clean = p.replace(/\\/g, '/');
  if (!clean.startsWith('/')) clean = '/' + clean;
  if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1);
  return clean;
}

// Scaffolding generators
function generateLayoutTsx() {
  return `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forged Portfolio Preview",
  description: "Built with Forged Studio",
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

function generateGlobalsCss() {
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

function generateSandboxPageTsx(componentName, portfolioData) {
  const importName = componentName.replace(/\.tsx?$/, '');
  return `import ${importName} from "./${importName}";
import type { PortfolioProps } from "./PortfolioTypes";

const data: PortfolioProps = ${JSON.stringify(portfolioData, null, 2)};

export default function Page() {
  return <${importName} {...data} />;
}
`;
}

function generatePackageJson(name = 'forged-portfolio') {
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
        tailwindcss: '^3.4.0',
        postcss: '^8.4.0',
        autoprefixer: '^10.4.0',
      },
    },
    null,
    2
  );
}

function generateTsConfig() {
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

function generateReadme(name = 'Developer Portfolio') {
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
 * Creates or resets a sandbox instance
 */
function createSandboxSession(userId = 'guest', templateId = 'template1') {
  const sandboxId = `sbx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const files = new Map();
  const directories = new Set(['/home/user', '/home/user/app']);

  const sandbox = {
    sandboxId,
    userId,
    templateId,
    previewUrl: `/studio/templates/${templateId}?sandboxId=${sandboxId}`,
    files,
    directories,
    portfolioData: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  activeSandboxes.set(sandboxId, sandbox);
  return sandbox;
}

// ──────────────────────────── API CONTROLLER HANDLERS ────────────────────────────

// @desc    Create a new sandbox session
// @route   POST /api/sandbox/create
export const create = async (req, res) => {
  try {
    const userId = req.user?._id?.toString() || 'guest';
    const sandbox = createSandboxSession(userId, 'template1');

    return res.status(200).json({
      sandboxId: sandbox.sandboxId,
      previewUrl: sandbox.previewUrl,
    });
  } catch (error) {
    console.error('Error creating sandbox:', error);
    return res.status(500).json({ error: error.message || 'Failed to create sandbox' });
  }
};

// @desc    Deploy a template into a sandbox session
// @route   POST /api/sandbox/deploy-template
export const deployTemplate = async (req, res) => {
  try {
    const userId = req.user?._id?.toString() || 'guest';
    const { templateId, portfolioData } = req.body;

    if (!templateId || !portfolioData) {
      return res.status(400).json({ error: 'Missing templateId or portfolioData' });
    }

    const normId = normalizeTemplateId(templateId);
    const templateInfo = TEMPLATE_MAP[normId] || TEMPLATE_MAP.template1;

    // Resolve template directory on disk
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

    // Adapt import statements for flat sandbox structure
    const adaptedComponent = componentContent.replace(
      /from\s+["']\.\.\/PortfolioTypes["']/g,
      'from "./PortfolioTypes"'
    );

    const sandbox = createSandboxSession(userId, normId);
    sandbox.portfolioData = portfolioData;

    // Generate project files
    const pageTsx = generateSandboxPageTsx(templateInfo.component, portfolioData);
    const layoutTsx = generateLayoutTsx();
    const globalsCss = generateGlobalsCss();
    const packageJson = generatePackageJson(portfolioData.name || 'My Portfolio');
    const tsconfigJson = generateTsConfig();
    const readmeMd = generateReadme(portfolioData.name || 'My Portfolio');
    const dataJson = JSON.stringify(portfolioData, null, 2);

    // Populate files in sandbox
    sandbox.files.set('/home/user/app/page.tsx', pageTsx);
    sandbox.files.set('/home/user/app/layout.tsx', layoutTsx);
    sandbox.files.set('/home/user/app/globals.css', globalsCss);
    sandbox.files.set(`/home/user/app/${templateInfo.component}`, adaptedComponent);
    sandbox.files.set(`/home/user/app/${templateInfo.css}`, cssContent);
    sandbox.files.set('/home/user/app/PortfolioTypes.ts', typesContent);
    sandbox.files.set('/home/user/app/data.json', dataJson);

    sandbox.files.set('/home/user/package.json', packageJson);
    sandbox.files.set('/home/user/tsconfig.json', tsconfigJson);
    sandbox.files.set('/home/user/README.md', readmeMd);

    return res.status(200).json({
      sandboxId: sandbox.sandboxId,
      previewUrl: sandbox.previewUrl,
    });
  } catch (error) {
    console.error('Error deploying template to sandbox:', error);
    return res.status(500).json({
      error: error.message || 'Failed to deploy template to sandbox',
    });
  }
};

// @desc    List files and folders in sandbox directory
// @route   GET /api/sandbox/files
export const listFiles = async (req, res) => {
  try {
    const sandboxId = req.query.id;
    const reqPath = normalizePath(req.query.path || '/home/user');

    if (!sandboxId) {
      return res.status(400).json({ error: 'Missing sandbox ID' });
    }

    const sandbox = activeSandboxes.get(sandboxId);
    if (!sandbox) {
      return res.status(404).json({ error: 'Sandbox session not found or expired' });
    }

    const entriesMap = new Map();

    // Check all directories
    for (const d of sandbox.directories) {
      if (d !== reqPath && d.startsWith(reqPath + '/')) {
        const remainder = d.slice(reqPath.length + 1);
        const seg = remainder.split('/')[0];
        const fullDir = `${reqPath}/${seg}`;
        if (!entriesMap.has(seg)) {
          entriesMap.set(seg, {
            name: seg,
            type: 'dir',
            path: fullDir,
          });
        }
      }
    }

    // Check all files
    for (const [filePath] of sandbox.files) {
      if (filePath.startsWith(reqPath + '/')) {
        const remainder = filePath.slice(reqPath.length + 1);
        const parts = remainder.split('/');
        if (parts.length === 1) {
          // Direct file
          entriesMap.set(parts[0], {
            name: parts[0],
            type: 'file',
            path: filePath,
          });
        } else {
          // Sub-directory
          const dirName = parts[0];
          const fullDir = `${reqPath}/${dirName}`;
          if (!entriesMap.has(dirName)) {
            entriesMap.set(dirName, {
              name: dirName,
              type: 'dir',
              path: fullDir,
            });
          }
        }
      }
    }

    const sortedEntries = Array.from(entriesMap.values()).sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return res.status(200).json({ entries: sortedEntries });
  } catch (error) {
    console.error('Error listing sandbox files:', error);
    return res.status(500).json({ error: error.message || 'Failed to list files' });
  }
};

// @desc    Read file content from sandbox
// @route   GET /api/sandbox/files/read
export const readFile = async (req, res) => {
  try {
    const sandboxId = req.query.id;
    const filePath = normalizePath(req.query.path);

    if (!sandboxId || !filePath) {
      return res.status(400).json({ error: 'Missing sandbox ID or file path' });
    }

    const sandbox = activeSandboxes.get(sandboxId);
    if (!sandbox) {
      return res.status(404).json({ error: 'Sandbox session not found' });
    }

    if (!sandbox.files.has(filePath)) {
      // Try resolving alternate prefix
      const altPath = filePath.startsWith('/home/user')
        ? filePath.replace('/home/user', '')
        : `/home/user${filePath}`;

      if (sandbox.files.has(altPath)) {
        return res.status(200).json({ content: sandbox.files.get(altPath) });
      }

      return res.status(404).json({ error: `File not found: ${filePath}` });
    }

    return res.status(200).json({ content: sandbox.files.get(filePath) });
  } catch (error) {
    console.error('Error reading sandbox file:', error);
    return res.status(500).json({ error: error.message || 'Failed to read file' });
  }
};

// @desc    Write or update file content in sandbox
// @route   POST /api/sandbox/files/write
export const writeFile = async (req, res) => {
  try {
    const { id: sandboxId, path: rawPath, content } = req.body;

    if (!sandboxId || !rawPath) {
      return res.status(400).json({ error: 'Missing sandbox ID or file path' });
    }

    const sandbox = activeSandboxes.get(sandboxId);
    if (!sandbox) {
      return res.status(404).json({ error: 'Sandbox session not found' });
    }

    const filePath = normalizePath(rawPath);
    sandbox.files.set(filePath, content || '');
    sandbox.updatedAt = Date.now();

    // If writing to page.tsx, try to update sandbox.portfolioData
    if (filePath.endsWith('page.tsx')) {
      const match = (content || '').match(/const data(?::\s*\w+)?\s*=\s*(\{[\s\S]*?\});/);
      if (match && match[1]) {
        try {
          sandbox.portfolioData = JSON.parse(match[1]);
        } catch {
          // Ignore parse errors while user is actively typing
        }
      }
    } else if (filePath.endsWith('data.json')) {
      try {
        sandbox.portfolioData = JSON.parse(content || '{}');
      } catch {
        // Ignore JSON syntax while typing
      }
    }

    // Auto-register parent directory
    const parentDir = filePath.substring(0, filePath.lastIndexOf('/'));
    if (parentDir) {
      sandbox.directories.add(parentDir);
    }

    return res.status(200).json({ success: true, path: filePath });
  } catch (error) {
    console.error('Error writing sandbox file:', error);
    return res.status(500).json({ error: error.message || 'Failed to write file' });
  }
};

// @desc    Create directory in sandbox
// @route   POST /api/sandbox/files/mkdir
export const mkdir = async (req, res) => {
  try {
    const { id: sandboxId, path: rawPath } = req.body;

    if (!sandboxId || !rawPath) {
      return res.status(400).json({ error: 'Missing sandbox ID or folder path' });
    }

    const sandbox = activeSandboxes.get(sandboxId);
    if (!sandbox) {
      return res.status(404).json({ error: 'Sandbox session not found' });
    }

    const dirPath = normalizePath(rawPath);
    sandbox.directories.add(dirPath);

    return res.status(200).json({ success: true, path: dirPath });
  } catch (error) {
    console.error('Error creating sandbox directory:', error);
    return res.status(500).json({ error: error.message || 'Failed to create directory' });
  }
};

// @desc    Delete file or directory in sandbox
// @route   POST /api/sandbox/files/delete
export const deleteFile = async (req, res) => {
  try {
    const { id: sandboxId, path: rawPath } = req.body;

    if (!sandboxId || !rawPath) {
      return res.status(400).json({ error: 'Missing sandbox ID or path' });
    }

    const sandbox = activeSandboxes.get(sandboxId);
    if (!sandbox) {
      return res.status(404).json({ error: 'Sandbox session not found' });
    }

    const targetPath = normalizePath(rawPath);

    // Remove exact file
    sandbox.files.delete(targetPath);
    sandbox.directories.delete(targetPath);

    // If directory, remove all children under targetPath
    const prefix = targetPath + '/';
    for (const [p] of sandbox.files) {
      if (p.startsWith(prefix)) sandbox.files.delete(p);
    }
    for (const d of sandbox.directories) {
      if (d.startsWith(prefix)) sandbox.directories.delete(d);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting sandbox item:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete' });
  }
};

// @desc    Extract portfolio data JSON from sandbox
// @route   POST /api/sandbox/extract-data
export const extractData = async (req, res) => {
  try {
    const { sandboxId } = req.body;

    if (!sandboxId) {
      return res.status(400).json({ error: 'Missing sandboxId' });
    }

    const sandbox = activeSandboxes.get(sandboxId);
    if (!sandbox) {
      return res.status(404).json({ error: 'Sandbox session not found' });
    }

    // If sandbox already has cached data, prioritize it
    if (sandbox.portfolioData) {
      return res.status(200).json({ portfolioData: sandbox.portfolioData });
    }

    // Check page.tsx
    const pageTsx =
      sandbox.files.get('/home/user/app/page.tsx') ||
      sandbox.files.get('/app/page.tsx') ||
      '';

    const match = pageTsx.match(/const data(?::\s*\w+)?\s*=\s*(\{[\s\S]*?\});/);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        sandbox.portfolioData = parsed;
        return res.status(200).json({ portfolioData: parsed });
      } catch {
        // Fallback to data.json
      }
    }

    // Check data.json
    const dataJson =
      sandbox.files.get('/home/user/app/data.json') ||
      sandbox.files.get('/app/data.json') ||
      '';

    if (dataJson) {
      try {
        const parsed = JSON.parse(dataJson);
        sandbox.portfolioData = parsed;
        return res.status(200).json({ portfolioData: parsed });
      } catch {
        // Continue
      }
    }

    return res.status(400).json({ error: 'Could not extract portfolio data from sandbox files' });
  } catch (error) {
    console.error('Error extracting sandbox data:', error);
    return res.status(500).json({ error: error.message || 'Failed to extract data' });
  }
};

// @desc    Kill sandbox session
// @route   POST /api/sandbox/kill
export const kill = async (req, res) => {
  try {
    const { sandboxId } = req.body;
    if (sandboxId) {
      activeSandboxes.delete(sandboxId);
    }
    return res.status(200).json({ success: true, message: 'Sandbox terminated' });
  } catch (error) {
    console.error('Error killing sandbox:', error);
    return res.status(500).json({ error: error.message || 'Failed to kill sandbox' });
  }
};

