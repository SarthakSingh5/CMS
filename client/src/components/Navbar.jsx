import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!user) return null;

    const isAdmin = user.role === 'admin';
    const isActive = (path) => {
        // Exact routes (home/overview equivalents) — only match exactly
        if (path === '/dashboard' || path === '/admin') return location.pathname === path;
        // Other routes — also match sub-paths (e.g. /dashboard/content/edit/:id)
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // For admin: Admin Panel is their "home", so highlight it on /admin/*
    // For admin: also highlight Admin Panel softly when on content (parent-breadcrumb effect like user has)
    const isActiveAdmin = (path) => {
        if (path === '/admin') return location.pathname.startsWith('/admin');
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const navLinks = isAdmin
        ? [
            { to: '/admin', label: 'Admin Panel', icon: '👑', accent: true },
            { to: '/dashboard/content', label: 'All Pages', icon: '📄' },
        ]
        : [
            { to: '/dashboard', label: 'Overview', icon: '📊' },
            { to: '/dashboard/content', label: 'My Pages', icon: '📄' },
        ];

    const avatarGradient = isAdmin
        ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
        : 'linear-gradient(135deg, #6366f1, #0891b2)';

    const avatarGlow = isAdmin
        ? '0 0 10px rgba(245,158,11,0.35)'
        : '0 0 10px rgba(99,102,241,0.35)';

    return (
        <nav style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 2rem', height: '64px',
            background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)',
            boxShadow: '0 1px 20px rgba(0,0,0,0.06)',
            position: 'sticky', top: 0, zIndex: 50, gap: '1.5rem',
        }}>

            {/* ── Brand ── */}
            <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    background: 'linear-gradient(135deg, #6366f1, #0891b2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', fontWeight: 800, color: 'white',
                    boxShadow: '0 0 14px rgba(99,102,241,0.4)',
                }}>✦</div>
                <span style={{
                    fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, #6366f1, #0891b2)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Forged</span>
                {isAdmin && (
                    <span style={{
                        background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
                        color: 'white', fontSize: '0.6rem', fontWeight: 800,
                        padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>Admin</span>
                )}
            </Link>

            {/* ── Nav Links ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                {navLinks.map(({ to, label, icon, accent }) => {
                    const active = isAdmin ? isActiveAdmin(to) : isActive(to);
                    return (
                        <Link key={to} to={to}
                            onMouseEnter={() => setHovered(to)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '7px 14px', borderRadius: '9px',
                                textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
                                transition: 'all 0.15s',
                                color: active ? (accent ? '#b45309' : '#6366f1') : hovered === to ? 'var(--text-main)' : 'var(--text-secondary)',
                                background: active ? (accent ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)') : hovered === to ? 'var(--bg-color)' : 'transparent',
                                borderBottom: active ? `2px solid ${accent ? '#f59e0b' : '#6366f1'}` : '2px solid transparent',
                            }}>
                            <span>{icon}</span>{label}
                        </Link>
                    );
                })}
            </div>

            {/* ── Right Side ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <ThemeToggle />
                <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

                {/* ── Profile Dropdown ── */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button
                        onClick={() => setDropdownOpen(prev => !prev)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '9px',
                            background: dropdownOpen ? 'var(--bg-color)' : 'transparent',
                            border: '1px solid', borderColor: dropdownOpen ? 'var(--border-color)' : 'transparent',
                            borderRadius: '10px', padding: '5px 10px 5px 5px',
                            cursor: 'pointer', transition: 'all 0.15s', width: 'auto', marginTop: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                        onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.background = 'transparent'; }}
                    >
                        {/* Avatar */}
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: avatarGradient, color: 'white', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '0.85rem', boxShadow: avatarGlow,
                        }}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        {/* Name + Role */}
                        <div style={{ lineHeight: 1.2, textAlign: 'left' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                {user.username}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, textTransform: 'capitalize' }}>
                                {user.role}
                            </p>
                        </div>
                        {/* Chevron */}
                        <span style={{
                            color: 'var(--text-secondary)', fontSize: '0.7rem', marginLeft: '2px',
                            transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s',
                            display: 'inline-block',
                        }}>▼</span>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                            background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                            borderRadius: '14px', padding: '8px', minWidth: '210px',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.15)', zIndex: 100,
                            animation: 'fadeIn 0.15s ease',
                        }}>
                            {/* User info header */}
                            <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: avatarGradient, color: 'white', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: '1rem', boxShadow: avatarGlow,
                                    }}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>{user.username}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sign Out */}
                            <button
                                onClick={() => { setDropdownOpen(false); logout(); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                                    padding: '9px 12px', borderRadius: '9px', border: 'none',
                                    background: 'transparent', color: '#ef4444',
                                    fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                                    textAlign: 'left', marginTop: 0, transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <span style={{ fontSize: '1rem' }}>↩</span> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
