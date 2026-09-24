import { motion } from 'motion/react';
import { lab } from '../../data/site';
import { profile } from '../../data/profile';

const EASE = [0.16, 1, 0.3, 1] as const;

const Lab = () => {
  return (
    <section id="lab" className="py-12 border-t border-cardBorder scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          The lab
        </h2>
        <p className="mt-3 max-w-2xl text-muted leading-relaxed">
          Unfinished things live here on purpose. Not everything needs to be a
          polished product to be worth keeping.
        </p>

        <ul className="mt-8">
          {lab.map((exp) => (
            <li key={exp.title} className="border-t border-cardBorder last:border-b">
              <a
                href={`${profile.social.github}/${exp.title}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline justify-between gap-4 py-4"
              >
                <span className="font-mono text-sm text-foreground group-hover:text-accent transition-colors">
                  {exp.title}
                </span>
                <span className="text-right text-sm text-faint">{exp.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
};

export default Lab;
