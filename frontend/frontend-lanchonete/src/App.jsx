import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/layout/PrivateRoute';
import LoginPage from './pages/LoginPage';
import PDVPage from './pages/PDVPage';
import DashboardPage from './pages/DashboardPage';
import EstoquePage from './pages/EstoquePage';
import EquipePage from './pages/EquipePage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/pdv"       element={<PDVPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/estoque"   element={<EstoquePage />} />
              <Route path="/equipe"    element={<EquipePage requireAdmin={true} />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/pdv" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}