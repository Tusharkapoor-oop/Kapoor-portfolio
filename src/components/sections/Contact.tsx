import { useState } from 'react';
import { motion } from 'motion/react';
import { profile } from '../../data/profile';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import { Copy, Check, Mail, Code2, ArrowUpRight, MessageSquare, Briefcase, Sparkles } from 'lucide-react';

const contactOptions = [
  {
    icon: Briefcase,
    label: 'Discuss Internship (Summer 2026)',
    subject: 'Summer 2026 Internship Opportunity — Tushar Kapoor',
    body: 'Hi Tushar,\n\nI reviewed your portfolio and would like to connect regarding an AI/ML engineering opportunity...',
  },
  {
    icon: Sparkles,
    label: 'Hackathon or Research Collab',
    subject: 'Collaboration / Hackathon Inquiry',
    body: 'Hey Tushar,\n\nI saw your work on EcoSphere and Energy-O-Thon, and wanted to talk about collaborating on...',
  },
  {
    icon: MessageSquare,
    label: 'Casual Tech & AI Discussion',
    subject: 'Saying hi from your portfolio',
    body: 'Hi Tushar,\n\nJust came across your portfolio. Would love to chat about...',
  },
];

const Contact = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCopyPhone = () => {
    if (profile.phone) {
      navigator.clipboard.writeText(profile.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    }
  };

  return (
    <section id="connect" className="py-20 border-t border-cardBorder min-h-[60vh] flex flex-col justify-center scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        className="max-w-3xl space-y-10"
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-4">
          <span className="w-8 h-[1px] bg-cardBorder hidden md:block" />
          <span className="font-mono text-xs text-accent font-semibold tracking-widest uppercase">
            // LET'S CONNECT
          </span>
        </div>

        {/* Narrative Call to Action */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Let's build something worth talking about.
          </h2>
          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl font-normal">
            Whether evaluating an AI/ML engineering candidate for Summer 2026, brainstorming an agentic system architecture, or exploring difficult computational problems—dialogue is always welcomed. Every message receives a thoughtful response.
          </p>
        </div>

        {/* Quick Conversation Starters (Direct Email Templates) */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-muted/70 flex items-center gap-2">
            <Mail size={13} className="text-accent" />
            <span>PICK A CONVERSATION STARTER:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {contactOptions.map((opt) => {
              const Icon = opt.icon;
              const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
                opt.subject
              )}&body=${encodeURIComponent(opt.body)}`;

              return (
                <a
                  key={opt.label}
                  href={mailtoUrl}
                  className="p-4 rounded-xl bg-card border border-cardBorder hover:border-foreground/30 hover:bg-card/80 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={16} className="text-accent" />
                    <ArrowUpRight
                      size={13}
                      className="text-muted/40 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                  <span className="text-xs font-mono text-foreground font-medium group-hover:text-white transition-colors">
                    {opt.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Direct Contact Badges (Email & Phone) */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* Email button */}
          <div className="flex items-center">
            <button
              onClick={handleCopyEmail}
              title="Click to copy email address"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-cardBorder hover:border-foreground/40 transition-all cursor-pointer group"
            >
              <div className="text-left font-mono text-xs sm:text-sm">
                <span className="text-muted/60 text-[10px] block">DIRECT EMAIL CONTACT</span>
                <span className="text-foreground group-hover:text-white font-medium">{profile.email}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-background border border-cardBorder text-muted group-hover:text-foreground transition-colors ml-2">
                {copiedEmail ? <Check size={14} className="text-live" /> : <Copy size={14} />}
              </div>
            </button>
          </div>

          {/* Phone button */}
          {profile.phone && (
            <div className="flex items-center">
              <button
                onClick={handleCopyPhone}
                title="Click to copy phone number"
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-cardBorder hover:border-foreground/40 transition-all cursor-pointer group"
              >
                <div className="text-left font-mono text-xs sm:text-sm">
                  <span className="text-muted/60 text-[10px] block">PHONE / WHATSAPP</span>
                  <span className="text-foreground group-hover:text-white font-medium">{profile.phone}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-background border border-cardBorder text-muted group-hover:text-foreground transition-colors ml-2">
                  {copiedPhone ? <Check size={14} className="text-live" /> : <Copy size={14} />}
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Social Profiles Grid */}
        <div className="pt-4 border-t border-cardBorder/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/60 border border-cardBorder hover:border-foreground/30 text-xs font-mono text-muted hover:text-foreground transition-colors"
            >
              <GithubIcon size={14} />
              <span>GitHub (@Tusharkapoor-oop)</span>
              <ArrowUpRight size={11} className="opacity-50" />
            </a>

            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/60 border border-cardBorder hover:border-foreground/30 text-xs font-mono text-muted hover:text-foreground transition-colors"
            >
              <LinkedinIcon size={14} />
              <span>LinkedIn (Tushar Kapoor)</span>
              <ArrowUpRight size={11} className="opacity-50" />
            </a>

            <a
              href={profile.social.leetcode}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/60 border border-cardBorder hover:border-foreground/30 text-xs font-mono text-muted hover:text-foreground transition-colors"
            >
              <Code2 size={14} className="text-accent" />
              <span>LeetCode (tusharkapoor66)</span>
              <ArrowUpRight size={11} className="opacity-50" />
            </a>
          </div>

          <div className="font-mono text-xs text-muted/50">
            <span>New Delhi, India · UTC+5:30</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
