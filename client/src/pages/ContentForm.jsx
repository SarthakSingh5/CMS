import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ContentForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        status: 'Draft',
    });
    const { title, body, status } = formData;
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const fetchContent = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const config = {
                        headers: { Authorization: `Bearer ${token}` },
                    };
                    const { data } = await axios.get('/api/content', config);
                    const contentValues = data.find(c => c._id === id);
                    if (contentValues) {
                        setFormData({
                            title: contentValues.title,
                            body: contentValues.body,
                            status: contentValues.status,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching content', error);
                }
            };
            fetchContent();
        }
    }, [id, isEditMode]);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (isEditMode) {
                await axios.put(`/api/content/${id}`, formData, config);
            } else {
                await axios.post('/api/content', formData, config);
            }
            navigate('/content');
        } catch (error) {
            console.error('Error saving content', error);
            alert('Failed to save content');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="auth-card" style={{ maxWidth: '800px' }}>
                <h1 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>{isEditMode ? 'Edit Content' : 'Create New Content'}</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={onChange}
                            placeholder="Enter post title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={status} onChange={onChange}>
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Body Content</label>
                        <textarea
                            name="body"
                            value={body}
                            onChange={onChange}
                            required
                            rows="10"
                            placeholder="Write your content here..."
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate('/content')} className="btn-outline" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                            Cancel
                        </button>
                        <button type="submit">
                            {isEditMode ? 'Update Content' : 'Publish Content'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContentForm;
