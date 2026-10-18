import { useEffect } from 'react';
import { director } from './engine/director';
import { Cursor, Hud, Preloader } from './components/Chrome';
import { Hero } from './scenes/Hero';
import { About } from './scenes/About';
import { Work } from './scenes/Work';
import { Journey } from './scenes/Journey';
import { Skills } from './scenes/Skills';
import { Awards } from './scenes/Awards';
import { Contact } from './scenes/Contact';

export default function App() {
  useEffect(() => {
    director.init();
    return () => director.destroy();
  }, []);

  return (
    <>
      <Preloader />
      <Cursor />
      <Hud />
      <main>
        <Hero />
        <About />
        <Work />
        <Journey />
        <Skills />
        <Awards />
        <Contact />
      </main>
    </>
  );
}
