import { useState, useEffect, useRef } from 'react'

const stages = [
  {
    id: 'sources',
    title: 'Where Data Comes From',
    emoji: '📡',
    color: '#3b82f6',
    simple: 'Computers, phones, and programs make logs — like a diary of everything they do.',
    analogy: 'Every device writes a diary. Splunk collects all the diaries.',
    items: [
      { icon: '🖥️', name: 'Servers', desc: 'Write down who logged in, what files were opened' },
      { icon: '🔥', name: 'Firewalls', desc: 'Write down who tried to visit your network' },
      { icon: '📱', name: 'Apps', desc: 'Write down what people clicked and typed' },
      { icon: '🔑', name: 'Logins', desc: 'Write down who signed in and from where' },
    ]
  },
  {
    id: 'collect',
    title: 'Splunk Collects It',
    emoji: '📦',
    color: '#f59e0b',
    simple: 'A tiny helper (called a Forwarder) watches the diaries and sends copies to Splunk.',
    analogy: 'Like a mailman picking up letters from every house and bringing them to the post office.',
    items: [
      { icon: '➡️', name: 'Forwarder', desc: 'Watches the logs and sends them to Splunk' },
    ]
  },
  {
    id: 'index',
    title: 'Splunk Organizes It',
    emoji: '🗄️',
    color: '#65A637',
    simple: 'Splunk puts all the logs into folders (indexes) so they\'re easy to find later.',
    analogy: 'Like sorting mail into bins — bills here, letters there, packages over there.',
    items: [
      { icon: '📁', name: 'Indexes', desc: 'Folders that hold different types of logs' },
      { icon: '🏷️', name: 'Sourcetypes', desc: 'Labels that say what kind of log it is' },
    ]
  },
  {
    id: 'search',
    title: 'You Search It',
    emoji: '🔍',
    color: '#8b5cf6',
    simple: 'You type questions and Splunk finds the answers in all those logs, instantly.',
    analogy: 'Like asking a librarian "show me every time someone logged in at 3am" and they find it in seconds.',
    items: [
      { icon: '📊', name: 'Dashboards', desc: 'Pictures and charts that show what\'s happening' },
      { icon: '🔎', name: 'SPL Search', desc: 'Type a question, get an answer' },
    ]
  },
  {
    id: 'es',
    title: 'ES Watches for Bad Stuff',
    emoji: '🛡️',
    color: '#ef4444',
    simple: 'Enterprise Security is like a security guard that never sleeps. It watches ALL the logs and rings an alarm when it sees something dangerous.',
    analogy: 'Like a night watchman with a flashlight — they walk around checking everything, and shout if they see a burglar.',
    items: [
      { icon: '🎯', name: 'Correlation', desc: 'Connects the dots between different logs to spot attacks' },
      { icon: '🚨', name: 'Notable Events', desc: 'Alarms that ring when something bad is found' },
      { icon: '⚖️', name: 'Risk Scoring', desc: 'Gives each person a danger score — too high = problem!' },
      { icon: '🔬', name: 'Threat Intel', desc: 'Checks if bad guys\' addresses show up in your logs' },
    ]
  }
]

