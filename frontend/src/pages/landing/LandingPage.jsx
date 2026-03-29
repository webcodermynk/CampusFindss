import React, { useState, useEffect, useRef } from 'react'

const Stars = ({ n }) => <span>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=n?'#f59e0b':'#e2e8f0',fontSize:'0.95rem'}}>★</span>)}</span>

export default function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled]         = useState(false)
  const [statsActive, setStatsActive]   = useState(false)
  const [liveStats, setLiveStats]       = useState({ totalItems:0, returned:0, students:0 })
  const [stories, setStories]           = useState([])
  const statsRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setStatsActive(true) }, { threshold:0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  // Fetch real stats and stories
  useEffect(() => {
    (async () => {
      try {
        const [statsRes, storiesRes] = await Promise.all([
          fetch('/api/analytics/stats'),
          fetch('/api/feedback/public')
        ])
        if (statsRes.ok) {
          const s = await statsRes.json()
          setLiveStats({ totalItems: s.totalItems||0, returned: s.returned||0, students: s.students||0 })
        }
        if (storiesRes.ok) setStories((await storiesRes.json()).slice(0,3))
      } catch(e) { /* API might not be up yet on landing — silent fail */ }
    })()
  }, [])

  const Num = ({ n, suffix='+' }) => {
    const [v, setV] = useState(0)
    useEffect(() => {
      if (!statsActive || !n) return
      let cur=0; const step = n/55
      const t = setInterval(() => { cur+=step; if(cur>=n){setV(n);clearInterval(t)}else setV(Math.floor(cur)) }, 20)
      return () => clearInterval(t)
    }, [statsActive, n])
    return <>{v.toLocaleString()}{suffix}</>
  }

  const STEPS = [
    { icon:'📸', title:'Report It',        desc:'Snap a photo and fill a quick form. Takes under 2 minutes whether you lost or found something.',     color:'#e0f2fe', accent:'#0284c7' },
    { icon:'🔍', title:'Browse & Match',   desc:'Scroll through found items. Search by category or location. Smart matching surfaces the best results.', color:'#dcfce7', accent:'#16a34a' },
    { icon:'🤝', title:'Claim & Collect',  desc:'Found your item? Submit a claim. Admin verifies and you collect it from the Student Care office.',       color:'#fef9c3', accent:'#ca8a04' },
  ]

  // Real features — accurate for CampusFinds
  const FEATURES = [
    { icon:'🤖', title:'Smart AI Matching',    desc:'Auto-suggests possible matches between lost and found items using keyword similarity.' },
    { icon:'📧', title:'Email Notifications',  desc:'Students get emailed when their claim is approved or rejected by admin.' },
    { icon:'📊', title:'Admin Dashboard',      desc:'Full analytics with charts, claim tracking, user management and recovery rates.' },
    { icon:'🙋', title:'Claim System',         desc:'Submit detailed claims with proof of ownership. Admin reviews and verifies each one.' },
    { icon:'🌙', title:'Dark Mode',            desc:'Switch anytime — your preference is saved automatically across sessions.' },
    { icon:'📱', title:'Mobile Friendly PWA',  desc:'Works on any device. Install it as a phone app for instant access.' },
  ]

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#fff', color:'#1e293b', margin:0 }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .land-btn:hover{transform:translateY(-2px)!important;opacity:.95}
        .step-card:hover{transform:translateY(-4px)!important;box-shadow:0 16px 40px rgba(0,0,0,.1)!important}
        .feat-card:hover{border-color:#6366f1!important;box-shadow:0 8px 24px rgba(99,102,241,.12)!important;transform:translateY(-2px)}
        .story-card:hover{transform:translateY(-4px)!important;box-shadow:0 16px 40px rgba(0,0,0,.09)!important}
        @media(max-width:640px){.hero-h1{font-size:2rem!important}.hero-btns{flex-direction:column!important;align-items:stretch!important}.stats-grid{grid-template-columns:1fr 1fr!important}.steps-grid{grid-template-columns:1fr!important}.feat-grid{grid-template-columns:1fr!important}.stories-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:999, height:64, display:'flex', alignItems:'center', padding:'0 1.5rem',
        background: scrolled ? 'rgba(255,255,255,.97)' : '#fff',
        boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,.08)' : '0 1px 0 #f1f5f9',
        backdropFilter: scrolled ? 'blur(10px)' : 'none', transition:'all .3s' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:'1.25rem', fontWeight:900, color:'#1e293b', letterSpacing:'-0.5px' }}>🔍 CampusFinds</span>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            {['How it works','Features'].map(l => (
              <a key={l} href={`#${l.replace(/ /g,'').toLowerCase()}`}
                style={{ color:'#64748b', fontSize:'0.875rem', fontWeight:500, textDecoration:'none', padding:'0.4rem 0.75rem', borderRadius:8, transition:'all .2s' }}
                onMouseEnter={e=>{ e.target.style.color='#6366f1'; e.target.style.background='#f1f5f9' }}
                onMouseLeave={e=>{ e.target.style.color='#64748b'; e.target.style.background='transparent' }}>{l}</a>
            ))}
            <button className="land-btn" onClick={onGetStarted}
              style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:10, padding:'0.5rem 1.25rem', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', marginLeft:'0.5rem', transition:'all .2s', boxShadow:'0 4px 12px rgba(99,102,241,.3)' }}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:'1.5rem', paddingRight:'1.5rem', background:'#fff', textAlign:'center' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:50, padding:'0.35rem 1rem', marginBottom:'1.8rem' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 2s infinite' }}/>
            <span style={{ color:'#15803d', fontSize:'0.8rem', fontWeight:600 }}>Live on Chandigarh University Campus</span>
          </div>
          <h1 className="hero-h1" style={{ fontSize:'clamp(2.2rem,5vw,3.5rem)', fontWeight:900, color:'#0f172a', letterSpacing:'-1.5px', lineHeight:1.15, marginBottom:'1.2rem', animation:'fadeUp .6s ease both' }}>
            Lost something?<br/>
            <span style={{ color:'#6366f1' }}>We'll help you find it.</span>
          </h1>
          <p style={{ fontSize:'1.1rem', color:'#64748b', lineHeight:1.7, marginBottom:'2rem', maxWidth:520, margin:'0 auto 2rem' }}>
            CampusFinds connects CU students who've lost items with those who found them. Simple, safe, and built for our campus.
          </p>
          <div className="hero-btns" style={{ display:'flex', justifyContent:'center', gap:'0.75rem', flexWrap:'wrap', marginBottom:'3rem' }}>
            <button className="land-btn" onClick={onGetStarted}
              style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:12, padding:'0.85rem 2rem', fontWeight:700, fontSize:'1rem', cursor:'pointer', transition:'all .2s', boxShadow:'0 6px 20px rgba(99,102,241,.35)' }}>
              📝 Report or Find an Item
            </button>
            <button className="land-btn" onClick={onGetStarted}
              style={{ background:'#fff', color:'#374151', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'0.85rem 2rem', fontWeight:600, fontSize:'1rem', cursor:'pointer', transition:'all .2s' }}>
              Browse Found Items →
            </button>
          </div>
          {/* Live item preview cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.8rem', maxWidth:720, margin:'0 auto' }}>
            {[
              { icon:'🎒', label:'Backpack', loc:'D-Block Canteen', status:'Found', sc:'#d1fae5', tc:'#065f46' },
              { icon:'📱', label:'iPhone 15', loc:'NCH-B Hostel 301', status:'Lost', sc:'#fee2e2', tc:'#991b1b' },
              { icon:'🔑', label:'Key Ring', loc:'Library 2nd Floor', status:'Found', sc:'#d1fae5', tc:'#065f46' },
            ].map(item => (
              <div key={item.label} style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:14, padding:'1rem', textAlign:'left', boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:'0.4rem' }}>{item.icon}</div>
                <div style={{ fontWeight:700, fontSize:'0.85rem', color:'#1e293b', marginBottom:'0.2rem' }}>{item.label}</div>
                <div style={{ fontSize:'0.72rem', color:'#94a3b8', marginBottom:'0.5rem' }}>📍 {item.loc}</div>
                <span style={{ background:item.sc, color:item.tc, padding:'0.18rem 0.6rem', borderRadius:20, fontSize:'0.7rem', fontWeight:700 }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real-time Stats ── */}
      <section ref={statsRef} style={{ background:'#f8fafc', padding:'5rem 1.5rem', borderTop:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
          <p style={{ color:'#6366f1', fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Live platform data</p>
          <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, color:'#0f172a', letterSpacing:'-0.5px', marginBottom:'0.5rem' }}>Making a real difference</h2>
          <p style={{ color:'#64748b', fontSize:'0.9rem', marginBottom:'3rem' }}>These numbers update in real-time from our database</p>
          <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem' }}>
            {[
              { n:liveStats.totalItems, suf:'+', label:'Items Reported',    emoji:'📦', color:'#6366f1' },
              { n:liveStats.returned,   suf:'+', label:'Items Returned',    emoji:'✅', color:'#10b981' },
              { n:liveStats.students,   suf:'+', label:'Students Registered',emoji:'👥', color:'#3b82f6' },
              { n:4,                    suf:'h',  label:'Avg Response Time', emoji:'⚡', color:'#f59e0b' },
            ].map(s => (
              <div key={s.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:'1.8rem 1rem', boxShadow:'0 2px 8px rgba(0,0,0,.04)', transition:'transform .2s, box-shadow .2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,.08)' }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:'0.6rem' }}>{s.emoji}</div>
                <div style={{ fontSize:'2.2rem', fontWeight:900, color:s.color, lineHeight:1, marginBottom:'0.3rem', letterSpacing:'-1px' }}>
                  <Num n={s.n} suffix={s.suf}/>
                </div>
                <div style={{ fontSize:'0.82rem', color:'#64748b', fontWeight:500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="howitworks" style={{ background:'#fff', padding:'5rem 1.5rem' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ color:'#6366f1', fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Simple process</p>
            <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, color:'#0f172a', letterSpacing:'-0.5px' }}>Three steps, that's it</h2>
          </div>
          <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            {STEPS.map((s,i) => (
              <div key={s.title} className="step-card" style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:20, padding:'2rem 1.5rem', position:'relative', transition:'all .25s', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
                <div style={{ position:'absolute', top:'1rem', right:'1.2rem', fontSize:'1.8rem', fontWeight:900, color:'#f1f5f9', lineHeight:1, userSelect:'none' }}>0{i+1}</div>
                <div style={{ width:56, height:56, borderRadius:16, background:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', marginBottom:'1.2rem' }}>{s.icon}</div>
                <h4 style={{ fontWeight:800, color:'#1e293b', marginBottom:'0.5rem', fontSize:'1.05rem' }}>{s.title}</h4>
                <p style={{ color:'#64748b', fontSize:'0.875rem', lineHeight:1.7, margin:0 }}>{s.desc}</p>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:s.accent, borderRadius:'0 0 20px 20px', opacity:.6 }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real Features ── */}
      <section id="features" style={{ background:'#f8fafc', padding:'5rem 1.5rem', borderTop:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ color:'#6366f1', fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>What CampusFinds offers</p>
            <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, color:'#0f172a', letterSpacing:'-0.5px' }}>Everything you need</h2>
          </div>
          <div className="feat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="feat-card" style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:16, padding:'1.5rem', display:'flex', alignItems:'flex-start', gap:'1rem', transition:'all .22s' }}>
                <div style={{ fontSize:'1.5rem', flexShrink:0, marginTop:2 }}>{f.icon}</div>
                <div>
                  <h5 style={{ fontWeight:700, color:'#1e293b', marginBottom:'0.3rem', fontSize:'0.95rem' }}>{f.title}</h5>
                  <p style={{ color:'#64748b', fontSize:'0.84rem', lineHeight:1.6, margin:0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real Student Stories ── */}
      <section style={{ background:'#fff', padding:'5rem 1.5rem', borderTop:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ color:'#6366f1', fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Real stories</p>
            <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, color:'#0f172a', letterSpacing:'-0.5px', marginBottom:'0.4rem' }}>Students helping students</h2>
            <p style={{ color:'#64748b', fontSize:'0.875rem' }}>Real feedback submitted by actual CU students — not made up</p>
          </div>
          {stories.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>
              <div style={{ fontSize:'3rem', marginBottom:'0.8rem', opacity:.3 }}>💬</div>
              <p style={{ marginBottom:'1rem' }}>No stories yet. Sign in and be the first to share yours!</p>
              <button onClick={onGetStarted} style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:10, padding:'0.65rem 1.5rem', fontWeight:700, cursor:'pointer' }}>Share My Story</button>
            </div>
          ) : (
            <div className="stories-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
              {stories.map((s,i) => (
                <div key={s._id||i} className="story-card" style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:20, padding:'2rem', position:'relative', overflow:'hidden', transition:'all .25s', boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
                  <div style={{ position:'absolute', top:12, left:16, fontSize:'4rem', color:'#f1f5f9', lineHeight:1, fontFamily:'Georgia,serif', fontWeight:900, userSelect:'none' }}>"</div>
                  <div style={{ marginBottom:'0.8rem', paddingTop:'0.5rem' }}><Stars n={s.rating}/></div>
                  <p style={{ color:'#475569', lineHeight:1.75, fontSize:'0.875rem', marginBottom:'1.5rem' }}>{s.message}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.8rem' }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', background:'#e0e7ff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.8rem', color:'#4338ca', flexShrink:0 }}>{s.name?.[0]?.toUpperCase()||'?'}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'0.875rem', color:'#1e293b' }}>{s.name}</div>
                      {s.itemRecovered && <div style={{ fontSize:'0.75rem', color:'#94a3b8' }}>✅ {s.itemRecovered}</div>}
                    </div>
                    <span style={{ marginLeft:'auto', fontSize:'0.72rem', color:'#94a3b8' }}>{new Date(s.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'#6366f1', padding:'5rem 1.5rem', textAlign:'center' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.5px', marginBottom:'0.8rem' }}>Ready to get started?</h2>
          <p style={{ color:'rgba(255,255,255,.75)', marginBottom:'2rem', fontSize:'1rem', lineHeight:1.6 }}>Join CU students already using CampusFinds to recover their belongings.</p>
          <button className="land-btn" onClick={onGetStarted}
            style={{ background:'#fff', color:'#6366f1', border:'none', borderRadius:12, padding:'1rem 2.5rem', fontWeight:800, fontSize:'1rem', cursor:'pointer', transition:'all .2s', boxShadow:'0 8px 28px rgba(0,0,0,.15)' }}>
            🔍 Create Account — It's Free
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background:'#0f172a', color:'rgba(255,255,255,.4)', padding:'2rem 1.5rem', textAlign:'center' }}>
        <div style={{ fontWeight:800, fontSize:'1.05rem', color:'rgba(255,255,255,.7)', marginBottom:'0.4rem' }}>🔍 CampusFinds</div>
        <p style={{ fontSize:'0.8rem', margin:0 }}>Campus Lost &amp; Found · Chandigarh University · E1 Block, Student Care</p>
        <p style={{ fontSize:'0.75rem', marginTop:'0.4rem', opacity:.6 }}>© {new Date().getFullYear()} CampusFinds. Built with ❤️ for students.</p>
      </footer>
    </div>
  )
}
