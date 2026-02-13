const ALERT_KEY = 'cryptoAlerts'

function getStoredAlerts() {
    try {
        return JSON.parse(localStorage.getItem(ALERT_KEY)) || []
    } catch {
        return []
    }
}

function saveAlert(alert) {
    const alerts = getStoredAlerts()

    const exists = alerts.some(
        a => a.coin === alert.coin && a.type === alert.type
    )

    if (exists) return

    const updated = [alert, ...alerts].slice(0, 50)
    localStorage.setItem(ALERT_KEY, JSON.stringify(updated))
}

function notifyBrowser(title, message) {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
        new Notification(title, { body: message })
    }
}

export function runAlertEngine(coin, avgVolume) {
    if (!coin) return

    const change = Number(coin.price_change_percentage_24h || 0)
    const volume = Number(coin.total_volume || 0)
    const score = Number(coin.score || 0)

    // 🔥 GEM
    if (score >= 80) {
        saveAlert({
            id: Date.now(),
            coin: coin.name,
            type: 'pump',
            percent: change.toFixed(2),
            date: new Date().toLocaleString()
        })

        notifyBrowser(
            '🔥 GEM Detectada',
            `${coin.name} com score ${score}`
        )
    }

    // 📉 QUEDA FORTE
    if (change <= -7) {
        saveAlert({
            id: Date.now(),
            coin: coin.name,
            type: 'drop',
            percent: change.toFixed(2),
            date: new Date().toLocaleString()
        })

        notifyBrowser(
            '📉 Queda Forte',
            `${coin.name} caiu ${change.toFixed(2)}%`
        )
    }

    // 🚀 EXPLOSÃO DE VOLUME
    if (volume > avgVolume * 3) {
        saveAlert({
            id: Date.now(),
            coin: coin.name,
            type: 'pump',
            percent: change.toFixed(2),
            date: new Date().toLocaleString()
        })

        notifyBrowser(
            '🚀 Volume Explodindo',
            `${coin.name} com volume anormal`
        )
    }
}
