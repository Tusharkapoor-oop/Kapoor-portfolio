import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Command } from 'lucide-react';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Work', href: '#work' },
    { name: 'Experience', href: '#experience' },
    { name: 'About', href: '#about' },
    { name: 'Lab', href: '#lab' },
    { name: 'Connect', href: '#connect' },
  ];

  const handleOpenPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-background/85 backdrop-blur-md border-b border-cardBorder/60 shadow-lg shadow-black/20'
            : 'py-6 bg-transparent'
        }`}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="max-w-5xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a
            href="#top"
            className="font-mono text-sm font-semibold tracking-wider text-foreground hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span>TK</span>
            <span className="text-accent animate-pulse">_</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-mono text-muted hover:text-foreground transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={handleOpenPalette}
              title="Open Command Palette (⌘K / Ctrl+K)"
              className="text-xs font-mono px-2.5 py-1.5 bg-card/80 hover:bg-card border border-cardBorder hover:border-muted/40 rounded text-muted hover:text-foreground transition-all duration-200 flex items-center gap-1.5 group cursor-pointer"
            >
              <Command size={11} className="text-muted group-hover:text-foreground transition-colors" />
              <span className="tracking-widest">K</span>
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={handleOpenPalette}
              aria-label="Open command palette"
              className="p-2 text-muted hover:text-foreground border border-cardBorder rounded bg-card/60"
            >
              <Command size={16} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-muted hover:text-foreground border border-cardBorder rounded bg-card/60"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-background/95 backdrop-blur-xl border-b border-cardBorder p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4 font-mono text-sm">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-muted hover:text-foreground border-b border-cardBorder/40 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
