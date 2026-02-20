import { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const DashboardStats = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // All hooks must come before any conditional return (Rules of Hooks)
    useEffect(() => {
        // If admin, skip fetching — they'll be redirected below
        if (user?.role === 'admin') {
            setLoading(false);
            return;
        }

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
    }, [user?.role]);

    // Redirect admin AFTER all hooks — this is the correct pattern
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
    if (!stats) return <div style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>Error loading stats</div>;

    const published = stats.content.byStatus?.Published || 0;
    const drafts = stats.content.byStatus?.Draft || 0;
    const total = stats.content.total || 0;

    const pieData = [
        { name: 'Published', value: published },
        { name: 'Drafts', value: drafts },
    ];
    const PIE_COLORS = ['#10b981', '#f59e0b'];

    const barData = [
        { name: 'My Pages', published, drafts },
    ];

    const cards = [
        { label: 'My Pages', value: total, icon: '🖼️', color: '#6366f1', bg: '#eef2ff' },
        { label: 'Published', value: published, icon: '🌐', color: '#059669', bg: '#d1fae5' },
        { label: 'Drafts', value: drafts, icon: '📝', color: '#f59e0b', bg: '#fef3c7' },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        👋 Welcome back, {user?.username}!
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                        Here's a summary of your pages
                    </p>
                </div>
                <Link
                    to="/content/new"
                    style={{ background: '#6366f1', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}
                >
                    + Create New Page
                </Link>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
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

            {/* Charts — only show when user has pages */}
            {total > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '2rem' }}>
                    {/* Donut Pie Chart */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
                        <h3 style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: '16px' }}>📊 Page Status</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [value, 'Pages']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
                        <h3 style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: '16px' }}>📈 Content Breakdown</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData} barCategoryGap="40%">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="published" name="Published" fill="#10b981" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="drafts" name="Drafts" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                /* Empty state for new users */
                <div style={{ background: 'var(--card-bg)', border: '2px dashed var(--border-color)', borderRadius: '14px', padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚀</p>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '8px', fontWeight: 700 }}>Build your first page</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Drag and drop blocks to create a professional website — no coding needed.</p>
                    <Link to="/content/new" style={{ background: '#6366f1', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
                        Get Started →
                    </Link>
                </div>
            )}

            {/* Quick link to manage pages */}
            {total > 0 && (
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
