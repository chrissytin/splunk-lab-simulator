import { useState } from 'react'
import { scenarios } from '../data/splunkData'

export default function Scenarios() {
  const [active, setActive] = useState(null)
  const [step, setStep] = useState(0)
  const [expandedConfig, setExpandedConfig] = useState({})

  const scenario = active ? scenarios.find(s => s.id === active) : null

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-1" style={{fontFamily:'JetBrains Mono, monospace'}}>Scenarios</h2>
      <p className="text-[var(--text-muted)] text-sm mb-6">Step-by-step guides for common Splunk tasks.</p>

      {!scenario ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActive(s.id); setStep(0); setExpandedConfig({}) }}
              className={`animate-fade-up text-left p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)] transition-all`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="text-lg font-bold">{s.title}</h3>
              </div>
              <div className="flex gap-1 flex-wrap mb-3">
                {s.components.map(c => (
                  <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent-bright)] font-mono">
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[var(--text-muted)]">{s.steps.length} steps</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <button
            onClick={() => setActive(null)}
            className="text-sm text-[var(--accent)] hover:underline mb-4 inline-flex items-center gap-1"
          >
            ← Back to scenarios
          </button>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{scenario.icon}</span>
            <div>
              <h3 className="text-xl font-bold">{scenario.title}</h3>
              <div className="flex gap-1 mt-1">
                {scenario.components.map(c => (
                  <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent-bright)] font-mono">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {scenario.steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`shrink-0 w-9 h-9 rounded-full text-sm font-bold transition-all ${
                  i === step
                    ? 'bg-[var(--accent)] text-black'
                    : i < step
                    ? 'bg-[var(--accent)]/30 text-[var(--accent-bright)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 animate-fade-in" key={step}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[var(--accent)] font-mono">STEP {step + 1}</span>
              {scenario.steps[step].conf && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent-bright)] font-mono">
                  {scenario.steps[step].conf}
                </span>
              )}
            </div>
            <h4 className="text-lg font-bold mb-2">{scenario.steps[step].title}</h4>
            <p className="text-sm text-[var(--text-muted)] mb-4">{scenario.steps[step].action}</p>

            {scenario.steps[step].location && (
              <div className="mb-3">
                <span className="text-xs text-[var(--text-dim)]">📍 </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">{scenario.steps[step].location}</span>
              </div>
            )}

            {scenario.steps[step].config && (
              <div className="mb-3">
                <button
                  onClick={() => setExpandedConfig(prev => ({...prev, [step]: !prev[step]}))}
                  className="text-xs text-[var(--accent)] hover:underline mb-2 inline-flex items-center gap-1"
                >
                  {expandedConfig[step] ? '▼' : '▶'} Show config
                </button>
                {expandedConfig[step] && (
                  <pre className="code-block text-xs animate-fade-in">{scenario.steps[step].config}</pre>
                )}
              </div>
            )}

            {scenario.steps[step].detail && (
              <div className="mt-3 bg-[var(--bg-primary)] rounded-lg p-3 border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-wider">CLI</span>
                <pre className="text-xs font-mono text-[var(--accent-bright)] mt-1">{scenario.steps[step].detail}</pre>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-card-hover)] text-[var(--text-muted)] disabled:opacity-30 transition-all"
              >
                ← Previous
              </button>
              <button
                onClick={() => setStep(Math.min(scenario.steps.length - 1, step + 1))}
                disabled={step === scenario.steps.length - 1}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--accent)] text-black disabled:opacity-30 transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
