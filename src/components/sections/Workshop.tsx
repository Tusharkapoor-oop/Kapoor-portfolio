import { motion } from 'framer-motion';
import { workshopRepos } from '../../data/skills';
import { profile } from '../../data/profile';
import { GithubIcon } from '../ui/Icons';
import { FolderGit2, ArrowUpRight, Star } from 'lucide-react';

const Workshop = () => {
  return (
    <section className="py-16 border-t border-cardBorder">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-3">
          <div className="flex items-center gap-4">
            <span className="w-8 h-[1px] bg-cardBorder hidden md:block" />
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              The Workshop
            </h2>
          </div>

          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="group shrink-0 inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-foreground border border-cardBorder bg-card/60 px-3.5 py-1.5 rounded-lg transition-colors"
          >
            <GithubIcon size={14} />
            <span>github/Tusharkapoor-oop</span>
            <ArrowUpRight size={12} className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <p className="max-w-2xl text-muted text-sm sm:text-base leading-relaxed mb-8">
          Most experiments end up here. Not a polished showroom, but a digital workbench—ranging from syllabus planners and computer-vision gesture controllers to cloud prototypes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workshopRepos.map((repo, idx) => (
            <motion.a
              key={repo.name}
              href={`${profile.social.github}/${repo.name}`}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: idx * 0.05 }}
              className="group p-5 rounded-xl bg-card/50 border border-cardBorder hover:border-foreground/30 hover:bg-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-accent">
                    <FolderGit2 size={16} />
                    <span className="font-mono text-xs font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {repo.name}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-muted/40 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                  />
                </div>

                {repo.description ? (
                  <p className="text-xs text-muted leading-relaxed line-clamp-2 mt-1">
                    {repo.description}
                  </p>
                ) : (
                  <p className="text-xs text-muted/60 font-mono italic mt-1">
                    Source repository on GitHub
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-cardBorder/60 flex items-center justify-between text-[11px] font-mono text-muted/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{repo.language || 'Code'}</span>
                </span>
                {repo.stars > 0 && (
                  <span className="flex items-center gap-1 text-accent font-medium">
                    <Star size={11} fill="currentColor" />
                    <span>{repo.stars}</span>
                  </span>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Workshop;
