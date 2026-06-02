import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Building2, MapPin, Maximize2 } from 'lucide-react'
import { fetchProperties } from '../services/api'
import { useTranslation } from 'react-i18next'
import {
  formatListingType,
  formatTotalArea,
  getPropertyImages,
} from '../utils/propertyFormat'

const FALLBACK_PROPERTY_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000'

function formatPrice(property) {
  if (property.formatted_price) return property.formatted_price
  if (property.price == null) return '—'
  const currency = property.currency ?? ''
  const amount = Number(property.price).toLocaleString()
  return currency ? `${currency} ${amount}` : amount
}

function ListingBadge({ listingType }) {
  const label = formatListingType(listingType)
  if (!label) return null

  const isRent = listingType === 'rent'

  return (
    <span
      className={[
        'absolute left-3 top-3 z-10 rounded-lg border px-2.5 py-1 text-xs font-medium backdrop-blur-md',
        isRent
          ? 'border-violet-400/25 bg-violet-500/15 text-violet-200'
          : 'border-accent/25 bg-accent/15 text-accent-hover',
      ].join(' ')}
    >
      {label}
    </span>
  )
}

function PropertyCardSkeleton() {
  return (
    <article className="glass overflow-hidden rounded-2xl">
      <div className="aspect-[4/3] animate-pulse bg-glass-shimmer" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-glass-shimmer" />
        <div className="h-3 w-1/2 animate-pulse rounded-md bg-glass-shimmer" />
        <div className="flex gap-3">
          <div className="h-3 w-16 animate-pulse rounded-md bg-glass-shimmer" />
          <div className="h-3 w-12 animate-pulse rounded-md bg-glass-shimmer" />
        </div>
        <div className="h-4 w-24 animate-pulse rounded-md bg-glass-shimmer" />
      </div>
    </article>
  )
}

function PropertyCard({ property }) {
  const { t, i18n } = useTranslation()
  const images = getPropertyImages(property)
  const cover = images[0] ?? null
  const areaLabel = formatTotalArea(property.total_area)
  const lang = i18n.language === 'ar' ? 'ar' : 'en'

  function handleImageError(e) {
    if (e.currentTarget.src !== FALLBACK_PROPERTY_IMAGE) {
      e.currentTarget.src = FALLBACK_PROPERTY_IMAGE
    }
  }

  return (
    <Link
      to={`/properties/${property.slug}`}
      className="glass group block overflow-hidden rounded-2xl backdrop-blur-glass transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_16px_48px_rgba(124,156,255,0.14)] dark:hover:shadow-[0_16px_48px_rgba(124,156,255,0.14)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-glass bg-glass-muted">
        <ListingBadge listingType={property.listing_type} />
        <img
          src={cover || FALLBACK_PROPERTY_IMAGE}
          onError={handleImageError}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-md border border-glass bg-overlay-panel px-2 py-0.5 text-[10px] font-medium text-ink-muted backdrop-blur-md">
            {t('properties.photosMore', { count: images.length - 1 })}
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-5">
        <h2 className="font-medium tracking-tight text-ink line-clamp-2">
          {property.title}
        </h2>
        {property.city && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{property.city}</span>
          </p>
        )}
        {(property.bedrooms != null || areaLabel) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-faint">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                {Number(property.bedrooms).toLocaleString(lang)}{' '}
                {t('property.bedroom', { count: Number(property.bedrooms) })}
              </span>
            )}
            {areaLabel && (
              <span className="flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                {areaLabel}
              </span>
            )}
          </div>
        )}
        <p className="mt-3 text-sm font-medium text-accent">
          {formatPrice(property)}
        </p>
      </div>
    </Link>
  )
}

export default function Properties() {
  const { t, i18n } = useTranslation()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetchProperties()
        if (!cancelled) {
          setProperties(response.data ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.data?.message ??
            err.message ??
            t('properties.unableToLoad')
          setError(message)
          setProperties([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [i18n.language])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {t('properties.title')}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {t('properties.subtitle')}
        </p>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="glass-card max-w-lg border-red-500/20">
          <p className="text-sm font-medium text-red-300/90">
            {t('properties.unableToLoad')}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{error}</p>
          <p className="mt-3 text-xs text-ink-faint">
            Ensure the Laravel API is running and{' '}
            <code className="rounded bg-glass-muted px-1.5 py-0.5 font-mono text-ink-muted">
              VITE_API_BASE_URL
            </code>{' '}
            points to your backend (e.g. http://localhost:8000/api).
          </p>
        </div>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="glass-card max-w-lg">
          <p className="text-sm text-ink-muted">{t('properties.noFound')}</p>
        </div>
      )}

      {!loading && !error && properties.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  )
}
