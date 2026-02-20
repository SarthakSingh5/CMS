import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ContentList from './pages/ContentList';
import PageBuilder from './pages/PageBuilder';
import PageViewer from './pages/PageViewer';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import './App.css';

// Wrapper that hides the Navbar on the landing page
const AppShell = () => {
  const location = useLocation();
  const showNav = !['/', '/login', '/register'].includes(location.pathname);

  // Paths that should NOT be wrapped in .container (full width)
  const fullWidthPaths = ['/', '/login', '/register', '/dashboard/content/new'];
  const isEditPage = location.pathname.startsWith('/dashboard/content/edit/');
  const isFullWidth = fullWidthPaths.includes(location.pathname) || isEditPage;

  return (
    <>
      {showNav && <Navbar />}
      <div className={isFullWidth ? '' : 'container'} style={showNav ? { padding: isFullWidth ? '0' : '20px' } : {}}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/view/:id" element={<PageViewer />} />

          {/* Private — user */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<DashboardStats />} />
            <Route path="content" element={<ContentList />} />
            <Route path="content/new" element={<PageBuilder />} />
            <Route path="content/edit/:id" element={<PageBuilder />} />
          </Route>

          {/* Private — admin */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminPanel />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
