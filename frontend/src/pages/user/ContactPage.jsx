import React, { useState, useEffect } from 'react'

const StatusBadge = ({ status }) => {
  const s = status === 'resolved'
    ? { bg: '#dbeafe', c: '#1e40af', l: '✅ Resolved' }
    : { bg: '#fef3c7', c: '#92400e', l: '⏳ Pending' }
  return <span style={{ background: s.bg, color: s.c, padding: '0.22rem 0.7rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>{s.l}</span>
}

const ClaimBadge = ({ status }) => {
  const M = {
    waiting:  { bg:'#fef3c7', c:'#92400e', l:'⏳ Pending Review' },
    pending:  { bg:'#fef3c7', c:'#92400e', l:'⏳ Pending Review' },
    approved: { bg:'#d1fae5', c:'#065f46', l:'✅ Approved' },
    rejected: { bg:'#fee2e2', c:'#991b1b', l:'❌ Rejected' },
  }
  const s = M[status?.toLowerCase()] || M.waiting
  return <span style={{ background:s.bg, color:s.c, padding:'0.22rem 0.7rem', borderRadius:20, fontSize:'0.72rem', fontWeight:700 }}>{s.l}</span>
}

export default function ContactPage({ currentUser, toast }) {
  const [form, setForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [myComplaints, setMyComplaints] = useState([])
  const [loadingComplaints, setLoadingComplaints] = useState(false)
  const [tab, setTab] = useState('send')
  const [myClaims, setMyClaims] = useState([])
  const [loadingClaims, setLoadingClaims] = useState(false)

  useEffect(() => {
    if (tab === 'my' && currentUser?.email) loadComplaints()
    if (tab === 'claims' && currentUser?.email) loadClaims()
  }, [tab, currentUser])

  const loadComplaints = async () => {
    setLoadingComplaints(true)
    try {
      const res = await fetch(`/api/contact/by-email/${encodeURIComponent(currentUser.email)}`)
      setMyComplaints(await res.json())
    } catch { } finally { setLoadingComplaints(false) }
  }

  const loadClaims = async () => {
    setLoadingClaims(true)
    try {
      const res = await fetch(`/api/claims/by-email/${encodeURIComponent(currentUser.email)}`)
      if (res.ok) setMyClaims(await res.json())
    } catch { } finally { setLoadingClaims(false) }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast?.error('Please fill in all fields'); return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast?.success('Message sent! We\'ll get back to you soon.', 'Sent ✅')
      setForm(p => ({ ...p, subject: '', message: '' }))
      if (tab === 'my') loadComplaints()
    } catch { toast?.error('Failed to send message. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background: 'var(--bg-color,#f8f9fa)', minHeight: '100vh' }}>
      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#1d4ed8 50%,#3b82f6 100%)', color: '#fff', padding: '3.5rem 0 4.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(6,182,212,.15)', filter: 'blur(60px)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.3rem' }}>Contact & Complaints</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0 }}>Send us a message or track the status of your previous complaints.</p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 48" fill="none" style={{ display: 'block' }}><path d="M0,32 C360,0 1080,48 1440,12 L1440,48 L0,48 Z" fill="var(--bg-color,#f8f9fa)" /></svg>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--card-bg,#fff)', padding: '0.4rem', borderRadius: 12, border: '1px solid var(--border-color,#dee2e6)', width: 'fit-content' }}>
          {[{ id: 'send', label: '✉️ Send Message' }, { id: 'my', label: '📋 My Complaints' }, { id: 'claims', label: '🙋 My Claims' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '0.55rem 1.4rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s',
              background: tab === t.id ? 'linear-gradient(135deg,#06b6d4,#0284c7)' : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--text-muted,#6c757d)',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'send' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem' }}>
            {/* Info card */}
            <div style={{ background: 'var(--card-bg,#fff)', borderRadius: 14, border: '1px solid var(--border-color,#dee2e6)', padding: '1.8rem', boxShadow: '0 4px 15px rgba(0,0,0,.05)' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--text-color,#2c3e50)', marginBottom: '1.2rem' }}>🏫 Student Care Office</h4>
              {[
                { icon: '📍', label: 'Location', val: 'E1 Block, Room 105\nNorth Campus, Chandigarh University' },
                { icon: '📞', label: 'Phone', val: '(123) 456-7890' },
                { icon: '✉️', label: 'Email', val: 'campusfinds@campus.edu' },
                { icon: '🕐', label: 'Hours', val: 'Mon–Fri: 10 AM – 4 PM\nSat: 10 AM – 1 PM\nSun: Closed' },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ marginBottom: '1.1rem' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted,#6c757d)', marginBottom: '0.2rem' }}>{icon} {label}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-color,#2c3e50)', whiteSpace: 'pre-line' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{ background: 'var(--card-bg,#fff)', borderRadius: 14, border: '1px solid var(--border-color,#dee2e6)', padding: '1.8rem', boxShadow: '0 4px 15px rgba(0,0,0,.05)' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--text-color,#2c3e50)', marginBottom: '1.2rem' }}>Send a Message</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '0.9rem' }}>
                {[['Name', 'name'], ['Email', 'email']].map(([lbl, key]) => (
                  <div key={key}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted,#6c757d)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{lbl}</label>
                    <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '0.6rem 0.9rem', borderRadius: 8, border: '1.5px solid var(--border-color,#dee2e6)', background: 'var(--input-bg,#fff)', color: 'var(--text-color,#2c3e50)', fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#06b6d4'} onBlur={e => e.target.style.borderColor = 'var(--border-color,#dee2e6)'} />
                  </div>
                ))}
              </div>
              {['Subject', 'Message'].map(lbl => {
                const key = lbl.toLowerCase()
                const isTA = key === 'message'
                return (
                  <div key={key} style={{ marginBottom: '0.9rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted,#6c757d)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{lbl}</label>
                    {isTA
                      ? <textarea rows={4} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.9rem', borderRadius: 8, border: '1.5px solid var(--border-color,#dee2e6)', background: 'var(--input-bg,#fff)', color: 'var(--text-color,#2c3e50)', fontSize: '0.88rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#06b6d4'} onBlur={e => e.target.style.borderColor = 'var(--border-color,#dee2e6)'} />
                      : <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.9rem', borderRadius: 8, border: '1.5px solid var(--border-color,#dee2e6)', background: 'var(--input-bg,#fff)', color: 'var(--text-color,#2c3e50)', fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#06b6d4'} onBlur={e => e.target.style.borderColor = 'var(--border-color,#dee2e6)'} />
                    }
                  </div>
                )
              })}
              <button onClick={handleSubmit} disabled={loading} style={{ background: 'linear-gradient(135deg,#06b6d4,#0284c7)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'wait' : 'pointer', width: '100%', marginTop: '0.4rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {loading ? <><span style={{ width: 18, height: 18, border: '3px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>Sending…</> : '✉️ Send Message'}
              </button>
            </div>
          </div>
        )}

        {tab === 'claims' && (
          <div>
            <h3 style={{ fontWeight:800, color:'var(--text-color,#2c3e50)', marginBottom:'1.2rem' }}>🙋 Your Claim History</h3>
            {!currentUser ? (
              <div style={{ background:'var(--card-bg,#fff)', borderRadius:14, padding:'3rem', textAlign:'center', border:'1px solid var(--border-color,#dee2e6)', color:'var(--text-muted,#6c757d)' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem', opacity:0.4 }}>🔒</div>
                <p>Please log in to view your claims.</p>
              </div>
            ) : loadingClaims ? (
              <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div style={{ width:44, height:44, border:'4px solid #e2e8f0', borderTopColor:'#10b981', borderRadius:'50%', animation:'spin .8s linear infinite' }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
            ) : myClaims.length === 0 ? (
              <div style={{ background:'var(--card-bg,#fff)', borderRadius:14, padding:'3rem', textAlign:'center', border:'1px solid var(--border-color,#dee2e6)', color:'var(--text-muted,#6c757d)' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem', opacity:0.4 }}>📭</div>
                <p>You haven't submitted any claims yet.</p>
                <p style={{ fontSize:'0.85rem' }}>Go to <strong>Found Items</strong> and click "Claim This Item" on any item.</p>
              </div>
            ) : (
              <div style={{ display:'grid', gap:'1rem' }}>
                {myClaims.map(cl => (
                  <div key={cl._id} style={{ background:'var(--card-bg,#fff)', borderRadius:14, padding:'1.4rem 1.6rem', border:'1px solid var(--border-color,#dee2e6)', borderLeft:`4px solid ${cl.status==='approved'?'#10b981':cl.status==='rejected'?'#ef4444':'#f59e0b'}`, boxShadow:'0 4px 15px rgba(0,0,0,.04)' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0.6rem' }}>
                      <span style={{ fontWeight:700, color:'var(--text-color,#2c3e50)', fontSize:'0.95rem' }}>Claim #{cl._id?.slice(-5)}</span>
                      <ClaimBadge status={cl.status}/>
                    </div>
                    <p style={{ color:'var(--text-muted,#6c757d)', fontSize:'0.86rem', margin:'0 0 0.4rem', lineHeight:1.5 }}>
                      <strong>Your message:</strong> {cl.message?.length > 120 ? cl.message.slice(0,120)+'…' : cl.message}
                    </p>
                    <p style={{ color:'var(--text-muted,#6c757d)', fontSize:'0.8rem', margin:'0 0 0.4rem' }}>
                      📞 Contact: {cl.contact} · Submitted: {new Date(cl.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                    </p>
                    {cl.adminNote && (
                      <div style={{ background:'rgba(99,102,241,0.07)', borderRadius:8, padding:'0.7rem 0.9rem', marginTop:'0.6rem', borderLeft:'3px solid #6366f1' }}>
                        <div style={{ fontSize:'0.74rem', fontWeight:700, color:'#6366f1', marginBottom:'0.2rem' }}>📝 Admin Note:</div>
                        <div style={{ fontSize:'0.85rem', color:'var(--text-color,#2c3e50)' }}>{cl.adminNote}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'my' && (
          <div>
            <h3 style={{ fontWeight: 800, color: 'var(--text-color,#2c3e50)', marginBottom: '1.2rem' }}>📋 Your Complaint History</h3>
            {!currentUser ? (
              <div style={{ background: 'var(--card-bg,#fff)', borderRadius: 14, padding: '3rem', textAlign: 'center', border: '1px solid var(--border-color,#dee2e6)', color: 'var(--text-muted,#6c757d)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🔒</div>
                <p>Please log in to view your complaints.</p>
              </div>
            ) : loadingComplaints ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div style={{ width: 44, height: 44, border: '4px solid #e2e8f0', borderTopColor: '#06b6d4', borderRadius: '50%', animation: 'spin .8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
            ) : myComplaints.length === 0 ? (
              <div style={{ background: 'var(--card-bg,#fff)', borderRadius: 14, padding: '3rem', textAlign: 'center', border: '1px solid var(--border-color,#dee2e6)', color: 'var(--text-muted,#6c757d)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>📭</div>
                <p>You haven't submitted any complaints yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {myComplaints.map(c => (
                  <div key={c._id} style={{ background: 'var(--card-bg,#fff)', borderRadius: 14, padding: '1.4rem 1.6rem', border: '1px solid var(--border-color,#dee2e6)', borderLeft: `4px solid ${c.status === 'resolved' ? '#3b82f6' : '#f59e0b'}`, boxShadow: '0 4px 15px rgba(0,0,0,.04)', display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-color,#2c3e50)', fontSize: '0.95rem' }}>{c.subject}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      <p style={{ color: 'var(--text-muted,#6c757d)', fontSize: '0.86rem', margin: '0 0 0.5rem', lineHeight: 1.5 }}>{c.message.length > 140 ? c.message.slice(0, 140) + '…' : c.message}</p>
                      {c.adminReply && (
                        <div style={{ background: 'rgba(59,130,246,0.07)', borderRadius: 8, padding: '0.7rem 0.9rem', marginTop: '0.5rem', borderLeft: '3px solid #3b82f6' }}>
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.2rem' }}>Admin Reply:</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-color,#2c3e50)' }}>{c.adminReply}</div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted,#6c757d)', whiteSpace: 'nowrap', flexShrink: 0 }}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
