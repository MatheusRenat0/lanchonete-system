import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute({ requireAdmin = false }) {
  const { user, loading } = useAuth();

  // Enquanto verifica se o usuário está logado, pode exibir um loading simples
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Se não estiver logado, manda pro Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota pedir Admin e o usuário for Operador, manda pro PDV
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/pdv" replace />;
  }

  // Se estiver tudo OK, renderiza a página filha (Outlet)
  return <Outlet />;
}