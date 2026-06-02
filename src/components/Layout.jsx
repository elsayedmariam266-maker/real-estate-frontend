import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { setDocumentMeta } from '../i18n/i18n'

export default function Layout() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    // SEO-ish metadata per language (no page refresh)
    setDocumentMeta({
      title: t('meta.title'),
      description: t('meta.description'),
    })
  }, [i18n.language, t])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
