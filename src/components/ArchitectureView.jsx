import { useState } from 'react'
import { components } from '../data/splunkData'

const flowPath = [
  {
    tier: 'DATA SOURCES',
    color: '#3b82f6',
    items: ['linux-logs','windows-logs','firewall-syslog','api-data','hec','app-logs']
  },
  {
    tier: 'FORWARDERS',
    color: '#f59e0b',
    items: ['uf','hf']
  },
  {
    tier: 'INDEXERS',
    color: '#65A637',
    items: ['indexer']
  },
  {
    tier: 'SEARCH HEAD',
    color: '#8b5cf6',
    items: ['searchhead']
  }
]

const mgmtNodes = ['deploymentserver','licensermanager','monitoringconsole']

function Arrow({ color = 'var(--accent)' }) {
  return (
    <div className="flex flex-col items-center justify-center px-2 shrink-0">
      <svg width="40" height="24" viewBox="0 0 40 24">
        <line x1="0" y1="12" x2="28" y2="12" stroke={color} strokeWidth="2" strokeDasharray="6 3">
          <animate attributeName="stroke-dashoffset" from="0" to="-9" dur="0.8s" repeatCount="indefinite" />
        </line>
        <polygon points="28,6 40,12 28,18" fill={color} opacity="0.7" />
      </svg>
    </div>
  )
}

export default function ArchitectureView() {
  const [selected, setSelected] = useState(null)
  const allComps = components
  const selectedData = selected ? allComps.find(c => c.id === selected) : null

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-1" style={{fontFamily:'JetBrains Mono, monospace'}}>
        Splunk Data Flow
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-6">Data flows left → right. Click any node for details.</p>

      {/* Main flow path */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 mb-6 overflow-x-auto">
        <div className="flex items-stretch min-w-[900px]">
          {flowPath.map((tier, ti) => {
            const tierComps = tier.items.map(id => allComps.find(c => c.id === id)).filter(Boolean)
            return (
              <div key={tier.tier} className="flex items-center">
                {/* Tier column */}
                <div className="flex flex-col items-center">
                  <span
                    className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded-full"
                    style={{ color: tier.color, backgroundColor: tier.color + '18', border: `1px solid ${tier.color}33` }}
                  >
                    {tier.tier}
                  </span>
                  <div className="flex flex-col gap-2">
                    {tierComps.map(comp => (
                      <button
                        key={comp.id}
                        onClick={() => setSelected(selected === comp.id ? null : comp.id)}
                        className={`text-left px-4 py-3 rounded-xl border transition-all min-w-[160px] ${
                          selected === comp.id
                            ? 'border-[' + tier.color + '] shadow-lg'
                            : 'border-[var(--border)] hover:border-[' + tier.color + ']/50'
                        }`}
                        style={selected === comp.id ? { borderColor: tier.color, backgroundColor: tier.color + '15' } : { backgroundColor: 'var(--bg-primary)' }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{comp.icon}</span>
                          <span className="text-sm font-bold">{comp.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Arrow to next tier */}
                {ti < flowPath.length - 1 && <Arrow color={tier.color} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Management tier */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 mb-6">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3 px-3 py-1 rounded-full inline-block"
          style={{ color: '#ef4444', backgroundColor: '#ef444418', border: '1px solid #ef444433' }}>
          MANAGEMENT
        </span>
        <div className="flex gap-3 mt-3">
          {mgmtNodes.map(id => {
            const comp = allComps.find(c => c.id === id)
            if (!comp) return null
            return (
              <button
                key={comp.id}
                onClick={() => setSelected(selected === comp.id ? null : comp.id)}
                className={`text-left px-4 py-3 rounded-xl border transition-all flex-1 ${
                  selected === comp.id
                    ? 'border-[#ef4444] bg-[#ef4444]/10'
                    : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[#ef4444]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{comp.icon}</span>
                  <span className="text-sm font-bold">{comp.name}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selectedData && (
        <div className="animate-fade-in bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedData.icon}</span>
            <div>
              <h3 className="text-xl font-bold">{selectedData.name}</h3>
              <span className="text-xs text-[var(--accent)] font-mono">{selectedData.category} · {selectedData.location}</span>
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-5 leading-relaxed max-w-2xl">{selectedData.description}</p>

          <div className="flex gap-1 mb-5">
            {selectedData.confFiles.map(cf => (
              <span key={cf} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--accent)]/15 text-[var(--accent-bright)] font-mono font-semibold">
                {cf}
              </span>
            ))}
          </div>

          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Sample Config</span>
            <pre className="code-block mt-2 text-xs max-w-2xl">{selectedData.sampleConfig}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
