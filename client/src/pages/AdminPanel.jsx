import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, statsRes] = await Promise.all([
                    axios.get('/api/admin/users', config),
                    axios.get('/api/admin/stats', config),
                ]);
                setUsers(usersRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error('Admin fetch failed', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const { data } = await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, config);
            setUsers(prev => prev.map(u => u._id === userId ? data : u));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update role');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
        try {
            await axios.delete(`/api/admin/users/${userId}`, config);
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Admin Panel...</div>;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>Admin Panel</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Platform management & oversight</p>
                </div>
                <span style={{ background: '#fef3c7', color: '#b45309', padding: '6px 16px', borderRadius: '50px', fontWeight: 700, fontSize: '0.85rem' }}>
                    👑 Admin: {user?.username}
                </span>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem', background: 'var(--card-bg)', padding: '6px', borderRadius: '10px', width: 'fit-content', border: '1px solid var(--border-color)' }}>
                {['overview', 'users'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '8px 20px', border: 'none', borderRadius: '8px', textTransform: 'capitalize', fontWeight: 600, width: 'auto',
                        background: activeTab === tab ? '#6366f1' : 'transparent',
                        color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                    }}>
                        {tab === 'overview' ? '📊 Overview' : '👥 Users'}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                        {[
                            { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#6366f1', bg: '#eef2ff' },
                            { label: 'New This Week', value: stats.newUsersThisWeek, icon: '🆕', color: '#0891b2', bg: '#e0f2fe' },
                            { label: 'Total Pages', value: stats.totalContent, icon: '📄', color: '#059669', bg: '#d1fae5' },
                            { label: 'Published', value: stats.publishedCount, icon: '🌐', color: '#ea580c', bg: '#ffedd5' },
                            { label: 'Drafts', value: stats.draftCount, icon: '📝', color: '#7c3aed', bg: '#f5f3ff' },
                        ].map(card => (
                            <div key={card.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '1.6rem', background: card.bg, padding: '8px', borderRadius: '8px' }}>{card.icon}</span>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{card.label}</p>
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: 800, color: card.color }}>{card.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                {['Username', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr key={u._id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.username}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.email}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ background: u.role === 'admin' ? '#fef3c7' : '#f1f5f9', color: u.role === 'admin' ? '#b45309' : '#64748b', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                                            {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        {u._id !== user?._id ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                                                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600, width: 'auto' }}
                                                >
                                                    {u.role === 'admin' ? '↓ Demote' : '↑ Make Admin'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u._id, u.username)}
                                                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, width: 'auto' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>You</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
