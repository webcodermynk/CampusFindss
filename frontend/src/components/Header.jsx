import React, { useState, useRef, useEffect } from 'react';

const NAV_ITEMS = [
  { label:'Home',        page:'home'       },
  { label:'Lost Items',  page:'lostItems'  },
  { label:'Found Items', page:'foundItems' },
  { label:'Report Item', page:'report'     },
  { label:'Complaints',  page:'contact'    },
];

export default function Header({ showPage, currentPage, userName, userEmail, onLogout, darkMode, toggleDarkMode }) {
  const [showCard, setShowCard] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cardRef = useRef(null);
  const initials = userName ? userName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'U';

  useEffect(() => {
    const fn = e => { if (cardRef.current && !cardRef.current.contains(e.target)) setShowCard(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const go = page => { showPage(page); setMobileOpen(false); };

  return (
    <>
      <style>{`
        .cf-nav-link{position:relative;text-decoration:none;font-size:0.875rem;font-weight:500;padding:0.4rem 0.2rem;transition:color .2s;color:var(--text-2,#64748b)}
        .cf-nav-link::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;background:#6366f1;border-radius:2px;transform:scaleX(0);transform-origin:left;transition:transform .2s}
        .cf-nav-link:hover,.cf-nav-link.active{color:#6366f1}
        .cf-nav-link.active::after,.cf-nav-link:hover::after{transform:scaleX(1)}
        .cf-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:800;font-size:0.8rem;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2.5px solid transparent;transition:border-color .2s}
        .cf-avatar:hover{border-color:#6366f1}
        .cf-toggle{width:42px;height:23px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:background .3s;flex-shrink:0}
        .cf-toggle::after{content:'';position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:transform .3s;box-shadow:0 1px 4px rgba(0,0,0,.2)}
        .cf-toggle.dark{background:#6366f1}
        .cf-toggle.dark::after{transform:translateX(19px)}
        .cf-toggle:not(.dark){background:#cbd5e1}
        @media(max-width:768px){.cf-nav-desktop{display:none!important}.cf-mobile-btn{display:flex!important}}
        @media(min-width:769px){.cf-mobile-btn{display:none!important}}
      `}</style>
      <div style={{ height:65 }}/>
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:1000, height:65, background:'var(--surface,#fff)', borderBottom:'1px solid var(--border,#e2e8f0)', boxShadow:'0 1px 12px rgba(0,0,0,.06)', display:'flex', alignItems:'center' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 1.25rem', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
          <a href="#" onClick={e=>{ e.preventDefault(); go('home'); }} style={{ fontSize:'1.2rem', fontWeight:900, color:'var(--text,#1e293b)', textDecoration:'none', letterSpacing:'-0.5px', flexShrink:0 }}>
            🔍 CampusFinds
          </a>
          <nav className="cf-nav-desktop" style={{ display:'flex', alignItems:'center', gap:'1.6rem' }}>
            {NAV_ITEMS.map(item => (
              <a key={item.page} href={`#${item.page}`} className={`cf-nav-link ${currentPage===item.page?'active':''}`}
                onClick={e=>{ e.preventDefault(); go(item.page); }}>{item.label}</a>
            ))}
          </nav>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
            <button className={`cf-toggle ${darkMode?'dark':''}`} onClick={toggleDarkMode} aria-label="Toggle dark mode"/>
            <div style={{ position:'relative' }} ref={cardRef}>
              <div className="cf-avatar" onClick={()=>setShowCard(p=>!p)} title={userName}>{initials}</div>
              {showCard && (
                <div style={{ position:'absolute', top:'calc(100% + 10px)', right:0, background:'var(--surface,#fff)', border:'1.5px solid var(--border,#e2e8f0)', borderRadius:14, padding:'1rem', minWidth:200, boxShadow:'0 8px 28px rgba(0,0,0,.12)', zIndex:100 }}>
                  <div style={{ marginBottom:'0.75rem', paddingBottom:'0.75rem', borderBottom:'1px solid var(--border,#e2e8f0)' }}>
                    <div style={{ fontWeight:700, color:'var(--text,#1e293b)', fontSize:'0.9rem' }}>{userName}</div>
                    {userEmail && <div style={{ fontSize:'0.75rem', color:'var(--text-3,#94a3b8)', marginTop:2 }}>{userEmail}</div>}
                  </div>
                  <button onClick={()=>{ setShowCard(false); onLogout?.(); }}
                    style={{ width:'100%', background:'#fee2e2', color:'#991b1b', border:'none', borderRadius:9, padding:'0.55rem 1rem', fontWeight:700, fontSize:'0.83rem', cursor:'pointer' }}
                    onMouseEnter={e=>e.target.style.background='#fca5a5'} onMouseLeave={e=>e.target.style.background='#fee2e2'}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            <button className="cf-mobile-btn" onClick={()=>setMobileOpen(p=>!p)}
              style={{ background:'none', border:'1.5px solid var(--border,#e2e8f0)', borderRadius:9, padding:'0.4rem 0.6rem', cursor:'pointer', display:'none', flexDirection:'column', gap:4 }}>
              {[0,1,2].map(i=><span key={i} style={{ width:18, height:2, background:'var(--text,#1e293b)', display:'block', borderRadius:2 }}/>)}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'var(--surface,#fff)', borderBottom:'1px solid var(--border,#e2e8f0)', padding:'0.75rem 1.25rem', display:'flex', flexDirection:'column', gap:'0.25rem', boxShadow:'0 8px 24px rgba(0,0,0,.1)' }}>
            {NAV_ITEMS.map(item => (
              <a key={item.page} href={`#${item.page}`} onClick={e=>{ e.preventDefault(); go(item.page); }}
                style={{ padding:'0.65rem 0.75rem', borderRadius:10, fontWeight:600, fontSize:'0.9rem', textDecoration:'none', color:currentPage===item.page?'#6366f1':'var(--text,#1e293b)', background:currentPage===item.page?'rgba(99,102,241,.08)':'transparent' }}>
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
