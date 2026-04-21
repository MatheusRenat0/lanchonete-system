import { useState, useEffect } from 'react'
import { Users, UserPlus, Edit2, Trash2, CircleCheck, Circle, Shield, Monitor, Briefcase, Activity, LogIn, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usuarioService } from '../services/dataService'
import { useToastMsg } from '../contexts/ToastContext'

const schema = z.object({
  nome:  z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  role:  z.enum(['OPERADOR', 'GERENTE', 'ADMIN']),
  senha: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
})

const MOCK_USERS = [
  { id:1, nome:'Ana Lima',      email:'ana@snap.com',      role:'ADMIN',    ativo:true,  lastLogin:'hoje 14:28' },
  { id:2, nome:'Carlos Ramos',  email:'carlos@snap.com',   role:'OPERADOR', ativo:true,  lastLogin:'hoje 08:05' },
  { id:3, nome:'Fernanda Melo', email:'fernanda@snap.com', role:'GERENTE',  ativo:true,  lastLogin:'ontem 18:40' },
  { id:4, nome:'João Oliveira', email:'joao@snap.com',     role:'OPERADOR', ativo:false, lastLogin:'há 3 dias' },
]

const ROLE_STYLE = {
  ADMIN:    'bg-blue-50 text-blue-800',
  GERENTE:  'bg-amber-50 text-amber-700',
  OPERADOR: 'bg-green-50 text-green-700',
}
const ROLE_ICONS = { ADMIN: Shield, GERENTE: Briefcase, OPERADOR: Monitor }

const initials = (nome) => nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
const avatarBg = (role) => ({ ADMIN: 'bg-blue-600', GERENTE: 'bg-amber-500', OPERADOR: 'bg-green-500' }[role] ?? 'bg-gray-400')

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-100 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-[13px] font-bold text-gray-900">{title}</span>
          <button onClick={onClose} className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={13} /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

const ROLES_OPT = [
  { value: 'OPERADOR', label: 'Operador', Icon: Monitor,   desc: 'Somente PDV' },
  { value: 'GERENTE',  label: 'Gerente',  Icon: Briefcase, desc: 'Relatórios + produtos' },
  { value: 'ADMIN',    label: 'Admin',    Icon: Shield,    desc: 'Acesso total' },
]

