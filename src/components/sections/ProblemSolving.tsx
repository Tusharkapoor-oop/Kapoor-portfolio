import { motion } from 'motion/react';
import { leetcode } from '../../data/skills';
import { profile } from '../../data/profile';
import { Terminal, Award, Code2, ArrowUpRight } from 'lucide-react';

const ProblemSolving = () => {
  return (
    <section id="problem-solving" className="py-16 border-t border-cardBorder scroll-mt-20">
      <div className="flex items-center gap-4 mb-10">
        <span className="w-8 h-[1px] bg-cardBorder hidden md:block" />
        <h2 className="text-xl font-medium tracking-tight text-foreground">
          Algorithmic Rigor & First-Principles Problem Solving
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14">
        {/* Narrative & Algorithmic Mental Model */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
          className="md:col-span-5 space-y-6 text-muted leading-relaxed text-sm sm:text-base"
        >
          <p>
            Engineering begins long before training models—it starts by taking ambiguous constraints and reducing them into deterministic, verifiable logic.
          </p>
          <p>
            Not every computational challenge demands a neural network. Often the most elegant and resource-conscious solution is an optimal data structure, an efficient traversal, or rigorous asymptotic complexity analysis.
          </p>

          {/* Micro Algorithmic Heuristic */}
          <div className="font-mono text-xs text-foreground bg-card border border-cardBorder p-4 rounded-xl space-y-2">
            <div className="text-muted/60 text-[11px] mb-1">// ALGORITHMIC HEURISTIC</div>
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-accent" />
              <span>01. understand_constraints()</span>
            </div>
            <div className="pl-4 border-l border-cardBorder ml-1.5 py-0.5 text-muted/40 text-[10px]">↓</div>
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-accent" />
              <span>02. decompose_subproblems()</span>
            </div>
            <div className="pl-4 border-l border-cardBorder ml-1.5 py-0.5 text-muted/40 text-[10px]">↓</div>
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-accent" />
              <span>03. implement_and_verify()</span>
            </div>
            <div className="pl-4 border-l border-cardBorder ml-1.5 py-0.5 text-muted/40 text-[10px]">↓</div>
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-accent" />
              <span>04. optimize_complexity()</span>
            </div>
          </div>
        </motion.div>

        {/* LeetCode Verified Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.1 }}
          className="md:col-span-7"
        >
          <div className="p-6 md:p-8 bg-card border border-cardBorder rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-cardBorder/70 pb-4">
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <Code2 size={16} className="text-accent" />
                <span className="uppercase tracking-wider">LeetCode Practice Log</span>
              </div>
              <a
                href={profile.social.leetcode}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground hover:text-accent transition-colors"
              >
                <span>@{leetcode.username}</span>
                <ArrowUpRight size={12} />
              </a>
            </div>

            {/* Total count & difficulty breakdown */}
            <div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl sm:text-5xl font-bold font-mono text-foreground">
                  {leetcode.totalSolved}
                </span>
                <span className="font-mono text-xs text-muted uppercase tracking-wider">
                  Problems Solved
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-background border border-cardBorder">
                  <div className="text-xl font-bold font-mono text-foreground">{leetcode.easy}</div>
                  <div className="text-[11px] font-mono text-muted/70 mt-0.5">Easy</div>
                </div>
                <div className="p-3 rounded-xl bg-background border border-cardBorder">
                  <div className="text-xl font-bold font-mono text-foreground">{leetcode.medium}</div>
                  <div className="text-[11px] font-mono text-muted/70 mt-0.5">Medium</div>
                </div>
                <div className="p-3 rounded-xl bg-background border border-cardBorder">
                  <div className="text-xl font-bold font-mono text-foreground">{leetcode.hard}</div>
                  <div className="text-[11px] font-mono text-muted/70 mt-0.5">Hard</div>
                </div>
              </div>
            </div>

            {/* Languages Breakdown */}
            <div className="space-y-2 pt-2 border-t border-cardBorder/60">
              <div className="text-xs font-mono text-muted/70 flex justify-between">
                <span>Language Breakdown:</span>
                <span className="text-[11px] text-muted/50">C++ primary for speed</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {leetcode.languages.map((lang) => (
                  <span
                    key={lang.name}
                    className="px-2.5 py-1 bg-background border border-cardBorder rounded-md text-xs font-mono text-muted flex items-center gap-2"
                  >
                    <span className="text-foreground font-medium">{lang.name}</span>
                    <span className="text-accent">{lang.solved}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="pt-4 border-t border-cardBorder/60 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-muted/60">Consistency:</span>
              {leetcode.badges.map((badge) => (
                <div
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accentMuted border border-accent/30 text-xs font-mono text-foreground"
                >
                  <Award size={12} className="text-accent" />
                  <span>{badge} Badge</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolving;
