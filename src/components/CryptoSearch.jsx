import { useState } from 'react'

export default function CryptoSearch({ onAddCoin }) {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)

    async function searchCoin() {
        if (!query) return

        try {
            setLoading(true)

            const res = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${query.toLowerCase()}`
            )
            const data = await res.json()

            if (Array.isArray(data) && data.length) {
                onAddCoin(data[0])
            } else {
                alert('Cripto não encontrada')
            }
        } catch {
            alert('Erro ao buscar cripto')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-slate-900 p-4 rounded-xl mb-6 flex gap-2">
            <input
                className="flex-1 bg-slate-800 text-white px-3 py-2 rounded"
                placeholder="Buscar cripto (ex: solana, cardano, pepe)"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />

            <button
                onClick={searchCoin}
                className="bg-emerald-600 hover:bg-emerald-500 px-4 rounded text-white"
            >
                {loading ? '...' : 'Adicionar'}
            </button>
        </div>
    )
}
