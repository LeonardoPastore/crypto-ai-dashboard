import { useMemo } from 'react'
import { formatCurrency, formatNumber } from '../utils/formatters'

export default function CryptoModal({
    coin,
    onClose,
    currency,
    budget,
    usdToBrl
}) {
    if (!coin) return null

    const price = currency === 'brl'
        ? coin.current_price * usdToBrl
        : coin.current_price

    const quantity = budget > 0 ? budget / price : 0
    const change = Number(coin.price_change_percentage_24h || 0)

    const recommendation = coin.recommendation ?? {
        label: '—',
        confidence: 0,
        color: 'text-slate-400'
    }

    const scenarios = [0.1, 0.5, 1]

    const status = useMemo(() => {
        if (change <= -3) return { label: 'Zona de Risco', color: 'text-red-400' }
        if (change < 0) return { label: 'Atenção', color: 'text-yellow-400' }
        return { label: 'Seguro', color: 'text-emerald-400' }
    }, [change])

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-xl p-6 w-full max-w-lg relative">

                {/* Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white"
                >
                    ✕
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold text-white mb-1">
                    {coin.name}
                </h2>
                <p className="text-slate-400 text-sm mb-3">
                    {coin.symbol?.toUpperCase()}
                </p>

                {/* IA */}
                {recommendation.label !== '—' && (
                    <div className={`mb-3 font-bold ${recommendation.color}`}>
                        🧠 IA: {recommendation.label} ({recommendation.confidence}%)
                    </div>
                )}

                {/* Preço */}
                <div className="text-3xl font-bold text-white mb-1">
                    {formatCurrency(price, currency)}
                </div>

                <div className={`text-sm font-semibold ${status.color}`}>
                    {change >= 0 ? '▲' : '▼'} {formatNumber(change, 2)}% — {status.label}
                </div>

                {/* Compra */}
                <div className="mt-4 text-slate-300 text-sm">
                    Investindo <b>{formatCurrency(budget, currency)}</b> você compra:
                    <div className="text-lg font-bold text-white mt-1">
                        {formatNumber(quantity, 6)} {coin.symbol?.toUpperCase()}
                    </div>
                </div>

                {/* Simulações */}
                <div className="mt-6 border-t border-slate-700 pt-4 space-y-2 text-sm">
                    {scenarios.map(p => {
                        const finalValue = budget * (1 + p)
                        const profit = finalValue - budget

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
        </div>
    )
}
