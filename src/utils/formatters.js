export function parseBRNumber(value) {
    if (!value) return 0

    const normalized = value
        .replace(/\./g, '')
        .replace(',', '.')
        .replace(/[^0-9.]/g, '')

    const number = Number(normalized)
    return isNaN(number) ? 0 : number
}

export function formatCurrency(value, currency = 'usd') {
    if (typeof value !== 'number' || isNaN(value)) return '0,00'

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency === 'brl' ? 'BRL' : 'USD',
        minimumFractionDigits: 2
    }).format(value)
}

export function formatNumber(value, decimals = 2) {
    if (typeof value !== 'number' || isNaN(value)) return '0,00'

    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value)
}