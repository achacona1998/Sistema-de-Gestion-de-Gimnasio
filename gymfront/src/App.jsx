import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Layout from "./components/layout/Layout";
import StartPage from "./pages/StartPage";
import MembersPage from "./pages/members";
import DashboardPage from "./pages/dashboard";
import ClassesPage from "./pages/classes";
import AttendancePage from "./pages/attendance";
import ReportsPage from "./pages/reports";
import MembershipsPage from "./pages/memberships";
import CalendarPage from "./pages/calendar";
import NotificationsPage from "./pages/notifications";
import AuthPage from "./pages/auth";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";
import HelpPage from "./pages/help";

// Componente de rutas que usa el contexto de autenticación
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Ruta pública - StartPage */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <StartPage />
        } 
      />
      
      {/* Rutas de autenticación */}
      <Route 
        path="/auth" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
        } 
      />
      
      {/* Rutas protegidas */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/memberships" element={<MembershipsPage />} />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
    </Routes>
  );
};

// Componente principal de la aplicación
const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
