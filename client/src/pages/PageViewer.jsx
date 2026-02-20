import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PageViewer = () => {
    const { id } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const { data } = await axios.get(`/api/content/${id}`);
                setPage(data);
            } catch (err) {
                setError('Page not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [id]);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem', color: '#64748b' }}>
            Loading page...
        </div>
    );

    if (error || !page) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ color: '#ef4444' }}>404 — Page Not Found</h2>
            <Link to="/content" style={{ color: '#6366f1' }}>← Back to Content</Link>
        </div>
    );

    return (
        <>
            {/* Inject the saved CSS */}
            {page.gjsCss && <style>{page.gjsCss}</style>}

            {/* Render the saved HTML */}
            <div dangerouslySetInnerHTML={{ __html: page.gjsHtml || '<p style="text-align:center;padding:4rem;color:#64748b;">This page has no content yet.</p>' }} />
        </>
    );
};

export default PageViewer;
