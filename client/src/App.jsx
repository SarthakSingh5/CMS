import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ContentList from './pages/ContentList';
import PageBuilder from './pages/PageBuilder';
import PageViewer from './pages/PageViewer';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <div className="container" style={{ padding: '20px' }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/view/:id" element={<PageViewer />} />
                <Route path="/" element={<PrivateRoute />}>
                  <Route index element={<DashboardStats />} />
                  <Route path="content" element={<ContentList />} />
                  <Route path="content/new" element={<PageBuilder />} />
                  <Route path="content/edit/:id" element={<PageBuilder />} />
                </Route>
                <Route path="/admin" element={<AdminRoute />}>
                  <Route index element={<AdminPanel />} />
                </Route>
              </Routes>
            </div>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