export default function DataFlowView() {
  const [activeStage, setActiveStage] = useState(0)
  const [particles, setParticles] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setParticles(prev => {
        const now = Date.now()
        const filtered = prev.filter(p => now - p.created < 3000)
        if (filtered.length < 8) {
          return [...filtered, { id: now + Math.random(), created: now, stage: Math.floor(Math.random() * 4) }]
        }
        return filtered
      })
    }, 400)
    return () => clearInterval(intervalRef.current)
  }, [])

  const stage = stages[activeStage]

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl md:text-2xl font-bold mb-1" style={{fontFamily:'JetBrains Mono, monospace'}}>
        🌊 How Data Flows Through Splunk
      </h2>
      <p className="text-[var(--text-muted)] text-xs md:text-sm mb-4 md:mb-6">Tap each step to learn what happens — explained simply.</p>

      {/* Animated flow path */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 md:p-6 mb-6 overflow-x-auto">
        {/* Mobile: vertical */}
        <div className="md:hidden">
          {stages.map((s, i) => (
            <div key={s.id}>
              <button
                onClick={() => setActiveStage(i)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all mb-2 ${
                  activeStage === i
                    ? 'bg-[' + s.color + ']/15 shadow-lg'
                    : 'border-[var(--border)] bg-[var(--bg-primary)]'
                }`}
                style={activeStage === i ? { borderColor: s.color } : {}}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded" style={{color: s.color, backgroundColor: s.color + '20'}}>STEP {i + 1}</span>
                      <span className="text-sm font-bold">{s.title}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{s.simple}</p>
                  </div>
                </div>
              </button>
              {i < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <line x1="12" y1="0" x2="12" y2="16" stroke={s.color} strokeWidth="2" strokeDasharray="4 2">
                      <animate attributeName="stroke-dashoffset" from="0" to="-6" dur="0.6s" repeatCount="indefinite" />
                    </line>
                    <polygon points="6,16 12,24 18,16" fill={s.color} opacity="0.7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-stretch min-w-[800px]">
          {stages.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => setActiveStage(i)}
                className={`text-left p-4 rounded-xl border-2 transition-all min-w-[160px] ${
                  activeStage === i
                    ? 'bg-[' + s.color + ']/15 shadow-lg'
                    : 'border-[var(--border)] bg-[var(--bg-primary)]'
                }`}
                style={activeStage === i ? { borderColor: s.color } : {}}
              >
                <div className="text-3xl mb-2">{s.emoji}</div>
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded" style={{color: s.color, backgroundColor: s.color + '20'}}>STEP {i + 1}</span>
                <h3 className="text-sm font-bold mt-1">{s.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{s.simple}</p>
              </button>
              {i < stages.length - 1 && (
                <div className="flex items-center px-2 shrink-0">
                  <svg width="48" height="24" viewBox="0 0 48 24">
                    <line x1="0" y1="12" x2="36" y2="12" stroke={s.color} strokeWidth="2.5" strokeDasharray="6 3">
                      <animate attributeName="stroke-dashoffset" from="0" to="-9" dur="0.7s" repeatCount="indefinite" />
                    </line>
                    <polygon points="36,6 48,12 36,18" fill={s.color} opacity="0.7" />
                    {/* Data particles */}
                    <circle r="3" fill={s.color} opacity="0.8">
                      <animateMotion dur="1.5s" repeatCount="indefinite" path="M0,12 L36,12" />
                      <animate attributeName="opacity" values="0;1;1;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle r="2.5" fill={s.color} opacity="0.5">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M0,12 L36,12" begin="0.5s" />
                      <animate attributeName="opacity" values="0;0.7;0.7;0" dur="2s" repeatCount="indefinite" begin="0.5s" />
                    </circle>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="animate-fade-in" key={stage.id}>
        {/* Analogy box */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 md:p-6 mb-4">
          <div className="flex items-start gap-3 md:gap-4">
            <span className="text-4xl md:text-5xl">{stage.emoji}</span>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold mb-2">{stage.title}</h3>
              <p className="text-sm text-[var(--text)] leading-relaxed mb-3">{stage.simple}</p>
              <div className="rounded-xl p-3 md:p-4" style={{backgroundColor: stage.color + '12', border: `1px solid ${stage.color}30`}}>
                <p className="text-xs font-bold mb-1" style={{color: stage.color}}>💡 Think of it like this...</p>
                <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">{stage.analogy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's inside */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 md:p-6">
          <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">What's inside this step</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stage.items.map((item, i) => (
              <div key={i} className="animate-fade-up flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]" style={{animationDelay: `${i * 0.05}s`}}>
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setActiveStage(Math.max(0, activeStage - 1))}
            disabled={activeStage === 0}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)] disabled:opacity-30 transition-all"
          >
            ← Previous
          </button>
          <button
            onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))}
            disabled={activeStage === stages.length - 1}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--accent)] text-black disabled:opacity-30 transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
