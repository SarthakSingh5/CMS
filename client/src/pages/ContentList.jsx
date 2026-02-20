import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ContentList = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            const { data } = await axios.get('/api/content');
            // Admin sees all; regular user sees only their own pages
            if (user?.role === 'admin') {
                setContents(data);
            } else {
                setContents(data.filter(c => c.author?._id === user?._id));
            }
        } catch (error) {
            console.error('Error fetching content', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPage = (content) => {
        const title = content.title || 'My Website';
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        ${content.gjsCss || ''}
    </style>
</head>
<body>
    ${content.gjsHtml || '<p style="text-align:center;padding:4rem">No content</p>'}
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

    const deleteContent = async (id) => {
        if (window.confirm('Are you sure you want to delete this page?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
                await axios.delete(`/api/content/${id}`, config);
                fetchContents();
            } catch (error) {
                console.error('Error deleting content', error);
                alert('Failed to delete content');
            }
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: 0 }}>
            <div className="content-header">
                <div>
                    <h1>{user?.role === 'admin' ? 'All Pages' : 'My Pages'}</h1>
                    {user?.role === 'admin' && (
                        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
                            Viewing all {contents.length} pages across all users
                        </p>
                    )}
                </div>
                {user && (
                    <Link to="/content/new" className="button btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', color: 'white', backgroundColor: 'var(--primary-color)' }}>
                        + Create New
                    </Link>
                )}
            </div>

            <div className="content-grid">
                {contents.map((content) => (
                    <div key={content._id} className="content-card">
                        <div className="meta-info">
                            <span className={`status-badge status-${content.status.toLowerCase()}`}>
                                {content.status}
                            </span>
                            <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                        </div>

                        <h2>{content.title}</h2>
                        <div className="content-excerpt">
                            {content.body ? content.body.substring(0, 100) + '...' : 'Visual page — click Edit to preview.'}
                        </div>

                        <div className="meta-info">
                            <span>By <strong>{content.author?.username || 'Unknown'}</strong></span>
                        </div>

                        <div className="card-actions">
                            <Link to={`/view/${content._id}`} target="_blank" style={{ textDecoration: 'none', textAlign: 'center', borderRadius: '6px', padding: '0.5rem 1rem', background: '#e0e7ff', color: '#6366f1', fontWeight: 600, fontSize: '0.9rem' }}>
                                👁️ View
                            </Link>
                            <button
                                onClick={() => downloadPage(content)}
                                style={{ borderRadius: '6px', padding: '0.5rem 1rem', background: '#1e293b', color: 'white', fontWeight: 600, fontSize: '0.9rem', border: 'none' }}
                            >
                                ⬇️ Export
                            </button>
                            {(user && (user.role === 'admin' || user._id === content.author?._id)) && (
                                <>
                                    <Link to={`/content/edit/${content._id}`} className="button btn-outline" style={{ textDecoration: 'none', textAlign: 'center', borderRadius: '6px' }}>
                                        Edit
                                    </Link>
                                    <button onClick={() => deleteContent(content._id)} className="btn-danger" style={{ borderRadius: '6px' }}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {contents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No pages yet</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Start by clicking "Create New" to build your first page.</p>
                </div>
            )}
        </div>
    );
};

export default ContentList;
