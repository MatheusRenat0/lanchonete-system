import { useEffect, useState } from 'react'
import { TrendingUp, Receipt, Wallet, AlertTriangle, Clock, Package, BarChart2, Download, ArrowRight, Edit2 } from 'lucide-react'
import { vendaService } from '../services/dataService'

const fmt = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

const MOCK_RESUMO = { vendasHoje: 847.50, pedidos: 34, ticketMedio: 24.93, estoqueBaixo: 3 }
const MOCK_VENDAS = [
  { hora: '14:32', descricao: 'X-Burguer + Batata + Suco', total: 32.50 },
  { hora: '14:18', descricao: 'Combo Família ×2',          total: 54.00 },
  { hora: '14:05', descricao: 'Açaí 500ml + Água',         total: 19.00 },
  { hora: '13:47', descricao: 'Hot-Dog + Refrigerante',    total: 17.50 },
  { hora: '13:30', descricao: 'Café + Misto Quente',       total: 12.50 },
]
const MOCK_ESTOQUE = [
  { nome: 'Pão Burguer', qty: 8,  max: 50, low: true  },
  { nome: 'Carne Bovina',qty: 18, max: 40, low: false },
  { nome: 'Bolo no Pote',qty: 3,  max: 20, low: true  },
  { nome: 'Açaí',        qty: 22, max: 30, low: false },
  { nome: 'Refrigerante',qty: 5,  max: 48, low: true  },
]
const BAR_VALS = [8, 14, 42, 88, 115, 97, 130, 122, 104, 78, 52, 30]
const BAR_MAX  = Math.max(...BAR_VALS)

function MetricCard({ icon: Icon, iconClass, value, label, delta, deltaUp }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon size={13} />
        </div>
        {delta && (
          <span className={`text-[10px] font-mono font-medium ${deltaUp ? 'text-green-500' : 'text-red-400'}`}>{delta}</span>
        )}
      </div>
      <p className="text-[20px] font-mono font-medium text-gray-900 leading-none mb-1">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  )
}

function PanelHeader({ icon: Icon, title, action, actionIcon: ActionIcon }) {
  return (
    <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
      <Icon size={13} className="text-blue-600" />
      <span className="text-[11px] font-bold text-gray-800 flex-1">{title}</span>
      {action && (
        <button className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:text-blue-700 transition-colors">
          {ActionIcon && <ActionIcon size={11} />}
          {action}
        </button>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [resumo, setResumo] = useState(MOCK_RESUMO)

  useEffect(() => {
    vendaService.resumoDia().then(setResumo).catch(() => {})
  }, [])

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-3 scrollbar-thin">
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <MetricCard icon={TrendingUp} iconClass="bg-blue-50 text-blue-600"  value={fmt(resumo.vendasHoje)}  label="Vendas hoje"   delta="+12%"  deltaUp />
        <MetricCard icon={Receipt}    iconClass="bg-green-50 text-green-600" value={resumo.pedidos}          label="Pedidos"       delta="+5"    deltaUp />
        <MetricCard icon={Wallet}     iconClass="bg-blue-50 text-blue-600"   value={fmt(resumo.ticketMedio)} label="Ticket médio"  delta="-3%"   deltaUp={false} />
        <MetricCard icon={AlertTriangle} iconClass="bg-amber-50 text-amber-600" value={resumo.estoqueBaixo} label="Estoque baixo" />
      </div>

      <div className="grid grid-cols-[1fr_200px] gap-2">
        <div className="flex flex-col gap-2">
          {/* Bar Chart */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <PanelHeader icon={BarChart2} title="Vendas por hora" action="Exportar" actionIcon={Download} />
            <div className="px-3 pt-3 pb-1 flex items-end gap-1 h-[90px]">
              {BAR_VALS.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div
                    className="w-full rounded-t-sm bg-blue-200 hover:bg-blue-400 transition-colors cursor-pointer"
                    style={{ height: `${Math.round((v / BAR_MAX) * 58)}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between px-3 pb-2">
              {['08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'].map(l => (
                <span key={l} className="text-[9px] text-gray-300 font-mono">{l}</span>
              ))}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <PanelHeader icon={Clock} title="Últimas vendas" action="Ver todas" actionIcon={ArrowRight} />
            {MOCK_VENDAS.map((v, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <span className="text-[10px] font-mono text-gray-400 w-9">{v.hora}</span>
                <span className="text-[11px] text-gray-700 flex-1">{v.descricao}</span>
                <span className="text-[11px] font-mono font-medium text-green-500">+{fmt(v.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden self-start">
          <PanelHeader icon={Package} title="Estoque" action="Editar" actionIcon={Edit2} />
          {MOCK_ESTOQUE.map((s, i) => {
            const pct = Math.round((s.qty / s.max) * 100)
            return (
              <div key={i} className="flex items-center gap-2 px-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-[11px] text-gray-700 flex-1 truncate">{s.nome}</span>
                <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.low ? 'bg-amber-400' : 'bg-blue-400'}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={`text-[10px] font-mono w-5 text-right ${s.low ? 'text-amber-500' : 'text-gray-400'}`}>{s.qty}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
