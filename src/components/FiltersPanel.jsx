export default function FiltersPanel({ filters, setFilters, currency }) {
    return (
        <div className="bg-slate-900 p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-end">

            <div>
                <label className="text-xs text-slate-400">Preço máximo</label>
                <input
                    type="number"
                    className="w-32 bg-slate-800 text-white px-2 py-1 rounded"
                    placeholder={currency === 'brl' ? 'R$' : '$'}
                    value={filters.maxPrice}
                    onChange={e =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="text-xs text-slate-400">Score mínimo</label>
                <input
                    type="number"
                    className="w-24 bg-slate-800 text-white px-2 py-1 rounded"
                    placeholder="0–100"
                    value={filters.minScore}
                    onChange={e =>
                        setFilters({ ...filters, minScore: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="text-xs text-slate-400">Decisão IA</label>
                <select
                    className="bg-slate-800 text-white px-2 py-1 rounded"
                    value={filters.decision}
                    onChange={e =>
                        setFilters({ ...filters, decision: e.target.value })
                    }
                >
                    <option value="all">Todas</option>
                    <option value="Comprar">Comprar</option>
                    <option value="Manter">Manter</option>
                    <option value="Evitar">Evitar</option>
                </select>
            </div>
        </div>
    )
}
