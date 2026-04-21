import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from './Toast';
import { useToastMsg } from '../../contexts/ToastContext';

export default function AppLayout() {
  const { toast } = useToastMsg();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Fixa */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar no topo */}
        <Topbar />

        {/* Área de conteúdo das páginas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sistema de Notificação Global */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}