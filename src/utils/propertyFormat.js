import i18n from 'i18next'

export function formatListingType(listingType) {
  if (!listingType) return null
  if (listingType === 'sale') return i18n.t('listing.sale')
  if (listingType === 'rent') return i18n.t('listing.rent')
  return i18n.t('listing.other', { type: listingType })
}

export function formatTotalArea(totalArea) {
  if (totalArea == null || totalArea === '') return null
  const lang = i18n.language === 'ar' ? 'ar' : 'en'
  const amount = Number(totalArea).toLocaleString(lang)
  return i18n.t('units.areaSqFt', { value: amount })
}

export function getPropertyImages(property) {
  const urls = property?.image_urls
  if (Array.isArray(urls) && urls.length > 0) {
    return urls.filter(Boolean)
  }
  if (property?.image_url) return [property.image_url]
  return []
}

export function getVideoEmbedUrl(url) {
  if (!url) return null

  try {
    const parsed = new URL(url)

    if (
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname.includes('youtube-nocookie.com')
    ) {
      const videoId = parsed.searchParams.get('v')
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
      const pathId = parsed.pathname.split('/').filter(Boolean).pop()
      if (pathId && pathId !== 'embed') {
        return `https://www.youtube.com/embed/${pathId}`
      }
    }

    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.replace('/', '')
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    if (parsed.hostname.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop()
      if (id) return `https://player.vimeo.com/video/${id}`
    }

    if (parsed.pathname.includes('/embed')) {
      return url
    }
  } catch {
    return url
  }

  return url
}
