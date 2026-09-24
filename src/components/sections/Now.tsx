import { motion } from 'framer-motion';
import { nowItems } from '../../data/site';

const EASE = [0.16, 1, 0.3, 1] as const;

const Now = () => (
  <section className="py-12 border-t border-cardBorder">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          Right now
        </h2>
        <p className="flex items-center gap-2 font-mono text-xs text-faint">
          <span className="w-1.5 h-1.5 rounded-full bg-live" aria-hidden="true" />
          fall 2026
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {nowItems.map((block) => (
          <div key={block.label} className="border-t border-cardBorder pt-4">
            <h3 className="font-mono text-xs tracking-[0.18em] text-accent">
              {block.label}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {block.items.map((item) => (
                <li key={item} className="text-sm text-muted">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);

export default Now;
