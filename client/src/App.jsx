import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import ContentList from './pages/ContentList';
import ContentForm from './pages/ContentForm';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
          <div className="container" style={{ padding: '20px' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute />}>
                <Route index element={<DashboardStats />} />
                <Route path="content" element={<ContentList />} />
                <Route path="content/new" element={<ContentForm />} />
                <Route path="content/edit/:id" element={<ContentForm />} />
              </Route>
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
