const AI_HISTORY_KEY = 'aiHistory'

export function getAIHistory() {
    try {
        return JSON.parse(localStorage.getItem(AI_HISTORY_KEY)) || []
    } catch {
        return []
    }
}

export function saveAIHistory(entry) {
    try {
        const history = getAIHistory()

        const updated = [
            {
                id: Date.now(),
                date: new Date().toLocaleString(),
                ...entry
            },
            ...history
        ].slice(0, 100)

        localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(updated))

        // 🔥 avisa o app que mudou
        window.dispatchEvent(new Event('ai-history-updated'))
    } catch (err) {
        console.error('Erro ao salvar histórico IA', err)
    }
}

export function clearAIHistory() {
    localStorage.removeItem(AI_HISTORY_KEY)
    window.dispatchEvent(new Event('ai-history-updated'))
}
