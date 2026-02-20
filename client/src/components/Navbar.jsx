import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const navLinkStyle = (path) => ({
        textDecoration: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        fontWeight: 500,
        fontSize: '0.95rem',
        color: isActive(path) ? '#6366f1' : 'var(--text-secondary)',
        background: isActive(path) ? '#eef2ff' : 'transparent',
        transition: 'all 0.15s',
    });

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#6366f1' }}>
                        ✦ Forged
                    </span>
                    {user.role === 'admin' && (
                        <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '50px', marginLeft: '8px', verticalAlign: 'middle' }}>
                            ADMIN
                        </span>
                    )}
                </Link>
            </div>

            <div className="nav-links">
                {/* Regular user: Overview is their home (logo handles it), show My Pages */}
                {user.role !== 'admin' ? (
                    <Link to="/dashboard/content" style={navLinkStyle('/dashboard/content')}>📄 My Pages</Link>
                ) : (
                    <>
                        <Link to="/dashboard/content" style={navLinkStyle('/dashboard/content')}>📄 All Pages</Link>
                        <Link to="/admin" style={{
                            ...navLinkStyle('/admin'),
                            color: isActive('/admin') ? '#b45309' : '#d97706',
                            background: isActive('/admin') ? '#fef3c7' : 'transparent',
                        }}>
                            👑 Admin Panel
                        </Link>
                    </>
                )}

                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />
                <ThemeToggle />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {user.username}
                    </span>
                </div>
                <button onClick={logout} className="btn-logout">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
