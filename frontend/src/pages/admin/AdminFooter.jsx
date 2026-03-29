import React from 'react'
export default function AdminFooter() {
  return (
    <footer style={{ background:'var(--surface,#fff)', borderTop:'1px solid var(--border,#e2e8f0)', padding:'1rem 1.5rem', marginTop:'auto' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontWeight:800, fontSize:'0.9rem', color:'var(--text,#1e293b)' }}>🛡️ CampusFinds Admin</span>
          <span style={{ fontSize:'0.75rem', color:'var(--text-3,#94a3b8)' }}>v4.0 · Chandigarh University</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
          <span style={{ fontSize:'0.75rem', color:'var(--text-3,#94a3b8)' }}>© {new Date().getFullYear()} CampusFinds</span>
          <span style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.75rem', color:'#10b981', fontWeight:600 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', display:'inline-block', boxShadow:'0 0 5px #10b981' }}/>
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  )
}
