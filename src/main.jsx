import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%', color: '#f1f5f9' }}>
      <App />
    </div>
  </StrictMode>,
)
