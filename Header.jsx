import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleThemeToggle = (e) => {
    toggleTheme(e.target.checked)
  }

  return (
    <header className="header glass">
      <div className="container header-content">
        <Link to="/" className="header-brand" onClick={closeMobileMenu}>
          <div className="header-logo">
            <img src="/logo.jpg" alt="Mindful Companion Logo" className="logo-image" />
          </div>
          <span className="header-title">Mindful Companion</span>
        </Link>

        <nav className="nav-desktop">
          <Link to="/#understanding">Understanding</Link>
          <Link to="/#functions">Functions</Link>
          <Link to="/#benefits">Benefits</Link>
          <Link to="/#how-to-use">How to Use</Link>
          <Link to="/games">Games</Link>
        </nav>

        <div className="header-actions">
          <div className="jelly-switch-wrapper">
            <input 
              type="checkbox" 
              id="jelly-toggle" 
              className="jelly-checkbox" 
              checked={isDarkMode}
              onChange={handleThemeToggle}
            />
            <label htmlFor="jelly-toggle" className="jelly-label">
              <span className="jelly-ball"></span>
              <span className="icon-sun">☀️</span>
              <span className="icon-moon">🌙</span>
            </label>
          </div>

          <button className="mobile-menu-toggle mobile-only" onClick={toggleMobileMenu}>
            <span className="hamburger">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-nav" style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          background: 'var(--card)',
          borderBottom: '1px solid var(--card-border)',
          padding: '1rem',
          zIndex: 99
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/#understanding" onClick={closeMobileMenu}>Understanding</Link>
            <Link to="/#functions" onClick={closeMobileMenu}>Functions</Link>
            <Link to="/#benefits" onClick={closeMobileMenu}>Benefits</Link>
            <Link to="/#how-to-use" onClick={closeMobileMenu}>How to Use</Link>
            <Link to="/games" onClick={closeMobileMenu}>Games</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
