export default function BudgetPanel({
    budgetInput,
    setBudgetInput,
    currency,
    setCurrency
}) {
    return (
        <div className="bg-slate-900 p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-end">

            <div>
                <label className="text-xs text-slate-400">Valor para investir</label>
                <input
                    className="bg-slate-800 text-white px-3 py-2 rounded w-40"
                    value={budgetInput}
                    onChange={e => setBudgetInput(e.target.value)}
                    placeholder="10,00"
                />
            </div>

            <div>
                <label className="text-xs text-slate-400">Moeda</label>
                <select
                    className="bg-slate-800 text-white px-3 py-2 rounded"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                >
                    <option value="usd">USD</option>
                    <option value="brl">BRL</option>
                </select>
            </div>

        </div>
    )
}
