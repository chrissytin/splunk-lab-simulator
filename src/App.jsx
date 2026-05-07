import { useState, useEffect, useCallback, useRef } from 'react'
import { components, confFiles, concepts, scenarios, quizQuestions } from './data/splunkData'
import ArchitectureView from './components/ArchitectureView'
import ConfExplorer from './components/ConfExplorer'
import LearningMode from './components/LearningMode'
import Scenarios from './components/Scenarios'
import Quiz from './components/Quiz'
import SearchResults from './components/SearchResults'

const tabs = [
  { id: 'architecture', label: 'Architecture', icon: '🏗️' },
  { id: 'conf', label: '.conf Explorer', icon: '📄' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'scenarios', label: 'Scenarios', icon: '🧪' },
  { id: 'quiz', label: 'Quiz', icon: '✅' },
]

function App() {
  const [activeTab, setActiveTab] = useState('architecture')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef(null)

  const handleSearch = useCallback((q) => {
    if (!q.trim()) { setShowSearch(false); return }
    setSearchQuery(q)
    setShowSearch(true)
  }, [])

  const navigateTo = useCallback((tab, detail) => {
    setActiveTab(tab)
    setShowSearch(false)
    setSearchQuery('')
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setShowSearch(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🟢</span>
            <span className="font-bold text-sm tracking-wide" style={{fontFamily:'JetBrains Mono, monospace'}}>Splunk Lab</span>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === t.id
                    ? 'bg-[var(--accent)] text-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <span className="mr-1">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="relative">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search… ⌘K"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              style={{fontFamily:'JetBrains Mono, monospace'}}
            />
            {showSearch && (
              <SearchResults query={searchQuery} navigateTo={navigateTo} />
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'conf' && <ConfExplorer />}
        {activeTab === 'learning' && <LearningMode />}
        {activeTab === 'scenarios' && <Scenarios />}
        {activeTab === 'quiz' && <Quiz />}
      </main>
    </div>
  )
}

export default App
