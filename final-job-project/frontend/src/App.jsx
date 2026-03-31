import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import JobsPage from './pages/JobsPage';
import DashboardPage from './pages/DashboardPage';
import Nearbyjob from './pages/Nearbyjob';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <Routes>
      <Route element={<MainLayout dark={dark} setDark={setDark} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/jobs" element={<JobsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs/nearby" element={<Nearbyjob />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;