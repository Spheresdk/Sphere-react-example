import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SphereProvider } from 'sphere-connect'
import { SPHERE_CONFIG } from './config/sphere'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SphereProvider config={SPHERE_CONFIG}>
      <App />
    </SphereProvider>
  </StrictMode>,
)
