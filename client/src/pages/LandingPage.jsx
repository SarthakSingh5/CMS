import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LandingPage = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect logged-in users straight to dashboard
    useEffect(() => {
        if (!loading && user) navigate('/dashboard');
    }, [user, loading, navigate]);

    if (loading) return null;

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#0a0a0f', color: '#e2e8f0', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* ── Navbar ── */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.2rem 5%', position: 'fixed', top: 0, width: '100%',
                background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)', zIndex: 100, boxSizing: 'border-box',
            }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ✦ Forged
                </span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, padding: '8px 16px', borderRadius: '8px', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#e2e8f0'}
                        onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                        Sign In
                    </Link>
                    <Link to="/register" style={{
                        background: 'linear-gradient(135deg,#6366f1,#0891b2)', color: 'white', textDecoration: 'none',
                        fontWeight: 600, padding: '9px 22px', borderRadius: '10px', fontSize: '0.9rem',
                        boxShadow: '0 0 20px rgba(99,102,241,0.35)',
                    }}>
                        Get Started Free →
                    </Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 5% 4rem', position: 'relative' }}>
                {/* Background glow */}
                <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '999px', padding: '6px 18px', fontSize: '0.82rem', fontWeight: 600, color: '#a5b4fc', marginBottom: '2rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    No-code Website Builder · CMS Platform
                </div>

                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                    Build Pages That{' '}
                    <span style={{ background: 'linear-gradient(135deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Actually Convert
                    </span>
                </h1>

                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#94a3b8', maxWidth: '560px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                    Drag-and-drop your way to stunning websites. Manage content, collaborate with your team, and publish — all from one powerful platform.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/register" style={{
                        background: 'linear-gradient(135deg,#6366f1,#0891b2)', color: 'white', textDecoration: 'none',
                        fontWeight: 700, padding: '14px 32px', borderRadius: '12px', fontSize: '1rem',
                        boxShadow: '0 0 30px rgba(99,102,241,0.4)', transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(99,102,241,0.6)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.4)'; }}>
                        🚀 Start Building Free
                    </Link>
                    <Link to="/login" style={{
                        background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', textDecoration: 'none',
                        fontWeight: 600, padding: '14px 32px', borderRadius: '12px', fontSize: '1rem',
                        border: '1px solid rgba(255,255,255,0.12)',
                    }}>
                        Sign In →
                    </Link>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '48px', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[['10k+', 'Pages Built'], ['99.9%', 'Uptime'], ['Free', 'Forever Plan']].map(([val, label]) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</p>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section style={{ padding: '6rem 5%', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Features</p>
                    <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Everything You Need to Ship Fast</h2>
                    <p style={{ color: '#64748b', marginTop: '12px', fontSize: '1.05rem' }}>From design to deployment — we've got it covered.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                    {[
                        { icon: '🎨', title: 'Drag & Drop Builder', desc: 'Visually design pages with GrapesJS. Add text, images, buttons, and custom blocks — zero code required.', color: '#6366f1' },
                        { icon: '📋', title: 'Content Management', desc: 'Organize your pages with status filters, search, and role-based visibility. Stay in control of your content.', color: '#0891b2' },
                        { icon: '📊', title: 'Analytics Dashboard', desc: 'Track page creation, user growth, and publish rates with beautiful charts powered by real data.', color: '#10b981' },
                        { icon: '👥', title: 'Role-Based Access', desc: 'Admin and user roles built-in. Admins manage the platform; users own their pages. Simple and powerful.', color: '#f59e0b' },
                        { icon: '⬇️', title: 'Export HTML Pages', desc: 'Download any page as a standalone HTML file — ready to host anywhere with one click.', color: '#8b5cf6' },
                        { icon: '🌗', title: 'Dark Mode & Themes', desc: 'Switch between light and dark mode instantly. Looks stunning either way, on any device.', color: '#ec4899' },
                    ].map(f => (
                        <div key={f.title} style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '16px', padding: '28px', transition: 'border-color 0.2s, transform 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '55'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; }}>
                            <div style={{ fontSize: '2rem', marginBottom: '16px', width: '52px', height: '52px', borderRadius: '12px', background: f.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px', color: '#e2e8f0' }}>{f.title}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ── */}
            <section style={{ padding: '6rem 5%', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(99,102,241,0.03)' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>How It Works</p>
                    <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Up and Running in Minutes</h2>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
                    {[
                        { step: '01', title: 'Create an Account', desc: 'Sign up in seconds — no credit card needed.' },
                        { step: '02', title: 'Build Your Page', desc: 'Drag blocks, add your content, and customize the design.' },
                        { step: '03', title: 'Publish or Export', desc: 'Go live or download your page as clean HTML.' },
                    ].map((s, i) => (
                        <div key={s.step} style={{ flex: '1', minWidth: '220px', textAlign: 'center', padding: '32px 24px', position: 'relative' }}>
                            {i < 2 && <div style={{ position: 'absolute', right: '-6px', top: '50%', fontSize: '1.5rem', color: '#334155', display: 'none' }}>→</div>}
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>{s.step}</div>
                            <h3 style={{ fontWeight: 700, marginBottom: '8px', color: '#e2e8f0' }}>{s.title}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section style={{ padding: '6rem 5%', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                        Ready to Build{' '}
                        <span style={{ background: 'linear-gradient(135deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Something Amazing?</span>
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '2.5rem' }}>Join and start building your first page today — completely free.</p>
                    <Link to="/register" style={{
                        display: 'inline-block', background: 'linear-gradient(135deg,#6366f1,#0891b2)', color: 'white', textDecoration: 'none',
                        fontWeight: 700, padding: '16px 40px', borderRadius: '14px', fontSize: '1.05rem',
                        boxShadow: '0 0 40px rgba(99,102,241,0.4)',
                    }}>
                        Get Started Free — It's Free →
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontWeight: 700, background: 'linear-gradient(135deg,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦ Forged</span>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <Link to="/login" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>Sign In</Link>
                    <Link to="/register" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>Sign Up</Link>
                </div>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>© 2025 Forged. All rights reserved.</p>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                * { box-sizing: border-box; }
                a { text-decoration: none; }
            `}</style>
        </div>
    );
};

export default LandingPage;
