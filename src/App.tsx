import { useState, type ReactNode, type FormEvent } from 'react'
import './App.css'

const API_BASE = '/api/v1'

const steps = [
  {
    icon: '📋',
    title: 'Apply in Minutes',
    desc: 'Fill out a simple form — no collateral, no guarantors, no credit history required.',
  },
  {
    icon: '📚',
    title: 'Learn Without Limits',
    desc: 'Enroll in your chosen program. Focus entirely on your education and future.',
  },
  {
    icon: '💼',
    title: 'Pay When You Earn',
    desc: 'Repayment begins only after you land a job. No income, no payment — that simple.',
  },
]

const programs = [
  { icon: '💻', name: 'Tech & Software', detail: 'Web Dev · Data Science · Cybersecurity' },
  { icon: '⚕️', name: 'Healthcare', detail: 'Nursing · Public Health · Pharmacy' },
  { icon: '🏗️', name: 'Engineering', detail: 'Civil · Electrical · Mechanical' },
  { icon: '📊', name: 'Business & Finance', detail: 'Accounting · Marketing · Entrepreneurship' },
  { icon: '🎓', name: 'Teacher Training', detail: 'Primary · Secondary · Special Needs' },
  { icon: '🌐', name: 'Languages', detail: 'English · Mandarin · Japanese' },
]

const stats = [
  { value: '5,000+', label: 'Learners Supported' },
  { value: '0 MMK', label: 'Upfront Cost' },
  { value: '94%', label: 'Completion Rate' },
  { value: '200+', label: 'Partner Institutions' },
]

const testimonials = [
  {
    name: 'Ma Hnin Wai',
    role: 'Software Developer, Yangon',
    quote: 'Clever Fund gave me a chance when nothing else did. I coded my way out of uncertainty — and now I help others do the same.',
    avatar: 'HW',
  },
  {
    name: 'Ko Zin Lin',
    role: 'Civil Engineer, Mandalay',
    quote: "I had talent but no tuition money. Clever Fund's LNPL model changed my life. I paid back smiling because I could afford to.",
    avatar: 'ZL',
  },
  {
    name: 'Ma Thida Kyaw',
    role: 'Registered Nurse, Sagaing',
    quote: 'Education is the only thing they cannot take from you. Clever Fund understood that, and so did I.',
    avatar: 'TK',
  },
]

const missionPoints = [
  { icon: '🎯', title: 'Merit-based, not wealth-based', body: 'We select students on potential and drive, not family income or connections.' },
  { icon: '🤝', title: 'Community-first repayment', body: 'Flexible income-share — we grow when you grow.' },
  { icon: '🔒', title: 'Zero collateral required', body: 'No assets, no guarantors, no stress. Just your commitment to learn.' },
  { icon: '🌱', title: 'Reinvested in Myanmar', body: '20% of all repayments fund the next generation of Clever Fund scholars.' },
]

interface Course {
  id: number
  title: string
  description: string
  program: string
  provider: string
  duration: string
  price_mmk: number
}

function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`w-full py-24 px-6 ${className ?? ''}`}>
      <div className="max-w-5xl mx-auto">
        {children}
      </div>
    </section>
  )
}

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <span className="inline-block text-amber-500 font-bold text-xs uppercase tracking-widest mb-3">
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-gray-500 mt-4 text-base max-w-xl mx-auto">{subtitle}</p>}
    </div>
  )
}

