import { useTranslation } from 'react-i18next'

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useTranslation()

  return (
    <footer className="mt-auto px-4 pb-6 pt-8 sm:px-6 lg:px-8">
      <div className="glass mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-2xl px-6 py-5 sm:flex-row">
        <p className="text-sm text-ink-muted">
          &copy; {year} Estate. {t('footer.rights')}
        </p>
        <p className="text-xs text-ink-faint">
          {t('footer.tagline')}
        </p>
      </div>
    </footer>
  )
}
