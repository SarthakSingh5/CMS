import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    LineChart, Line, Area, AreaChart,
} from 'recharts';

const COLORS = {
    published: '#10b981',
    draft: '#f59e0b',
    users: '#6366f1',
    pages: '#0891b2',
};

const StatCard = ({ label, value, icon, color, bg }) => (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.6rem', background: bg, padding: '8px', borderRadius: '8px' }}>{icon}</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{label}</p>
        </div>
        <p style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</p>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
        <h3 style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: '20px', fontSize: '1rem' }}>{title}</h3>
        {children}
    </div>
);

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
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
                addToast('Failed to load admin data', 'error');
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
            addToast(`Role updated to ${newRole}`, 'success');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to update role', 'error');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
        try {
            await axios.delete(`/api/admin/users/${userId}`, config);
            setUsers(prev => prev.filter(u => u._id !== userId));
            addToast(`User "${username}" deleted`, 'info');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to delete user', 'error');
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Admin Panel...</div>;

    const pieData = stats ? [
        { name: 'Published', value: stats.publishedCount },
        { name: 'Drafts', value: stats.draftCount },
    ] : [];

    const userRoleData = [
        { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
        { name: 'Users', value: users.filter(u => u.role === 'user').length },
    ];

    const customTooltipStyle = {
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        color: 'var(--text-main)',
    };

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
                {['overview', 'charts', 'users'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '8px 20px', border: 'none', borderRadius: '8px', textTransform: 'capitalize', fontWeight: 600, width: 'auto',
                        background: activeTab === tab ? '#6366f1' : 'transparent',
                        color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                    }}>
                        {tab === 'overview' ? '📊 Overview' : tab === 'charts' ? '📈 Analytics' : '👥 Users'}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="#6366f1" bg="#eef2ff" />
                        <StatCard label="New This Week" value={stats.newUsersThisWeek} icon="🆕" color="#0891b2" bg="#e0f2fe" />
                        <StatCard label="Total Pages" value={stats.totalContent} icon="📄" color="#059669" bg="#d1fae5" />
                        <StatCard label="Published" value={stats.publishedCount} icon="🌐" color="#ea580c" bg="#ffedd5" />
                        <StatCard label="Drafts" value={stats.draftCount} icon="📝" color="#7c3aed" bg="#f5f3ff" />
                    </div>

                    {/* Quick chart row in overview */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <ChartCard title="📄 Page Status Distribution">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                                        <Cell fill={COLORS.published} />
                                        <Cell fill={COLORS.draft} />
                                    </Pie>
                                    <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [v, 'Pages']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="👥 User Role Distribution">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={userRoleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                                        <Cell fill="#f59e0b" />
                                        <Cell fill="#6366f1" />
                                    </Pie>
                                    <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [v, 'Users']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </div>
            )}

            {/* Analytics / Charts Tab */}
            {activeTab === 'charts' && stats && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Line charts row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <ChartCard title="👤 New Signups — Last 7 Days">
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={stats.signupChart}>
                                    <defs>
                                        <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                                    <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                                    <Tooltip contentStyle={customTooltipStyle} />
                                    <Area type="monotone" dataKey="signups" name="Signups" stroke="#6366f1" fill="url(#signupGrad)" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="📄 Pages Created — Last 7 Days">
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={stats.contentChart}>
                                    <defs>
                                        <linearGradient id="pageGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                                    <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                                    <Tooltip contentStyle={customTooltipStyle} />
                                    <Area type="monotone" dataKey="pages" name="Pages" stroke="#0891b2" fill="url(#pageGrad)" strokeWidth={2} dot={{ r: 4, fill: '#0891b2' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* Top Authors bar chart */}
                    {stats.topAuthors?.length > 0 && (
                        <ChartCard title="🏆 Top Authors by Page Count">
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={stats.topAuthors} layout="vertical" margin={{ left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                                    <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                    <YAxis type="category" dataKey="name" width={90} tick={{ fill: 'var(--text-main)', fontSize: 12, fontWeight: 600 }} />
                                    <Tooltip contentStyle={customTooltipStyle} />
                                    <Legend />
                                    <Bar dataKey="published" name="Published" fill={COLORS.published} radius={[0, 6, 6, 0]} stackId="a" />
                                    <Bar dataKey="drafts" name="Drafts" fill={COLORS.draft} radius={[0, 6, 6, 0]} stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    )}

                    {/* No content state */}
                    {stats.topAuthors?.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', background: 'var(--card-bg)', borderRadius: '14px', border: '2px dashed var(--border-color)' }}>
                            <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📊</p>
                            <p style={{ fontWeight: 600 }}>No content data yet</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Charts will populate as users create pages</p>
                        </div>
                    )}
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
