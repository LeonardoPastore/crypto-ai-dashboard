import { useEffect, useState } from 'react'
import { getAIHistory, clearAIHistory } from '../utils/aiHistory'

export default function AIHistoryPanel() {
    const [history, setHistory] = useState([])

    function loadHistory() {
        setHistory(getAIHistory())
    }

    useEffect(() => {
        loadHistory()

        // 🔥 escuta mudanças
        window.addEventListener('ai-history-updated', loadHistory)

        return () => {
            window.removeEventListener('ai-history-updated', loadHistory)
        }
    }, [])

    if (!history.length) {
        return (
            <div className="bg-slate-900 p-4 rounded-xl text-slate-400">
                Nenhuma análise da IA registrada.
            </div>
        )
    }

    return (
        <div className="bg-slate-900 p-4 rounded-xl mb-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-white">
                    🧠 Histórico da IA
                </h2>

                <button
                    onClick={clearAIHistory}
                    className="text-xs text-red-400 hover:text-red-300"
                >
                    Limpar
                </button>
            </div>

            <ul className="space-y-2 text-sm max-h-60 overflow-y-auto pr-2">
                {history.map(item => (
                    <li
                        key={item.id}
                        className="text-slate-300 border-b border-slate-700 pb-1"
                    >
                        {item.summary || `${item.coin} — ${item.recommendation}`}
                    </li>
                ))}
            </ul>
        </div>
    )
}
