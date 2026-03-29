import React from 'react';

const AdminFooter = () => (
  <footer style={{ background:'var(--surface,#fff)', borderTop:'1.5px solid var(--border,#e2e8f0)', marginTop:'auto', padding:'3rem 0 1.5rem' }}>
    <div className="container" style={{ maxWidth:1200 }}>
      
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2rem', marginBottom:'2rem' }}>
        
        {/* Brand */}
        <div>
          <div style={{ fontSize:'1.15rem', fontWeight:900, color:'var(--text,#1e293b)', marginBottom:'0.6rem' }}>
            🛡️ CampusFinds Admin
          </div>
          <p style={{ fontSize:'0.83rem', color:'var(--text-2,#64748b)', lineHeight:1.65, margin:0 }}>
            Admin dashboard to manage lost & found items, users, reports, and platform activity efficiently.
          </p>
        </div>

        {/* Admin Links */}
        <div>
          <div style={{ fontWeight:700, color:'var(--text,#1e293b)', fontSize:'0.83rem', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.8rem' }}>
            Dashboard
          </div>

          {['Overview','Users','Lost Items','Found Items','Reports','Analytics'].map((item) => (
            <span
              key={item}
              style={{
                display:'block',
                fontSize:'0.85rem',
                color:'var(--text-2,#64748b)',
                marginBottom:'0.35rem',
                cursor:'pointer',
                transition:'color .2s'
              }}
              onMouseEnter={e=>e.target.style.color='#6366f1'}
              onMouseLeave={e=>e.target.style.color='var(--text-2,#64748b)'}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Admin Contact */}
        <div>
          <div style={{ fontWeight:700, color:'var(--text,#1e293b)', fontSize:'0.83rem', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.8rem' }}>
            Admin Support
          </div>

          {[
            '📍 Chandigarh University Admin Block',
            '📞 +91 98765 43210',
            '✉️ admin@campusfinds.com',
            '🕐 Mon–Sat · 9 AM – 5 PM'
          ].map((item) => (
            <p key={item} style={{ fontSize:'0.83rem', color:'var(--text-2,#64748b)', marginBottom:'0.35rem' }}>
              {item}
            </p>
          ))}
        </div>

      </div>

      {/* Bottom Section */}
      <div style={{ borderTop:'1px solid var(--border,#e2e8f0)', paddingTop:'1.2rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.5rem' }}>
        
        <p style={{ fontSize:'0.78rem', color:'var(--text-3,#94a3b8)', margin:0 }}>
          © {new Date().getFullYear()} CampusFinds Admin · Chandigarh University
        </p>

        <span style={{ fontSize:'0.75rem', background:'#f0fdf4', color:'#15803d', padding:'0.2rem 0.7rem', borderRadius:20, fontWeight:600 }}>
          🟢 All systems operational
        </span>

      </div>

    </div>
  </footer>
);

export default AdminFooter;
