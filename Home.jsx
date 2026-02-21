import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Motivational quotes from quotes.md
const quotes = [
  "Your mental health is just as important as your physical health.",
  "It's okay not to be okay.",
  "You are not your mental illness.",
  "Your struggles do not define you.",
  "Taking care of your mental health is an act of self-love.",
  "You are worthy of happiness and peace of mind.",
  "There is no shame in seeking help for your mental health.",
  "It's okay to take a break and prioritize your mental health.",
  "You are not alone in your struggles.",
  "It's okay to ask for support when you need it.",
  "Mental health is not a destination, it's a journey.",
  "Your mental health matters more than any external validation.",
  "Healing is not linear, but it is possible.",
  "You are stronger than you realize.",
  "Your mental health journey is unique to you.",
  "Self-care is not selfish, it's necessary for good mental health.",
  "Small steps can lead to big progress in mental health.",
  "You are capable of overcoming your mental health challenges.",
  "Mental illness is not a personal failure, it's a medical condition.",
  "Your mental health should not be stigmatized.",
  "You are deserving of a life free from mental health struggles.",
  "Your mental health journey may be difficult, but it's worth it.",
  "You are not weak for struggling with mental health issues.",
  "It's okay to take medication for your mental health.",
  "You are not a burden for seeking help for your mental health.",
  "Mental health issues do not make you any less of a person.",
  "Your mental health is just as important as your career or education.",
  "You are capable of managing your mental health and living a fulfilling life.",
  "You have the power to overcome your mental health challenges.",
  "It's okay to take time to focus on your mental health.",
  "You are deserving of love and compassion, especially from yourself.",
  "Your mental health struggles do not define your future.",
  "It's okay to prioritize your mental health over other commitments.",
  "You are not alone in your journey towards better mental health.",
  "You are not your thoughts or emotions.",
  "You are capable of creating a positive mindset and outlook on life.",
  "Mental health recovery is possible, and it starts with seeking help.",
  "You are worthy of a life filled with joy and happiness.",
  "It's okay to have bad days and ask for support when you need it.",
  "You have the power to change your relationship with your mental health.",
  "Your mental health journey may be a lifelong process, but it's worth it.",
  "You are capable of breaking free from negative thought patterns.",
  "Mental health is just as important as physical health when it comes to overall wellness.",
  "You have the power to choose how you respond to your mental health challenges.",
  "It's okay to take time to rest and recharge when you're feeling overwhelmed.",
  "You are not alone in your struggles, even if it feels that way.",
  "Mental health is a journey of self-discovery and growth.",
  "You are worthy of receiving support and love, even on your toughest days.",
  "It's okay to set boundaries to protect your mental health.",
  "You are capable of creating a life filled with purpose and meaning, despite your mental health challenges."
]

