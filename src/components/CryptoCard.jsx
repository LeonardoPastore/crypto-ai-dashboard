import { formatCurrency, formatNumber } from '../utils/formatters'

export default function CryptoCard({
  coin,
  invested = 0,
  currency = 'usd',
  rank,
  score = 0,
  onSelect,
  isSelected
}) {
  // =====================
  // Proteções / Normalização
  // =====================
  const name = coin?.name || 'Sem nome'
  const symbol = coin?.symbol || '—'
  const price = Number(coin?.current_price) || 0
  const changeValue = Number(coin?.price_change_percentage_24h) || 0
  const quantity = price > 0 ? invested / price : 0

  const recommendation = coin?.recommendation ?? {
    label: '—',
    confidence: 0,
    color: 'text-slate-400'
  }

  // =====================
  // Status de risco
  // =====================
  let status = 'Seguro'
  let statusColor = 'text-emerald-400'
  let borderColor = 'border-emerald-500'

  if (changeValue < 0 && changeValue > -3) {
    status = 'Atenção'
    statusColor = 'text-yellow-400'
    borderColor = 'border-yellow-500'
  }

  if (changeValue <= -3) {
    status = 'Zona de Risco'
    statusColor = 'text-red-400'
    borderColor = 'border-red-500'
  }

  // =====================
  // Decisão IA
  // =====================
  let decision = {
    label: 'Manter',
    bg: 'bg-slate-700',
    color: 'text-slate-300'
  }

  if (score >= 80) {
    decision = {
      label: 'Comprar',
      bg: 'bg-emerald-500/20',
      color: 'text-emerald-400'
    }
  }

  if (score < 40) {
    decision = {
      label: 'Evitar',
      bg: 'bg-red-500/20',
      color: 'text-red-400'
    }
  }

  // =====================
  // Simulações
  // =====================
  const scenarios = [0.1, 0.5, 1]

  // =====================
  // Render
  // =====================
  return (
    <div
      onClick={() => onSelect?.(coin)}
      className={`
        cursor-pointer bg-slate-800 rounded-xl p-4 shadow-md border-l-4
        ${borderColor}
        ${isSelected ? 'ring-2 ring-emerald-400 scale-[1.02]' : ''}
        transition
      `}
    >
      {/* Outras Cryptos */}
      {coin?.custom && (
        <span className="text-xs text-sky-400 font-bold">
          🔍 Adicionada manualmente
        </span>
      )}

      {/* IA */}
      <div className={`mt-1 text-sm font-bold ${recommendation.color}`}>
        🧠 IA: {recommendation.label} ({recommendation.confidence}%)
      </div>

      {/* Cabeçalho */}
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span>
          🧠 Score: <b className="text-white">{score}</b>
        </span>
        <span>#{rank} Oportunidade</span>
      </div>

      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${decision.bg} ${decision.color}`}
      >
        {decision.label}
      </span>

      {/* Nome */}
      <div className="flex justify-between items-center mt-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{name}</h2>
          <span className="text-sm text-slate-400">
            {symbol.toUpperCase()}
          </span>
        </div>

        <span className={`text-sm font-bold ${statusColor}`}>
          {changeValue >= 0 ? '▲' : '▼'} {formatNumber(changeValue, 2)}%
        </span>
      </div>

      {/* Preço */}
      <div className="mt-3 text-xl font-bold text-white">
        {formatCurrency(price, currency)}
      </div>

      <div className={`mt-1 text-sm font-semibold ${statusColor}`}>
        {status}
      </div>

      {/* Compra */}
      <div className="mt-2 text-sm text-slate-400">
        Investindo {formatCurrency(invested, currency)} você compra{' '}
        <b className="text-white">
          {formatNumber(quantity, 6)} {symbol.toUpperCase()}
        </b>
      </div>

      {/* Simulação de lucro */}
      <div className="mt-4 border-t border-slate-700 pt-3 space-y-1 text-sm">
        {scenarios.map(p => {
          const finalValue = invested * (1 + p)
          const profit = finalValue - invested

          return (
            <div key={p} className="flex justify-between text-emerald-400">
              <span>📈 +{p * 100}%</span>
              <span>
                {formatCurrency(finalValue, currency)}
                <span className="text-slate-400">
                  {' '} (+{formatCurrency(profit, currency)})
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
