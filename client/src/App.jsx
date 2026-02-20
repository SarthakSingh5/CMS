import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import ContentList from './pages/ContentList';
import ContentForm from './pages/ContentForm';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<h1>Dashboard (Protected)</h1>} />
            <Route path="content" element={<ContentList />} />
            <Route path="content/new" element={<ContentForm />} />
            <Route path="content/edit/:id" element={<ContentForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