function MatchedCourses({ courses, program }: { courses: Course[]; program: string }) {
  const programIcon = programs.find(p => p.name === program)?.icon ?? '📚'
  return (
    <div className="mt-8 text-left">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">{programIcon}</span>
        <div>
          <p className="font-black text-gray-900 text-lg leading-tight">Courses matched for you</p>
          <p className="text-amber-700 text-xs font-semibold">{program}</p>
        </div>
      </div>
      <div className="space-y-3">
        {courses.map(course => (
          <div key={course.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{course.title}</p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{course.description}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="text-xs text-amber-700 font-semibold">{course.provider}</span>
                  <span className="text-xs text-gray-400">{course.duration}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400 line-through">
                  {course.price_mmk.toLocaleString()} MMK
                </p>
                <p className="text-xs font-black text-amber-600 mt-0.5">0 upfront</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApplyForm() {
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [program, setProgram] = useState('')
  const [motivation, setMotivation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [matchedCourses, setMatchedCourses] = useState<Course[] | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, contact, program, motivation }),
        signal: controller.signal,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setMatchedCourses(data.matched_courses ?? [])
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out.')
      } else {
        setError('Could not reach the server.')
      }
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  if (matchedCourses !== null) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-2xl text-left">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-3">
            ✅
          </div>
          <h3 className="font-black text-gray-900 text-xl">Application received!</h3>
          <p className="text-gray-500 text-sm mt-1">
            We'll reach out to <span className="font-semibold text-gray-700">{contact}</span> within 3 business days.
          </p>
        </div>

        {matchedCourses.length > 0 ? (
          <MatchedCourses courses={matchedCourses} program={program} />
        ) : (
          <p className="text-center text-gray-400 text-sm mt-4">
            No courses found for this program yet — we review every case individually.
          </p>
        )}

        <button
          onClick={() => {
            setMatchedCourses(null)
            setFullName('')
            setContact('')
            setProgram('')
            setMotivation('')
          }}
          className="mt-6 w-full border border-gray-200 text-gray-500 hover:text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Submit another application
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl text-left space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Ma Aye Aye"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone / Email</label>
          <input
            type="text"
            placeholder="09 xxx xxx xxx"
            value={contact}
            onChange={e => setContact(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Program of Interest</label>
        <select
          value={program}
          onChange={e => setProgram(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white transition"
        >
          <option value="">Select a field…</option>
          {programs.map((p) => (
            <option key={p.name} value={p.name}>{p.icon} {p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Why do you want to learn?{' '}
          <span className="font-normal normal-case text-gray-400">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Tell us about your goals and situation..."
          value={motivation}
          onChange={e => setMotivation(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base transition-colors shadow-md"
      >
        {loading ? 'Submitting…' : 'Submit Application →'}
      </button>
      <p className="text-center text-xs text-gray-400">
        No spam. We'll reach out within 3 business days.
      </p>
    </form>
  )
}

export default function App() {
  return (
    <div className="w-full min-h-screen bg-white text-gray-900">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <span className="text-2xl font-black text-amber-500 tracking-tight">Clever</span>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Fund</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <a href="#how-it-works" className="hover:text-amber-500 transition-colors">How It Works</a>
            <a href="#programs" className="hover:text-amber-500 transition-colors">Programs</a>
            <a href="#about" className="hover:text-amber-500 transition-colors">Our Mission</a>
            <a href="#apply" className="bg-amber-500 text-white px-5 py-2 rounded-full hover:bg-amber-600 transition-colors">
              Apply Now
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1c2537 55%, #2d1a08 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 10% 90%, rgba(245,158,11,0.18) 0%, transparent 55%), ' +
              'radial-gradient(ellipse 55% 45% at 90% 10%, rgba(220,38,38,0.12) 0%, transparent 55%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-28 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/35 text-amber-300 text-sm font-semibold px-5 py-2 rounded-full mb-10">
            🇲🇲 Built for Myanmar's Future
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-6">
            Learn Now.<br />
            <span className="text-amber-400">Pay Later.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-4 max-w-2xl mx-auto">
            Education shouldn't wait for peace — and it shouldn't cost your future before it begins.
          </p>
          <p className="text-slate-400 text-sm md:text-base mb-12 max-w-lg mx-auto leading-relaxed">
            Clever Fund provides zero-upfront education financing to students across Myanmar.
            You pay only when you earn. No income — no payment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#apply"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-9 py-4 rounded-full text-base transition-colors shadow-lg shadow-amber-600/30"
            >
              Start Learning Today →
            </a>
            <a
              href="#how-it-works"
              className="border border-white/25 hover:border-white/50 text-white px-9 py-4 rounded-full text-base transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="w-full bg-amber-500 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-black text-gray-950 tabular-nums">{s.value}</div>
              <div className="text-amber-900 font-semibold mt-2 text-xs uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section id="about" className="w-full py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="text-center md:text-left">
            <span className="inline-block text-amber-500 font-bold text-xs uppercase tracking-widest mb-3">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900">
              Education is a right,<br />not a privilege.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              Myanmar's ongoing conflict has shattered educational systems and displaced millions.
              Yet talent, ambition, and the will to rebuild remain unbroken across the country.
            </p>
            <p className="text-gray-500 leading-relaxed mb-4">
              Clever Fund was founded on the belief that a student in a conflict zone deserves
              the same access to world-class education as anyone else — without debt looming before they've even started.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Our <strong className="text-gray-800">Learn Now Pay Later (LNPL)</strong> model removes
              the financial barrier entirely. We invest in you first. You repay once you're earning.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm divide-y divide-gray-100">
            {missionPoints.map((point, i) => (
              <div key={point.title} className={`flex gap-5 items-start ${i === 0 ? 'pb-6' : i === missionPoints.length - 1 ? 'pt-6' : 'py-6'}`}>
                <div className="w-11 h-11 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                  {point.icon}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm mb-0.5">{point.title}</div>
                  <div className="text-gray-500 text-sm leading-relaxed">{point.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <Section id="how-it-works" className="bg-white">
        <SectionHeading label="Simple Process" title="How Clever Fund Works" />

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center px-8 pt-14 pb-9 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
            >
              <div className="absolute top-5 w-9 h-9 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-black shadow shadow-amber-300/40">
                {i + 1}
              </div>
              <div className="text-5xl mb-5">{step.icon}</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl px-8 py-5 text-center">
          <p className="text-amber-800 text-sm font-medium">
            💡 <strong>No income threshold to start repaying.</strong>{' '}
            You decide when you're stable — we work with you, not against you.
          </p>
        </div>
      </Section>

      {/* ── Programs ── */}
      <section id="programs" className="w-full py-24 px-6 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-amber-400 font-bold text-xs uppercase tracking-widest mb-3">
              What You Can Study
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">Programs We Fund</h2>
            <p className="text-gray-400 mt-4 text-sm max-w-md mx-auto">
              Partnered with 200+ accredited institutions across Myanmar and online.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {programs.map((p) => (
              <div
                key={p.name}
                className="bg-gray-800/70 hover:bg-gray-800 border border-gray-700 hover:border-amber-500/50 rounded-2xl p-7 transition-all cursor-pointer"
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <div className="font-bold text-base text-white mb-1">{p.name}</div>
                <div className="text-gray-400 text-sm">{p.detail}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-10 text-sm">
            Don't see your field?{' '}
            <a href="#apply" className="text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors">
              Apply anyway
            </a>{' '}
            — we review every case individually.
          </p>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <Section className="bg-white">
        <SectionHeading label="Real Stories" title="From Our Community" />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="text-4xl text-amber-400 mb-4 leading-none">"</div>
              <p className="text-gray-600 leading-relaxed flex-1 mb-8 text-sm">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">{t.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Apply CTA ── */}
      <section id="apply" className="w-full py-24 px-6" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-950 mb-4 leading-tight">
            Ready to Start?
          </h2>
          <p className="text-amber-900 text-base mb-10 leading-relaxed">
            Join thousands of Myanmar students who chose education over uncertainty.
            Your application takes under 10 minutes.
          </p>

          <ApplyForm />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="w-full bg-gray-950 text-gray-500 py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs text-center md:text-left">
            <div className="flex items-center gap-0.5 mb-4 justify-center md:justify-start">
              <span className="text-xl font-black text-amber-500">Clever</span>
              <span className="text-xl font-black text-white">Fund</span>
            </div>
            <p className="text-sm leading-relaxed">
              Learn Now Pay Later — investing in Myanmar's people, one scholar at a time.
            </p>
          </div>

          <div className="flex gap-16 text-sm justify-center md:justify-end">
            <div>
              <div className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Program</div>
              <div className="space-y-3">
                <a href="#how-it-works" className="block hover:text-amber-400 transition-colors">How It Works</a>
                <a href="#programs" className="block hover:text-amber-400 transition-colors">Programs</a>
                <a href="#apply" className="block hover:text-amber-400 transition-colors">Apply</a>
              </div>
            </div>
            <div>
              <div className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Contact</div>
              <div className="space-y-3">
                <a href="mailto:hello@cleverfund.mm" className="block hover:text-amber-400 transition-colors">
                  hello@cleverfund.mm
                </a>
                <span className="block">Yangon · Mandalay · Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-gray-800 text-xs text-center">
          © 2025 Clever Fund. Made with purpose for Myanmar. 🇲🇲
        </div>
      </footer>

    </div>
  )
}
