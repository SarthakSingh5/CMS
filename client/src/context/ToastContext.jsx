import { createContext, useState, useCallback, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const colors = {
        success: { bg: '#f0fdf4', border: '#86efac', color: '#166534' },
        error: { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b' },
        info: { bg: '#eff6ff', border: '#93c5fd', color: '#1e40af' },
        warning: { bg: '#fffbeb', border: '#fcd34d', color: '#92400e' },
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Toast Container */}
            <div style={{
                position: 'fixed', bottom: '24px', right: '24px',
                display: 'flex', flexDirection: 'column', gap: '10px',
                zIndex: 9999, maxWidth: '360px',
            }}>
                {toasts.map(toast => {
                    const c = colors[toast.type] || colors.info;
                    return (
                        <div key={toast.id} style={{
                            background: c.bg, border: `1px solid ${c.border}`,
                            color: c.color, padding: '14px 18px', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                            animation: 'slideIn 0.25s ease',
                            fontWeight: 500, fontSize: '0.9rem',
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>{icons[toast.type]}</span>
                            <span style={{ flex: 1 }}>{toast.message}</span>
                            <button
                                onClick={() => removeToast(toast.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.color, fontSize: '1rem', padding: '0', lineHeight: 1, width: 'auto' }}
                            >×</button>
                        </div>
                    );
                })}
            </div>
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(30px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

export default ToastContext;
