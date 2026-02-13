import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ReferenceLine
} from 'recharts'
import { useMemo } from 'react'

function getColor(coin, avgPrice, avgScore) {
    if (coin.score >= avgScore && coin.current_price <= avgPrice)
        return '#22c55e' // GEM

    if (coin.score >= avgScore && coin.current_price > avgPrice)
        return '#eab308' // atenção

    if (coin.score < avgScore && coin.current_price <= avgPrice)
        return '#94a3b8' // neutro

    return '#ef4444' // evitar
}

export default function OpportunityChart({
    data,
    currency,
    onSelectCoin,
    selectedCoin
}) {

    const { avgPrice, avgScore } = useMemo(() => {
        if (!data.length) return { avgPrice: 0, avgScore: 0 }

        const totalPrice = data.reduce(
            (sum, c) => sum + Number(c.current_price || 0), 0
        )

        const totalScore = data.reduce(
            (sum, c) => sum + Number(c.score || 0), 0
        )

        return {
            avgPrice: totalPrice / data.length,
            avgScore: totalScore / data.length
        }
    }, [data])

    return (
        <div className="bg-slate-900 rounded-xl p-4 mb-6">
            <h2 className="text-white font-semibold mb-3">
                📊 Mapa de Oportunidades
            </h2>

            <ResponsiveContainer width="100%" height={320}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                    <XAxis
                        dataKey="current_price"
                        name="Preço"
                        tick={{ fill: '#cbd5f5' }}
                        tickFormatter={v =>
                            currency === 'brl'
                                ? `R$ ${Number(v).toLocaleString('pt-BR')}`
                                : `$ ${Number(v).toLocaleString('en-US')}`
                        }
                    />

                    <YAxis
                        dataKey="score"
                        name="Score"
                        tick={{ fill: '#cbd5f5' }}
                    />

                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ payload }) => {
                            if (!payload?.length) return null
                            const c = payload[0].payload

                            return (
                                <div className="bg-slate-800 p-3 rounded text-sm text-white">
                                    <div className="font-bold">{c.name}</div>
                                    <div>Score: {c.score}</div>
                                    <div>
                                        Preço:{' '}
                                        {currency === 'brl' ? 'R$' : '$'}{' '}
                                        {Number(c.current_price).toLocaleString()}
                                    </div>
                                    <div>
                                        24h: {c.price_change_percentage_24h?.toFixed(2)}%
                                    </div>
                                </div>
                            )
                        }}
                    />

                    <Scatter
                        data={data}
                        shape={props => {
                            const { cx, cy, payload } = props
                            const isSelected = payload.id === selectedCoin?.id

                            return (
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={isSelected ? 10 : 6}
                                    fill={getColor(payload, avgPrice, avgScore)}
                                    stroke={isSelected ? '#22c55e' : '#0f172a'}
                                    strokeWidth={isSelected ? 3 : 1}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => onSelectCoin?.(payload)}
                                />
                            )
                        }}
                    />


                    <ReferenceLine
                        x={avgPrice}
                        stroke="#64748b"
                        strokeDasharray="4 4"
                    />

                    <ReferenceLine
                        y={avgScore}
                        stroke="#64748b"
                        strokeDasharray="4 4"
                    />

                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}
