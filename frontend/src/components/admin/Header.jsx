import React, { useState, useRef, useEffect } from 'react'
import '../../components/Header.css'

export default function AdminHeader({ currentPage, showPage, adminName, adminEmail, onLogout, darkMode, toggleDarkMode }) {
  const [showCard, setShowCard] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const cardRef = useRef(null)

  const NAV = [
    { id:'dashboard', label:'Dashboard' },
    { id:'lostItems', label:'Lost Items' },
    { id:'foundItems', label:'Found Items' },
    { id:'claims', label:'Claims' },
    { id:'users', label:'Users' },
    { id:'feedback', label:'Feedback' },
    { id:'analytics', label:'Analytics' },
    { id:'qrLabels', label:'QR Labels' },
    { id:'settings', label:'Settings' },
  ]

  useEffect(() => {
    const h = e => { if (cardRef.current && !cardRef.current.contains(e.target)) setShowCard(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const go = id => { showPage(id); setMenuOpen(false) }
  const initials = adminName?.split(' ').map(n=>n[0]).join('') || 'A'

  return (
    <div className="header-spacer">
      <nav className="app-navbar-fixed admin-theme" role="navigation">
        <div className="app-header-container">
          <a className="app-branding" href="#" onClick={() => go('dashboard')}>🛡️ Admin Panel</a>
          <button className={`navbar-toggler ${menuOpen?'is-active':''}`} onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle">
            <span className="toggler-line"/><span className="toggler-line"/>
          </button>
          <div className={`app-nav-wrapper ${menuOpen?'open':''}`}>
            <ul className="nav-list" role="menubar">
              {NAV.map(item => (
                <li key={item.id} role="none">
                  <a role="menuitem" className={`nav-link-item ${currentPage===item.id?'active':''}`} href={`#${item.id}`} onClick={()=>go(item.id)}>
                    {item.label}<span className="link-underline"/>
                  </a>
                </li>
              ))}
            </ul>
            <button className="dark-mode-toggle" onClick={toggleDarkMode} title={darkMode?'Light mode':'Dark mode'} style={{ marginRight:12 }}>
            </button>
            <div className="user-profile-section" ref={cardRef}>
              <button className="user-avatar-button admin-avatar-button" onClick={()=>setShowCard(!showCard)}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'0.85rem', border:'2px solid rgba(245,158,11,.4)' }}>{initials}</div>
              </button>
              {showCard && (
                <div className="user-card-popover admin-card-popover">
                  <p className="user-name-text" style={{ fontWeight:700 }}>👋 {adminName}</p>
                  <p style={{ fontSize:'0.78rem', color:'var(--text-muted,#6c757d)', margin:'0 0 0.8rem' }}>{adminEmail}</p>
                  <span style={{ display:'inline-block', background:'#fef3c7', color:'#92400e', padding:'0.2rem 0.7rem', borderRadius:20, fontSize:'0.72rem', fontWeight:700, marginBottom:'0.8rem' }}>🛡️ ADMINISTRATOR</span>
                  <button className="logout-button admin-logout-button" onClick={()=>{ setShowCard(false); onLogout?.() }}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
