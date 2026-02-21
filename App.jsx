import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Games from './pages/Games'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/games" element={<Games />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
