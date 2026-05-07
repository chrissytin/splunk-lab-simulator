import { useState } from 'react'
import { components } from '../data/splunkData'

const flowPath = [
  { tier: 'DATA SOURCES', color: '#3b82f6', items: ['linux-logs','windows-logs','firewall-syslog','api-data','hec','app-logs'] },
  { tier: 'FORWARDERS', color: '#f59e0b', items: ['uf','hf'] },
  { tier: 'INDEXERS', color: '#65A637', items: ['indexer'] },
  { tier: 'SEARCH HEAD', color: '#8b5cf6', items: ['searchhead'] }
]
const mgmtNodes = ['deploymentserver','licensermanager','monitoringconsole']

function ArrowDown({ color }) {
  return (
    <div className="flex justify-center py-1">
      <svg width="24" height="28" viewBox="0 0 24 28">
        <line x1="12" y1="0" x2="12" y2="18" stroke={color} strokeWidth="2" strokeDasharray="4 3">
          <animate attributeName="stroke-dashoffset" from="0" to="-7" dur="0.8s" repeatCount="indefinite" />
        </line>
        <polygon points="6,18 12,28 18,18" fill={color} opacity="0.7" />
      </svg>
    </div>
  )
}

function ArrowRight({ color }) {
  return (
    <div className="flex items-center px-1 shrink-0">
      <svg width="36" height="20" viewBox="0 0 36 20">
        <line x1="0" y1="10" x2="24" y2="10" stroke={color} strokeWidth="2" strokeDasharray="5 3">
          <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="0.8s" repeatCount="indefinite" />
        </line>
        <polygon points="24,5 36,10 24,15" fill={color} opacity="0.7" />
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
      <h2 className="text-xl md:text-2xl font-bold mb-1" style={{fontFamily:'JetBrains Mono, monospace'}}>
        Splunk Data Flow
      </h2>
      <p className="text-[var(--text-muted)] text-xs md:text-sm mb-4 md:mb-6">Data flows left → right. Tap any node for details.</p>

      {/* Mobile: vertical flow */}
      <div className="md:hidden bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 mb-4">
        {flowPath.map((tier, ti) => {
          const tierComps = tier.items.map(id => allComps.find(c => c.id === id)).filter(Boolean)
          return (
            <div key={tier.tier}>
              <span
                className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full inline-block mb-2"
                style={{ color: tier.color, backgroundColor: tier.color + '18', border: `1px solid ${tier.color}33` }}
              >
                {tier.tier}
              </span>
              <div className="grid grid-cols-2 gap-2 mb-1">
                {tierComps.map(comp => (
                  <button
                    key={comp.id}
                    onClick={() => setSelected(selected === comp.id ? null : comp.id)}
                    className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                      selected === comp.id ? '' : 'border-[var(--border)] bg-[var(--bg-primary)]'
                    }`}
                    style={selected === comp.id ? { borderColor: tier.color, backgroundColor: tier.color + '15' } : {}}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{comp.icon}</span>
                      <span className="text-xs font-bold">{comp.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              {ti < flowPath.length - 1 && <ArrowDown color={tier.color} />}
            </div>
          )
        })}
      </div>

      {/* Desktop: horizontal flow */}
      <div className="hidden md:block bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 mb-6 overflow-x-auto">
        <div className="flex items-stretch min-w-[900px]">
          {flowPath.map((tier, ti) => {
            const tierComps = tier.items.map(id => allComps.find(c => c.id === id)).filter(Boolean)
            return (
              <div key={tier.tier} className="flex items-center">
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
                          selected === comp.id ? '' : 'border-[var(--border)] bg-[var(--bg-primary)]'
                        }`}
                        style={selected === comp.id ? { borderColor: tier.color, backgroundColor: tier.color + '15' } : {}}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{comp.icon}</span>
                          <span className="text-sm font-bold">{comp.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {ti < flowPath.length - 1 && <ArrowRight color={tier.color} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Management tier */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-5 mb-4 md:mb-6">
        <span className="text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 md:px-3 md:py-1 rounded-full inline-block mb-3"
          style={{ color: '#ef4444', backgroundColor: '#ef444418', border: '1px solid #ef444433' }}>
          MANAGEMENT
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {mgmtNodes.map(id => {
            const comp = allComps.find(c => c.id === id)
            if (!comp) return null
            return (
              <button
                key={comp.id}
                onClick={() => setSelected(selected === comp.id ? null : comp.id)}
                className={`text-left px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border transition-all ${
                  selected === comp.id
                    ? 'border-[#ef4444] bg-[#ef4444]/10'
                    : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[#ef4444]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl">{comp.icon}</span>
                  <span className="text-xs md:text-sm font-bold">{comp.name}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selectedData && (
        <div className="animate-fade-in bg-[var(--bg-card)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <span className="text-3xl md:text-4xl">{selectedData.icon}</span>
            <div>
              <h3 className="text-base md:text-xl font-bold">{selectedData.name}</h3>
              <span className="text-[10px] md:text-xs text-[var(--accent)] font-mono">{selectedData.category} · {selectedData.location}</span>
            </div>
          </div>
          <p className="text-xs md:text-sm text-[var(--text-muted)] mb-4 md:mb-5 leading-relaxed">{selectedData.description}</p>

          <div className="flex gap-1 mb-4 md:mb-5 flex-wrap">
            {selectedData.confFiles.map(cf => (
              <span key={cf} className="text-[10px] md:text-xs px-2 py-1 rounded bg-[var(--accent)]/15 text-[var(--accent-bright)] font-mono font-semibold">
                {cf}
              </span>
            ))}
          </div>

          <div>
            <span className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Sample Config</span>
            <pre className="code-block mt-2 text-[10px] md:text-xs overflow-x-auto">{selectedData.sampleConfig}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
