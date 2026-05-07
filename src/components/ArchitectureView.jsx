import { useState } from 'react'
import { components } from '../data/splunkData'

const categories = ['Data Sources', 'Forwarders', 'Indexing Tier', 'Search Tier', 'Management']

const flowConnections = [
  { from: 'Data Sources', to: 'Forwarders' },
  { from: 'Forwarders', to: 'Indexing Tier' },
  { from: 'Indexing Tier', to: 'Search Tier' },
  { from: 'Management', to: 'Forwarders', dashed: true },
  { from: 'Management', to: 'Indexing Tier', dashed: true },
]

export default function ArchitectureView() {
  const [selected, setSelected] = useState(null)
  const selectedData = selected ? components.find(c => c.id === selected) : null

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-1" style={{fontFamily:'JetBrains Mono, monospace'}}>
        Splunk Architecture
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-6">Click any component to explore its config and role in the data pipeline.</p>

      <div className="flex gap-6">
        {/* Diagram */}
        <div className="flex-1">
          {/* Flow header */}
          <div className="flex items-center justify-between mb-4 px-2">
            {categories.map((cat, i) => (
              <div key={cat} className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider" style={{fontFamily:'JetBrains Mono, monospace'}}>
                  {cat}
                </span>
                {i < categories.length - 1 && (
                  <svg width="40" height="20" className="shrink-0">
                    <line x1="0" y1="10" x2="30" y2="10" stroke="var(--accent)" strokeWidth="2" strokeDasharray={i >= 3 ? "4 4" : "0"}>
                      <animate attributeName="stroke-dashoffset" from="0" to={i >= 3 ? "-8" : "0"} dur="1s" repeatCount="indefinite" />
                    </line>
                    <polygon points="30,5 40,10 30,15" fill="var(--accent)" opacity="0.6" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Component cards by category */}
          {categories.map(cat => {
            const items = components.filter(c => c.category === cat)
            return (
              <div key={cat} className="mb-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {items.map((comp, i) => (
                    <button
                      key={comp.id}
                      onClick={() => setSelected(selected === comp.id ? null : comp.id)}
                      className={`animate-fade-up text-left p-3 rounded-lg border transition-all ${
                        selected === comp.id
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg shadow-[var(--accent)]/5'
                          : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)]'
                      }`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{comp.icon}</span>
                        <span className="text-sm font-semibold">{comp.name}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2">{comp.description}</p>
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {comp.confFiles.map(cf => (
                          <span key={cf} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent-bright)] font-mono">
                            {cf}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
                {cat !== 'Management' && (
                  <div className="flex justify-center my-2">
                    <svg width="24" height="24">
                      <polygon points="8,4 16,12 8,20" fill="var(--accent)" opacity="0.3" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Detail Panel */}
        {selectedData && (
          <div className="w-96 shrink-0 animate-fade-in">
            <div className="sticky top-20 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedData.icon}</span>
                <div>
                  <h3 className="font-bold text-lg">{selectedData.name}</h3>
                  <span className="text-xs text-[var(--accent)] font-mono">{selectedData.category}</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">{selectedData.description}</p>
              
              <div className="mb-4">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Location</span>
                <p className="text-sm mt-1 font-mono text-[var(--accent-bright)]">{selectedData.location}</p>
              </div>

              <div className="mb-4">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Config Files</span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {selectedData.confFiles.map(cf => (
                    <span key={cf} className="text-xs px-2 py-1 rounded bg-[var(--accent)]/15 text-[var(--accent-bright)] font-mono">
                      {cf}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Sample Config</span>
                <pre className="code-block mt-2 text-xs overflow-x-auto">{selectedData.sampleConfig}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
