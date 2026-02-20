import { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const { data } = await axios.get('/api/stats', config);
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading Stats...</div>;
    if (!stats) return <div>Error loading stats</div>;

    return (
        <div className="dashboard-stats">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="card" style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.users}</p>
                </div>
                <div className="card" style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                    <h3>Total Content</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.content.total}</p>
                </div>
                <div className="card" style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                    <h3>Published</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.content.byStatus?.Published || 0}</p>
                </div>
                <div className="card" style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                    <h3>Drafts</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.content.byStatus?.Draft || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
