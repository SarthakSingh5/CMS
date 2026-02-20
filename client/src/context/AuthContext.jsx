import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    const { data } = await axios.get('/api/users/me', config);
                    setUser(data);
                } catch (error) {
                    console.error('Auth verification failed', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, []);

    const login = async (userData) => {
        try {
            const { data } = await axios.post('/api/users/login', userData);
            localStorage.setItem('token', data.token);
            setUser(data);
            addToast('Logged in successfully!', 'success');
            navigate('/');
        } catch (error) {
            const message =
                error.response?.data?.message || 'Login failed. Please try again.';
            addToast(message, 'error');
            console.error('Login error:', error);
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post('/api/users', userData);
            localStorage.setItem('token', data.token);
            setUser(data);
            addToast('Account created successfully!', 'success');
            navigate('/');
        } catch (error) {
            const message =
                error.response?.data?.message || 'Registration failed. Please try again.';
            addToast(message, 'error');
            console.error('Register error:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        addToast('Logged out.', 'info');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
