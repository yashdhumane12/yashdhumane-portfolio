import { useStore } from '../store';
import { PERSON } from '../content';
import Magnetic from './Magnetic';

const LINKS = [
  { href: '#about',      label: 'About'      },
  { href: '#experience', label: 'Experience' },
  { href: '#skills',     label: 'Skills'     },
  { href: '#projects',   label: 'Projects'   },
  { href: '#homelab',    label: 'Homelab'    },
  { href: '#contact',    label: 'Contact'    },
];

export default function Nav() {
  const section = useStore(s => s.section);
  const sectionMap: Record<string, number> = {
    about: 1, experience: 2, skills: 3, projects: 4, homelab: 5, contact: 6,
  };

  return (
    <nav className="nav" role="navigation">
      <a href="#hero" className="nav-logo">
        <span className="nav-logo-dot" aria-hidden />
        YD.sys
      </a>
      <div className="nav-links">
        {LINKS.map(l => (
          <Magnetic key={l.href} strength={0.22}>
            <a
              href={l.href}
              className={section === sectionMap[l.href.slice(1)] ? 'active' : ''}
            >
              {l.label}
            </a>
          </Magnetic>
        ))}
      </div>
      <Magnetic strength={0.28}>
        <a href={PERSON.resume} download className="nav-resume">
          Resume ↓
        </a>
      </Magnetic>
    </nav>
  );
}
