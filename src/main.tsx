import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, anchors: true, syncTouch: true }}>
        <App />
      </ReactLenis>
    </MotionConfig>
  </StrictMode>,
)
