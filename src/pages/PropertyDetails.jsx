import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Maximize2,
  MessageSquare,
  Phone,
  Tag,
  User,
  X,
} from 'lucide-react'
import { fetchPropertyBySlug, submitEnquiry } from '../services/api'
import {
  formatListingType,
  formatTotalArea,
  getPropertyImages,
  getVideoEmbedUrl,
} from '../utils/propertyFormat'
import { useTranslation } from 'react-i18next'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

function formatPrice(property) {
  if (property?.formatted_price) return property.formatted_price
  if (property?.price == null) return '—'
  const currency = property.currency ?? ''
  const amount = Number(property.price).toLocaleString()
  return currency ? `${currency} ${amount}` : amount
}

function ListingTypeBadge({ listingType, className = '', size = 'md' }) {
  const label = formatListingType(listingType)
  if (!label) return null

  const isRent = listingType === 'rent'
  const sizeClass =
    size === 'lg'
      ? 'px-4 py-2 text-sm'
      : 'px-3 py-1.5 text-xs sm:text-sm'

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-lg border font-medium backdrop-blur-md shadow-glass',
        sizeClass,
        isRent
          ? 'border-violet-400/30 bg-violet-500/15 text-violet-200'
          : 'border-accent/30 bg-accent/15 text-accent-hover',
        className,
      ].join(' ')}
    >
      <Tag className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
      {label}
    </span>
  )
}

function ListingStatCard({ listingType }) {
  const { t } = useTranslation()
  const label = formatListingType(listingType)
  if (!label) return null

  return (
    <div className="glass flex flex-col justify-center rounded-xl border border-glass p-4 backdrop-blur-glass">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">
        {t('propertyDetails.listing')}
      </span>
      <div className="mt-3">
        <ListingTypeBadge listingType={listingType} size="lg" />
      </div>
    </div>
  )
}

function PropertyDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-4 w-32 animate-pulse rounded-md bg-glass-shimmer" />
      <div className="glass aspect-[16/9] min-h-[280px] animate-pulse rounded-2xl bg-glass-shimmer" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-20 shrink-0 animate-pulse rounded-lg bg-glass-shimmer"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-8 w-2/3 animate-pulse rounded-md bg-glass-shimmer" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="glass h-20 animate-pulse rounded-xl bg-glass-muted"
              />
            ))}
          </div>
          <div className="glass h-40 animate-pulse rounded-2xl bg-glass-muted" />
        </div>
        <div className="glass h-64 animate-pulse rounded-2xl bg-glass-muted" />
      </div>
    </div>
  )
}

