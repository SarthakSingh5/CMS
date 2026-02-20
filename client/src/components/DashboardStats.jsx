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
            <div className="dashboard-header">
                <h2>Dashboard Overview</h2>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value">{stats.users}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Total Content</div>
                    <div className="stat-value">{stats.content.total}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Published</div>
                    <div className="stat-value" style={{ color: '#10b981' }}>
                        {stats.content.byStatus?.Published || 0}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Drafts</div>
                    <div className="stat-value" style={{ color: '#f59e0b' }}>
                        {stats.content.byStatus?.Draft || 0}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
