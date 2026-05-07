import { useState } from 'react'
import { quizQuestions } from '../data/splunkData'

export default function Quiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = quizQuestions[current]

  const handleAnswer = (i) => {
    if (showResult) return
    setSelected(i)
    setShowResult(true)
    if (i === q.correct) setScore(s => s + 1)
  }

  const next = () => {
    if (current + 1 >= quizQuestions.length) {
      setFinished(true)
    } else {
      setCurrent(current + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  const restart = () => {
    setCurrent(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100)
    return (
      <div className="animate-fade-in max-w-lg mx-auto text-center py-12">
        <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete</h2>
        <p className="text-4xl font-bold text-[var(--accent)] font-mono mb-2">{score} / {quizQuestions.length}</p>
        <p className="text-[var(--text-muted)] mb-6">
          {pct >= 80 ? 'Excellent! You know your Splunk.' : pct >= 60 ? 'Good start — review the sections you missed.' : 'Keep learning! Go through Learning Mode and try again.'}
        </p>
        <button
          onClick={restart}
          className="px-6 py-3 rounded-xl bg-[var(--accent)] text-black font-bold text-sm hover:brightness-110 transition-all"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{fontFamily:'JetBrains Mono, monospace'}}>Quiz</h2>
        <span className="text-sm text-[var(--text-muted)] font-mono">
          {current + 1} / {quizQuestions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 bg-[var(--bg-card)] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / quizQuestions.length) * 100}%` }}
        />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 animate-fade-in" key={current}>
        <h3 className="text-lg font-bold mb-5">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let cls = 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)]'
            if (showResult) {
              if (i === q.correct) cls = 'border-[var(--accent)] bg-[var(--accent)]/15'
              else if (i === selected) cls = 'border-[var(--accent-error)] bg-[var(--accent-error)]/15'
              else cls = 'border-[var(--border)] opacity-50'
            } else if (i === selected) {
              cls = 'border-[var(--accent)] bg-[var(--accent)]/10'
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${cls}`}
              >
                <span className="font-mono text-[var(--text-dim)] mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className="mt-4 animate-fade-in">
            <div className={`p-4 rounded-lg ${selected === q.correct ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/30' : 'bg-[var(--accent-error)]/10 border border-[var(--accent-error)]/30'}`}>
              <p className="text-sm font-semibold mb-1">{selected === q.correct ? '✅ Correct!' : '❌ Not quite'}</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{q.explanation}</p>
            </div>
            <button
              onClick={next}
              className="mt-4 px-5 py-2 rounded-lg bg-[var(--accent)] text-black text-sm font-bold hover:brightness-110 transition-all"
            >
              {current + 1 >= quizQuestions.length ? 'See Results' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
