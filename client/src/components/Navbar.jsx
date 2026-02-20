import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem',
            borderBottom: '1px solid #ccc',
            marginBottom: '2rem'
        }}>
            <div className="logo">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>CMS Dashboard</Link>
            </div>
            <div className="links">
                <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
                <Link to="/content" style={{ marginRight: '1rem' }}>Content</Link>
                <button onClick={logout} style={{
                    padding: '5px 10px',
                    cursor: 'pointer',
                    backgroundColor: '#ff5252',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                }}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
