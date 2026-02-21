import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

// Mood messages
const moodMessages = {
  sad: [
    "You're not alone.",
    "It's okay to slow down.",
    "You're doing enough.",
    "Breathe. This will pass."
  ],
  neutral: [
    "Keep going gently.",
    "Small steps matter.",
    "Pause. Breathe.",
    "You're present. That's enough."
  ],
  happy: [
    "Let the joy stay.",
    "You're glowing ✨",
    "This moment is yours.",
    "Spread the smile."
  ]
}

const memoryWords = ["Calm", "Joy", "Peace", "Hope", "Smile", "Love", "Focus", "Grateful"]

export default function Games() {
  const [activeTab, setActiveTab] = useState('breathing')
  
  // Breathing state
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState('inhale')
  const [breathCount, setBreathCount] = useState(4)
  
  // Memory state
  const [memoryCards, setMemoryCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [memoryMessage, setMemoryMessage] = useState('')
  
  // Mood state
  const [moodMode, setMoodMode] = useState('calm')
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [currentMood, setCurrentMood] = useState('neutral')
  const [moodMessage, setMoodMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [bubbles, setBubbles] = useState([])
  
  const audioCtxRef = useRef(null)
  const bubbleIntervalRef = useRef(null)

  // Initialize memory game
  useEffect(() => {
    if (activeTab === 'memory') {
      const cards = [...memoryWords, ...memoryWords]
        .sort(() => Math.random() - 0.5)
        .map((word, index) => ({
          id: index,
          word,
          isFlipped: false,
          isMatched: false
        }))
      setMemoryCards(cards)
      setFlippedCards([])
      setMatchedPairs(0)
      setMemoryMessage('')
    }
  }, [activeTab])

  // Breathing exercise
  useEffect(() => {
    let interval
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathCount(prev => {
          if (prev <= 1) {
            // Switch phase
            if (breathingPhase === 'inhale') {
              setBreathingPhase('exhale')
              return 6
            } else {
              setBreathingPhase('inhale')
              return 4
            }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isBreathing, breathingPhase])

  // Memory card flip
  const flipCard = (index) => {
    if (flippedCards.length >= 2) return
    if (memoryCards[index].isFlipped || memoryCards[index].isMatched) return

    const newCards = [...memoryCards]
    newCards[index].isFlipped = true
    setMemoryCards(newCards)

    const newFlipped = [...flippedCards, { index, word: memoryCards[index].word }]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setTimeout(() => {
        if (newFlipped[0].word === newFlipped[1].word) {
          // Match found
          const matchedCards = [...memoryCards]
          matchedCards[newFlipped[0].index].isMatched = true
          matchedCards[newFlipped[1].index].isMatched = true
          setMemoryCards(matchedCards)
          setMatchedPairs(prev => prev + 1)
          setMemoryMessage(newFlipped[0].word)
          
          if (matchedPairs + 1 === memoryWords.length) {
            setMemoryMessage('Well done 💙')
          }
        } else {
          // No match - flip back
          const resetCards = [...memoryCards]
          resetCards[newFlipped[0].index].isFlipped = false
          resetCards[newFlipped[1].index].isFlipped = false
          setMemoryCards(resetCards)
        }
        setFlippedCards([])
      }, 700)
    }
  }

  // Mood bubbles
  const spawnBubble = useCallback(() => {
    const size = moodMode === 'calm' ? Math.random() * 30 + 40 : Math.random() * 40 + 30
    const bubble = {
      id: Date.now(),
      left: Math.random() * (window.innerWidth - size),
      size,
      background: `hsl(${Math.random() * 360}, 70%, 75%)`,
      duration: moodMode === 'calm' ? 10 : 6
    }
    setBubbles(prev => [...prev, bubble])
    
    // Remove bubble after animation
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== bubble.id))
    }, bubble.duration * 1000)
  }, [moodMode])

  useEffect(() => {
    if (activeTab === 'mood') {
      const interval = setInterval(() => {
        spawnBubble()
      }, moodMode === 'calm' ? 1800 : 900)
      bubbleIntervalRef.current = interval
    }
    return () => {
      if (bubbleIntervalRef.current) {
        clearInterval(bubbleIntervalRef.current)
      }
    }
  }, [activeTab, moodMode, spawnBubble])

  const handleBubbleClick = (bubble) => {
    if (soundEnabled) {
      playPop()
    }
    setBubbles(prev => prev.filter(b => b.id !== bubble.id))
    
    // Show message
    const messages = moodMessages[currentMood]
    const text = messages[Math.floor(Math.random() * messages.length)]
    setMoodMessage(text)
    setShowMessage(true)
    
    setTimeout(() => {
      setShowMessage(false)
    }, moodMode === 'calm' ? 2500 : 1600)
  }

  const playPop = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const osc = audioCtxRef.current.createOscillator()
    const gain = audioCtxRef.current.createGain()
    osc.type = 'sine'
    osc.frequency.value = 400
    gain.gain.value = 0.08
    osc.connect(gain)
    gain.connect(audioCtxRef.current.destination)
    osc.start()
    osc.stop(audioCtxRef.current.currentTime + 0.12)
  }

  return (
    <div className="games-body" style={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      {/* Background Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--card)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--card-border)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--muted)',
            color: 'var(--foreground)',
            textDecoration: 'none',
            fontSize: '20px'
          }}>
            <X size={20} />
          </Link>
          <span style={{
            fontWeight: '700',
            fontSize: '1.375rem',
            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Mindful Games</span>
          <div style={{ width: '42px' }}></div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)'
      }}>
        {['breathing', 'memory', 'mood'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.875rem 1.75rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              background: activeTab === tab 
                ? 'linear-gradient(135deg, var(--primary-light), var(--primary))' 
                : 'rgba(167, 139, 250, 0.1)',
              border: '1px solid transparent',
              transition: 'all 0.2s',
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: activeTab === tab ? 'white' : 'var(--muted-foreground)'
            }}
          >
            {tab === 'breathing' && '😤 '}
            {tab === 'memory' && '🧠 '}
            {tab === 'mood' && '💭 '}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Breathing Game */}
      {activeTab === 'breathing' && (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2rem'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Breathing Calm</span>
          </h2>
          <div style={{ position: 'relative', width: '280px', height: '280px', margin: '2rem auto' }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%)',
              animation: isBreathing ? 'pulse-glow 4s ease-in-out infinite' : 'none'
            }}></div>
            <div style={{
              width: '180px',
              height: '180px',
              margin: '30px auto',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fff 0%, var(--primary-light) 50%, var(--secondary) 100%)',
              animation: isBreathing 
                ? (breathingPhase === 'inhale' ? 'breathe-inhale 4s ease-in-out' : 'breathe-exhale 6s ease-in-out')
                : 'none',
              boxShadow: '0 0 40px rgba(167, 139, 250, 0.5), 0 0 80px rgba(103, 232, 249, 0.3)',
              position: 'relative',
              zIndex: 1
            }}></div>
          </div>
          <div style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', marginTop: '1.5rem', lineHeight: 1.6 }}>
            {isBreathing ? (
              <>
                <strong>{breathingPhase === 'inhale' ? 'Inhale' : 'Exhale'}</strong> 
                {' '}as it {breathingPhase === 'inhale' ? 'grows' : 'shrinks'}
                <br />
                <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {breathCount}
                </span>
              </>
            ) : (
              <>
                <strong>Inhale</strong> as it grows • <strong>Exhale</strong> as it shrinks<br />
                <small>Let the rhythm guide you to peace</small>
              </>
            )}
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => { setIsBreathing(true); setBreathingPhase('inhale'); setBreathCount(4) }}
              disabled={isBreathing}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '9999px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                cursor: isBreathing ? 'not-allowed' : 'pointer',
                opacity: isBreathing ? 0.5 : 1
              }}
            >
              Start
            </button>
            <button
              onClick={() => { setIsBreathing(false); setBreathCount(4) }}
              disabled={!isBreathing}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '9999px',
                background: 'var(--muted)',
                color: 'var(--foreground)',
                border: 'none',
                fontWeight: 600,
                cursor: !isBreathing ? 'not-allowed' : 'pointer',
                opacity: !isBreathing ? 0.5 : 1
              }}
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Memory Game */}
      {activeTab === 'memory' && (
        <div style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2rem'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Memory Match</span>
          </h2>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--muted-foreground)' }}>
            {matchedPairs === 0 ? 'Find all matching pairs' : `${matchedPairs} / ${memoryWords.length} pairs found`}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {memoryCards.map((card, index) => (
              <div
                key={index}
                onClick={() => flipCard(index)}
                style={{
                  aspectRatio: '1',
                  perspective: '1000px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                  borderRadius: '1rem'
                }}>
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--primary-light), var(--primary))',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 700
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--card)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--foreground)',
                    fontWeight: 600,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    {card.word}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {memoryMessage && (
            <div style={{
              textAlign: 'center',
              fontSize: '1.75rem',
              marginTop: '2rem',
              fontWeight: 700,
              color: 'var(--primary-dark)',
              animation: 'bounceIn 0.5s ease'
            }}>
              {memoryMessage}
            </div>
          )}
        </div>
      )}

      {/* Mood Game */}
      {activeTab === 'mood' && (
        <div style={{ padding: '2rem 1.5rem', position: 'relative', minHeight: 'calc(100vh - 220px)' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2rem'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Mood Bubbles</span>
          </h2>
          
          {/* Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--card)',
            borderRadius: '1.5rem',
            border: '1px solid var(--card-border)',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            <select
              value={currentMood}
              onChange={(e) => setCurrentMood(e.target.value)}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '9999px',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="neutral">😐 Feeling okay</option>
              <option value="sad">😔 Feeling low</option>
              <option value="happy">😊 Feeling good</option>
            </select>
            <button
              onClick={() => setMoodMode(moodMode === 'calm' ? 'joy' : 'calm')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--foreground)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {moodMode === 'calm' ? 'Calm Mode' : 'Joy Mode'}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: '1px solid var(--border)',
                background: soundEnabled ? 'var(--primary)' : 'var(--card)',
                color: soundEnabled ? 'white' : 'var(--foreground)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sound: {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Bubbles */}
          {bubbles.map(bubble => (
            <div
              key={bubble.id}
              onClick={() => handleBubbleClick(bubble)}
              style={{
                position: 'absolute',
                left: bubble.left,
                bottom: -60,
                width: bubble.size,
                height: bubble.size,
                borderRadius: '50%',
                background: bubble.background,
                boxShadow: '0 0 20px rgba(255,255,255,0.4), inset 0 0 15px rgba(255,255,255,0.2)',
                animation: `floatUp ${bubble.duration}s linear forwards`,
                cursor: 'pointer'
              }}
            />
          ))}

          {/* Message */}
          {showMessage && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--card)',
              backdropFilter: 'blur(16px)',
              padding: '1.5rem 2rem',
              borderRadius: '1.5rem',
              fontSize: '1.375rem',
              textAlign: 'center',
              zIndex: 50,
              border: '1px solid var(--card-border)',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
            }}>
              {moodMessage}
            </div>
          )}

          {/* Helper */}
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted-foreground)' }}>
            ✨ Tap bubbles. No rush. No goals. Just small moments of joy.
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes breathe-inhale {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        @keyframes breathe-exhale {
          0% { transform: scale(1.4); }
          50% { transform: scale(1); }
          100% { transform: scale(1.4); }
        }
        @keyframes floatUp {
          from { transform: translateY(0) rotate(0deg); opacity: 1; }
          to { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
