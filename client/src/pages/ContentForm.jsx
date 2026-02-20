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
                    // Filter to find the specific content since we don't have a public get-by-id yet, 
                    // or we can just fetch all and filter.
                    // Better practice: Implement get-by-id API. But for now, let's filter from list or fetch.
                    // Actually, our API routes don't have public GET /:id. We only have PUT /:id and DELETE /:id.
                    // We should add GET /:id or just filter from the full list for simplicity if list is small.
                    // Let's assume we can fetch all and find it, or add GET /:id to backend.
                    // For now, let's filter from the full list response which is public.
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
        <div className="container">
            <h1>{isEditMode ? 'Edit Content' : 'Create New Content'}</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
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
                    <label>Body</label>
                    <textarea
                        name="body"
                        value={body}
                        onChange={onChange}
                        required
                        rows="5"
                    ></textarea>
                </div>
                <button type="submit">{isEditMode ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default ContentForm;
