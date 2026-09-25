import { motion } from 'motion/react';
import { Sparkles, Cpu, Users } from 'lucide-react';

const convictions = [
  {
    icon: Sparkles,
    number: '01',
    title: 'The Real World Isn’t Deterministic',
    desc: 'Traditional code operates on if/else certainty. But real-world data—from shifting climate sensors to human biology—is noisy, volatile, and non-linear. The mandate: engineering systems that thrive in probabilistic ambiguity.',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'Models Alone Aren’t Enough',
    desc: 'A neural net in a Jupyter notebook is just a mathematical formula. Real engineering begins when that model connects to high-frequency AWS IoT streams, grounds with 10k+ verified USDA database records, or orchestrates autonomous tool-calling on watsonx.ai.',
  },
  {
    icon: Users,
    number: '03',
    title: 'Code Is Built for People',
    desc: 'Whether coordinating an international team across time zones in Energy-O-Thon or leading an agile squad at Edunet presenting weekly to mentors at IBM and Shell, the ultimate measure of AI is whether it creates actionable, reliable value for people.',
  },
];

const Context = () => {
  return (
    <section id="about" className="py-16 border-t border-cardBorder scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        className="space-y-12"
      >
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <span className="w-8 h-[1px] bg-cardBorder hidden md:block" />
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            The Philosophy: Why Machine Learning & Living Systems
          </h2>
        </div>

        {/* Narrative Essay without the pronoun 'I' */}
        <div className="max-w-3xl space-y-6 text-muted text-base sm:text-lg leading-relaxed font-normal">
          <p>
            Standard software engineering operates on deterministic certainty: write instructions, execute logic, receive an exact output. But reality rarely conforms to a spreadsheet. <span className="text-foreground font-medium">The most vital challenges on Earth—human wellness, climate volatility, fluctuating power grids, and conversational context—refuse to fit into hardcoded if-else statements.</span>
          </p>
          <p>
            Machine learning represents a profound paradigm shift: moving away from dictating answers toward <span className="text-foreground font-medium">engineering architectures that learn directly from raw, chaotic signals</span>. The thrill lies in building software that can perceive subtle correlations, navigate probabilistic ambiguity, and adapt to shifting environments.
          </p>
          <p>
            Long before training deep neural networks, extensive focus on dissecting recursion trees, graph traversals, and dynamic programming in C++ on LeetCode established an unwavering principle: <span className="text-foreground font-medium">artificial intelligence is not sorcery—it is rigorous systems engineering.</span> Real impact requires bridging loss functions with low-latency APIs, resilient cloud infrastructure, and human-centric design.
          </p>
        </div>

        {/* The 3 Core Convictions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {convictions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-card border border-cardBorder hover:border-foreground/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-background border border-cardBorder flex items-center justify-center text-accent">
                      <Icon size={16} />
                    </div>
                    <span className="font-mono text-xs text-accent font-semibold">{item.number} //</span>
                  </div>

                  <h3 className="text-base font-semibold text-foreground tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-cardBorder/60 text-[11px] font-mono text-muted/50">
                  <span>Core Conviction</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Context;
