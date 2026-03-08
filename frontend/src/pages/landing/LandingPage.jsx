import React, { useState, useEffect, useRef } from 'react'

export default function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [statsActive, setStatsActive] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsActive(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const Counter = ({ target, suffix = '+' }) => {
    const [n, setN] = useState(0)
    useEffect(() => {
      if (!statsActive) return
      let v = 0; const step = target / 60
      const t = setInterval(() => { v += step; if (v >= target) { setN(target); clearInterval(t) } else setN(Math.floor(v)) }, 16)
      return () => clearInterval(t)
    }, [statsActive, target])
    return <>{n.toLocaleString()}{suffix}</>
  }

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#fff', color: '#1e293b' }}>

      {/* ─── Navbar ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,.09)' : 'none',
        transition: 'all 0.3s', padding: '0 1.5rem', height: 68,
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1e293b', textDecoration: 'none', letterSpacing: '-0.5px',background: '#ffffff', padding: '6px 16px', borderRadius: '30px', border: '1px solid #e5e7eb', }}>
            🔍 CampusFinds
          </a>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {['How it Works', 'Features', 'Success Stories'].map(l => (
              <a key={l} href={`#${l.replace(/ /g,'').toLowerCase()}`} style={{ color: '#475569', fontWeight: 500, fontSize: '0.88rem', textDecoration: 'none', padding: '0.4rem 0.8rem', borderRadius: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.color = '#6366f1'; e.target.style.background = '#f1f5f9' }}
                onMouseLeave={e => { e.target.style.color = '#475569'; e.target.style.background = 'transparent' }}
              >{l}</a>
            ))}
            <button onClick={onGetStarted} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.55rem 1.3rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', marginLeft: '0.5rem', transition: 'transform 0.2s,box-shadow 0.2s', boxShadow: '0 4px 14px rgba(99,102,241,.35)' }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 22px rgba(99,102,241,.45)' }}
              onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,.35)' }}
            >Get Started</button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0f172a 0%,#1e293b 45%,#0f172a 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 68 }}>
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        {/* Glows */}
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.14) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 50, padding: '0.4rem 1.1rem', marginBottom: '2rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }} />
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600 }}>Live on Chandigarh University Campus</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Lost something on<br />
              <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>campus?</span>
              {' '}We can<br />help you find it.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 560 }}>
              CampusFinds connects students who've lost items with those who've found them. Simple, fast, and built for our campus community.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={onGetStarted} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem 2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >🔍 Report or Find an Item</button>
              <button style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '0.9rem 1.8rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(4px)' }}
                onClick={onGetStarted}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >Browse Found Items</button>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex' }}>
                {['PS','RM','AK','VK'].map((i, idx) => (
                  <div key={idx} style={{ width: 34, height: 34, borderRadius: '50%', background: `hsl(${idx * 80 + 200},65%,50%)`, border: '2px solid #0f172a', marginLeft: idx > 0 ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.7rem' }}>{i}</div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>{'★★★★★'.split('').map((s,i) => <span key={i} style={{ color: '#fbbf24', fontSize: '0.8rem' }}>{s}</span>)}</div>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>183+ items returned to students</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <style>{`@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-8px)}}@keyframes scrollDot{0%{opacity:0;transform:translateY(0)}50%{opacity:1}100%{opacity:0;transform:translateY(12px)}}`}</style>
      </section>

      {/* ─── Stats ─── */}
      <section ref={statsRef} style={{ background: '#f8fafc', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.7rem' }}>By the numbers</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 900, letterSpacing: '-1px', color: '#0f172a' }}>Making a real difference</h2>
            <p style={{ color: '#64748b', marginTop: '0.7rem', maxWidth: 480, margin: '0.7rem auto 0' }}>Every item returned is a student's day saved. Here's our track record so far.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
            {[
              { n: 248, suf: '+', label: 'Items reported', emoji: '📦', color: '#6366f1', bg: '#e0e7ff' },
              { n: 183, suf: '+', label: 'Successfully returned', emoji: '✅', color: '#10b981', bg: '#d1fae5' },
              { n: 620, suf: '+', label: 'Students registered', emoji: '👥', color: '#3b82f6', bg: '#dbeafe' },
              { n: 4,   suf: 'hr', label: 'Avg. response time', emoji: '⚡', color: '#f59e0b', bg: '#fef3c7' },
            ].map(({ n, suf, label, emoji, color, bg }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '2rem 1.5rem', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,.04)', transition: 'transform 0.2s,box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.04)' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 1rem' }}>{emoji}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color, lineHeight: 1, marginBottom: '0.4rem' }}><Counter target={n} suffix={suf} /></div>
                <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="howitworks" style={{ background: '#0f172a', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#10b981', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.7rem' }}>Simple process</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 900, letterSpacing: '-1px', color: '#fff' }}>Three steps, that's it</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '2rem' }}>
            {[
              { n: '01', icon: '📸', title: 'Report', desc: 'Spot a lost or found item? Take a photo and submit a quick report with where and when you found it.', color: '#6366f1' },
              { n: '02', icon: '🔎', title: 'Browse & Match', desc: 'Our platform shows possible matches. Browse by category, location, or date to find what you\'re looking for.', color: '#10b981' },
              { n: '03', icon: '🤝', title: 'Claim & Collect', desc: 'File a claim with a short description of your item. Once verified, coordinate pickup at the student care office.', color: '#f59e0b' },
            ].map(({ n, icon, title, desc, color }) => (
              <div key={n} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '2rem', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s,background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
                <span style={{ position: 'absolute', top: '1.2rem', right: '1.5rem', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}>{n}</span>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
                <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: '0.6rem', fontSize: '1.1rem' }}>{title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.7rem' }}>Built for campus life</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 900, letterSpacing: '-1px', color: '#0f172a' }}>Everything you need</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🤖', title: 'AI-Powered Matching', desc: 'Our system automatically suggests possible matches between lost and found items using smart text analysis.', color: '#6366f1' },
              { icon: '📧', title: 'Email Notifications', desc: 'Get notified by email the moment your claim is reviewed — approved or rejected.', color: '#10b981' },
              { icon: '🏷️', title: 'QR Code Labels', desc: 'Print QR sticker labels for found items. Anyone who scans it lands directly on the item page.', color: '#f59e0b' },
              { icon: '📊', title: 'Admin Analytics', desc: 'Full dashboard with recovery rate, category breakdowns, and weekly trend charts for administrators.', color: '#3b82f6' },
              { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes, day or night. Your preference is saved automatically.', color: '#8b5cf6' },
              { icon: '📱', title: 'Works Offline (PWA)', desc: 'Install CampusFinds on your phone like a native app — it even loads without internet.', color: '#ef4444' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.8rem', position: 'relative', overflow: 'hidden', transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(0,0,0,.04)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,.1)`; e.currentTarget.style.borderColor = color }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.04)'; e.currentTarget.style.borderColor = '#e2e8f0' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
                <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>{title}</h5>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="successstories" style={{ background: '#f8fafc', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.7rem' }}>Real stories</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 900, letterSpacing: '-1px', color: '#0f172a' }}>Students helping students</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {[
              { text: "Lost my wallet near the library with all my cash and cards inside. Someone posted it on CampusFinds the same hour. I couldn't believe it — got everything back by evening.", author: 'Priya S.', dept: 'CSE, 3rd Year', item: '💛 Wallet', initials: 'PS', color: '#f59e0b' },
              { text: "My laptop bag with six months of project notes went missing the day before my exam. A classmate found it and I recovered everything within three hours through this platform.", author: 'Rahul M.', dept: 'ECE, 4th Year', item: '💻 Laptop Bag', initials: 'RM', color: '#6366f1' },
              { text: "I found someone's student ID near the canteen and used CampusFinds to post it. The owner found the listing and collected it the next morning. Love how easy this made it.", author: 'Anjali K.', dept: 'Commerce, 2nd Year', item: '🪪 Student ID', initials: 'AK', color: '#10b981' },
            ].map(({ text, author, dept, item, initials, color }) => (
              <div key={author} style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,.04)', transition: 'all 0.2s', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,.09)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.04)' }}
              >
                <div style={{ fontSize: '3.5rem', color, opacity: 0.12, lineHeight: 1, position: 'absolute', top: 12, left: 16, fontFamily: 'Georgia,serif', fontWeight: 900 }}>"</div>
                <p style={{ color: '#475569', lineHeight: 1.75, fontSize: '0.9rem', marginBottom: '1.5rem', paddingTop: '1rem' }}>{text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg,${color},${color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>{initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{author}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{dept}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', background: '#f1f5f9', padding: '0.2rem 0.7rem', borderRadius: 20, color: '#64748b', fontWeight: 500 }}>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e293b 100%)', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '1rem' }}>Ready to find what you lost?</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>Join hundreds of Chandigarh University students already using CampusFinds.</p>
          <button onClick={onGetStarted} style={{ background: '#fff', color: '#312e81', border: 'none', borderRadius: 12, padding: '1rem 2.5rem', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >🔍 Create Your Account — It's Free</button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.45)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>🔍 CampusFinds</div>
        <p style={{ fontSize: '0.82rem', margin: 0 }}>Campus Lost & Found · Chandigarh University · E1 Block, Student Care</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>© {new Date().getFullYear()} CampusFinds. Built with ❤️ by Rohit Negi & Mayank Aneja.</p>
      </footer>
    </div>
  )
}
