import React, { useState, useEffect, useMemo } from 'react'

const Modal = ({ open, onClose, item, onResolve }) => open ? (
  <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', backdropFilter:'blur(6px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
    <div onClick={e=>e.stopPropagation()} style={{ background:'var(--surface,#fff)', borderRadius:20, maxWidth:580, width:'100%', maxHeight:'92vh', overflow:'auto', boxShadow:'0 24px 64px rgba(0,0,0,.25)', border:'1px solid var(--border,#e2e8f0)' }}>
      <div style={{ background:'linear-gradient(135deg,#1e1b4b 0%,#4c1d95 50%,#7c3aed 100%)', padding:'1.4rem 1.8rem', borderRadius:'20px 20px 0 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ color:'rgba(255,255,255,.5)', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Feedback Message</div>
          <h4 style={{ color:'#fff', fontWeight:800, margin:0 }}>{item?.subject}</h4>
        </div>
        <button onClick={onClose} style={{ background:'rgba(255,255,255,.1)', border:'none', width:32, height:32, borderRadius:'50%', color:'#fff', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
      </div>
      {item && (
        <div style={{ padding:'1.8rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'1.5rem' }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#06b6d4,#0284c7)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'1rem' }}>{item.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={{ fontWeight:700, color:'var(--text,#1e293b)' }}>{item.name}</div>
              <div style={{ fontSize:'0.82rem', color:'#94a3b8' }}>{item.email} · {new Date(item.createdAt).toLocaleString()}</div>
            </div>
            <span style={{ marginLeft:'auto', background:item.status==='resolved'?'#dbeafe':'#fef3c7', color:item.status==='resolved'?'#1e40af':'#92400e', padding:'0.22rem 0.7rem', borderRadius:20, fontSize:'0.72rem', fontWeight:700 }}>
              {item.status==='resolved'?'✅ Resolved':'⏳ Pending'}
            </span>
          </div>
          <div style={{ background:'var(--surface2,#f8f9fa)', borderRadius:12, padding:'1.2rem', marginBottom:'1.5rem' }}>
            <p style={{ color:'var(--text,#1e293b)', lineHeight:1.7, margin:0, fontSize:'0.92rem' }}>{item.message}</p>
          </div>
          {item.adminReply && (
            <div style={{ background:'rgba(59,130,246,.07)', borderRadius:10, padding:'1rem', marginBottom:'1.5rem', borderLeft:'3px solid #3b82f6' }}>
              <div style={{ fontSize:'0.74rem', fontWeight:700, color:'#3b82f6', marginBottom:4 }}>Admin Reply</div>
              <p style={{ color:'var(--text,#1e293b)', margin:0, fontSize:'0.9rem' }}>{item.adminReply}</p>
            </div>
          )}
          {item.status !== 'resolved' && (
            <div>
              <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#94a3b8', display:'block', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.04em' }}>Reply to user (optional)</label>
              <ResolveForm item={item} onResolve={onResolve} />
            </div>
          )}
          {item.status === 'resolved' && (
            <div style={{ background:'#d1fae5', borderRadius:10, padding:'0.9rem 1.2rem', display:'flex', alignItems:'center', gap:'0.7rem' }}>
              <span style={{ fontSize:'1.3rem' }}>✅</span>
              <span style={{ color:'#065f46', fontWeight:600, fontSize:'0.9rem' }}>This feedback has been resolved.</span>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
) : null

function ResolveForm({ item, onResolve }) {
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    setLoading(true)
    await onResolve(item._id, reply)
    setLoading(false)
  }
  return (
    <div>
      <textarea rows={3} value={reply} onChange={e=>setReply(e.target.value)} placeholder="Optional reply message to the student…" style={{ width:'100%', padding:'0.7rem 0.9rem', borderRadius:8, border:'1.5px solid var(--border,#e2e8f0)', background:'var(--surface,#fff)', color:'var(--text,#1e293b)', fontSize:'0.88rem', fontFamily:'inherit', outline:'none', resize:'vertical', marginBottom:'0.9rem' }}/>
      <button onClick={submit} disabled={loading} style={{ background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff', border:'none', borderRadius:10, padding:'0.75rem 2rem', fontWeight:700, cursor:loading?'wait':'pointer', display:'flex', alignItems:'center', gap:'0.5rem' }}>
        {loading ? <>⏳ Resolving…</> : <>✅ Mark as Resolved</>}
      </button>
    </div>
  )
}

export default function FeedbackComplaints({ toast }) {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchFeedbacks() }, [])

  const fetchFeedbacks = async () => {
    setLoading(true)
    try { const r = await fetch('/api/contact'); setFeedbacks(await r.json()) }
    catch { toast?.error('Failed to load feedback') }
    finally { setLoading(false) }
  }

  const filtered = useMemo(() => feedbacks
    .filter(f => filter === 'all' || f.status === filter)
    .filter(f => [f.name, f.email, f.subject, f.message].join(' ').toLowerCase().includes(search.toLowerCase()))
  , [feedbacks, search, filter])

  const pending = feedbacks.filter(f => f.status === 'pending').length

  const handleResolve = async (id, adminReply) => {
    try {
      const r = await fetch(`/api/contact/${id}/resolve`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ adminReply }) })
      const updated = await r.json()
      setFeedbacks(p => p.map(f => f._id === id ? updated : f))
      setSelected(updated)
      toast?.success('Feedback resolved and student notified 📧', 'Resolved')
    } catch { toast?.error('Failed to resolve feedback') }
  }

  const initials = n => n?.[0]?.toUpperCase() || '?'
  const colors = ['#6366f1','#10b981','#3b82f6','#f59e0b','#8b5cf6','#ef4444','#06b6d4']
  const aColor = n => colors[(n?.charCodeAt(0)||0) % colors.length]

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh' }}><div style={{ width:44, height:44, border:'4px solid #e2e8f0', borderTopColor:'#06b6d4', borderRadius:'50%', animation:'spin .8s linear infinite' }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ background:'var(--bg,#f8fafc)', minHeight:'100vh' }}>
      <div style={{ background:'linear-gradient(135deg,#1e1b4b 0%,#4c1d95 50%,#7c3aed 100%)', color:'#fff', padding:'3rem 0 4rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-20%', right:'-5%', width:280, height:280, borderRadius:'50%', background:'rgba(6,182,212,.15)', filter:'blur(60px)' }}/>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 1.5rem', position:'relative', zIndex:2 }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>💬</div>
          <h1 style={{ fontSize:'2.2rem', fontWeight:900, letterSpacing:'-1px', marginBottom:'0.3rem' }}>Feedback & Complaints</h1>
          <p style={{ color:'rgba(255,255,255,.65)', margin:0 }}>{feedbacks.length} total · <strong style={{ color:'#67e8f9' }}>{pending} pending</strong></p>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0 }}><svg viewBox="0 0 1440 48" fill="none" style={{ display:'block' }}><path d="M0,32 C360,0 1080,48 1440,12 L1440,48 L0,48 Z" fill="var(--bg,#f8fafc)"/></svg></div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'1.5rem' }}>
        <div style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap', alignItems:'center', marginBottom:'1rem' }}>
          <div style={{ flex:1, minWidth:200, position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search messages…" style={{ width:'100%', padding:'0.65rem 1rem 0.65rem 2.5rem', borderRadius:10, border:'1.5px solid var(--border,#e2e8f0)', background:'var(--surface,#fff)', color:'var(--text,#1e293b)', fontSize:'0.9rem', outline:'none' }}/>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {[{ id:'all',l:'All' },{ id:'pending',l:'⏳ Pending' },{ id:'resolved',l:'✅ Resolved' }].map(c => (
            <button key={c.id} onClick={()=>setFilter(c.id)} style={{ padding:'0.38rem 1rem', borderRadius:20, border:'1.5px solid', fontWeight:600, fontSize:'0.82rem', cursor:'pointer', transition:'all .2s', background:filter===c.id?'linear-gradient(135deg,#06b6d4,#0284c7)':'var(--surface,#fff)', color:filter===c.id?'#fff':'#94a3b8', borderColor:filter===c.id?'transparent':'var(--border,#e2e8f0)' }}>{c.l}</button>
          ))}
          <span style={{ marginLeft:'auto', alignSelf:'center', color:'#94a3b8', fontSize:'0.85rem', fontWeight:600 }}>{filtered.length} messages</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ background:'var(--surface,#fff)', borderRadius:14, padding:'3rem', textAlign:'center', border:'1px solid var(--border,#e2e8f0)', color:'#94a3b8' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem', opacity:.4 }}>📭</div><p>No messages found.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gap:'0.9rem' }}>
            {filtered.map(f => (
              <div key={f._id} onClick={()=>setSelected(f)} style={{ background:'var(--surface,#fff)', borderRadius:14, padding:'1.2rem 1.4rem', border:'1px solid var(--border,#e2e8f0)', borderLeft:`4px solid ${f.status==='resolved'?'#3b82f6':'#f59e0b'}`, cursor:'pointer', transition:'all .2s', boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.08)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,.04)'}}>
                <div style={{ display:'flex', gap:'0.9rem', alignItems:'flex-start' }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${aColor(f.name)},${aColor(f.name)}bb)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'0.9rem', flexShrink:0 }}>{initials(f.name)}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem', flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700, color:'var(--text,#1e293b)', fontSize:'0.9rem' }}>{f.name} <span style={{ fontWeight:400, color:'#94a3b8', fontSize:'0.8rem' }}>— {f.subject}</span></span>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
                        {f.status==='pending' && <span style={{ background:'#fef3c7', color:'#92400e', padding:'0.15rem 0.5rem', borderRadius:20, fontSize:'0.68rem', fontWeight:700 }}>NEW</span>}
                        <span style={{ background:f.status==='resolved'?'#dbeafe':'#fef3c7', color:f.status==='resolved'?'#1e40af':'#92400e', padding:'0.15rem 0.5rem', borderRadius:20, fontSize:'0.7rem', fontWeight:700 }}>{f.status==='resolved'?'✅ Resolved':'⏳ Pending'}</span>
                        <span style={{ fontSize:'0.75rem', color:'#94a3b8' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p style={{ color:'#94a3b8', fontSize:'0.84rem', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={()=>setSelected(null)} item={selected} onResolve={handleResolve}/>
    </div>
  )
}
