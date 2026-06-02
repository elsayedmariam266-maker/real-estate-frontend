import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar' : 'en'

  useEffect(() => {
    // Smoothly transition typography on language flip
    document.documentElement.classList.add('lang-transition')
    const tmr = window.setTimeout(() => {
      document.documentElement.classList.remove('lang-transition')
    }, 260)
    return () => window.clearTimeout(tmr)
  }, [lang])

  return (
    <div className="flex items-center rounded-xl border border-glass bg-glass-muted p-1 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => i18n.changeLanguage('ar')}
        className={[
          'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-theme',
          lang === 'ar'
            ? 'bg-glass-input text-ink'
            : 'text-ink-muted hover:text-ink',
        ].join(' ')}
        aria-pressed={lang === 'ar'}
      >
        {t('language.ar')}
      </button>
      <span className="px-2 text-xs text-ink-faint">{t('language.divider')}</span>
      <button
        type="button"
        onClick={() => i18n.changeLanguage('en')}
        className={[
          'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-theme',
          lang === 'en'
            ? 'bg-glass-input text-ink'
            : 'text-ink-muted hover:text-ink',
        ].join(' ')}
        aria-pressed={lang === 'en'}
      >
        {t('language.en')}
      </button>
    </div>
  )
}

