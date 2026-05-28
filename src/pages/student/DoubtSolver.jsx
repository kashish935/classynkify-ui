import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosInstance'

const SUGGESTIONS = [
  'Explain gradient descent simply',
  'What is the difference between supervised and unsupervised learning?',
  'How does JWT authentication work?',
  'Give me an example of recursion in Python',
  'What are REST API best practices?',
]

const formatMessage = (text) => {
  // Code block
  const parts = text.split(/(```[\s\S]*?```)/g)
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const lines = part.slice(3).split('\n')
      const lang = lines[0].trim()
      const code = lines.slice(1).join('\n').replace(/```$/, '').trim()
      return (
        <div key={i} style={{
          background: '#0f172a', borderRadius: '10px',
          padding: '14px 16px', margin: '10px 0',
          overflowX: 'auto'
        }}>
          {lang && <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontFamily: 'monospace' }}>{lang}</p>}
          <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '13px', fontFamily: "'Fira Code', 'Cascadia Code', monospace", lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {code}
          </pre>
        </div>
      )
    }
    // Bold
    const bolded = part.split(/(\*\*.*?\*\*)/g).map((b, j) =>
      b.startsWith('**') ? <strong key={j} style={{ color: 'inherit' }}>{b.slice(2, -2)}</strong> : b
    )
    return <span key={i}>{bolded}</span>
  })
}

const Message = ({ msg }) => {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: '12px', alignItems: 'flex-start',
      animation: 'fadeUp 0.3s ease'
    }}>
      {/* Avatar */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
        background: isUser
          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
          : 'linear-gradient(135deg, #f59e0b, #f97316)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isUser ? '14px' : '18px', fontWeight: '700', color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
      }}>
        {isUser ? '👤' : '✨'}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '72%',
        background: isUser
          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
          : '#fff',
        color: isUser ? '#fff' : '#0f172a',
        borderRadius: isUser ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
        padding: '14px 18px',
        fontSize: '14px', lineHeight: 1.7,
        boxShadow: isUser
          ? '0 4px 16px rgba(99,102,241,0.25)'
          : '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        border: isUser ? 'none' : '1px solid #f1f5f9',
      }}>
        {isUser ? msg.content : formatMessage(msg.content)}
        <p style={{
          fontSize: '10px', marginTop: '6px',
          color: isUser ? 'rgba(255,255,255,0.5)' : '#cbd5e1',
          textAlign: isUser ? 'right' : 'left'
        }}>
          {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

const TypingIndicator = () => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #f59e0b, #f97316)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
    }}>✨</div>
    <div style={{
      background: '#fff', borderRadius: '4px 20px 20px 20px',
      padding: '14px 18px', border: '1px solid #f1f5f9',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      display: 'flex', gap: '5px', alignItems: 'center'
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#cbd5e1',
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
        }} />
      ))}
    </div>
  </div>
)

export default function DoubtSolver() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput('')

    const userMsg = { role: 'user', content: q, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await axiosInstance.post('/student/doubt-solver', {
        question: q,
        courseContext: context || undefined
      })
      const answer = res.data?.answer || res.data?.reply || 'Sorry, I could not generate a response.'
      setMessages(prev => [...prev, { role: 'assistant', content: answer, timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I ran into an error. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearChat = () => setMessages([])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      background: '#f8fafc',
      fontFamily: "'DM Sans', system-ui, sans-serif"
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '16px 32px',
        background: '#fff', borderBottom: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
          }}>✨</div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
              AI Doubt Solver
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />
              <p style={{ fontSize: '12px', color: '#64748b' }}>Ready to help · Powered by Gemini</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Context input */}
          <input
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Course context (optional)"
            style={{
              padding: '8px 14px', background: '#f8fafc',
              border: '1.5px solid #e2e8f0', borderRadius: '10px',
              fontSize: '13px', color: '#0f172a', outline: 'none',
              fontFamily: 'inherit', width: '200px', transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#f59e0b'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />

          {messages.length > 0 && (
            <button onClick={clearChat} style={{
              padding: '8px 16px', background: '#f8fafc',
              border: '1.5px solid #e2e8f0', borderRadius: '10px',
              fontSize: '13px', color: '#64748b', cursor: 'pointer',
              fontWeight: '600', fontFamily: 'inherit', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fecaca' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0' }}
            >
              Clear chat
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {messages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '24px' }}>
            {/* Hero */}
            <div>
              <div style={{
                width: '80px', height: '80px', borderRadius: '24px',
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '36px', margin: '0 auto 20px',
                boxShadow: '0 8px 32px rgba(245,158,11,0.3)'
              }}>✨</div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.4px', marginBottom: '8px' }}>
                Ask me anything
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '360px', lineHeight: 1.7 }}>
                Your AI study companion. Get instant answers to course doubts, concepts, and coding questions.
              </p>
            </div>

            {/* Suggestions */}
            <div style={{ width: '100%', maxWidth: '560px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Try asking
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    padding: '12px 18px', background: '#fff',
                    border: '1.5px solid #f1f5f9', borderRadius: '14px',
                    fontSize: '13px', color: '#334155', cursor: 'pointer',
                    textAlign: 'left', fontFamily: 'inherit', fontWeight: '500',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fffbeb' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#fff' }}
                  >
                    <span style={{ color: '#f59e0b', fontSize: '16px' }}>→</span>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: '16px 32px 24px',
        background: '#fff', borderTop: '1px solid #f1f5f9'
      }}>
        <div style={{
          display: 'flex', gap: '12px', alignItems: 'flex-end',
          background: '#f8fafc', border: '1.5px solid #e2e8f0',
          borderRadius: '18px', padding: '10px 12px 10px 18px',
          transition: 'border-color 0.2s',
        }}
        onFocusCapture={e => e.currentTarget.style.borderColor = '#f59e0b'}
        onBlurCapture={e => e.currentTarget.style.borderColor = '#e2e8f0'}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
            }}
            onKeyDown={handleKey}
            placeholder="Type your doubt here… (Enter to send, Shift+Enter for newline)"
            rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              fontSize: '14px', color: '#0f172a', outline: 'none',
              fontFamily: 'inherit', resize: 'none', lineHeight: 1.6,
              maxHeight: '140px', minHeight: '24px'
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
              background: !input.trim() || loading
                ? '#e2e8f0'
                : 'linear-gradient(135deg, #f59e0b, #f97316)',
              border: 'none', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: !input.trim() || loading ? 'none' : '0 4px 12px rgba(245,158,11,0.35)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke={!input.trim() || loading ? '#94a3b8' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22 11 13 2 9l20-7z" stroke={!input.trim() || loading ? '#94a3b8' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p style={{ fontSize: '11px', color: '#cbd5e1', textAlign: 'center', marginTop: '10px' }}>
          AI can make mistakes. Always verify with your instructor.
        </p>
      </div>
    </div>
  )
}