export default function Home() {
  const navigate = useNavigate()
  const [dailyQuote, setDailyQuote] = useState('')
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    // Get random quote on mount
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setDailyQuote(quotes[randomIndex])

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    const elements = document.querySelectorAll('.story-card, .function-card, .step-card, .benefit-card, .highlight-card')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setDailyQuote(quotes[randomIndex])
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  const retryVideo = () => {
    setVideoError(false)
  }

  const learnMore = () => {
    document.getElementById('functions')?.scrollIntoView({ behavior: 'smooth' })
  }

  const selectStarter = (index) => {
    const starters = [
      "How do you create a supportive environment?",
      "Strategies for anxiety disorders.",
      "Techniques to address PTSD."
    ]
    alert("This would populate the chat input with: " + starters[index])
  }

  const selectFunction = (index) => {
    console.log("Selected function:", index)
  }

  const stepAction = (step) => {
    alert("Activating step " + step)
  }

  return (
    <>
      <Header />
      
      {/* Background Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  <span className="hero-highlight-text">Psychiatrist AI</span>
                  <br />
                  Mental Wellness Partner
                </h1>
                <p className="hero-subtitle">
                  Hello, How can I assist you on your mental health journey today?
                </p>
                <p className="hero-description">
                  Empowering your mental well-being with 24/7 empathetic, professional AI support designed to listen, guide, and help you grow.
                </p>
              </div>

              <div className="hero-buttons">
                <button className="btn btn-primary btn-large" onClick={() => navigate('/chat')}>
                  Start Conversation
                </button>
                <button className="btn btn-outline btn-large" onClick={learnMore}>
                  Learn More
                </button>
              </div>

              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">💬</div>
                  <span>24/7 Support</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🛡️</div>
                  <span>Private & Safe</span>
                </div>
              </div>
            </div>

            <div className="hero-sidebar">
              <div className="video-container">
                <div className="video-wrapper">
                  {videoError ? (
                    <div className="video-error">
                      <p>Video unavailable</p>
                      <button onClick={retryVideo}>Retry</button>
                    </div>
                  ) : (
                    <video 
                      id="heroVideo" 
                      className="hero-video" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      preload="metadata" 
                      poster="/image.png"
                      onError={handleVideoError}
                    >
                      <source src="/video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <div className="video-overlay"></div>
                  <div className="video-badge">
                    <span>▶</span> AI Companion
                  </div>
                </div>
              </div>

              <div className="starters-section glass">
                <h3 className="starters-title">Conversation Starters</h3>
                <div className="starters-list">
                  <div className="starter-card" onClick={() => selectStarter(0)}>
                    "How do you create a supportive environment?"
                  </div>
                  <div className="starter-card" onClick={() => selectStarter(1)}>
                    "Strategies for anxiety disorders."
                  </div>
                  <div className="starter-card" onClick={() => selectStarter(2)}>
                    "Techniques to address PTSD."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="success-stories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">See how mental health professionals use Mindful Companion.</p>
          </div>
          
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-header">
                <div className="story-info">
                  <h3 className="story-name">Dr. Sara Khan</h3>
                  <p className="story-title">Clinical Psychologist</p>
                </div>
              </div>
              <p className="story-quote">"The immediate response feature has been a game-changer for crisis intervention support between sessions."</p>
              <div className="story-highlight">Best for: Between-session support</div>
            </div>
            
            <div className="story-card">
              <div className="story-header">
                <div className="story-info">
                  <h3 className="story-name">Dr. Mohan Gulati</h3>
                  <p className="story-title">Psychiatrist</p>
                </div>
              </div>
              <p className="story-quote">"The CBT tools integrated into the conversations have shown measurable improvements in patient outcomes."</p>
              <div className="story-highlight">Best for: CBT Reinforcement</div>
            </div>

            <div className="story-card">
              <div className="story-header">
                <div className="story-info">
                  <h3 className="story-name">Dr. Ashoke Sen</h3>
                  <p className="story-title">Researcher</p>
                </div>
              </div>
              <p className="story-quote">"The data-driven insights and pattern recognition capabilities are remarkable for preventive care."</p>
              <div className="story-highlight">Best for: Pattern Recognition</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quotes Section */}
      <section id="quotes" className="quotes-section">
        <div className="container">
          <div className="quote-container glass">
            <div className="quote-icon">✨</div>
            <blockquote className="quote-text">
              {dailyQuote}
            </blockquote>
            <button className="btn btn-outline" onClick={getNewQuote}>
              New Quote
            </button>
          </div>
        </div>
      </section>

      {/* Functions Section */}
      <section id="functions" className="functions">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Core Functions</h2>
            <p>Comprehensive support through evidence-based techniques.</p>
          </div>

          <div className="functions-grid">
            <div className="function-card" onClick={() => selectFunction(0)}>
              <div className="function-icon">❤️</div>
              <h3>Emotional Support</h3>
              <p>Empathetic feedback and coping strategies for overwhelming feelings.</p>
            </div>
            <div className="function-card" onClick={() => selectFunction(1)}>
              <div className="function-icon">🧠</div>
              <h3>CBT Tools</h3>
              <p>Identify and reframe negative thought patterns efficiently.</p>
            </div>
            <div className="function-card" onClick={() => selectFunction(2)}>
              <div className="function-icon">📚</div>
              <h3>Psychoeducation</h3>
              <p>Detailed, accessible information about mental health conditions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section id="how-to-use" className="how-to-use">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Your Journey Starts Here</h2>
            <p>Simple steps to better mental health.</p>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number-container">1</div>
              <div className="step-content-box">
                <h3 className="step-title">Visit and Start</h3>
                <p>No registration required. Just open the chat to begin.</p>
                <button className="btn btn-outline" onClick={() => stepAction(1)}>Get Started →</button>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number-container">2</div>
              <div className="step-content-box">
                <h3 className="step-title">Choose Your Focus</h3>
                <p>Select from Anxiety, Depression, Stress, or General Wellness.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number-container">3</div>
              <div className="step-content-box">
                <h3 className="step-title">Engage & Grow</h3>
                <p>Chat freely. Our AI adapts to your needs and provides actionable insights.</p>
                <button className="btn btn-primary" onClick={() => navigate('/chat')}>Start Chatting</button>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Ready to feel better?</h2>
            <p>Join thousands finding peace with Mindful Companion.</p>
            <button className="btn btn-primary btn-large" onClick={() => navigate('/chat')}>Begin Now</button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
