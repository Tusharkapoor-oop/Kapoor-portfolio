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

function App() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground flex flex-col items-center relative">

      {/* Scholar backdrop — static, no blend mode (blend forces repaint on scroll) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('${import.meta.env.BASE_URL}scholar_full_bg.jpg')`,
            transform: 'translateZ(0)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
      </div>

      <Navigation />
      <CommandPalette />

      <main className="w-full max-w-5xl px-6 md:px-12 pt-24 pb-12 space-y-32 relative z-10">
        <Hero />
        <div id="about"><Context /></div>
        <Now />
        <div id="work"><Projects /></div>
        <div id="projects" className="sr-only" aria-hidden="true" />
        <div id="experience"><Experience /></div>
        <ProblemSolving />
        <div id="lab"><Lab /></div>
        <Workshop />
        <Skills />
        <Credentials />
        <div id="connect"><Contact /></div>
        <div id="contact" className="sr-only" aria-hidden="true" />
        <Footer />
      </main>
    </div>
  );
}

export default App;
