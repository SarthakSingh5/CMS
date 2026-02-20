import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// --- Block Definitions ---
const BLOCK_TEMPLATES = {
    hero: { type: 'hero', content: { title: 'Welcome to Future', subtitle: 'Build something amazing today.', bg: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' } },
    features: {
        type: 'features', content: {
            title: 'Our Key Features',
            items: [
                { title: 'Fast', text: 'Lightning quick performance.' },
                { title: 'Secure', text: 'Bank-grade security standards.' },
                { title: 'Scalable', text: 'Grows with your business.' }
            ]
        }
    },
    cta: { type: 'cta', content: { title: 'Ready to get started?', buttonText: 'Join Now', url: '#' } },
    testimonial: { type: 'testimonial', content: { quote: "This product changed my life completely. Highly recommended!", author: "Sarah Connor", role: "CTO, TechCorp" } },
    text: { type: 'text', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    image: { type: 'image', content: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80' }
};

const PageBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [pageTitle, setPageTitle] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [status, setStatus] = useState('Draft');
    const [loading, setLoading] = useState(false);

    // Initial Load
    useEffect(() => {
        if (isEditMode) {
            fetchPage();
        }
    }, [id]);

    const fetchPage = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/content', { headers: { Authorization: `Bearer ${token}` } });
            const page = data.find(p => p._id === id);
            if (page) {
                setPageTitle(page.title);
                setStatus(page.status);
                // Ensure blocks have valid structure, fallback for legacy
                if (page.blocks && page.blocks.length > 0) {
                    setBlocks(page.blocks);
                } else {
                    setBlocks([{ type: 'text', content: page.body || '' }]);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    // --- Actions ---

    const addBlock = (type) => {
        const template = BLOCK_TEMPLATES[type];
        // Deep copy to avoid reference issues
        const newBlock = JSON.parse(JSON.stringify(template));
        setBlocks([...blocks, newBlock]);
    };

    const updateBlock = (index, newContent) => {
        const updatedBlocks = [...blocks];
        updatedBlocks[index].content = newContent;
        setBlocks(updatedBlocks);
    };

    const moveBlock = (index, direction) => {
        if (direction === -1 && index === 0) return;
        if (direction === 1 && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        setBlocks(newBlocks);
    };

    const deleteBlock = (index) => {
        if (window.confirm('Delete this block?')) {
            setBlocks(blocks.filter((_, i) => i !== index));
        }
    };

    const duplicateBlock = (index) => {
        const newBlocks = [...blocks];
        const blockToCopy = JSON.parse(JSON.stringify(blocks[index]));
        newBlocks.splice(index + 1, 0, blockToCopy);
        setBlocks(newBlocks);
    };

    const savePage = async () => {
        if (!pageTitle.trim()) {
            alert('Please enter a Page Title');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const sanitizedBlocks = blocks.map(({ _id, ...rest }) => rest);
            const payload = { title: pageTitle, blocks: sanitizedBlocks, status };
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (isEditMode) {
                await axios.put(`/api/content/${id}`, payload, config);
            } else {
                await axios.post('/api/content', payload, config);
            }
            navigate('/content');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Error saving page';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    // --- Renderers ---

    const RenderControl = ({ index }) => (
        <div className="block-controls">
            <button onClick={() => moveBlock(index, -1)} title="Move Up">↑</button>
            <button onClick={() => moveBlock(index, 1)} title="Move Down">↓</button>
            <button onClick={() => duplicateBlock(index)} title="Duplicate">📋</button>
            <button onClick={() => deleteBlock(index)} title="Delete" className="btn-delete">✕</button>
        </div>
    );

    const renderBlockEditor = (block, index) => {
        switch (block.type) {
            case 'hero':
                return (
                    <div className="editor-block hero-block" style={{ background: block.content.bg }}>
                        <input
                            value={block.content.title}
                            onChange={(e) => updateBlock(index, { ...block.content, title: e.target.value })}
                            className="hero-title-input"
                        />
                        <input
                            value={block.content.subtitle}
                            onChange={(e) => updateBlock(index, { ...block.content, subtitle: e.target.value })}
                            className="hero-subtitle-input"
                        />
                    </div>
                );
            case 'features':
                return (
                    <div className="editor-block features-block">
                        <input
                            value={block.content.title}
                            onChange={(e) => updateBlock(index, { ...block.content, title: e.target.value })}
                            className="section-title-input"
                        />
                        <div className="features-grid-editor">
                            {block.content.items.map((item, i) => (
                                <div key={i} className="feature-item-editor">
                                    <input
                                        value={item.title}
                                        onChange={(e) => {
                                            const newItems = [...block.content.items];
                                            newItems[i].title = e.target.value;
                                            updateBlock(index, { ...block.content, items: newItems });
                                        }}
                                        className="feature-title-input"
                                    />
                                    <textarea
                                        value={item.text}
                                        onChange={(e) => {
                                            const newItems = [...block.content.items];
                                            newItems[i].text = e.target.value;
                                            updateBlock(index, { ...block.content, items: newItems });
                                        }}
                                        className="feature-text-input"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'cta':
                return (
                    <div className="editor-block cta-block">
                        <input
                            value={block.content.title}
                            onChange={(e) => updateBlock(index, { ...block.content, title: e.target.value })}
                            className="cta-title-input"
                        />
                        <input
                            value={block.content.buttonText}
                            onChange={(e) => updateBlock(index, { ...block.content, buttonText: e.target.value })}
                            className="cta-btn-input"
                        />
                    </div>
                );
            case 'testimonial':
                return (
                    <div className="editor-block testimonial-block">
                        <textarea
                            value={block.content.quote}
                            onChange={(e) => updateBlock(index, { ...block.content, quote: e.target.value })}
                            className="quote-input"
                        />
                        <div className="author-inputs">
                            <input
                                value={block.content.author}
                                onChange={(e) => updateBlock(index, { ...block.content, author: e.target.value })}
                                placeholder="Author Name"
                            />
                            <input
                                value={block.content.role}
                                onChange={(e) => updateBlock(index, { ...block.content, role: e.target.value })}
                                placeholder="Role / Company"
                            />
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div className="editor-block image-block">
                        <img src={block.content} alt="Preview" />
                        <input
                            value={block.content}
                            onChange={(e) => updateBlock(index, e.target.value)}
                            placeholder="Image URL"
                            className="url-input"
                        />
                    </div>
                );
            case 'text':
            default:
                return (
                    <div className="editor-block text-block">
                        <textarea
                            value={typeof block.content === 'string' ? block.content : ''}
                            onChange={(e) => updateBlock(index, e.target.value)}
                            className="text-area-input"
                            rows={4}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="builder-container">
            {/* Sidebar */}
            <aside className="builder-sidebar">
                <div className="sidebar-header">
                    <h3>Editor Toolbox</h3>
                </div>

                <div className="components-list">
                    <button onClick={() => addBlock('hero')} className="tool-btn">✨ Hero Section</button>
                    <button onClick={() => addBlock('features')} className="tool-btn">💎 Features Grid</button>
                    <button onClick={() => addBlock('text')} className="tool-btn">📝 Text Block</button>
                    <button onClick={() => addBlock('image')} className="tool-btn">🖼️ Image</button>
                    <button onClick={() => addBlock('testimonial')} className="tool-btn">💬 Testimonial</button>
                    <button onClick={() => addBlock('cta')} className="tool-btn">🚀 Call to Action</button>
                </div>

                <div className="page-settings">
                    <label>Page Title</label>
                    <input
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        placeholder="My Landing Page"
                    />

                    <label>Status</label>
                    <div className="status-toggle">
                        <button
                            className={status === 'Draft' ? 'active' : ''}
                            onClick={() => setStatus('Draft')}
                        >Draft</button>
                        <button
                            className={status === 'Published' ? 'active' : ''}
                            onClick={() => setStatus('Published')}
                        >Published</button>
                    </div>

                    <button onClick={savePage} className="btn-save" disabled={loading}>
                        {loading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                </div>
            </aside>

            {/* Canvas */}
            <main className="builder-canvas">
                <div className="canvas-wrapper">
                    {blocks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🎨</div>
                            <h3>Start Designing</h3>
                            <p>Select a component from the toolbox to build your page.</p>
                        </div>
                    ) : (
                        blocks.map((block, index) => (
                            <div key={index} className="canvas-block-wrapper">
                                <RenderControl index={index} />
                                {renderBlockEditor(block, index)}
                            </div>
                        ))
                    )}
                </div>
            </main>

            <style>{`
                .builder-container { display: flex; height: calc(100vh - 80px); gap: 20px; overflow: hidden; }
                
                /* Sidebar */
                .builder-sidebar { 
                    width: 280px; background: var(--card-bg); border-right: 1px solid var(--border-color);
                    display: flex; flex-direction: column; padding: 20px; overflow-y: auto;
                }
                .sidebar-header h3 { margin-bottom: 20px; font-size: 1.1rem; color: var(--text-main); }
                .components-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
                .tool-btn { 
                    text-align: left; padding: 12px; border: 1px solid var(--border-color); background: var(--bg-color);
                    border-radius: 8px; font-weight: 500; transition: all 0.2s; color: var(--text-main);
                }
                .tool-btn:hover { background: var(--primary-color); color: white; border-color: var(--primary-color); transform: translateX(5px); }
                
                .page-settings label { display: block; margin: 15px 0 5px; font-size: 0.9rem; color: var(--text-secondary); }
                .page-settings input { width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--input-bg); color: var(--text-main); }
                
                .status-toggle { display: flex; border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden; margin-bottom: 20px; }
                .status-toggle button { width: 50%; padding: 8px; background: var(--bg-color); border: none; font-size: 0.9rem; color: var(--text-secondary); margin: 0; border-radius: 0; }
                .status-toggle button.active { background: var(--primary-color); color: white; }
                
                .btn-save { width: 100%; padding: 12px; background: #10b981; color: white; font-weight: bold; border-radius: 8px; border: none; }
                .btn-save:hover { background: #059669; }

                /* Canvas */
                .builder-canvas { flex: 1; background: #f1f5f9; padding: 40px; overflow-y: auto; border-radius: 12px; border: 1px solid var(--border-color); }
                [data-theme="dark"] .builder-canvas { background: #0f172a; }
                
                .canvas-wrapper { max-width: 800px; margin: 0 auto; min-height: 100%; padding-bottom: 100px; }
                
                .empty-state { text-align: center; margin-top: 100px; color: var(--text-secondary); }
                .empty-icon { font-size: 50px; margin-bottom: 20px; }
                
                /* Block Wrappers */
                .canvas-block-wrapper { 
                    position: relative; margin-bottom: 20px; border: 2px solid transparent; border-radius: 12px;
                    transition: all 0.2s;
                }
                .canvas-block-wrapper:hover { border-color: var(--primary-color); }
                .canvas-block-wrapper:hover .block-controls { opacity: 1; }
                
                .block-controls {
                    position: absolute; right: 10px; top: -15px; background: var(--primary-color);
                    border-radius: 20px; padding: 5px 10px; display: flex; gap: 5px;
                    opacity: 0; transition: opacity 0.2s; z-index: 10;
                }
                .block-controls button {
                    width: 25px; height: 25px; border-radius: 50%; border: none; background: rgba(255,255,255,0.2);
                    color: white; font-size: 12px; display: flex; align-items: center; justify-content: center; padding: 0; margin: 0;
                }
                .block-controls button:hover { background: rgba(255,255,255,0.4); }
                .block-controls .btn-delete:hover { background: #ef4444; }

                /* Editor Blocks */
                .editor-block { background: var(--card-bg); padding: 20px; border-radius: 12px; box-shadow: var(--shadow); }
                
                .hero-block { color: white; text-align: center; padding: 50px 20px; }
                .hero-title-input { font-size: 2.5rem; font-weight: 800; background: transparent; border: none; color: white; text-align: center; width: 100%; margin-bottom: 10px; }
                .hero-subtitle-input { font-size: 1.2rem; background: transparent; border: none; color: rgba(255,255,255,0.9); text-align: center; width: 100%; }
                
                .text-area-input { width: 100%; border: none; background: transparent; font-size: 1.1rem; color: var(--text-main); font-family: inherit; resize: vertical; }
                .text-area-input:focus { outline: none; }
                
                .section-title-input { font-size: 1.8rem; font-weight: 700; width: 100%; border: none; background: transparent; margin-bottom: 20px; color: var(--text-main); }
                
                .features-grid-editor { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
                .feature-item-editor { text-align: center; padding: 15px; border: 1px dashed var(--border-color); border-radius: 8px; }
                .feature-title-input { font-weight: 700; text-align: center; width: 100%; border: none; background: transparent; margin-bottom: 5px; color: var(--text-main); }
                .feature-text-input { text-align: center; width: 100%; border: none; background: transparent; font-size: 0.9rem; color: var(--text-secondary); resize: none; }
                
                .testimonial-block { text-align: center; font-style: italic; }
                .quote-input { font-size: 1.5rem; text-align: center; width: 100%; border: none; background: transparent; color: var(--text-main); margin-bottom: 15px; }
                .author-inputs input { text-align: center; display: block; width: 100%; border: none; background: transparent; margin-bottom: 5px; color: var(--text-secondary); }
                
                .cta-block { text-align: center; background: #1e293b; color: white; padding: 40px; }
                .cta-title-input { font-size: 2rem; color: white; background: transparent; border: none; text-align: center; width: 100%; margin-bottom: 20px; }
                .cta-btn-input { background: var(--primary-color); border: none; color: white; padding: 10px 20px; border-radius: 6px; font-weight: bold; width: auto; display: inline-block; text-align: center; }

                .image-block img { width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px; }
                .url-input { width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-main); }
            `}</style>
        </div>
    );
};

export default PageBuilder;
