import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { skills, skillGroups, skillLinks } from '../../data/skills';
import { Layers, Sparkles } from 'lucide-react';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const activeLink = hoveredSkill ? skillLinks.find((s) => s.skill === hoveredSkill) : null;

  return (
    <section className="py-16 border-t border-cardBorder">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-4">
          <span className="w-8 h-[1px] bg-cardBorder hidden md:block" />
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Technical Ecosystem & Core Toolchain
          </h2>
        </div>

        {/* Live Reactive Pill */}
        <div className="h-7 flex items-center">
          <AnimatePresence mode="wait">
            {activeLink ? (
              <motion.div
                key={activeLink.skill}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accentMuted border border-accent/40 font-mono text-xs text-foreground"
              >
                <Sparkles size={11} className="text-accent" />
                <span>{activeLink.skill} →</span>
                <span className="text-accent font-medium">{activeLink.projects.slice(0, 2).join(', ')}</span>
              </motion.div>
            ) : (
              <div className="font-mono text-xs text-muted/60 flex items-center gap-1.5">
                <Layers size={12} className="opacity-60" />
                <span>hover a tool to see project lineage</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="font-mono text-xs text-muted/60 mb-10">
        Organized by system lifecycle phase · zero arbitrary percentage bars
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
        {skillGroups.map((group, idx) => (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}
            className="space-y-3"
          >
            <div className="border-b border-cardBorder/60 pb-2">
              <h3 className={`text-xs font-mono font-semibold uppercase tracking-widest ${['text-gold', 'text-teal', 'text-rose', 'text-violet', 'text-gold', 'text-teal', 'text-rose', 'text-violet'][idx % 8]}`}>
                0{idx + 1} // {group.title}
              </h3>
              <p className="text-[11px] font-mono text-muted/50 mt-0.5">{group.hint}</p>
            </div>

            <ul className="space-y-1.5 pt-1">
              {skills[group.key].map((skill) => {
                const hasLink = skillLinks.some((s) => s.skill === skill);
                const isHovered = hoveredSkill === skill;
                return (
                  <li
                    key={skill}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={`text-sm font-mono cursor-pointer transition-all duration-150 flex items-center justify-between py-1 px-1.5 rounded-md ${
                      isHovered
                        ? 'text-foreground bg-card border border-foreground/20 pl-2.5 font-medium'
                        : hasLink
                        ? 'text-muted hover:text-foreground'
                        : 'text-muted/70 hover:text-foreground'
                    }`}
                  >
                    <span>{skill}</span>
                    {hasLink && (
                      <span className={`w-1 h-1 rounded-full ${isHovered ? 'bg-accent' : 'bg-muted/30'}`} />
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
