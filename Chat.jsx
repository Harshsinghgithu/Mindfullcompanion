import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Send, Smile } from 'lucide-react'

const GROQ_API_KEY = "gsk_0IQE4xdKxEalhgrTTY20kashifWGdyb3FYEVdUqj1lm5KyGppURL924oP5"
const MODEL = "llama-3.3-70b-versatile"

const systemPrompt = `You are a calm and supportive mental wellness assistant.
Respond empathetically and provide helpful guidance to users.
When providing advice or tips, always format them as bullet points for better readability.
Keep your responses clear and structured.
Use appropriate emojis in your responses to make them more engaging and friendly.`

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', 
  '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', 
  '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', 
  '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣', '🤗', '🫡', '🤔', '🫢', 
  '🤭', '🤫', '🤥', '😶', '🫠', '😶‍🌫️', '💀', '👻', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', 
  '😿', '😾'
]

const suggestions = [
  "I'm feeling anxious 😰",
  "Stress management tips 🧘",
  "How to improve sleep? 😴",
  "I need motivation 💪"
]

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "system", content: systemPrompt }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const formatResponse = (text) => {
    // Clean up any asterisks from the text
    text = text.replace(/\*\*/g, '')
    return text
  }

  const showTypingIndicator = () => {
    setIsTyping(true)
  }

  const hideTypingIndicator = () => {
    setIsTyping(false)
  }

  const sendMessage = async () => {
    const userMessage = inputValue.trim()
    if (!userMessage) return

    setInputValue('')
    setShowEmojiPicker(false)
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    showTypingIndicator()

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages.concat({ role: "user", content: userMessage }),
          temperature: 0.7,
          max_tokens: 1024,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const botResponse = data.choices[0].message.content

      hideTypingIndicator()
      setMessages(prev => [...prev, { role: "assistant", content: botResponse }])

    } catch (error) {
      hideTypingIndicator()
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I encountered an error. Please try again." 
      }])
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
    sendMessage()
  }

  const addEmoji = (emoji) => {
    setInputValue(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Filter out system prompt from display messages
  const displayMessages = messages.filter(m => m.role !== 'system')

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fae8ff 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '18px 24px',
        textAlign: 'center',
        position: 'relative',
        borderBottom: '1px solid #e5e7eb',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <Link to="/" style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(124, 58, 237, 0.1)',
          color: '#7c3aed',
          borderRadius: '50%',
          textDecoration: 'none',
          transition: 'all 0.2s ease'
        }}>
          <X size={18} />
        </Link>
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          width: '10px',
          height: '10px',
          background: '#10b981',
          borderRadius: '50%',
          boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
        }}></div>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '700',
          margin: 0,
          color: '#7c3aed',
          letterSpacing: '-0.5px'
        }}>Mindful Companion</h1>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '4px'
        }}>Your mental wellness assistant</p>
      </div>
      
      {/* Messages */}
      <div style={{
        flex: 1,
        background: 'transparent',
        padding: '24px',
        overflowY: 'auto',
        scrollBehavior: 'smooth'
      }}>
        {/* Welcome Message */}
        {displayMessages.length === 0 && (
          <div style={{ textAlign: 'center', margin: '20px 0 30px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Hello there! 👋</h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
              I'm here to support your mental wellness journey. How can I help you today?
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#7c3aed',
                    padding: '12px 20px',
                    borderRadius: '24px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {displayMessages.map((message, index) => (
          <div 
            key={index}
            style={{
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'messageAppear 0.3s ease-out'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '16px 20px',
              borderRadius: '18px',
              fontSize: '15px',
              lineHeight: '1.5',
              position: 'relative',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              background: message.role === 'user' ? '#7c3aed' : '#ffffff',
              color: message.role === 'user' ? '#ffffff' : '#1f2937',
              border: message.role === 'bot' ? '1px solid #e5e7eb' : 'none',
              borderBottomRightRadius: message.role === 'user' ? '6px' : '18px',
              borderBottomLeftRadius: message.role === 'bot' ? '6px' : '18px'
            }}>
              {message.content}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            background: '#ffffff',
            borderRadius: '18px',
            width: 'fit-content',
            marginBottom: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#7c3aed',
              borderRadius: '50%',
              margin: '0 4px',
              opacity: 0.6,
              animation: 'typingAnimation 1.4s infinite ease-in-out'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#7c3aed',
              borderRadius: '50%',
              margin: '0 4px',
              opacity: 0.6,
              animation: 'typingAnimation 1.4s infinite ease-in-out',
              animationDelay: '0.2s'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#7c3aed',
              borderRadius: '50%',
              margin: '0 4px',
              opacity: 0.6,
              animation: 'typingAnimation 1.4s infinite ease-in-out',
              animationDelay: '0.4s'
            }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '20px 24px',
        borderTop: '1px solid #e5e7eb',
        position: 'relative',
        flexShrink: 0
      }}>
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            right: '30px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            padding: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '6px',
            width: '300px',
            zIndex: 100,
            border: '1px solid #e5e7eb',
            animation: 'fadeIn 0.2s ease'
          }}>
            {emojis.map((emoji, index) => (
              <span
                key={index}
                onClick={() => addEmoji(emoji)}
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px',
                  textAlign: 'center',
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '24px',
          padding: '0 16px',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              color: '#6b7280',
              transition: 'all 0.2s'
            }}
          >
            <Smile size={20} />
          </button>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            style={{
              flex: 1,
              padding: '14px 0',
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
              outline: 'none',
              color: '#1f2937'
            }}
          />
          <button 
            onClick={sendMessage}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              borderRadius: '50%',
              background: '#7c3aed',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes typingAnimation {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes messageAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

