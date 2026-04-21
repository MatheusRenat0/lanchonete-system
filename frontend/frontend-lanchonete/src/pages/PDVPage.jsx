import { useState, useEffect } from 'react'
import { Search, ShoppingBag, CheckCircle, PackageOpen, Plus, Minus, X, Grid2x2, Sandwich, CupSoda, IceCreamBowl, Layers } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useToastMsg } from '../contexts/ToastContext'
import { produtoService, vendaService } from '../services/dataService'

const CAT_ICONS = { Todos: Grid2x2, Lanches: Sandwich, Bebidas: CupSoda, Sobremesas: IceCreamBowl, Combos: Layers }

const MOCK_PRODUCTS = [
  { id: 1, nome: 'X-Burguer',      preco: 18.90, categoria: 'Lanches',    badge: 'hot',  ativo: true },
  { id: 2, nome: 'Hot-Dog',        preco: 10.50, categoria: 'Lanches',    badge: '',     ativo: true },
  { id: 3, nome: 'Frango Grelhado',preco: 16.00, categoria: 'Lanches',    badge: '',     ativo: true },
  { id: 4, nome: 'Misto Quente',   preco: 7.50,  categoria: 'Lanches',    badge: '',     ativo: true },
  { id: 5, nome: 'Suco Natural',   preco: 8.00,  categoria: 'Bebidas',    badge: '',     ativo: true },
  { id: 6, nome: 'Refrigerante',   preco: 6.50,  categoria: 'Bebidas',    badge: '',     ativo: true },
  { id: 7, nome: 'Água Mineral',   preco: 3.00,  categoria: 'Bebidas',    badge: '',     ativo: true },
  { id: 8, nome: 'Café',           preco: 5.00,  categoria: 'Bebidas',    badge: '',     ativo: true },
  { id: 9, nome: 'Açaí 500ml',     preco: 16.00, categoria: 'Sobremesas', badge: '',     ativo: true },
  { id: 10,nome: 'Bolo no Pote',   preco: 11.00, categoria: 'Sobremesas', badge: 'low',  ativo: true },
  { id: 11,nome: 'Combo Rápido',   preco: 22.90, categoria: 'Combos',     badge: '',     ativo: true },
  { id: 12,nome: 'Combo Família',  preco: 54.00, categoria: 'Combos',     badge: 'new',  ativo: true },
]

const fmt = (v) => 'R$ ' + v.toFixed(2).replace('.', ',')

function ProductCard({ produto, inCart, onAdd }) {
  const badgeMap = { hot: ['bg-red-50 text-red-600', 'hot'], low: ['bg-amber-50 text-amber-600', 'baixo'], new: ['bg-blue-50 text-blue-800', 'novo'] }
  const [bc, bl] = badgeMap[produto.badge] ?? []

  return (
    <div
      onClick={() => onAdd(produto)}
      className={`relative bg-white border rounded-xl p-2.5 cursor-pointer transition-all duration-150 text-center hover:-translate-y-0.5 active:translate-y-0
        ${inCart ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-blue-300'}`}
    >
      <div className={`w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center ${inCart ? 'bg-blue-100' : 'bg-blue-50'}`}>
        <ShoppingBag size={16} className="text-blue-600" />
      </div>
      <p className="text-[10px] font-bold text-gray-800 leading-tight mb-1">{produto.nome}</p>
      <p className="text-[11px] font-mono font-medium text-blue-600">{fmt(produto.preco)}</p>
      {produto.badge && (
        <span className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${bc}`}>{bl}</span>
      )}
    </div>
  )
}

function CartItem({ entry, onAdd, onDec, onRemove }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2 flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <ShoppingBag size={13} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-800 truncate">{entry.produto.nome}</p>
        <p className="text-[9px] text-gray-400 font-mono">{fmt(entry.produto.preco)} cada</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onDec(entry.produto.id)} className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
          <Minus size={9} />
        </button>
        <span className="text-[11px] font-mono font-medium text-gray-800 w-4 text-center">{entry.qty}</span>
        <button onClick={() => onAdd(entry.produto)} className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
          <Plus size={9} />
        </button>
      </div>
      <span className="text-[10px] font-mono font-medium text-blue-600 w-14 text-right">{fmt(entry.produto.preco * entry.qty)}</span>
      <button onClick={() => onRemove(entry.produto.id)} className="w-5 h-5 rounded-md flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-all">
        <X size={11} />
      </button>
    </div>
  )
}

export default function PDVPage() {
  const { entries, items, totalQty, totalPrice, addItem, decItem, removeItem, clearCart, toPayload } = useCart()
  const showToast = useToastMsg()
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [activeCat, setActiveCat] = useState('Todos')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    produtoService.listar()
      .then(data => setProducts(data))
      .catch(() => {}) // fallback to mock
  }, [])

  const categories = ['Todos', ...new Set(products.map(p => p.categoria))]

  const filtered = products.filter(p =>
    p.ativo &&
    (activeCat === 'Todos' || p.categoria === activeCat) &&
    (!search || p.nome.toLowerCase().includes(search.toLowerCase()))
  )

  const handleAdd = (produto) => {
    addItem(produto)
    showToast(`${produto.nome} adicionado`)
  }

  const handleCheckout = async () => {
    if (!entries.length) return
    setLoading(true)
    try {
      await vendaService.registrar(toPayload())
      clearCart()
      showToast('Venda registrada com sucesso!')
    } catch {
      showToast('Erro ao registrar venda', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* Catalog */}
      <div className="flex-1 bg-gray-50 overflow-y-auto p-3 scrollbar-thin">
        <div className="relative mb-3">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full h-8 pl-7 pr-3 text-[12px] font-mono border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-400 transition-all"
          />
        </div>

        <div className="flex gap-1.5 mb-3 flex-wrap">
          {categories.map(cat => {
            const Icon = CAT_ICONS[cat] ?? Grid2x2
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full border transition-all
                  ${activeCat === cat ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
              >
                <Icon size={11} />
                {cat}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(105px,1fr))] gap-2">
          {filtered.map(p => (
            <ProductCard key={p.id} produto={p} inCart={!!items[p.id]} onAdd={handleAdd} />
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-[220px] bg-white border-l border-gray-100 flex flex-col shrink-0">
        <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <ShoppingBag size={13} className="text-blue-600" />
          </div>
          <span className="text-[12px] font-bold text-gray-800">Pedido</span>
          <span className="ml-auto text-[10px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded-full">{totalQty}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 scrollbar-thin">
          {entries.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <PackageOpen size={26} className="text-gray-200" />
              <p className="text-[11px] text-gray-300 text-center leading-relaxed">Selecione produtos<br />para adicionar</p>
            </div>
          ) : (
            entries.map(entry => (
              <CartItem key={entry.produto.id} entry={entry} onAdd={handleAdd} onDec={decItem} onRemove={removeItem} />
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-100">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
            <span className="text-[18px] font-mono font-medium text-gray-900">{fmt(totalPrice)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={!entries.length || loading}
            className="w-full h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle size={14} />
            {loading ? 'Registrando...' : 'Finalizar Pedido'}
          </button>
        </div>
      </div>
    </div>
  )
}
