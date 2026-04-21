import { useState, useEffect } from 'react'
import { Package, Plus, Edit2, Trash2, Search, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { produtoService } from '../services/dataService'
import { useToastMsg } from '../contexts/ToastContext'

const schema = z.object({
  nome:      z.string().min(2, 'Nome obrigatório'),
  preco:     z.coerce.number().positive('Preço inválido'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  estoque:   z.coerce.number().int().min(0, 'Estoque inválido'),
  estoqueMin:z.coerce.number().int().min(0),
})

const CATS = ['Lanches', 'Bebidas', 'Sobremesas', 'Combos']

const MOCK = [
  { id:1,  nome:'X-Burguer',      preco:18.90, categoria:'Lanches',    estoque:24, estoqueMin:10, ativo:true },
  { id:2,  nome:'Hot-Dog',        preco:10.50, categoria:'Lanches',    estoque:18, estoqueMin:8,  ativo:true },
  { id:3,  nome:'Suco Natural',   preco:8.00,  categoria:'Bebidas',    estoque:12, estoqueMin:10, ativo:true },
  { id:4,  nome:'Refrigerante',   preco:6.50,  categoria:'Bebidas',    estoque:5,  estoqueMin:10, ativo:true },
  { id:5,  nome:'Açaí 500ml',     preco:16.00, categoria:'Sobremesas', estoque:22, estoqueMin:8,  ativo:true },
  { id:6,  nome:'Bolo no Pote',   preco:11.00, categoria:'Sobremesas', estoque:3,  estoqueMin:5,  ativo:true },
  { id:7,  nome:'Combo Rápido',   preco:22.90, categoria:'Combos',     estoque:15, estoqueMin:5,  ativo:true },
  { id:8,  nome:'Combo Família',  preco:54.00, categoria:'Combos',     estoque:8,  estoqueMin:3,  ativo:true },
]

const fmt = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-100 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-[13px] font-bold text-gray-900">{title}</span>
          <button onClick={onClose} className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
            <X size={13} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export default function EstoquePage() {
  const showToast = useToastMsg()
  const [products, setProducts] = useState(MOCK)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    produtoService.listar().then(setProducts).catch(() => {})
  }, [])

  const openNew = () => { setEditing(null); reset({ nome:'', preco:'', categoria:'', estoque:'', estoqueMin:5 }); setShowModal(true) }
  const openEdit = (p) => { setEditing(p); reset(p); setShowModal(true) }
  const closeModal = () => setShowModal(false)

  const onSubmit = async (values) => {
    try {
      if (editing) {
        const updated = await produtoService.atualizar(editing.id, values).catch(() => ({ ...editing, ...values }))
        setProducts(ps => ps.map(p => p.id === editing.id ? { ...p, ...updated } : p))
        showToast('Produto atualizado!')
      } else {
        const created = await produtoService.criar(values).catch(() => ({ id: Date.now(), ...values, ativo: true }))
        setProducts(ps => [...ps, created])
        showToast('Produto criado!')
      }
      closeModal()
    } catch { showToast('Erro ao salvar', 'error') }
  }

  const handleDelete = async (id) => {
    await produtoService.deletar(id).catch(() => {})
    setProducts(ps => ps.filter(p => p.id !== id))
    showToast('Produto removido', 'warning')
  }

  const filtered = products.filter(p => !search || p.nome.toLowerCase().includes(search.toLowerCase()))
  const lowCount = products.filter(p => p.estoque <= p.estoqueMin).length

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
      <input {...register(name)} type={type} placeholder={placeholder}
        className="w-full h-9 px-3 text-[12px] font-mono border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-400 transition-all" />
      {errors[name] && <p className="text-[10px] text-red-500 mt-0.5">{errors[name].message}</p>}
    </div>
  )

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-3 scrollbar-thin">
      <div className="flex items-center gap-3 mb-3">
        {lowCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-[11px] text-amber-700 font-semibold">
            <AlertTriangle size={12} className="text-amber-500" />
            {lowCount} produto{lowCount > 1 ? 's' : ''} com estoque baixo
          </div>
        )}
        <div className="relative flex-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto..."
            className="w-full h-8 pl-7 pr-3 text-[12px] font-mono border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-400 transition-all" />
        </div>
        <button onClick={openNew} className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-2 transition-all shrink-0">
          <Plus size={13} /> Novo Produto
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_80px_70px_70px] px-3 py-2 border-b border-gray-100 bg-gray-50">
          {['Produto', 'Categoria', 'Preço', 'Estoque', 'Mín.', 'Ações'].map(h => (
            <span key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</span>
          ))}
        </div>
        {filtered.map(p => {
          const isLow = p.estoque <= p.estoqueMin
          return (
            <div key={p.id} className="grid grid-cols-[1fr_100px_100px_80px_70px_70px] px-3 py-2.5 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Package size={12} className="text-blue-600" />
                </div>
                <span className="text-[12px] font-semibold text-gray-800">{p.nome}</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full w-fit">{p.categoria}</span>
              <span className="text-[12px] font-mono text-blue-600">{fmt(p.preco)}</span>
              <div className="flex items-center gap-1.5">
                {isLow
                  ? <AlertTriangle size={11} className="text-amber-500" />
                  : <CheckCircle size={11} className="text-green-400" />}
                <span className={`text-[12px] font-mono font-medium ${isLow ? 'text-amber-600' : 'text-gray-700'}`}>{p.estoque}</span>
              </div>
              <span className="text-[11px] font-mono text-gray-400">{p.estoqueMin}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                  <Edit2 size={11} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <Modal title={editing ? 'Editar Produto' : 'Novo Produto'} onClose={closeModal}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Field label="Nome" name="nome" placeholder="Nome do produto" />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Preço (R$)" name="preco" type="number" placeholder="0.00" />
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Categoria</label>
                <select {...register('categoria')} className="w-full h-9 px-3 text-[12px] font-mono border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-400 transition-all">
                  <option value="">Selecionar...</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.categoria && <p className="text-[10px] text-red-500 mt-0.5">{errors.categoria.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Estoque atual" name="estoque" type="number" placeholder="0" />
              <Field label="Estoque mínimo" name="estoqueMin" type="number" placeholder="5" />
            </div>
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={closeModal} className="flex-1 h-9 border border-gray-200 rounded-lg text-[12px] font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancelar</button>
              <button type="submit" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold transition-all">Salvar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
