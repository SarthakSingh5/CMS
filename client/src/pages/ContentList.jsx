import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ContentList = () => {
    const [contents, setContents] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            const { data } = await axios.get('/api/content');
            setContents(data);
        } catch (error) {
            console.error('Error fetching content', error);
        }
    };

    const deleteContent = async (id) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                };
                await axios.delete(`/api/content/${id}`, config);
                fetchContents();
            } catch (error) {
                console.error('Error deleting content', error);
                alert('Failed to delete content');
            }
        }
    };

    return (
        <div className="container" style={{ padding: 0 }}>
            <div className="content-header">
                <h1>Content Library</h1>
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
                            {content.body.substring(0, 100)}...
                        </div>

                        <div className="meta-info">
                            <span>By {content.author?.username || 'Unknown'}</span>
                        </div>

                        {(user && (user.role === 'admin' || user._id === content.author?._id)) && (
                            <div className="card-actions">
                                <Link to={`/content/edit/${content._id}`} className="button btn-outline" style={{ textDecoration: 'none', textAlign: 'center', borderRadius: '6px' }}>
                                    Edit
                                </Link>
                                <button onClick={() => deleteContent(content._id)} className="btn-danger" style={{ borderRadius: '6px' }}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {contents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    No content found. Start by creating a new post.
                </div>
            )}
        </div>
    );
};

export default ContentList;
