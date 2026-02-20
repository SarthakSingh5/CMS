import { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const DashboardStats = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Redirect admin straight to Admin Panel
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
    if (!stats) return <div style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>Error loading stats</div>;

    const isAdmin = stats.isAdmin;

    // Card configs differ by role
    const cards = isAdmin
        ? [
            { label: 'Total Users', value: stats.users, icon: '👥', color: '#6366f1', bg: '#eef2ff' },
            { label: 'Total Pages', value: stats.content.total, icon: '📄', color: '#0891b2', bg: '#e0f2fe' },
            { label: 'Published', value: stats.content.byStatus?.Published || 0, icon: '🌐', color: '#059669', bg: '#d1fae5' },
            { label: 'Drafts', value: stats.content.byStatus?.Draft || 0, icon: '📝', color: '#f59e0b', bg: '#fef3c7' },
        ]
        : [
            { label: 'My Pages', value: stats.content.total, icon: '🖼️', color: '#6366f1', bg: '#eef2ff' },
            { label: 'Published', value: stats.content.byStatus?.Published || 0, icon: '🌐', color: '#059669', bg: '#d1fae5' },
            { label: 'Drafts', value: stats.content.byStatus?.Draft || 0, icon: '📝', color: '#f59e0b', bg: '#fef3c7' },
        ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {isAdmin ? '📊 Platform Overview' : `👋 Welcome, ${user?.username}!`}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                        {isAdmin
                            ? 'Platform-wide statistics across all users'
                            : 'Here\'s a summary of your pages'}
                    </p>
                </div>
                {!isAdmin && (
                    <Link
                        to="/content/new"
                        style={{ background: '#6366f1', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}
                    >
                        + Create New Page
                    </Link>
                )}
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                {cards.map(card => (
                    <div key={card.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <span style={{ fontSize: '1.6rem', background: card.bg, padding: '8px', borderRadius: '10px' }}>{card.icon}</span>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{card.label}</p>
                        </div>
                        <p style={{ fontSize: '2.4rem', fontWeight: 800, color: card.color }}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Action for regular users */}
            {!isAdmin && stats.content.total === 0 && (
                <div style={{ background: 'var(--card-bg)', border: '2px dashed var(--border-color)', borderRadius: '14px', padding: '3rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚀</p>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '8px', fontWeight: 700 }}>Build your first page</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Drag and drop blocks to create a professional website — no coding needed.</p>
                    <Link to="/content/new" style={{ background: '#6366f1', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
                        Get Started →
                    </Link>
                </div>
            )}

            {/* Quick link to manage pages */}
            {!isAdmin && stats.content.total > 0 && (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>Manage your pages</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>View, edit, export or delete your pages</p>
                    </div>
                    <Link to="/content" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                        My Pages →
                    </Link>
                </div>
            )}
        </div>
    );
};

export default DashboardStats;
