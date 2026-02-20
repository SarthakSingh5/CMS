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
        if (window.confirm('Are you sure?')) {
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
        <div className="container">
            <h1>Content Management</h1>
            {user && (
                <Link to="/content/new" className="btn btn-primary">
                    Create New Content
                </Link>
            )}
            <div className="content-list">
                {contents.map((content) => (
                    <div key={content._id} className="card">
                        <h2>{content.title}</h2>
                        <p>Status: {content.status}</p>
                        <p>Author: {content.author?.username || 'Unknown'}</p>
                        <p>{content.body.substring(0, 100)}...</p>

                        {(user && (user.role === 'admin' || user._id === content.author?._id)) && (
                            <div className="actions">
                                <Link to={`/content/edit/${content._id}`}>Edit</Link>
                                <button onClick={() => deleteContent(content._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentList;
