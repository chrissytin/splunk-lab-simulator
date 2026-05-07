import { useState } from 'react'

const useCases = [
  {
    id: 'phishing',
    title: 'Phishing Detection',
    icon: '🎣',
    severity: 'High',
    color: '#ef4444',
    simple: 'Someone sends a fake email pretending to be your boss, trying to steal your password. ES spots the trick.',
    story: 'Sarah gets an email that looks like it\'s from her CEO asking her to "verify her login" on a fake website. She almost clicks it. But ES noticed the email came from a suspicious address and the link points to a known bad website. ES rings the alarm BEFORE Sarah clicks.',
    how: [
      { step: '1', emoji: '📧', text: 'Email gateway logs show a message from an unknown sender' },
      { step: '2', emoji: '🔗', text: 'ES checks the link against threat intel — it\'s a known phishing site!' },
      { step: '3', emoji: '🚨', text: 'Notable event fires: "Phishing email detected"' },
      { step: '4', emoji: '🛑', text: 'Security team blocks the email before Sarah sees it' },
    ],
    spl: 'index=email sourcetype="mail" | search sender=*@suspicious.com OR url=*phishing-site.com',
    soar: '🤖 SOAR auto-blocks the sender domain, quarantines the email from all inboxes, and notifies the security team via Slack.'
  },
  {
    id: 'suspicious-login',
    title: 'Suspicious Login',
    icon: '🔑',
    severity: 'High',
    color: '#f59e0b',
    simple: 'Someone logs into your account from a different country at 3am. That\'s weird. ES notices.',
    story: 'Dave works in Melbourne and logs in every day at 9am. Suddenly, his account logs in from Russia at 3am. Dave is asleep — someone stole his password! ES sees the impossible travel and locks the account.',
    how: [
      { step: '1', emoji: '🌍', text: 'Login log shows Dave\'s account from Melbourne at 5pm' },
      { step: '2', emoji: '✈️', text: '30 minutes later, same account logs in from Russia — impossible travel!' },
      { step: '3', emoji: '🚨', text: 'ES correlation search fires: "Impossible travel detected"' },
      { step: '4', emoji: '🔒', text: 'Account is locked, Dave gets a phone call to verify' },
    ],
    spl: 'index=security action=login | iplocation src_ip | stats count by user, City, Country | where Country!="Australia"',
    soar: '🤖 SOAR auto-locks the account, forces a password reset, and sends the user a verification text message.'
  },
  {
    id: 'ransomware',
    title: 'Ransomware Activity',
    icon: '☠️',
    severity: 'Critical',
    color: '#ef4444',
    simple: 'A virus locks all the files on a computer and demands money. ES catches it early before it spreads.',
    story: 'A teacher accidentally opens a bad attachment. The virus starts encrypting files — first 10, then 100, then 1000. ES sees files being renamed with weird extensions and raises the alarm. The infected computer is cut off the network before the virus spreads to other teachers.',
    how: [
      { step: '1', emoji: '📎', text: 'User opens a suspicious email attachment' },
      { step: '2', emoji: '📁', text: 'Hundreds of files are being renamed with .locked extension' },
      { step: '3', emoji: '🚨', text: 'ES fires: "Mass file encryption — possible ransomware!"' },
      { step: '4', emoji: '🔌', text: 'Network team disconnects the computer immediately' },
    ],
    spl: 'index=security sourcetype=win_security EventCode=4663 | stats count by host, file_path | where count > 100',
    soar: '🤖 SOAR auto-isolates the computer from the network, blocks the malware\'s communication, and creates an emergency ticket.'
  },
  {
    id: 'insider-threat',
    title: 'Insider Threat',
    icon: '🤫',
    severity: 'Medium',
    color: '#f59e0b',
    simple: 'An employee who\'s about to quit downloads a lot of secret files. ES spots the unusual behavior.',
    story: 'Tom is leaving the company next week. He starts downloading customer lists, financial reports, and product plans — way more than normal. ES notices Tom\'s data downloads are 10x higher than usual and alerts the security team. They have a chat with Tom before the data walks out the door.',
    how: [
      { step: '1', emoji: '📊', text: 'Tom\'s risk score slowly increases — he\'s downloading more files than usual' },
      { step: '2', emoji: '📈', text: 'ES sees Tom\'s risk score jump from 20 to 85 (danger zone!)' },
      { step: '3', emoji: '🚨', text: 'ES fires: "Employee risk score exceeded threshold"' },
      { step: '4', emoji: '👥', text: 'HR and security talk to Tom, restrict his access' },
    ],
    spl: 'index=security action=file_download | stats sum(file_size) as total_mb by user | where total_mb > 500',
    soar: '🤖 SOAR auto-restricts the user\'s file access, flags their account for monitoring, and alerts HR.'
  },
  {
    id: 'network-anomaly',
    title: 'Unusual Network Traffic',
    icon: '🌐',
    severity: 'High',
    color: '#8b5cf6',
    simple: 'A computer is sending way too much data to a weird website. It might be stealing secrets. ES catches it.',
    story: 'A laptop starts sending 5GB of data to an unknown server in another country at 2am. No one is using the laptop. ES sees the unusual traffic spike and flags it. Turns out, malware was quietly sending company data to hackers.',
    how: [
      { step: '1', emoji: '📤', text: 'Firewall logs show 5GB uploaded to an unknown IP at 2am' },
      { step: '2', emoji: '❓', text: 'ES checks — this IP isn\'t on any approved list' },
      { step: '3', emoji: '🚨', text: 'ES fires: "Large data transfer to unknown destination"' },
      { step: '4', emoji: '🧹', text: 'Malware is found and removed, the data leak is stopped' },
    ],
    spl: 'index=network action=allowed | stats sum(bytes) as total_bytes by src_ip, dest_ip | where total_bytes > 5000000000',
    soar: '🤖 SOAR auto-blocks the destination IP at the firewall, isolates the infected laptop, and starts a forensic investigation.'
  },
  {
    id: 'soar-overview',
    title: 'How SOAR Responds',
    icon: '🤖',
    severity: 'Auto',
    color: '#06b6d4',
    simple: 'When ES rings the alarm, SOAR is the robot that immediately takes action — no waiting for a human to wake up.',
    story: 'It\'s 3am and ES detects a ransomware attack. Without SOAR, someone has to wake up, log in, find the infected computer, and block it — that takes 30 minutes. With SOAR, the infected computer is automatically cut off the network in 30 seconds. The robot doesn\'t sleep.',
    how: [
      { step: '1', emoji: '🚨', text: 'ES detects a threat and creates a notable event' },
      { step: '2', emoji: '🤖', text: 'SOAR picks up the alert and checks the playbook' },
      { step: '3', emoji: '⚡', text: 'SOAR auto-blocks the bad IP, locks the account, isolates the PC' },
      { step: '4', emoji: '📋', text: 'SOAR opens a case, notifies the team, and logs what it did' },
    ],
    spl: '| rest /services/saved/searches | search action.notable=1 | table title, actions'
  }
]

