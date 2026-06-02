import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EASE = [0.22, 1, 0.36, 1]

function useCountUp(target, { durationMs = 1100, delayMs = 0 } = {}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = 0
    let startAt = 0
    const timeout = window.setTimeout(() => {
      startAt = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - startAt) / durationMs)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.round(target * eased))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delayMs)

    return () => {
      window.clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [delayMs, durationMs, target])

  return value
}

function AmbientLightBackground() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 22, mass: 0.8 })
  const sy = useSpring(my, { stiffness: 80, damping: 22, mass: 0.8 })
  const ref = useRef(null)

  const onMove = useMemo(
    () => (e) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      mx.set(e.clientX - rect.left)
      my.set(e.clientY - rect.top)
    },
    [mx, my],
  )

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className="pointer-events-auto absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_0%,rgba(214,177,106,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_20%_60%,rgba(79,110,247,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_85%_55%,rgba(255,200,120,0.14),transparent_58%)]" />

      {/* Soft moving glass blobs (cheap + premium) */}
      <motion.div
        className="absolute -left-32 -top-28 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.65),transparent_62%)] blur-[34px]"
        animate={{ x: [0, 40, 0], y: [0, 25, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-40 top-6 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(214,177,106,0.22),transparent_62%)] blur-[40px]"
        animate={{ x: [0, -35, 0], y: [0, 40, 0], scale: [1, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-220px] left-[18%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(79,110,247,0.14),transparent_62%)] blur-[52px]"
        animate={{ x: [0, 55, 0], y: [0, -25, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cursor light reflection */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            // eslint-disable-next-line max-len
            `radial-gradient(520px circle at ${sx.get()}px ${sy.get()}px, rgba(255,255,255,0.55), transparent 65%)`,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            'linear-gradient(var(--glass-border) 1px, transparent 1px), linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse 65% 55% at 50% 45%, black 15%, transparent 75%)',
        }}
      />
    </div>
  )
}

function SectionHeader({ kicker, title, subtitle, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`${alignClass}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
        {kicker}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[100svh]">
      <AmbientLightBackground />

      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-strong bg-glass/70 px-4 py-2 text-xs font-medium text-ink-muted shadow-glass backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.5} />
            {t('home.hero.badge')}
          </div>

          <h1 className="text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
            {t('home.hero.headline')}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {t('home.hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/properties"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-glass-strong bg-accent/15 px-8 py-3.5 text-sm font-semibold text-accent shadow-glass backdrop-blur-xl transition-all duration-300 hover:border-accent/30 hover:bg-accent/20 sm:w-auto"
            >
              {t('common.exploreProperties')}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
            <a
              href="#cta"
              className="inline-flex w-full items-center justify-center rounded-full border border-glass bg-glass/60 px-8 py-3.5 text-sm font-medium text-ink backdrop-blur-xl transition-colors duration-theme hover:border-glass-strong sm:w-auto"
            >
              {t('common.contactUs')}
            </a>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: t('home.hero.feature1Label'),
                value: t('home.hero.feature1Value'),
              },
              {
                label: t('home.hero.feature2Label'),
                value: t('home.hero.feature2Value'),
              },
              {
                label: t('home.hero.feature3Label'),
                value: t('home.hero.feature3Value'),
              },
              {
                label: t('home.hero.feature4Label'),
                value: t('home.hero.feature4Value'),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="glass rounded-2xl border border-glass-strong bg-glass/70 p-4 text-left shadow-glass backdrop-blur-xl"
              >
                <p className="text-xs font-medium text-ink-faint">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function WhyChooseUs() {
  const { t } = useTranslation()

  const items = [
    {
      title: t('home.why.trustTitle'),
      description: t('home.why.trustDesc'),
      icon: ShieldCheck,
    },
    {
      title: t('home.why.verifiedTitle'),
      description: t('home.why.verifiedDesc'),
      icon: CheckCircle2,
    },
    {
      title: t('home.why.supportTitle'),
      description: t('home.why.supportDesc'),
      icon: UserRound,
    },
    {
      title: t('home.why.secureTitle'),
      description: t('home.why.secureDesc'),
      icon: Lock,
    },
  ]

  return (
    <section className="py-16 sm:py-24">
      <SectionHeader
        kicker={t('home.why.kicker')}
        title={t('home.why.title')}
        subtitle={t('home.why.subtitle')}
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
            className="glass rounded-2xl border border-glass-strong bg-glass/70 p-6 shadow-glass backdrop-blur-xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-glass bg-glass-muted">
              <item.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="mt-5 text-base font-semibold tracking-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Statistics() {
  const { t } = useTranslation()

  const sold = useCountUp(1240, { durationMs: 1200, delayMs: 120 })
  const clients = useCountUp(3120, { durationMs: 1200, delayMs: 180 })
  const cities = useCountUp(27, { durationMs: 1000, delayMs: 240 })
  const years = useCountUp(12, { durationMs: 900, delayMs: 300 })

  const stats = [
    { label: t('home.stats.propertiesSold'), value: sold, suffix: '+' },
    { label: t('home.stats.happyClients'), value: clients, suffix: '+' },
    { label: t('home.stats.citiesCovered'), value: cities, suffix: '' },
    { label: t('home.stats.yearsExperience'), value: years, suffix: '' },
  ]

  return (
    <section className="py-16 sm:py-24">
      <div className="glass rounded-3xl border border-glass-strong bg-glass/70 p-8 shadow-glass backdrop-blur-xl sm:p-12">
        <SectionHeader
          kicker={t('home.stats.kicker')}
          title={t('home.stats.title')}
          subtitle={t('home.stats.subtitle')}
        />

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, delay: i * 0.05, ease: EASE }}
              className="rounded-2xl border border-glass bg-glass-muted p-5 text-center"
            >
              <p className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {s.value}
                {s.suffix}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  const { t } = useTranslation()

  const steps = [
    {
      title: t('home.process.discoverTitle'),
      description: t('home.process.discoverDesc'),
    },
    {
      title: t('home.process.visitTitle'),
      description: t('home.process.visitDesc'),
    },
    {
      title: t('home.process.decideTitle'),
      description: t('home.process.decideDesc'),
    },
    {
      title: t('home.process.moveInTitle'),
      description: t('home.process.moveInDesc'),
    },
  ]

  return (
    <section className="py-16 sm:py-24">
      <SectionHeader
        kicker={t('home.process.kicker')}
        title={t('home.process.title')}
        subtitle={t('home.process.subtitle')}
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
            className="glass rounded-2xl border border-glass-strong bg-glass/70 p-6 shadow-glass backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
                {t('home.process.step')} {i + 1}
              </p>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-ink-faint/50 to-transparent" />
            </div>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  const { t } = useTranslation()
  const raw = t('home.testimonials.items', { returnObjects: true })
  const items = Array.isArray(raw) ? raw : []

  const [active, setActive] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return undefined
    const t = window.setInterval(() => {
      setActive((v) => (v + 1) % items.length)
    }, 4800)
    return () => window.clearInterval(t)
  }, [items.length])

  useEffect(() => {
    if (active >= items.length) setActive(0)
  }, [active, items.length])

  if (items.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <SectionHeader
          kicker={t('home.testimonials.kicker')}
          title={t('home.testimonials.title')}
          subtitle={t('home.testimonials.subtitle')}
        />
        <div className="mt-12 glass-card text-center">
          <p className="text-sm text-ink-muted">{t('common.loading')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-24">
      <SectionHeader
        kicker={t('home.testimonials.kicker')}
        title={t('home.testimonials.title')}
        subtitle={t('home.testimonials.subtitle')}
      />

      <div className="mt-12">
        <div className="glass mx-auto max-w-3xl overflow-hidden rounded-3xl border border-glass-strong bg-glass/70 shadow-glass backdrop-blur-xl">
          <div className="relative p-8 sm:p-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink-faint">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-[rgba(214,177,106,0.9)]"
                    strokeWidth={1.5}
                    fill="rgba(214,177,106,0.3)"
                  />
                ))}
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
                {active + 1} / {items.length}
              </p>
            </div>

            <motion.p
              key={items[active].quote}
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-lg leading-relaxed text-ink sm:text-xl"
            >
              “{items[active].quote}”
            </motion.p>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">
                  {items[active].name}
                </p>
                <p className="text-sm text-ink-muted">{items[active].role}</p>
              </div>

              <div className="flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={[
                      'h-2.5 w-2.5 rounded-full border border-glass transition-colors',
                      i === active ? 'bg-accent/70' : 'bg-glass-muted',
                    ].join(' ')}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CallToAction() {
  const { t } = useTranslation()

  return (
    <section id="cta" className="scroll-mt-28 py-16 sm:scroll-mt-32 sm:py-24">
      <div className="glass rounded-3xl border border-glass-strong bg-glass/70 p-10 text-center shadow-glass backdrop-blur-xl sm:p-14">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
          {t('home.cta.kicker')}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {t('home.cta.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
          {t('home.cta.subtitle')}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/properties"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-glass-strong bg-accent/15 px-8 py-3.5 text-sm font-semibold text-accent shadow-glass backdrop-blur-xl transition-colors hover:bg-accent/20 sm:w-auto"
          >
            {t('common.exploreProperties')}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <a
            href="mailto:hello@estate.com"
            className="inline-flex w-full items-center justify-center rounded-full border border-glass bg-glass/60 px-8 py-3.5 text-sm font-medium text-ink backdrop-blur-xl transition-colors hover:border-glass-strong sm:w-auto"
          >
            {t('common.contactUs')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <WhyChooseUs />
        <Statistics />
        <Process />
        <Testimonials />
        <CallToAction />
      </div>
    </div>
  )
}

