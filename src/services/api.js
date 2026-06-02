import axios from 'axios'
import i18n from '../i18n/i18n'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

function getActiveLanguage() {
  const lng = i18n.language
  return lng === 'ar' ? 'ar' : 'en'
}

// Attach Accept-Language on every request.
api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {}
  config.headers['Accept-Language'] = getActiveLanguage()
  return config
})

// Keep defaults in sync (useful for devtools / non-intercepted calls).
i18n.on('languageChanged', () => {
  api.defaults.headers.common['Accept-Language'] = getActiveLanguage()
})

export async function fetchProperties(params) {
  const { data } = await api.get('/properties', { params })
  return data
}

export async function fetchPropertyBySlug(slug) {
  const { data } = await api.get(`/properties/${slug}`)
  return data.data ?? data
}

export async function submitEnquiry(propertyId, enquiryData) {
  const response = await api.post(
    `/properties/${propertyId}/enquiries`,
    enquiryData,
  )
  return response
}

export default api
