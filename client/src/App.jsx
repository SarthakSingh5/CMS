import { useLocation, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Studio components
import StudioLayout from './layouts/StudioLayout';
import DocsPage from './pages/studio/DocsPage';
import SettingsPage from './pages/studio/SettingsPage';
import HelpPage from './pages/studio/HelpPage';
import FeedbackPage from './pages/studio/FeedbackPage';
import TemplatesPage from './pages/studio/TemplatesPage';
import TemplateEditorPage from './pages/studio/TemplateEditorPage';
import CvMakerPage from './pages/studio/CvMakerPage';
import EditorPage from './pages/editor/EditorPage';

import './App.css';

const AppShell = () => {
  const location = useLocation();
  const isStudio = location.pathname.startsWith('/studio');
  const isEditor = location.pathname.startsWith('/editor');
  const showLegacyNav = !['/', '/login', '/register'].includes(location.pathname) && !isStudio && !isEditor;

  const fullWidthPaths = ['/', '/login', '/register', '/dashboard/content/new'];
  const isEditPage = location.pathname.startsWith('/dashboard/content/edit/');
  const isFullWidth = fullWidthPaths.includes(location.pathname) || isEditPage || isStudio || isEditor;

  return (
    <>
      {showLegacyNav && <Navbar />}
      <div className={isFullWidth ? '' : 'container'} style={showLegacyNav ? { padding: isFullWidth ? '0' : '20px' } : {}}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/view/:id" element={<PageViewer />} />

          {/* Studio Workspace */}
          <Route path="/studio" element={<PrivateRoute />}>
            <Route element={<StudioLayout />}>
              <Route index element={<Navigate to="/studio/docs" replace />} />
              <Route path="docs" element={<DocsPage />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="templates/:templateId" element={<TemplateEditorPage />} />
              <Route path="cv-maker" element={<CvMakerPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
            </Route>
          </Route>

          {/* In-Browser Cloud Sandbox IDE */}
          <Route path="/editor" element={<EditorPage />} />

          {/* Legacy Dashboard (Redirect default to studio) */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<Navigate to="/studio/docs" replace />} />
            <Route path="stats" element={<DashboardStats />} />
            <Route path="content" element={<ContentList />} />
            <Route path="content/new" element={<PageBuilder />} />
            <Route path="content/edit/:id" element={<PageBuilder />} />
          </Route>

          {/* Admin */}
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
