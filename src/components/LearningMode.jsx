import { useState } from 'react'
import { concepts } from '../data/splunkData'

export default function LearningMode() {
  const [flipped, setFlipped] = useState(new Set())
  const toggle = (id) => {
    setFlipped(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{fontFamily:'JetBrains Mono, monospace'}}>Learning Mode</h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">Click cards to flip and learn. Track your progress below.</p>
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          <span className="text-[var(--accent)] font-bold font-mono">{flipped.size}</span> / {concepts.length} concepts explored
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[var(--bg-card)] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
          style={{ width: `${(flipped.size / concepts.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {concepts.map((c, i) => (
          <div
            key={c.id}
            className={`flip-card ${flipped.has(c.id) ? 'flipped' : ''} animate-fade-up`}
            style={{ animationDelay: `${i * 0.05}s`, minHeight: '180px' }}
          >
            <div className="flip-card-inner" style={{ minHeight: '180px' }}>
              {/* Front */}
              <div className="flip-card-front">
                <button
                  onClick={() => toggle(c.id)}
                  className="w-full h-full p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/50 transition-all text-left flex flex-col justify-between"
                >
                  <h3 className="text-lg font-bold">{c.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                    <span>Click to reveal →</span>
                  </div>
                </button>
              </div>
              {/* Back */}
              <div className="flip-card-back">
                <button
                  onClick={() => toggle(c.id)}
                  className="w-full h-full p-5 bg-[var(--bg-card)] border border-[var(--accent)]/30 rounded-xl text-left flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-[var(--accent)] mb-2">{c.title}</h3>
                    <p className="text-sm text-[var(--text)] leading-relaxed mb-3">{c.explanation}</p>
                    <div className="bg-[var(--accent)]/10 rounded-lg p-3 border border-[var(--accent)]/20">
                      <p className="text-xs text-[var(--accent-bright)] font-semibold mb-1">💡 Real-world analogy</p>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{c.analogy}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-dim)]">Click to flip back</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
