import { useState } from 'react'
import { confFiles } from '../data/splunkData'

function highlightConf(code) {
  return code.split('\n').map((line, i) => {
    if (line.match(/^\[.+\]$/)) return <span key={i} className="stanza">{line}</span>
    if (line.match(/^#/)) return <span key={i} className="comment">{line}</span>
    const m = line.match(/^(\s*)([\w.]+)(\s*=\s*)(.*)$/)
    if (m) return <span key={i}>{m[1]}<span className="key">{m[2]}</span>{m[3]}<span className="value">{m[4]}</span></span>
    return line
  }).reduce((acc, el, i) => i === 0 ? [el] : [...acc, '\n', el], [])
}

export default function ConfExplorer() {
  const [active, setActive] = useState(confFiles[0].id)
  const [expandedSample, setExpandedSample] = useState(0)
  const data = confFiles.find(f => f.id === active)

  return (
    <div className="animate-fade-in flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Sidebar */}
      <div className="md:w-56 shrink-0">
        <h2 className="text-lg font-bold mb-2 md:mb-3" style={{fontFamily:'JetBrains Mono, monospace'}}>.conf Files</h2>
        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {confFiles.map(f => (
            <button
              key={f.id}
              onClick={() => { setActive(f.id); setExpandedSample(0) }}
              className={`shrink-0 md:shrink md:w-auto text-left px-3 py-2 rounded-lg text-sm transition-all ${
                active === f.id
                  ? 'bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent-bright)]'
                  : 'hover:bg-[var(--bg-card)] text-[var(--text-muted)]'
              }`}
            >
              <span className="mr-2">{f.icon}</span>
              <span className="font-mono font-semibold">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {data && (
        <div className="flex-1 animate-fade-in" key={data.id}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{data.icon}</span>
            <div>
              <h2 className="text-2xl font-bold font-mono">{data.name}</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{data.description}</p>
            </div>
          </div>

          {/* Location Matrix */}
          <div className="mb-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Where does it live?</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(data.locations).map(([loc, status]) => (
                <div key={loc} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-[var(--text)]">{loc}</span>
                  <span className="text-xs">{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Samples */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Sample Configs</h3>
            <div className="space-y-3">
              {data.samples.map((s, i) => (
                <div key={i} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
                  <button
                    onClick={() => setExpandedSample(expandedSample === i ? -1 : i)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-card-hover)] transition-colors"
                  >
                    <span className="text-sm font-semibold">{s.title}</span>
                    <span className="text-[var(--text-muted)] text-xs">{expandedSample === i ? '▼' : '▶'}</span>
                  </button>
                  {expandedSample === i && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <pre className="code-block text-xs">{highlightConf(s.config)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gotchas */}
          <div className="bg-[var(--accent-warn)]/10 border border-[var(--accent-warn)]/30 rounded-xl p-4">
            <h3 className="text-xs font-bold text-[var(--accent-warn)] uppercase tracking-wider mb-2">⚠️ Gotchas</h3>
            <ul className="space-y-2">
              {data.gotchas.map((g, i) => (
                <li key={i} className="text-sm text-[var(--text)] flex gap-2">
                  <span className="text-[var(--accent-warn)] shrink-0">•</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
