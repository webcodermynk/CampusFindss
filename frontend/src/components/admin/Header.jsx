import React, { useState, useRef, useEffect } from 'react'

const NAV = [
  { id:'dashboard',  label:'Dashboard',           icon:'📊' },
  { id:'lostItems',  label:'Lost Items',           icon:'🔴' },
  { id:'foundItems', label:'Found Items',          icon:'🟢' },
  { id:'claims',     label:'Claims',               icon:'📋' },
  { id:'users',      label:'Users',                icon:'👥' },
  { id:'feedback',   label:'Feedback & Complaints',icon:'💬' },
  { id:'analytics',  label:'Analytics',            icon:'📈' },
  { id:'settings',   label:'Settings',             icon:'⚙️' },
]

export default function AdminHeader({ currentPage, showPage, adminName, adminEmail, onLogout, darkMode, toggleDarkMode }) {
  const [showCard, setShowCard] = useState(false)
  const cardRef = useRef(null)
  const initials = adminName?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'SA'

  useEffect(() => {
    const fn = e => { if (cardRef.current && !cardRef.current.contains(e.target)) setShowCard(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const go = id => { showPage(id) }

  return (
    <>
      <style>{`
        .adm-link{display:inline-flex;align-items:center;gap:0.35rem;text-decoration:none;font-size:0.8rem;font-weight:600;padding:0.4rem 0.75rem;border-radius:9px;transition:all .2s;white-space:nowrap;color:var(--text-2,#64748b)}
        .adm-link:hover{background:rgba(99,102,241,.08);color:#6366f1}
        .adm-link.active{background:rgba(99,102,241,.12);color:#6366f1;font-weight:700}
        .adm-nav-scroll{display:flex;align-items:center;gap:0.25rem;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;padding:0.35rem 0}
        .adm-nav-scroll::-webkit-scrollbar{display:none}
        .adm-toggle{width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;position:relative;transition:background .3s;flex-shrink:0}
        .adm-toggle::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .3s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
        .adm-toggle.dark{background:#6366f1}.adm-toggle.dark::after{transform:translateX(18px)}.adm-toggle:not(.dark){background:#cbd5e1}
      `}</style>
      <div style={{ height:108 }}/>
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:1000, background:'var(--surface,#fff)', borderBottom:'1px solid var(--border,#e2e8f0)', boxShadow:'0 1px 12px rgba(0,0,0,.06)' }}>
        <div style={{ height:56, display:'flex', alignItems:'center', padding:'0 1.25rem', borderBottom:'1px solid var(--border,#e2e8f0)' }}>
          <div style={{ maxWidth:1280, margin:'0 auto', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
            <a href="#" onClick={e=>{ e.preventDefault(); go('dashboard'); }} style={{ fontSize:'1.1rem', fontWeight:900, color:'var(--text,#1e293b)', textDecoration:'none', letterSpacing:'-0.5px', flexShrink:0 }}>
              🛡️ Admin Panel
            </a>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <button className={`adm-toggle ${darkMode?'dark':''}`} onClick={toggleDarkMode} aria-label="Toggle dark mode"/>
              <div style={{ position:'relative' }} ref={cardRef}>
                <button onClick={()=>setShowCard(p=>!p)} style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'none', border:'1.5px solid var(--border,#e2e8f0)', borderRadius:10, padding:'0.3rem 0.6rem 0.3rem 0.4rem', cursor:'pointer', transition:'border-color .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#6366f1'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border,#e2e8f0)'}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'0.72rem' }}>{initials}</div>
                  <span style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--text,#1e293b)' }}>{adminName}</span>
                </button>
                {showCard && (
                  <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, background:'var(--surface,#fff)', border:'1.5px solid var(--border,#e2e8f0)', borderRadius:14, padding:'1rem', minWidth:200, boxShadow:'0 8px 28px rgba(0,0,0,.12)', zIndex:100 }}>
                    <div style={{ marginBottom:'0.75rem', paddingBottom:'0.75rem', borderBottom:'1px solid var(--border,#e2e8f0)' }}>
                      <div style={{ fontWeight:700, color:'var(--text,#1e293b)', fontSize:'0.88rem' }}>{adminName}</div>
                      {adminEmail && <div style={{ fontSize:'0.73rem', color:'var(--text-3,#94a3b8)', marginTop:2 }}>{adminEmail}</div>}
                      <span style={{ display:'inline-block', marginTop:'0.4rem', background:'#fef3c7', color:'#92400e', padding:'0.15rem 0.6rem', borderRadius:20, fontSize:'0.7rem', fontWeight:700 }}>🛡️ Administrator</span>
                    </div>
                    <button onClick={()=>{ setShowCard(false); onLogout?.() }}
                      style={{ width:'100%', background:'#fee2e2', color:'#991b1b', border:'none', borderRadius:9, padding:'0.55rem 1rem', fontWeight:700, fontSize:'0.83rem', cursor:'pointer' }}
                      onMouseEnter={e=>e.target.style.background='#fca5a5'} onMouseLeave={e=>e.target.style.background='#fee2e2'}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding:'0 1.25rem' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <nav className="adm-nav-scroll">
              {NAV.map(item => (
                <a key={item.id} href={`#${item.id}`} className={`adm-link ${currentPage===item.id?'active':''}`}
                  onClick={e=>{ e.preventDefault(); go(item.id); }}>
                  {item.icon} {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
