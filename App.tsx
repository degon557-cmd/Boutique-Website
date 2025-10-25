
import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
// FIX: `useAuth` is defined in `hooks/useAuth.ts`, not `contexts/AuthContext.tsx`.
// FIX: Corrected import path for AuthProvider to its actual location.
import { AuthProvider } from './components/admin/AuthContext';
import { useAuth } from './hooks/useAuth';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
// FIX: Corrected import path for AdminLoginPage to its actual location.
import AdminLoginPage from './utils/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const ProtectedRoute: React.FC = () => {
  const { isAdminAuthenticated } = useAuth();
  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="tentang-kami" element={<AboutPage />} />
              <Route path="kontak" element={<ContactPage />} />
            </Route>
            
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route path="/admin" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;