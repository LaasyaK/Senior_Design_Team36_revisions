import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BottomBar from './bottom_bar.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>

    {/* weave rendering space */}
    <App />

    {/* button collapsible bar */}
    <BottomBar />

  </StrictMode>,
)
