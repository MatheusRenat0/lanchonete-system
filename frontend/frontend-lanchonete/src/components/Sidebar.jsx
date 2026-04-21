import { NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, BarChart2, Users, LogOut, Zap, Package } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { to: '/pdv',       icon: ShoppingCart, label: 'PDV' },
  { to: '/dashboard', icon: BarChart2,    label: 'Dashboard' },
  { to: '/estoque',   icon: Package,      label: 'Estoque' },
  { to: '/equipe',    icon: Users,        label: 'Equipe' },
]

export default function Sidebar() {
  const { logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const linkCls = ({ isActive }) =>
    `w-9 h-9 rounded-lg border-none flex items-center justify-center cursor-pointer transition-all duration-150
     ${isActive ? 'bg-blue-600 text-white' : 'bg-transparent text-blue-200 hover:bg-white/10 hover:text-white'}`

  return (
    <aside className="w-[52px] bg-blue-900 flex flex-col items-center py-3 gap-1 shrink-0">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
        <Zap size={16} className="text-white" />
      </div>

      {NAV.filter(n => n.to !== '/equipe' || isAdmin).map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className={linkCls} title={label}>
          <Icon size={16} />
        </NavLink>
      ))}

      <div className="w-6 h-px bg-white/15 my-2" />

      <button
        onClick={handleLogout}
        title="Sair"
        className="w-9 h-9 rounded-lg border-none bg-transparent text-blue-200 hover:bg-white/10 hover:text-white flex items-center justify-center cursor-pointer transition-all duration-150"
      >
        <LogOut size={16} />
      </button>
    </aside>
  )
}
