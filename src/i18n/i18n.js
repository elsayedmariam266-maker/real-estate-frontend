import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en/translation.json'
import ar from '../locales/ar/translation.json'

const STORAGE_KEY = 'estate-language'

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'ar') return stored

  const browser = navigator.language?.toLowerCase?.() ?? 'en'
  return browser.startsWith('ar') ? 'ar' : 'en'
}

export function applyLanguageToDom(language) {
  const root = document.documentElement
  root.lang = language
  root.dir = language === 'ar' ? 'rtl' : 'ltr'
}

export function setDocumentMeta({ title, description }) {
  if (title) document.title = title

  if (description) {
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', description)
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

applyLanguageToDom(i18n.language)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  applyLanguageToDom(lng)
})

export default i18n

