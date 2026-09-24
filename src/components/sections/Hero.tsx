import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import { ArrowDown, Mail, Code2, MapPin, Clock, Sparkles } from 'lucide-react';

const Hero = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-8 pb-16 min-h-[80vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        className="space-y-8"
      >
        {/* Status bar: Location, Local Time, Availability */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-cardBorder">
            <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
            <span className="text-foreground font-medium">Available for Summer 2026 Internships</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/60 border border-cardBorder/70 text-muted/80">
            <MapPin size={12} className="text-accent" />
            <span>New Delhi, India</span>
            <span className="text-muted/40">·</span>
            <Clock size={11} className="text-muted/60" />
            <span>{time ? `${time} IST` : 'IST'}</span>
          </div>
        </div>

        {/* Narrative & personal headline without the pronoun 'I' */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-accent font-mono text-sm tracking-wide">
            <Sparkles size={14} />
            <span>Tushar Kapoor // Applied AI & Systems Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
            Engineering systems that reason through real-world complexity.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted leading-relaxed font-normal pt-2">
            Deterministic software only solves the problems already predicted. But human wellness, fluctuating power grids, and high-frequency sensor streams are probabilistic and volatile. True computational power begins where hardcoded rules end: building intelligent architectures that observe, adapt, and turn ambiguous data into dependable action.
          </p>
        </div>

        {/* Quick Social & Connection Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-cardBorder hover:border-foreground/30 text-xs font-mono text-foreground hover:text-white transition-all group"
          >
            <GithubIcon size={15} />
            <span>github/Tusharkapoor-oop</span>
            <span className="text-muted/50 group-hover:text-accent transition-colors">↗</span>
          </a>

          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-cardBorder hover:border-foreground/30 text-xs font-mono text-foreground hover:text-white transition-all group"
          >
            <LinkedinIcon size={15} />
            <span>linkedin/in/tushar-kapoor</span>
            <span className="text-muted/50 group-hover:text-accent transition-colors">↗</span>
          </a>

          <a
            href={profile.social.leetcode}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-cardBorder hover:border-foreground/30 text-xs font-mono text-foreground hover:text-white transition-all group"
          >
            <Code2 size={15} className="text-accent" />
            <span>leetcode/tusharkapoor66</span>
            <span className="text-muted/50 group-hover:text-accent transition-colors">↗</span>
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-cardBorder/60">
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-mono text-xs font-semibold hover:bg-white transition-all shadow-md"
          >
            <span>Explore Built Systems</span>
            <ArrowDown size={14} />
          </a>

          <a
            href="#connect"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-cardBorder hover:border-foreground/30 text-foreground font-mono text-xs font-medium transition-all"
          >
            <Mail size={14} className="text-accent" />
            <span>Start A Conversation</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
