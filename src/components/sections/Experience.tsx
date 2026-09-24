import { motion } from 'framer-motion';
import { experience, leadership } from '../../data/experience';
import { Users, Globe2, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

const Experience = () => {
  return (
    <section id="experience" className="py-16 border-t border-cardBorder scroll-mt-20">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-10">
        <span className="w-8 h-[1px] bg-cardBorder hidden md:block" />
        <h2 className="text-xl font-medium tracking-tight text-foreground">
          Experience & Technical Leadership
        </h2>
      </div>

      {/* Leadership Showcase Grid */}
      <div className="mb-14 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-accent font-semibold tracking-widest uppercase">
            // DOCUMENTED TEAM LEADERSHIP
          </span>
          <span className="font-mono text-[11px] text-muted/60">Agile sprints & cross-timezone coordination</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {leadership.map((item, idx) => {
            const icons = [Users, Users, Globe2];
            const Icon = icons[idx] || Users;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: idx * 0.08 }}
                className="p-5 rounded-2xl bg-card border border-cardBorder hover:border-foreground/30 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-background border border-cardBorder flex items-center justify-center text-accent">
                    <Icon size={15} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{item.label}</h4>
                    <p className="text-[10px] font-mono text-muted/60">0{idx + 1} // Track</p>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed font-mono">
                  {item.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Internship Chapters */}
      <div className="space-y-10">
        <div className="font-mono text-xs text-muted/70 tracking-widest uppercase">
          // INTERNSHIP CHAPTERS
        </div>

        {experience.map((exp, index) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.1 }}
            className="p-6 md:p-8 rounded-2xl bg-card/60 border border-cardBorder space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cardBorder/60 pb-5">
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">{exp.role}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-accent">{exp.company}</span>
                  {exp.company === 'Edunet Foundation' && (
                    <span className="text-xs font-mono text-muted/70">
                      (IBM · Shell · VOIS · VI)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted/70">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>{exp.duration}</span>
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>{exp.location}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Bullets */}
            <ul className="space-y-3 pt-1">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                  <CheckCircle2 size={15} className="text-accent/90 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Tech stack */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-muted/50 mr-1">Stack:</span>
              {exp.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-background border border-cardBorder text-muted/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
