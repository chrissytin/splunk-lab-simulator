import { components, confFiles, concepts, scenarios, quizQuestions } from '../data/splunkData'

export default function SearchResults({ query, navigateTo }) {
  const q = query.toLowerCase()
  const results = []

  components.forEach(c => {
    if (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.confFiles.some(f => f.toLowerCase().includes(q)))
      results.push({ type: 'Component', label: `${c.icon} ${c.name}`, tab: 'architecture' })
  })

  confFiles.forEach(f => {
    if (f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
      results.push({ type: '.conf', label: `${f.icon} ${f.name}`, tab: 'conf' })
  })

  concepts.forEach(c => {
    if (c.title.toLowerCase().includes(q) || c.explanation.toLowerCase().includes(q))
      results.push({ type: 'Concept', label: `📚 ${c.title}`, tab: 'learning' })
  })

  scenarios.forEach(s => {
    if (s.title.toLowerCase().includes(q))
      results.push({ type: 'Scenario', label: `${s.icon} ${s.title}`, tab: 'scenarios' })
  })

  if (results.length === 0) return (
    <div className="absolute top-full mt-1 right-0 w-72 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-xl p-3 z-50">
      <p className="text-xs text-[var(--text-dim)]">No results for "{query}"</p>
    </div>
  )

  return (
    <div className="absolute top-full mt-1 right-0 w-72 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
      {results.slice(0, 10).map((r, i) => (
        <button
          key={i}
          onClick={() => navigateTo(r.tab)}
          className="w-full text-left px-3 py-2 hover:bg-[var(--bg-card-hover)] transition-colors flex items-center gap-2"
        >
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent-bright)] font-mono shrink-0">
            {r.type}
          </span>
          <span className="text-sm truncate">{r.label}</span>
        </button>
      ))}
    </div>
  )
}
