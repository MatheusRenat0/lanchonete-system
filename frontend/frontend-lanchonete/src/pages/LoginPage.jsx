import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Mail, KeyRound, LogIn, ShieldCheck, Monitor, Shield, Briefcase } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(4, 'Mínimo 4 caracteres'),
})

const ROLES = [
  { value: 'OPERADOR', label: 'Operador', Icon: Monitor },
  { value: 'ADMIN',    label: 'Admin',    Icon: Shield },
  { value: 'GERENTE',  label: 'Gerente',  Icon: Briefcase },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('OPERADOR')
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', senha: '' },
  })

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const user = await login({ ...values, role })
      navigate(user.role === 'OPERADOR' ? '/pdv' : '/dashboard', { replace: true })
    } catch {
      setServerError('Credenciais inválidas. Verifique email e senha.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-100 rounded-xl p-7 w-full max-w-[300px] shadow-sm">

        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
          <Zap size={20} className="text-white" />
        </div>

        <h1 className="text-[22px] font-extrabold text-gray-900 tracking-tight leading-none mb-1">SnapPDV</h1>
        <p className="text-[12px] text-gray-400 mb-6">Autenticação via JWT Bearer</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</label>
            <div className="relative">
              <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                {...register('email')}
                type="email"
                placeholder="seu@email.com"
                className="w-full h-9 pl-7 pr-3 text-[12px] font-mono border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Senha</label>
            <div className="relative">
              <KeyRound size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                {...register('senha')}
                type="password"
                placeholder="••••••••"
                className="w-full h-9 pl-7 pr-3 text-[12px] font-mono border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>
            {errors.senha && <p className="text-[10px] text-red-500 mt-1">{errors.senha.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Perfil de acesso</label>
            <div className="flex gap-2">
              {ROLES.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all
                    ${role === value
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                >
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {serverError && (
            <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-3 py-2 text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-all mt-1"
          >
            <LogIn size={14} />
            {isSubmitting ? 'Entrando...' : 'Entrar no sistema'}
          </button>
        </form>

        <div className="mt-4 bg-blue-50 rounded-lg px-3 py-2 text-[10px] text-blue-800 font-mono flex items-center gap-2">
          <ShieldCheck size={12} className="text-blue-600 shrink-0" />
          POST /api/auth/login → Bearer JWT
        </div>
      </div>
    </div>
  )
}