export default function ESUseCases() {
  const [activeCase, setActiveCase] = useState(0)
  const [showSPL, setShowSPL] = useState(false)
  const uc = useCases[activeCase]

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl md:text-2xl font-bold mb-1" style={{fontFamily:'JetBrains Mono, monospace'}}>
        🛡️ ES in Action — Real-World Threats
      </h2>
      <p className="text-[var(--text-muted)] text-xs md:text-sm mb-4 md:mb-6">Tap a threat to see how Enterprise Security catches it.</p>

      {/* Case selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap mb-4">
        {useCases.map((u, i) => (
          <button
            key={u.id}
            onClick={() => { setActiveCase(i); setShowSPL(false) }}
            className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
              activeCase === i
                ? 'border-[' + u.color + '] shadow-lg'
                : 'border-[var(--border)] bg-[var(--bg-card)]'
            }`}
            style={activeCase === i ? { borderColor: u.color, backgroundColor: u.color + '15' } : {}}
          >
            <span className="text-lg">{u.icon}</span>
            <span className="font-semibold whitespace-nowrap">{u.title}</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{color: u.color, backgroundColor: u.color + '20'}}>
              {u.severity}
            </span>
          </button>
        ))}
      </div>

      {/* Story card */}
      <div className="animate-fade-in bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 md:p-6 mb-4" key={uc.id}>
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <span className="text-4xl md:text-5xl">{uc.icon}</span>
          <div>
            <h3 className="text-lg md:text-xl font-bold">{uc.title}</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{uc.simple}</p>
          </div>
        </div>

        {/* The story */}
        <div className="rounded-xl p-3 md:p-4 mb-4" style={{backgroundColor: uc.color + '10', border: `1px solid ${uc.color}25`}}>
          <p className="text-xs font-bold mb-1" style={{color: uc.color}}>📖 The Story</p>
          <p className="text-xs md:text-sm text-[var(--text)] leading-relaxed">{uc.story}</p>
        </div>

        {/* Step by step */}
        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">How ES catches it — step by step</h4>
        <div className="space-y-2">
          {uc.how.map((h, i) => (
            <div key={i} className="flex items-start gap-3 animate-fade-up" style={{animationDelay: `${i * 0.08}s`}}>
              <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{backgroundColor: uc.color + '20', color: uc.color}}>
                {h.emoji}
              </div>
              <p className="text-sm text-[var(--text)] pt-0.5 leading-relaxed">{h.text}</p>
            </div>
          ))}
        </div>

        {/* SPL query */}
        <div className="mt-4">
          <button
            onClick={() => setShowSPL(!showSPL)}
            className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            {showSPL ? '▼' : '▶'} Show the Splunk search that finds this
          </button>
          {showSPL && (
            <pre className="code-block mt-2 text-[10px] md:text-xs animate-fade-in">{uc.spl}</pre>
          )}
        </div>

        {/* SOAR auto-response */}
        {uc.soar && (
          <div className="mt-4 rounded-xl p-3 md:p-4" style={{backgroundColor: '#06b6d415', border: '1px solid #06b6d430'}}>
            <p className="text-xs font-bold mb-1" style={{color: '#06b6d4'}}>🤖 SOAR Auto-Response</p>
            <p className="text-xs md:text-sm text-[var(--text)] leading-relaxed">{uc.soar}</p>
          </div>
        )}
      </div>

      {/* Visual: ES detection flow */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 md:p-6">
        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">How ES Detects Threats</h4>
        <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-1">
          {[
            { emoji: '📡', label: 'Data flows in', color: '#3b82f6' },
            { emoji: '🎯', label: 'ES checks the rules', color: '#f59e0b' },
            { emoji: '🔗', label: 'Connects the dots', color: '#8b5cf6' },
            { emoji: '🚨', label: 'Alarm rings!', color: '#ef4444' },
            { emoji: '🤖', label: 'SOAR takes action', color: '#06b6d4' },
            { emoji: '👤', label: 'Analyst reviews', color: '#65A637' },
          ].map((step, i, arr) => (
            <div key={i} className="flex md:flex-col items-center gap-2 md:gap-1 flex-1">
              <div className="flex items-center gap-2 md:flex-col md:gap-1 w-full">
                <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl" style={{backgroundColor: step.color + '20', border: `2px solid ${step.color}40`}}>
                  {step.emoji}
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-center leading-tight">{step.label}</span>
              </div>
              {i < arr.length - 1 && (
                <svg className="hidden md:block shrink-0" width="20" height="20" viewBox="0 0 20 20">
                  <line x1="0" y1="10" x2="12" y2="10" stroke={step.color} strokeWidth="2" strokeDasharray="3 2">
                    <animate attributeName="stroke-dashoffset" from="0" to="-5" dur="0.5s" repeatCount="indefinite" />
                  </line>
                  <polygon points="12,6 20,10 12,14" fill={step.color} opacity="0.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
