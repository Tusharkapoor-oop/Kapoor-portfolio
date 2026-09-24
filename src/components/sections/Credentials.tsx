import { motion } from 'framer-motion';
import { education, certifications, achievements } from '../../data/credentials';

const EASE = [0.16, 1, 0.3, 1] as const;

const Credentials = () => (
  <section className="py-12 border-t border-cardBorder">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE }}
      className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16"
    >
      <div>
        <h2 className="font-mono text-xs tracking-[0.18em] text-faint">EDUCATION</h2>
        <p className="mt-4 font-display text-xl font-semibold tracking-tight">
          {education.degree}
        </p>
        <p className="mt-1 text-muted">{education.institution}</p>
        <p className="mt-3 font-mono text-xs text-faint leading-loose">
          {education.duration}<br />
          CGPA {education.cgpa} · {education.sgpa}
        </p>

        <h2 className="mt-10 font-mono text-xs tracking-[0.18em] text-faint">PROUD OF</h2>
        <ul className="mt-4 space-y-2">
          {achievements.map((a) => (
            <li key={a} className="text-sm text-muted">
              <span className="text-accent">— </span>{a}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-mono text-xs tracking-[0.18em] text-faint">CERTIFICATIONS</h2>
        <ul className="mt-4">
          {certifications.map((c) => (
            <li key={c} className="border-t border-cardBorder last:border-b py-3 text-sm text-muted">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  </section>
);

export default Credentials;
