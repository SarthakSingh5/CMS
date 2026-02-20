import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Only allow access if user is admin
const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
