// utils/recommendation.js

export function getRecommendation(data) {
    if (!data || typeof data !== 'object') {
        return {
            label: '—',
            confidence: 0,
            color: 'text-slate-400'
        }
    }

    // Aceita tanto dados da API quanto dados normalizados
    const score = Number(data.score) || 0
    const change =
        Number(data.price_change_percentage_24h ?? data.change) || 0
    const volume =
        Number(data.total_volume ?? data.volume) || 0

    const volatility = Math.abs(change)

    let confidence = 0

    // 🧠 Score
    if (score >= 80) confidence += 45
    else if (score >= 60) confidence += 30
    else if (score >= 40) confidence += 15

    // 📉 Queda / correção
    if (change < -7) confidence += 25
    else if (change < -3) confidence += 15
    else if (change < 0) confidence += 8

    // 💧 Liquidez
    if (volume > 100_000_000) confidence += 20
    else if (volume > 20_000_000) confidence += 10

    // 🌊 Volatilidade saudável
    if (volatility >= 4 && volatility <= 12) confidence += 10

    // 🔒 Limites
    confidence = Math.min(100, Math.max(0, Math.round(confidence)))

    // 🎯 Decisão
    let label = 'Manter'
    let color = 'text-yellow-400'

    if (confidence >= 70) {
        label = 'Comprar'
        color = 'text-emerald-400'
    } else if (confidence < 40) {
        label = 'Evitar'
        color = 'text-red-400'
    }

    return {
        label,
        confidence,
        color
    }
}
