import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App' // Removed '/utils' from the path
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)