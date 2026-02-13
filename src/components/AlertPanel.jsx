import { useEffect, useState } from 'react'

const ALERT_KEY = 'cryptoAlerts'

export default function AlertPanel() {
    const [alerts, setAlerts] = useState([])

    // =====================
    // Load alerts
    // =====================
    useEffect(() => {
        loadAlerts()

        // sincroniza entre abas
        const sync = () => loadAlerts()
        window.addEventListener('storage', sync)

        return () => window.removeEventListener('storage', sync)
    }, [])

    function loadAlerts() {
        try {
            const stored = JSON.parse(localStorage.getItem(ALERT_KEY)) || []
            setAlerts(stored)
        } catch {
            setAlerts([])
        }
    }

    // =====================
    // Clear
    // =====================
    const clearAlerts = () => {
        localStorage.removeItem(ALERT_KEY)
        setAlerts([])
    }

    // =====================
    // Empty state
    // =====================
    if (!alerts || alerts.length === 0) {
        return (
            <div className="bg-slate-800 p-4 rounded-xl text-slate-400 mb-6">
                Nenhum alerta registrado ainda.
            </div>
        )
    }

    // =====================
    // Color map
    // =====================
    const styleMap = {
        drop: {
            box: 'border-red-500 bg-red-500/10',
            text: 'text-red-400',
            icon: '📉'
        },
        pump: {
            box: 'border-emerald-500 bg-emerald-500/10',
            text: 'text-emerald-400',
            icon: '🚀'
        },
        info: {
            box: 'border-slate-500 bg-slate-500/10',
            text: 'text-slate-300',
            icon: 'ℹ️'
        }
    }

    // =====================
    // Render
    // =====================
    return (
        <div className="bg-slate-900 p-4 rounded-xl shadow-md mb-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-white">
                    🔔 Alertas de Mercado
                </h2>

                <button
                    onClick={clearAlerts}
                    className="text-xs text-red-400 hover:text-red-300"
                >
                    Limpar
                </button>
            </div>

            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {alerts.map(alert => {
                    const id =
                        alert.id ??
                        `${alert.coin}-${alert.date}-${Math.random()}`

                    const type = alert.type ?? 'info'
                    const style = styleMap[type] ?? styleMap.info

                    return (
                        <li
                            key={id}
                            className={`p-3 rounded-lg border-l-4 ${style.box}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-white">
                                    {alert.coin || '—'}
                                </span>

                                <span className="text-xs text-slate-400">
                                    {alert.date || ''}
                                </span>
                            </div>

                            <div className={`text-sm mt-1 ${style.text}`}>
                                {style.icon}{' '}
                                {type === 'drop'
                                    ? 'Queda'
                                    : type === 'pump'
                                        ? 'Alta'
                                        : 'Informação'}{' '}
                                de {alert.percent ?? 0}%
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
