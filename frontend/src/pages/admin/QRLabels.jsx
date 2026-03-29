import React, { useState, useEffect } from 'react'
import { getImageUrl } from '../../utils'

const QRLabel = ({ item, type, qrData, onPrint }) => (
  <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '1.2rem', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,.06)' }}>
    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: type === 'lost' ? '#ef4444' : '#10b981', marginBottom: '0.6rem' }}>
      {type === 'lost' ? '🔴 Lost' : '🟢 Found'} Item
    </div>
    {qrData ? (
      <img src={qrData} alt="QR Code" style={{ width: 120, height: 120, margin: '0 auto 0.7rem', display: 'block', borderRadius: 8 }} />
    ) : (
      <div style={{ width: 120, height: 120, margin: '0 auto 0.7rem', background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>Loading…</div>
    )}
    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem', marginBottom: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>📍 {item.location}</div>
    <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.2rem', fontFamily: 'monospace' }}>ID: {item._id?.slice(-6)}</div>
    <button onClick={() => onPrint(item, type, qrData)} style={{ marginTop: '0.8rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.4rem 1rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
      🖨️ Print Label
    </button>
  </div>
)

export default function QRLabels({ toast }) {
  const [foundItems, setFoundItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrCache, setQrCache] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/found-items')
        const data = await res.json()
        setFoundItems(data)
        // Preload QR codes
        data.slice(0, 12).forEach(async item => {
          try {
            const r = await fetch(`/api/qrcode/${item._id}`)
            const { qr } = await r.json()
            setQrCache(p => ({ ...p, [item._id]: qr }))
          } catch {}
        })
      } catch { toast?.error('Failed to load items') }
      finally { setLoading(false) }
    })()
  }, [])

  const loadQR = async (id) => {
    if (qrCache[id]) return
    try {
      const r = await fetch(`/api/qrcode/${id}`)
      const { qr } = await r.json()
      setQrCache(p => ({ ...p, [id]: qr }))
    } catch {}
  }

  const handlePrint = (item, type, qrData) => {
    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html><html><head><title>QR Label — ${item.title}</title>
      <style>body{font-family:system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#fff}
      .label{border:2px solid #1e293b;border-radius:12px;padding:20px;text-align:center;width:240px;page-break-inside:avoid}
      @media print{body{margin:0}.label{border:2px solid #000}}</style></head>
      <body><div class="label">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${type==='found'?'#10b981':'#ef4444'};margin-bottom:10px">${type.toUpperCase()} ITEM — CAMPUSFINDS</div>
        <img src="${qrData}" width="140" height="140" style="display:block;margin:0 auto 12px;border-radius:6px"/>
        <div style="font-size:15px;font-weight:800;margin-bottom:6px">${item.title}</div>
        <div style="font-size:12px;color:#64748b;margin-bottom:4px">📍 ${item.location}</div>
        <div style="font-size:11px;color:#94a3b8;font-family:monospace">ID: ${item._id?.slice(-6)}</div>
        <div style="margin-top:12px;font-size:11px;color:#475569">Scan to view · Student Care, E1-105</div>
      </div></body></html>
    `)
    win.document.close()
    setTimeout(() => { win.print(); win.close() }, 300)
  }

  const filtered = foundItems.filter(it => [it.title, it.location, it.category].join(' ').toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem', color: '#94a3b8' }}>
      <div style={{ width: 44, height: 44, border: '4px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin .8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p>Loading items…</p>
    </div>
  )

  return (
    <div style={{ background: 'var(--bg,#f8fafc)', minHeight: '100vh' }}>
      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg,#064e3b 0%,#0f766e 50%,#14b8a6 100%)', color: '#fff', padding: '3rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(245,158,11,.15)', filter: 'blur(60px)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>🏷️</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.3rem' }}>QR Code Labels</h1>
          <p style={{ color: 'rgba(255,255,255,.65)', margin: 0 }}>Generate and print QR sticker labels for found items stored at the office.</p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 48" fill="none" style={{ display: 'block' }}><path d="M0,32 C360,0 1080,48 1440,12 L1440,48 L0,48 Z" fill="#f8fafc" /></svg>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…"
              style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: 10, border: '1.5px solid var(--border,#e2e8f0)', background: 'var(--surface,#fff)', color: 'var(--text,#1e293b)', fontSize: '0.9rem', outline: 'none' }} />
          </div>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>{filtered.length} found items</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: 'var(--surface,#fff)', borderRadius: 14, padding: '3rem', textAlign: 'center', border: '1px solid var(--border,#e2e8f0)', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>📭</div>
            <p>No found items available.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
            {filtered.map(item => {
              if (!qrCache[item._id]) loadQR(item._id)
              return <QRLabel key={item._id} item={item} type="found" qrData={qrCache[item._id]} onPrint={handlePrint} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
