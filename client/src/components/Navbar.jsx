import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/" className="nav-brand">CMS Dashboard</Link>
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Overview</Link>
                <Link to="/content" className="nav-link">Content</Link>
                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
                <ThemeToggle />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {user.username}
                </span>
                <button onClick={logout} className="btn-logout">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
