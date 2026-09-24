import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile } from '../../data/profile';
import { Search, ArrowRight, CornerDownLeft, ExternalLink, Mail, FileText } from 'lucide-react';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, []);

  const commands = [
    {
      name: 'Go to Work / Case Studies',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        window.location.hash = '#work';
        setIsOpen(false);
      },
    },
    {
      name: 'Go to Experience & Leadership',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        window.location.hash = '#experience';
        setIsOpen(false);
      },
    },
    {
      name: 'Go to About / Context',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        window.location.hash = '#about';
        setIsOpen(false);
      },
    },
    {
      name: 'Go to Problem Solving / LeetCode',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        const el = document.getElementById('problem-solving');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      name: 'Go to The Lab',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        window.location.hash = '#lab';
        setIsOpen(false);
      },
    },
    {
      name: 'Connect / Contact',
      category: 'Navigation',
      icon: Mail,
      action: () => {
        window.location.hash = '#connect';
        setIsOpen(false);
      },
    },
    {
      name: 'Copy Email Address',
      category: 'Action',
      icon: Mail,
      action: () => {
        navigator.clipboard.writeText(profile.email);
        setIsOpen(false);
      },
    },
    {
      name: 'Open GitHub Profile',
      category: 'External',
      icon: ExternalLink,
      action: () => {
        window.open(profile.social.github, '_blank');
        setIsOpen(false);
      },
    },
    {
      name: 'Open LinkedIn Profile',
      category: 'External',
      icon: ExternalLink,
      action: () => {
        window.open(profile.social.linkedin, '_blank');
        setIsOpen(false);
      },
    },
    {
      name: 'Open LeetCode Profile',
      category: 'External',
      icon: ExternalLink,
      action: () => {
        window.open(profile.social.leetcode, '_blank');
        setIsOpen(false);
      },
    },
    {
      name: 'Request Official Resume (Email)',
      category: 'Action',
      icon: FileText,
      action: () => {
        window.location.href = `mailto:${profile.email}?subject=Resume%20Request%20-%20Tushar%20Kapoor`;
        setIsOpen(false);
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="w-full max-w-xl bg-card border border-cardBorder rounded-xl shadow-2xl z-[101] overflow-hidden"
            onKeyDown={handleKeyDownList}
          >
            <div className="p-4 border-b border-cardBorder flex items-center gap-3">
              <Search size={16} className="text-muted/60" />
              <input
                type="text"
                placeholder="Type a command or jump to section..."
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted/50 font-mono text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 border border-cardBorder rounded text-muted/60">
                ESC
              </kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2 space-y-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.name}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs md:text-sm font-mono transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-accentMuted text-foreground border-l-2 border-accent pl-4'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={14} className={isSelected ? 'text-accent' : 'text-muted/60'} />
                        <span>{cmd.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted/50 uppercase tracking-wider">{cmd.category}</span>
                        {isSelected && <CornerDownLeft size={12} className="text-accent" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-muted font-mono text-xs">
                  No matching commands found.
                </div>
              )}
            </div>

            <div className="p-3 border-t border-cardBorder bg-background/50 flex justify-between items-center text-[11px] font-mono text-muted/60">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1 border border-cardBorder rounded text-[10px]">↑</kbd>
                <kbd className="px-1 border border-cardBorder rounded text-[10px]">↓</kbd>
                <span>to navigate</span>
                <span className="mx-1.5">·</span>
                <kbd className="px-1 border border-cardBorder rounded text-[10px]">↵</kbd>
                <span>to select</span>
              </span>
              <span>Tushar Kapoor // Digital Home</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
