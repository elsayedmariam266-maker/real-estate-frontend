import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const { i18n } = useTranslation()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        i18n.language === 'ar'
          ? isDark
            ? 'التبديل إلى الوضع الفاتح'
            : 'التبديل إلى الوضع الداكن'
          : isDark
            ? 'Switch to light mode'
            : 'Switch to dark mode'
      }
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass bg-glass-muted text-ink-muted backdrop-blur-sm transition-all duration-theme hover:border-accent/30 hover:bg-glass-input hover:text-ink"
    >
      {isDark ? (
        <Sun className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.5} />
      )}
    </button>
  )
}
