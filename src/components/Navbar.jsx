import { NavLink } from 'react-router-dom'
import { Building2, Home } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import { useTranslation } from 'react-i18next'

const navLinkClass = ({ isActive }) =>
  [
    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-theme',
    isActive
      ? 'nav-link-active text-ink'
      : 'text-ink-muted nav-link-hover hover:text-ink',
  ].join(' ')

export default function Navbar() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="glass-nav mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-ink transition-opacity duration-theme hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass bg-glass-muted backdrop-blur-sm">
            <Building2 className="h-5 w-5 text-accent" strokeWidth={1.5} />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            Estate
          </span>
        </NavLink>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center gap-1 sm:gap-2">
            <li>
              <NavLink to="/" end className={navLinkClass}>
                <Home className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">{t('nav.home')}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/properties" className={navLinkClass}>
                <Building2 className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">{t('nav.properties')}</span>
              </NavLink>
            </li>
          </ul>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
