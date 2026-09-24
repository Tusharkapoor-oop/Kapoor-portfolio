import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, projectFilters } from '../../data/projects';
import { Activity, ChevronDown, ChevronUp, Database, Users, Calendar, Sparkles, Terminal } from 'lucide-react';

const projectNarratives: Record<
  string,
  {
    motivation: string;
    engineeringDetails: string;
    takeaway: string;
  }
> = {
  'nutrition-assistant': {
    motivation:
      'Standard fitness applications provide static caloric totals that ignore real environmental factors like regional heat, humidity, and biological individuality. The objective: construct an autonomous agent capable of reasoning through live ambient context (location, weather) alongside personal constraints to generate dynamic dietary plans.',
    engineeringDetails:
      'To anchor the Llama model and prevent hallucinated nutritional facts, over 10,000 verified USDA food items were structured and indexed in MySQL. The agent on IBM watsonx.ai orchestrates deterministic tool-calling, integrates live weather endpoints, and serves personalized recommendations through a responsive Streamlit interface.',
    takeaway:
      'Prompting alone is fragile in production. Dependable agentic systems demand structured schema enforcement, deterministic database grounding, and explicit fallback rules.',
  },
  'ecosphere': {
    motivation:
      'Industrial facilities frequently react to environmental hazards only after catastrophic thresholds trigger alarms. The mandate: engineer an intelligent platform that flags subtle sensor anomalies in real time before critical failures occur.',
    engineeringDetails:
      'Directing a team of 5 members as Team Lead, the telemetry pipeline streams physical air quality, temperature, and humidity sensor readings directly into AWS IoT Core. A TensorFlow anomaly detection model evaluates rolling sliding windows, storing events in MySQL and alerting plant operators via a real-time Streamlit HUD. Presented at the K.R. Mangalam University AI Showcase in March 2025.',
    takeaway:
      'Edge networks drop packets and raw hardware sensors produce erratic noise. Implementing local batching and signal-smoothing filters prior to AWS ingestion proved vital to eliminating false alarms.',
  },
  'energy-o-thon': {
    motivation:
      'Commercial buildings squander gigawatt-hours due to uncoordinated heating and power cycles. The objective: build an automated energy optimization engine under strict international hackathon constraints in November 2025.',
    engineeringDetails:
      'Serving as International Team Lead coordinating a distributed team across conflicting time zones. Engineered a Flask REST backend hosting TensorFlow consumption models that forecast energy peaks and output specific reduction strategies through an interactive Streamlit dashboard within the competition deadline.',
    takeaway:
      'Fast-paced distributed sprints depend on strict API contracts frozen on day one. Establishing clear Flask REST request/response schemas allowed the machine learning and frontend sub-teams to build concurrently with zero blocking.',
  },
  'business-data': {
    motivation:
      'Enterprise data repositories are notoriously fragmented, incomplete, and noisy. The objective: extract statistically valid, actionable business decisions from extensive real-world datasets.',
    engineeringDetails:
      'Ingested over 50,000 records across 3 independent UCI Machine Learning Repository datasets. Rigorous exploratory data analysis using Python (Pandas, NumPy) and R surfaced 12 core operational insights and powered an automated inventory reorder recommendation engine via Flask.',
    takeaway:
      'Eighty percent of data engineering is exploratory hygiene. No machine learning model compensates for flawed data collection; rigorous feature validation in Pandas and R was where actionable business value was unlocked.',
  },
};

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('nutrition-assistant');

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'ALL') return true;
    return p.categories.includes(activeFilter as any);
  });

  return (
    <section id="work" className="py-16 border-t border-cardBorder scroll-mt-20">
      {/* Header without pronoun I */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <span className="w-8 h-[1px] bg-cardBorder hidden md:block" />
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              Selected Systems & Case Studies
            </h2>
          </div>
          <p className="font-mono text-xs text-muted/70">
            Autonomous agents, real-time IoT anomaly pipelines, and cloud ML architectures
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-card/60 border border-cardBorder rounded-xl">
          {projectFilters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                  isActive ? 'text-foreground font-semibold' : 'text-muted hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-project-filter"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="absolute inset-0 bg-accentMuted border border-foreground/20 rounded-lg shadow-sm"
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Showcase */}
      <div className="space-y-16">
        {filteredProjects.map((project, idx) => {
          const isExpanded = expandedId === project.id;
          const narrative = projectNarratives[project.id];

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ type: 'spring', stiffness: 90, damping: 20, delay: idx * 0.05 }}
              className="bg-card/50 border border-cardBorder rounded-2xl p-6 sm:p-8 hover:border-foreground/25 transition-all duration-300"
            >
              {/* Title & Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-accent">0{idx + 1} //</span>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted/80 mt-2">
                    <span className="text-accent font-medium">{project.type}</span>
                    {project.role && (
                      <span className="flex items-center gap-1 text-foreground font-medium bg-background px-2 py-0.5 rounded border border-cardBorder">
                        <Users size={12} className="text-accent" />
                        <span>{project.role}</span>
                      </span>
                    )}
                    {project.duration && (
                      <span className="flex items-center gap-1 text-muted/60">
                        <Calendar size={12} />
                        <span>{project.duration}</span>
                      </span>
                    )}
                    {project.dataset && (
                      <span className="flex items-center gap-1 text-muted/60">
                        <Database size={12} />
                        <span>{project.dataset}</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-cardBorder bg-background hover:bg-card text-xs font-mono text-foreground hover:border-foreground/40 transition-all self-start cursor-pointer"
                >
                  <span>{isExpanded ? 'Collapse Story' : 'Read Inside Story'}</span>
                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              </div>

              {/* Summary */}
              <p className="text-muted text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
                {project.description}
              </p>

              {/* Architecture Flow Diagram */}
              <div className="my-6 p-5 rounded-xl bg-background border border-cardBorder">
                <div className="flex items-center justify-between text-xs font-mono text-muted/60 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Activity size={13} className="text-accent" />
                    <span>SYSTEM ARCHITECTURE DATAFLOW</span>
                  </span>
                  <span className="text-[11px] text-muted/40 hidden sm:inline">Execution Flow</span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
                  {project.architecture.map((step, stepIdx) => (
                    <Fragment key={step}>
                      <div className="w-full md:w-auto flex-1">
                        <div className="px-3 py-2 rounded-lg border border-cardBorder bg-card text-center text-xs font-mono text-foreground/90 hover:border-accent hover:text-accent transition-all cursor-default select-none">
                          <span className="block truncate">{step}</span>
                        </div>
                      </div>
                      {stepIdx < project.architecture.length - 1 && (
                        <>
                          <span className="hidden md:inline text-muted/40 text-xs px-1 select-none">→</span>
                          <span className="md:hidden text-muted/40 text-xs py-0.5 select-none">↓</span>
                        </>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-mono text-muted/50 mr-1">Stack:</span>
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-background border border-cardBorder text-muted/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Expanded Narrative Story without pronoun I */}
              <AnimatePresence>
                {isExpanded && narrative && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    className="overflow-hidden mt-6 pt-6 border-t border-cardBorder space-y-6 text-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 bg-background/60 p-4 rounded-xl border border-cardBorder/60">
                        <div className="font-mono text-xs text-accent font-semibold uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles size={12} />
                          <span>The Problem & Motivation</span>
                        </div>
                        <p className="text-muted leading-relaxed text-xs sm:text-sm">
                          {narrative.motivation}
                        </p>
                      </div>

                      <div className="space-y-2 bg-background/60 p-4 rounded-xl border border-cardBorder/60">
                        <div className="font-mono text-xs text-accent font-semibold uppercase tracking-wider flex items-center gap-1.5">
                          <Terminal size={12} />
                          <span>The Engineering Architecture</span>
                        </div>
                        <p className="text-muted leading-relaxed text-xs sm:text-sm">
                          {narrative.engineeringDetails}
                        </p>
                      </div>
                    </div>

                    <div className="bg-background/60 p-4 rounded-xl border border-cardBorder/60 space-y-2">
                      <div className="font-mono text-xs text-accent font-semibold uppercase tracking-wider">
                        Key Lesson & Technical Insight
                      </div>
                      <p className="text-muted/90 italic font-sans leading-relaxed text-xs sm:text-sm">
                        "{narrative.takeaway}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
