import { profile, site } from '../data';

const Footer = () => (
  <footer className="w-full border-t border-cardBorder mt-12 py-10 flex flex-col md:flex-row gap-6 items-center justify-between text-xs font-mono text-muted/60">
    <div className="flex items-center gap-2">
      <span>© {new Date().getFullYear()}</span>
      <span className="text-foreground font-medium">{profile.name}</span>
      <span>·</span>
      <span>{profile.location}</span>
    </div>

    <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer Navigation">
      {site.nav.map((n) => (
        <a
          key={n.href}
          href={n.href}
          className="hover:text-foreground transition-colors"
        >
          {n.label}
        </a>
      ))}
    </nav>

    <div className="flex items-center gap-4">
      <span className="hidden sm:inline text-muted/40">Press ⌘K for menu</span>
      <a
        href="#top"
        className="hover:text-accent transition-colors flex items-center gap-1 text-foreground"
      >
        <span>back to top</span>
        <span>↑</span>
      </a>
    </div>
  </footer>
);

export default Footer;
