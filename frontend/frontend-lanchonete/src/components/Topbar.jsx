import { Bell, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/pdv':       ['Ponto de Venda', 'turno aberto'],
  '/dashboard': ['Dashboard', 'visão geral do dia'],
  '/estoque':   ['Gestão de Estoque', 'produtos e inventário'],
  '/equipe':    ['Gestão de Equipe', 'usuários e permissões'],
}

export default function Topbar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [title, sub] = TITLES[pathname] ?? ['SnapPDV', '']
  const initials = user?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? 'U'

  return (
    <header className="h-11 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0">
      <span className="text-[13px] font-bold text-gray-900 tracking-tight">{title}</span>
      {sub && <span className="text-[11px] text-gray-400 font-normal">— {sub}</span>}

      <div className="ml-auto flex items-center gap-2">
        <button className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all">
          <Bell size={13} />
        </button>
        <button className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all">
          <Settings size={13} />
        </button>
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer" title={user?.nome}>
          {initials}
        </div>
      </div>
    </header>
  )
}
