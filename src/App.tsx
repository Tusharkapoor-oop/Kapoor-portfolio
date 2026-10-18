import { lazy, Suspense, useState } from 'react';
import Navigation from './components/ui/Navigation';
import CommandPalette from './components/ui/CommandPalette';
import Hero from './components/sections/Hero';
import Context from './components/sections/Context';
import Now from './components/sections/Now';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import ProblemSolving from './components/sections/ProblemSolving';
import Lab from './components/sections/Lab';
import Workshop from './components/sections/Workshop';
import Skills from './components/sections/Skills';
import Credentials from './components/sections/Credentials';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/ui/CustomCursor';
import Loader from './components/ui/Loader';
import { Layers } from 'lucide-react';

// Three.js is heavy — split it into its own chunk so first paint stays fast
const Background3D = lazy(() => import('./components/Background3D'));

function App() {
  const [showShapes, setShowShapes] = useState(true);

  return (
    <div id="top" className="min-h-screen bg-background text-foreground flex flex-col items-center relative">
      
      <Loader />
      <CustomCursor />
      
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setShowShapes(!showShapes)}
        aria-label="Toggle 3D background shapes"
        aria-pressed={showShapes}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-card/80 backdrop-blur-md border border-cardBorder text-muted hover:text-accent hover:border-accent/50 transition-all shadow-lg"
        title="Toggle 3D Floating Shapes"
      >
        <Layers size={20} className={showShapes ? 'opacity-100' : 'opacity-40'} />
      </button>

      <Suspense fallback={null}>
        <Background3D showShapes={showShapes} />
      </Suspense>

      <Navigation />
      <CommandPalette />

      <main className="w-full max-w-5xl px-6 md:px-12 pt-24 pb-12 space-y-32 relative z-10">
        <Hero />
        <Context />
        <Now />
        <Projects />
        <div id="projects" className="sr-only" aria-hidden="true" />
        <Experience />
        <ProblemSolving />
        <Lab />
        <Workshop />
        <Skills />
        <Credentials />
        <Contact />
        <div id="contact" className="sr-only" aria-hidden="true" />
        <Footer />
      </main>
    </div>
  );
}

export default App;
