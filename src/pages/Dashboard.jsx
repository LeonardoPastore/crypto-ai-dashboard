import { useEffect, useState } from 'react'

import CryptoCard from '../components/CryptoCard'
import CryptoModal from '../components/CryptoModal'
import OpportunityChart from '../components/OpportunityChart'
import AlertPanel from '../components/AlertPanel'
import AIHistoryPanel from '../components/AIHistoryPanel'
import CryptoSearch from '../components/CryptoSearch'
import BudgetPanel from '../components/BudgetPanel'

import { parseBRNumber } from '../utils/formatters'
import { getRecommendation } from '../utils/recommendation'
import { saveAIHistory } from '../utils/aiHistory'
import { runAlertEngine } from '../utils/alertEngine'

export default function Dashboard() {
  // =====================
  // STATES
  // =====================
  const [cryptos, setCryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState(null)

  const [budgetInput, setBudgetInput] = useState('10,00')
  const [currency, setCurrency] = useState('usd')
  const [usdToBrl, setUsdToBrl] = useState(1)

  // =====================
  // UTILS
  // =====================
  function normalize(value, min, max) {
    if (max === min) return 0
    return (value - min) / (max - min)
  }

  const budget = Number.isFinite(parseBRNumber(budgetInput))
    ? parseBRNumber(budgetInput)
    : 0

  // =====================
  // USD → BRL
  // =====================
  useEffect(() => {
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=brl'
    )
      .then(res => res.json())
      .then(data => {
        if (data?.usd?.brl) setUsdToBrl(data.usd.brl)
      })
      .catch(() => { })

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // =====================
  // FETCH CRYPTOS
  // =====================
  async function fetchCryptos() {
    try {
      setLoading(true)

      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets' +
        '?vs_currency=usd' +
        '&order=market_cap_asc' +
        '&per_page=20' +
        '&page=1' +
        '&sparkline=false' +
        '&price_change_percentage=24h'
      )

      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('API inválida')

      const changes = data.map(c => Math.abs(c.price_change_percentage_24h || 0))
      const volumes = data.map(c => c.total_volume)
      const caps = data.map(c => c.market_cap)

      const minChange = Math.min(...changes)
      const maxChange = Math.max(...changes)
      const minVolume = Math.min(...volumes)
      const maxVolume = Math.max(...volumes)
      const minCap = Math.min(...caps)
      const maxCap = Math.max(...caps)

      const ranked = data.map(coin => {
        const change = coin.price_change_percentage_24h || 0

        const score =
          (change < 0
            ? normalize(Math.abs(change), minChange, maxChange) * 3
            : 0) +
          normalize(coin.total_volume, minVolume, maxVolume) * 2 -
          normalize(coin.market_cap, minCap, maxCap)

        const recommendation = getRecommendation({
          score,
          price_change_percentage_24h: change,
          total_volume: coin.total_volume
        })

        return {
          ...coin,
          score: Number(score.toFixed(2)),
          recommendation
        }
      })

      ranked.sort((a, b) => b.score - a.score)

      const avgVolume =
        ranked.reduce((sum, c) => sum + c.total_volume, 0) / ranked.length

      ranked.forEach(coin => runAlertEngine(coin, avgVolume))

      saveAIHistory({
        summary: `Análise gerada (${ranked.length} moedas analisadas)`
      })

      setCryptos(ranked)
    } catch (err) {
      console.error('Erro ao buscar moedas', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptos()
    const interval = setInterval(fetchCryptos, 60000)
    return () => clearInterval(interval)
  }, [])

  // =====================
  // ADD COIN (SEARCH)
  // =====================
  function addExternalCoin(coin) {
    setCryptos(prev => {
      const exists = prev.find(c => c.id === coin.id)
      if (exists) return prev

      const recommendation = getRecommendation({
        score: 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        total_volume: coin.total_volume || 0
      })

      return [
        {
          ...coin,
          score: 0,
          recommendation
        },
        ...prev
      ]
    })
  }

  // =====================
  // RENDER
  // =====================
  return (
    <div className="p-6 bg-slate-950 min-h-screen space-y-6">

      {/* ALERTAS */}
      <AlertPanel />

      {/* HISTÓRICO IA */}
      <AIHistoryPanel />

      {/* BUSCA DE CRIPTOS */}
      <CryptoSearch onAddCoin={addExternalCoin} />

      {/* FILTROS*/}
      <BudgetPanel
        budgetInput={budgetInput}
        setBudgetInput={setBudgetInput}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* MAPA */}
      <OpportunityChart
        data={cryptos}
        currency={currency}
        selectedCoin={selectedCoin}
        onSelectCoin={setSelectedCoin}
      />

      {/* MODAL */}
      {selectedCoin && (
        <CryptoModal
          coin={selectedCoin}
          onClose={() => setSelectedCoin(null)}
          currency={currency}
          budget={budget}
          usdToBrl={usdToBrl}
        />
      )}

      {/* LISTAGEM */}
      {loading ? (
        <p className="text-slate-400">Carregando oportunidades...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cryptos.map((coin, index) => (
            <CryptoCard
              key={coin.id}
              coin={coin}
              name={coin.name}
              symbol={coin.symbol}
              price={
                currency === 'brl'
                  ? coin.current_price * usdToBrl
                  : coin.current_price
              }
              change={coin.price_change_percentage_24h}
              quantity={budget > 0 ? budget / coin.current_price : 0}
              invested={budget}
              currency={currency}
              rank={index + 1}
              score={coin.score}
              onSelect={setSelectedCoin}
              isSelected={selectedCoin?.id === coin.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