export default function EquipePage() {
  const showToast = useToastMsg()
  const [users, setUsers] = useState(MOCK_USERS)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'OPERADOR' },
  })
  const selectedRole = watch('role')

  useEffect(() => { usuarioService.listar().then(setUsers).catch(() => {}) }, [])

  const openNew = () => { setEditing(null); reset({ nome:'', email:'', role:'OPERADOR', senha:'' }); setShowModal(true) }
  const openEdit = (u) => { setEditing(u); reset({ nome:u.nome, email:u.email, role:u.role, senha:'' }); setShowModal(true) }

  const onSubmit = async (values) => {
    try {
      if (editing) {
        const updated = await usuarioService.atualizar(editing.id, values).catch(() => ({ ...editing, ...values }))
        setUsers(us => us.map(u => u.id === editing.id ? { ...u, ...updated } : u))
        showToast('Usuário atualizado!')
      } else {
        const created = await usuarioService.criar(values).catch(() => ({ id: Date.now(), ...values, ativo:true, lastLogin:'—' }))
        setUsers(us => [...us, created])
        showToast('Usuário criado!')
      }
      setShowModal(false)
    } catch { showToast('Erro ao salvar', 'error') }
  }

  const handleDelete = async (id) => {
    await usuarioService.deletar(id).catch(() => {})
    setUsers(us => us.filter(u => u.id !== id))
    showToast('Usuário removido', 'warning')
  }

  const activeCount = users.filter(u => u.ativo).length

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-3 scrollbar-thin">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users size={15} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-gray-900 leading-none">Gestão de equipe</h2>
            <p className="text-[11px] text-gray-400">{users.length} usuários cadastrados</p>
          </div>
        </div>
        <button onClick={openNew} className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-2 transition-all">
          <UserPlus size={13} /> Novo usuário
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-3">
        <div className="grid grid-cols-[1fr_100px_90px_120px_70px] px-3 py-2 border-b border-gray-100 bg-gray-50">
          {['Usuário', 'Perfil', 'Status', 'Último acesso', 'Ações'].map(h => (
            <span key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</span>
          ))}
        </div>
        {users.map(u => {
          const RoleIcon = ROLE_ICONS[u.role]
          return (
            <div key={u.id} className="grid grid-cols-[1fr_100px_90px_120px_70px] px-3 py-2.5 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full ${avatarBg(u.role)} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                  {initials(u.nome)}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-gray-800">{u.nome}</p>
                  <p className="text-[10px] font-mono text-gray-400">{u.email}</p>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit ${ROLE_STYLE[u.role]}`}>
                <RoleIcon size={10} />{u.role}
              </span>
              <div className={`flex items-center gap-1.5 text-[11px] font-medium ${u.ativo ? 'text-green-500' : 'text-gray-300'}`}>
                {u.ativo ? <CircleCheck size={12} /> : <Circle size={12} />}
                {u.ativo ? 'Ativo' : 'Inativo'}
              </div>
              <span className="text-[10px] font-mono text-gray-400">{u.lastLogin}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(u)} className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                  <Edit2 size={11} />
                </button>
                <button onClick={() => handleDelete(u.id)} className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center"><Shield size={12} className="text-blue-600" /></div>
            <span className="text-[11px] font-bold text-gray-800">Permissões por role</span>
          </div>
          <div className="flex flex-col gap-1">
            {ROLES_OPT.map(r => (
              <div key={r.value} className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ROLE_STYLE[r.value]}`}>{r.value}</span>
                <span className="text-[10px] text-gray-400">— {r.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center"><LogIn size={12} className="text-green-600" /></div>
            <span className="text-[11px] font-bold text-gray-800">Último acesso</span>
          </div>
          <div className="flex flex-col gap-1">
            {users.filter(u => u.ativo).slice(0, 3).map(u => (
              <div key={u.id} className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-gray-700">{u.nome.split(' ')[0]}</span>
                <span className="text-[10px] font-mono text-gray-400">— {u.lastLogin}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center"><Activity size={12} className="text-amber-600" /></div>
            <span className="text-[11px] font-bold text-gray-800">Sessões ativas</span>
          </div>
          <p className="text-[22px] font-mono font-medium text-gray-900 leading-none">{activeCount}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">de {users.length} usuários</p>
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? 'Editar Usuário' : 'Novo Usuário'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nome completo</label>
              <input {...register('nome')} placeholder="Nome completo"
                className="w-full h-9 px-3 text-[12px] font-mono border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-400 transition-all" />
              {errors.nome && <p className="text-[10px] text-red-500 mt-0.5">{errors.nome.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</label>
              <input {...register('email')} type="email" placeholder="email@empresa.com"
                className="w-full h-9 px-3 text-[12px] font-mono border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-400 transition-all" />
              {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Perfil</label>
              <div className="flex gap-2">
                {ROLES_OPT.map(({ value, label, Icon }) => (
                  <button key={value} type="button" onClick={() => setValue('role', value)}
                    className={`flex-1 py-2 rounded-lg border text-[10px] font-bold flex flex-col items-center gap-1 transition-all
                      ${selectedRole === value ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}>
                    <Icon size={12} />{label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{editing ? 'Nova senha (opcional)' : 'Senha'}</label>
              <input {...register('senha')} type="password" placeholder="••••••"
                className="w-full h-9 px-3 text-[12px] font-mono border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-400 transition-all" />
              {errors.senha && <p className="text-[10px] text-red-500 mt-0.5">{errors.senha.message}</p>}
            </div>
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-9 border border-gray-200 rounded-lg text-[12px] font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancelar</button>
              <button type="submit" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold transition-all">Salvar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
