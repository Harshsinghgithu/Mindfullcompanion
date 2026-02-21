import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="header-brand">
              <img src="/logo.jpg" alt="Logo" className="footer-logo-icon" />
              <span className="header-title">Mindful Companion</span>
            </div>
            <p>AI-powered mental health support providing empathetic guidance and accessible assistance 24/7.</p>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <Link to="/#understanding" style={{ textDecoration: 'none', color: 'var(--muted-foreground)' }}>Understanding</Link>
              <Link to="/#functions" style={{ textDecoration: 'none', color: 'var(--muted-foreground)' }}>Functions</Link>
              <Link to="/#benefits" style={{ textDecoration: 'none', color: 'var(--muted-foreground)' }}>Benefits</Link>
              <Link to="/games" style={{ textDecoration: 'none', color: 'var(--muted-foreground)' }}>Games</Link>
            </div>
          </div>

          <div className="footer-disclaimer">
            <h3>Important Notice</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '1rem' }}>Mindful Companion is an AI assistant. It does not replace professional therapy. If you are in crisis, please contact emergency services immediately.</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2025 Mindful Companion AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