function ImageGallery({ property }) {
  const { t } = useTranslation()
  const images = getPropertyImages(property)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [property.id])

  const goTo = useCallback(
    (index) => {
      if (images.length === 0) return
      setActiveIndex((index + images.length) % images.length)
    },
    [images.length],
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    if (images.length <= 1) return undefined

    function onKeyDown(event) {
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [images.length, goPrev, goNext])

  const activeImage = images[activeIndex]
  const hasMultiple = images.length > 1

  return (
    <section className="glass overflow-hidden rounded-2xl border border-glass-strong shadow-glass backdrop-blur-glass">
      <div className="group/gallery relative aspect-[16/9] min-h-[240px] w-full overflow-hidden bg-glass-muted sm:min-h-[420px]">
        {activeImage ? (
          <img
            key={activeImage}
            src={activeImage}
            alt={`${property.title} — image ${activeIndex + 1}`}
            className="h-full w-full object-cover transition-all duration-500 ease-out group-hover/gallery:scale-[1.01]"
          />
        ) : (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 sm:min-h-[420px]">
            <Building2 className="h-16 w-16 text-ink-faint" strokeWidth={1} />
            <p className="text-sm text-ink-faint">{t('gallery.noImages')}</p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas via-canvas/25 to-transparent" />

        <div className="absolute left-4 top-4 z-10">
          <ListingTypeBadge listingType={property.listing_type} size="lg" />
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-glass bg-overlay-panel text-ink backdrop-blur-md transition-all hover:border-accent/30 hover:bg-overlay-panel hover:shadow-[0_0_24px_rgba(124,156,255,0.15)]"
              aria-label={t('gallery.previousImage')}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-glass bg-overlay-panel text-ink backdrop-blur-md transition-all hover:border-accent/30 hover:bg-overlay-panel hover:shadow-[0_0_24px_rgba(124,156,255,0.15)]"
              aria-label={t('gallery.nextImage')}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <span className="absolute right-4 top-4 z-10 rounded-lg border border-glass bg-overlay-panel px-2.5 py-1 text-xs font-medium tabular-nums text-ink-muted backdrop-blur-md">
              {activeIndex + 1} / {images.length}
            </span>
            <div className="absolute bottom-24 left-0 right-0 z-10 flex justify-center gap-1.5 px-4 sm:bottom-28">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={[
                    'h-1.5 rounded-full border border-glass backdrop-blur-sm transition-all',
                    index === activeIndex
                      ? 'w-6 bg-accent/80'
                      : 'w-1.5 bg-glass-shimmer hover:bg-glass-input',
                  ].join(' ')}
                  aria-label={t('gallery.goToImage', { number: index + 1 })}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {property.title}
          </h1>
          {(property.full_address || property.city) && (
            <p className="mt-2 text-sm text-ink-muted sm:text-base">
              {property.full_address ?? property.city}
            </p>
          )}
        </div>
      </div>

      {hasMultiple && (
        <div className="border-t border-glass bg-glass-muted p-3 backdrop-blur-md sm:p-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-20 sm:w-28',
                  index === activeIndex
                    ? 'border-accent/50 ring-1 ring-accent/30'
                    : 'border-glass opacity-70 hover:border-glass-strong hover:opacity-100',
                ].join(' ')}
                aria-label={t('gallery.viewImage', { number: index + 1 })}
                aria-current={index === activeIndex}
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function DetailStat({ icon: Icon, label, value }) {
  if (value == null || value === '') return null

  return (
    <div className="glass rounded-xl border border-glass p-4 backdrop-blur-glass">
      <div className="flex items-center gap-2 text-ink-faint">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-ink">{value}</p>
    </div>
  )
}

function PropertyVideo({ videoUrl }) {
  const { t } = useTranslation()
  const embedUrl = getVideoEmbedUrl(videoUrl)
  if (!embedUrl) return null

  return (
    <section className="glass-card">
      <h2 className="text-sm font-medium uppercase tracking-wider text-ink-faint">
        {t('propertyDetails.videoTour')}
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        {t('propertyDetails.videoTourSubtitle')}
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-glass-strong bg-black/30 shadow-glass backdrop-blur-sm">
        <div className="relative aspect-video w-full">
          <iframe
            src={embedUrl}
            title="Property video tour"
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  )
}

function EnquiryModal({ property, onClose }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setFieldErrors({})

    try {
      const response = await submitEnquiry(property.id, form)
      if (response.status === 201) {
        setSuccess(true)
        setForm(EMPTY_FORM)
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors)
      } else {
        setError(
          err.response?.data?.message ??
            err.message ??
            'Failed to send enquiry. Please try again.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-glass bg-glass-input px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint backdrop-blur-sm transition-colors duration-theme focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-overlay-scrim backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div className="glass relative z-10 w-full max-w-md rounded-2xl border border-glass-strong p-6 shadow-glass backdrop-blur-glass sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-glass-shimmer hover:text-ink"
          aria-label={t('common.close')}
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {success ? (
          <div className="py-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <CheckCircle2
                className="h-8 w-8 text-emerald-400"
                strokeWidth={1.5}
              />
            </span>
            <h2
              id="enquiry-modal-title"
              className="mt-4 text-lg font-semibold text-ink"
            >
              {t('propertyDetails.enquiry.sentTitle')}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {t('propertyDetails.enquiry.sentBody', { title: property.title })}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl border border-glass bg-glass-muted py-2.5 text-sm font-medium text-ink transition-colors hover:bg-glass-shimmer"
            >
              {t('common.close')}
            </button>
          </div>
        ) : (
          <>
            <h2
              id="enquiry-modal-title"
              className="pr-8 text-lg font-semibold tracking-tight text-ink"
            >
              {t('propertyDetails.enquiry.title')}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {t('propertyDetails.enquiry.subtitle', { title: property.title })}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="enquiry-name"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted"
                >
                  <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t('propertyDetails.enquiry.name')}
                </label>
                <input
                  id="enquiry-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={t('propertyDetails.enquiry.name')}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-300/90">
                    {fieldErrors.name[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="enquiry-email"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted"
                >
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t('propertyDetails.enquiry.email')}
                </label>
                <input
                  id="enquiry-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={t('propertyDetails.enquiry.email')}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-300/90">
                    {fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="enquiry-phone"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t('propertyDetails.enquiry.phone')}
                </label>
                <input
                  id="enquiry-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={t('propertyDetails.enquiry.phone')}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-300/90">
                    {fieldErrors.phone[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="enquiry-message"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted"
                >
                  <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t('propertyDetails.enquiry.message')}
                </label>
                <textarea
                  id="enquiry-message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  placeholder={t('propertyDetails.enquiry.message')}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-red-300/90">
                    {fieldErrors.message[0]}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-300/90" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-glass bg-accent/20 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    {t('propertyDetails.enquiry.sending')}
                  </>
                ) : (
                  t('propertyDetails.enquiry.send')
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function PropertyDetails() {
  const { t, i18n } = useTranslation()
  const { slug } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      setProperty(null)

      try {
        const data = await fetchPropertyBySlug(slug)
        if (!cancelled) {
          setProperty(data)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.status === 404
              ? t('propertyDetails.notFound')
              : (err.response?.data?.message ??
                err.message ??
                t('propertyDetails.unableToLoad'))
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (slug) {
      load()
    }

    return () => {
      cancelled = true
    }
  }, [slug, i18n.language])

  useEffect(() => {
    if (!enquiryOpen) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') setEnquiryOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [enquiryOpen])

  if (loading) {
    return <PropertyDetailsSkeleton />
  }

  if (error || !property) {
    return (
      <div className="space-y-4">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          {t('common.backToProperties')}
        </Link>
        <div className="glass-card max-w-lg border-red-500/20">
          <p className="text-sm font-medium text-red-300/90">
            {error ?? t('propertyDetails.notFound')}
          </p>
        </div>
      </div>
    )
  }

  const features = Array.isArray(property.features) ? property.features : []
  const listingLabel = formatListingType(property.listing_type)
  const areaLabel = formatTotalArea(property.total_area)

  return (
    <div className="space-y-8">
      <Link
        to="/properties"
        className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        {t('common.backToProperties')}
      </Link>

      <ImageGallery property={property} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ListingStatCard listingType={property.listing_type} />
            <DetailStat
              icon={Building2}
              label={t('propertyDetails.price')}
              value={formatPrice(property)}
            />
            <DetailStat
              icon={BedDouble}
              label={t('propertyDetails.bedrooms')}
              value={
                property.bedrooms != null
                  ? `${Number(property.bedrooms).toLocaleString(
                      i18n.language === 'ar' ? 'ar' : 'en',
                    )} ${t('property.bedroom', { count: Number(property.bedrooms) })}`
                  : null
              }
            />
            <DetailStat
              icon={Maximize2}
              label={t('propertyDetails.totalArea')}
              value={areaLabel}
            />
          </div>

          {property.description && (
            <div className="glass-card">
              <h2 className="text-sm font-medium uppercase tracking-wider text-ink-faint">
                {t('propertyDetails.description')}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                {property.description}
              </p>
            </div>
          )}

          {property.video_url && (
            <PropertyVideo videoUrl={property.video_url} />
          )}

          {features.length > 0 && (
            <div className="glass-card">
              <h2 className="text-sm font-medium uppercase tracking-wider text-ink-faint">
                {t('propertyDetails.features')}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-lg border border-glass bg-glass-muted px-3 py-1.5 text-xs font-medium text-ink backdrop-blur-sm"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="glass-card sticky top-24 space-y-4">
            {listingLabel && (
              <ListingTypeBadge
                listingType={property.listing_type}
                size="lg"
                className="w-full justify-center"
              />
            )}
            <p className="text-2xl font-semibold tracking-tight text-accent">
              {formatPrice(property)}
            </p>
            {areaLabel && (
              <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                <Maximize2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                {areaLabel}
              </p>
            )}
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="w-full rounded-xl border border-glass bg-accent/20 py-3 text-sm font-medium text-accent transition-colors hover:border-accent/30 hover:bg-accent/30"
            >
              {t('propertyDetails.contactAgent')}
            </button>
            {(property.contact_name || property.contact_email) && (
              <div className="border-t border-glass pt-4 text-xs text-ink-faint">
                {property.contact_name && (
                  <p className="text-ink-muted">{property.contact_name}</p>
                )}
                {property.contact_email && (
                  <p className="mt-1">{property.contact_email}</p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {enquiryOpen && (
        <EnquiryModal
          property={property}
          onClose={() => setEnquiryOpen(false)}
        />
      )}
    </div>
  )
}
