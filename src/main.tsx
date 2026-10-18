import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'

// Respect the user's OS motion preference: skip smooth scrolling when reduced motion is on
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.08, smoothWheel: !prefersReducedMotion, anchors: true }}>
        <App />
      </ReactLenis>
    </MotionConfig>
  </StrictMode>,
)
