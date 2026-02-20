import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsBlocksBasic from 'grapesjs-blocks-basic';

const PageBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const editorRef = useRef(null);
    const containerRef = useRef(null);

    const [pageTitle, setPageTitle] = useState('');
    const [status, setStatus] = useState('Draft');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Prevent double-init in dev strict mode
        if (editorRef.current) return;

        const editor = grapesjs.init({
            container: containerRef.current,
            height: 'calc(100vh - 140px)',
            width: 'auto',
            storageManager: false, // We handle saving manually
            plugins: [gjsBlocksBasic],
            pluginsOpts: {
                [gjsBlocksBasic]: {
                    blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'],
                    flexGrid: true,
                }
            },
            canvas: {
                styles: [
                    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
                ],
            },
            styleManager: {
                sectors: [
                    {
                        name: 'General',
                        open: true,
                        properties: [
                            'float', 'display', 'position', 'top', 'right', 'left', 'bottom',
                        ],
                    },
                    {
                        name: 'Dimension',
                        open: false,
                        properties: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                    },
                    {
                        name: 'Typography',
                        open: false,
                        properties: [
                            'font-family', 'font-size', 'font-weight', 'letter-spacing',
                            'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow',
                        ],
                    },
                    {
                        name: 'Decorations',
                        open: false,
                        properties: ['background-color', 'border-radius', 'border', 'box-shadow', 'background'],
                    },
                ],
            },
        });

        // Add custom starter blocks
        editor.BlockManager.add('hero-section', {
            label: '🌟 Hero',
            category: 'Sections',
            content: `
                <section style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:80px 20px;text-align:center;color:white;">
                    <h1 style="font-size:3rem;font-weight:800;margin-bottom:1rem;font-family:Inter,sans-serif;">Welcome to My Site</h1>
                    <p style="font-size:1.3rem;opacity:0.9;margin-bottom:2rem;">Build stunning pages with no code.</p>
                    <a href="#" style="background:white;color:#6366f1;padding:14px 32px;border-radius:50px;font-weight:700;text-decoration:none;font-size:1rem;">Get Started</a>
                </section>`,
        });

        editor.BlockManager.add('features-section', {
            label: '💎 Features',
            category: 'Sections',
            content: `
                <section style="padding:60px 20px;max-width:1000px;margin:0 auto;text-align:center;">
                    <h2 style="font-size:2.2rem;font-weight:700;margin-bottom:40px;font-family:Inter,sans-serif;">Our Features</h2>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
                        <div style="background:#f8fafc;padding:30px;border-radius:16px;">
                            <h3 style="color:#6366f1;margin-bottom:12px;">⚡ Fast</h3>
                            <p style="color:#64748b;">Lightning-quick performance you can rely on.</p>
                        </div>
                        <div style="background:#f8fafc;padding:30px;border-radius:16px;">
                            <h3 style="color:#6366f1;margin-bottom:12px;">🔒 Secure</h3>
                            <p style="color:#64748b;">Enterprise-grade security built in.</p>
                        </div>
                        <div style="background:#f8fafc;padding:30px;border-radius:16px;">
                            <h3 style="color:#6366f1;margin-bottom:12px;">📈 Scalable</h3>
                            <p style="color:#64748b;">Grows alongside your business needs.</p>
                        </div>
                    </div>
                </section>`,
        });

        editor.BlockManager.add('cta-section', {
            label: '🚀 CTA',
            category: 'Sections',
            content: `
                <section style="background:#0f172a;padding:80px 20px;text-align:center;color:white;">
                    <h2 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem;font-family:Inter,sans-serif;">Ready to get started?</h2>
                    <p style="opacity:0.7;margin-bottom:2rem;font-size:1.1rem;">Join thousands of users who trust our platform.</p>
                    <a href="#" style="background:#6366f1;color:white;padding:16px 40px;border-radius:50px;font-weight:700;font-size:1.1rem;text-decoration:none;">Sign Up Free →</a>
                </section>`,
        });

        editor.BlockManager.add('testimonial-section', {
            label: '💬 Testimonial',
            category: 'Sections',
            content: `
                <section style="padding:60px 20px;max-width:800px;margin:0 auto;text-align:center;">
                    <blockquote style="font-size:1.6rem;font-style:italic;color:#334155;margin-bottom:24px;line-height:1.6;">"This platform completely transformed how we manage our content. Absolutely love it!"</blockquote>
                    <strong style="font-size:1.1rem;color:#1e293b;">— Sarah Connor</strong>
                    <p style="color:#64748b;margin-top:4px;">CTO, TechCorp</p>
                </section>`,
        });

        editor.BlockManager.add('navbar-section', {
            label: '📌 Navbar',
            category: 'Sections',
            content: `
                <nav style="background:white;padding:16px 40px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 10px rgba(0,0,0,0.1);font-family:Inter,sans-serif;">
                    <a href="#" style="font-size:1.3rem;font-weight:700;color:#6366f1;text-decoration:none;">Brand</a>
                    <div style="display:flex;gap:24px;">
                        <a href="#" style="color:#64748b;text-decoration:none;font-weight:500;">Home</a>
                        <a href="#" style="color:#64748b;text-decoration:none;font-weight:500;">About</a>
                        <a href="#" style="color:#64748b;text-decoration:none;font-weight:500;">Contact</a>
                    </div>
                </nav>`,
        });

        editor.BlockManager.add('footer-section', {
            label: '🔻 Footer',
            category: 'Sections',
            content: `
                <footer style="background:#1e293b;color:#94a3b8;padding:40px 20px;text-align:center;font-family:Inter,sans-serif;">
                    <p style="font-size:1.2rem;color:white;font-weight:600;margin-bottom:8px;">Brand Name</p>
                    <p style="margin-bottom:16px;">Building the future, one page at a time.</p>
                    <p style="font-size:0.85rem;">© 2025 Brand Name. All rights reserved.</p>
                </footer>`,
        });

        editorRef.current = editor;

        // Load existing page data in edit mode
        const loadPage = async () => {
            if (!isEditMode) return;
            try {
                const { data } = await axios.get(`/api/content/${id}`);
                setPageTitle(data.title || '');
                setStatus(data.status || 'Draft');
                if (data.gjsHtml) {
                    editor.setComponents(data.gjsHtml);
                }
                if (data.gjsCss) {
                    editor.setStyle(data.gjsCss);
                }
            } catch (err) {
                console.error('Failed to load page', err);
            }
        };

        loadPage();

        return () => {
            editor.destroy();
            editorRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSave = async () => {
        if (!pageTitle.trim()) {
            setError('Please enter a page title.');
            return;
        }
        setError('');
        setSaving(true);

        try {
            const editor = editorRef.current;
            const gjsHtml = editor.getHtml();
            const gjsCss = editor.getCss();
            const token = localStorage.getItem('token');

            const payload = { title: pageTitle, gjsHtml, gjsCss, status };
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (isEditMode) {
                await axios.put(`/api/content/${id}`, payload, config);
            } else {
                await axios.post('/api/content', payload, config);
            }
            navigate('/content');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save page.');
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = () => {
        const editor = editorRef.current;
        if (!editor) return;

        const html = editor.getHtml();
        const css = editor.getCss();
        const title = pageTitle || 'My Website';

        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        ${css}
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', margin: '-20px' }}>
            {/* Top Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px',
                background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)',
                flexShrink: 0,
            }}>
                <button
                    onClick={() => navigate('/content')}
                    style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '8px 14px', borderRadius: '6px', width: 'auto' }}
                >
                    ← Back
                </button>

                <input
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="Page Title..."
                    style={{
                        flex: 1, maxWidth: '340px', padding: '8px 14px', border: '1px solid var(--border-color)',
                        borderRadius: '6px', background: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '1rem',
                    }}
                />

                <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                    {['Draft', 'Published'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            style={{
                                padding: '8px 16px', border: 'none', margin: 0, borderRadius: 0, width: 'auto',
                                background: status === s ? '#6366f1' : 'var(--bg-color)',
                                color: status === s ? 'white' : 'var(--text-secondary)',
                                fontWeight: status === s ? 700 : 400,
                            }}
                        >{s}</button>
                    ))}
                </div>

                {error && <span style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</span>}

                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    <button
                        onClick={handleDownload}
                        style={{ background: '#334155', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, border: 'none', width: 'auto' }}
                        title="Download page as a standalone HTML file"
                    >
                        ⬇️ Export HTML
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{ background: '#10b981', color: 'white', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, border: 'none', width: 'auto' }}
                    >
                        {saving ? 'Saving...' : '💾 Save'}
                    </button>
                </div>
            </div>

            {/* GrapesJS Canvas */}
            <div ref={containerRef} style={{ flex: 1 }} />
        </div>
    );
};

export default PageBuilder;
