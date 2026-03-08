import React, { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

const MetricCard = ({ icon, label, value, sub, color }) => (
  <div style={{ background: 'var(--surface,#fff)', borderRadius: 14, padding: '1.4rem 1.2rem', border: '1px solid var(--border,#e2e8f0)', boxShadow: '0 2px 10px rgba(0,0,0,.04)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
    <div style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{icon}</div>
    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text,#1e293b)', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: '0.78rem', color: 'var(--text-3,#94a3b8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: '0.8rem', color, fontWeight: 600, marginTop: 4 }}>{sub}</div>}
  </div>
)

const ChartCard = ({ title, children, span = 1 }) => (
  <div style={{ background: 'var(--surface,#fff)', borderRadius: 14, border: '1px solid var(--border,#e2e8f0)', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,.04)', gridColumn: span > 1 ? `span ${span}` : undefined }}>
    <h4 style={{ fontWeight: 800, color: 'var(--text,#1e293b)', marginBottom: '1.2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>{title}</h4>
    {children}
  </div>
)

const customTooltipStyle = { background: 'var(--surface,#fff)', border: '1px solid var(--border,#e2e8f0)', borderRadius: 10, fontSize: '0.82rem', boxShadow: '0 4px 16px rgba(0,0,0,.1)' }

export default function Analytics({ toast }) {
  const [data, setData] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const [analyticsRes, matchesRes] = await Promise.all([fetch('/api/analytics'), fetch('/api/analytics/ai-matches')])
        setData(await analyticsRes.json())
        setMatches(await matchesRes.json())
      } catch { toast?.error('Failed to load analytics') }
      finally { setLoading(false) }
    })()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem', color: 'var(--text-3,#94a3b8)' }}>
      <div style={{ width: 44, height: 44, border: '4px solid var(--border,#e2e8f0)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p>Loading analytics…</p>
    </div>
  )

  const { summary = {}, weeklyData = [], monthlyData = [], categoryData = [], claimStatusData = [] } = data || {}

  return (
    <div style={{ background: 'var(--bg,#f8fafc)', minHeight: '100vh' }}>
      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg,#0c4a6e 0%,#0369a1 50%,#06b6d4 100%)', color: '#fff', padding: '3rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(99,102,241,.15)', filter: 'blur(60px)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>📊</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.3rem' }}>Analytics & Insights</h1>
          <p style={{ color: 'rgba(255,255,255,.65)', margin: 0 }}>Platform performance, trends, and AI-powered item matching.</p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 48" fill="none" style={{ display: 'block' }}><path d="M0,32 C360,0 1080,48 1440,12 L1440,48 L0,48 Z" fill="var(--bg,#f8fafc)" /></svg>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', background: 'var(--surface,#fff)', padding: '0.35rem', borderRadius: 12, border: '1px solid var(--border,#e2e8f0)', width: 'fit-content' }}>
          {[{ id: 'overview', label: '📊 Overview' }, { id: 'trends', label: '📈 Trends' }, { id: 'ai', label: '🤖 AI Matches' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '0.5rem 1.2rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all .2s', background: tab === t.id ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text-3,#94a3b8)' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            {/* Metric cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <MetricCard icon="📦" label="Total Items" value={summary.totalItems || 0} color="#6366f1" />
              <MetricCard icon="✅" label="Resolved" value={summary.resolved || 0} sub={`${summary.resolutionRate || 0}% rate`} color="#10b981" />
              <MetricCard icon="📋" label="Total Claims" value={summary.totalClaims || 0} color="#f59e0b" />
              <MetricCard icon="💬" label="Feedback" value={summary.totalFeedback || 0} sub={`${summary.pendingFeedback || 0} pending`} color="#06b6d4" />
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <ChartCard title="📦 Category Breakdown">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={customTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="📋 Claim Status Distribution">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={claimStatusData} cx="50%" cy="50%" outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {claimStatusData.map((entry, i) => <Cell key={i} fill={entry.name === 'Approved' ? '#10b981' : entry.name === 'Rejected' ? '#ef4444' : '#f59e0b'} />)}
                    </Pie>
                    <Tooltip contentStyle={customTooltipStyle} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Weekly chart */}
            <ChartCard title="📅 Weekly Activity (Last 8 Weeks)">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border,#e2e8f0)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--text-3,#94a3b8)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-3,#94a3b8)' }} allowDecimals={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend />
                  <Bar dataKey="lost" name="Lost" fill="#ef4444" radius={[4,4,0,0]} />
                  <Bar dataKey="found" name="Found" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {tab === 'trends' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <ChartCard title="📈 Monthly Trend (Last 6 Months)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border,#e2e8f0)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-3,#94a3b8)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-3,#94a3b8)' }} allowDecimals={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="lost" name="Lost Reports" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="found" name="Found Items" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="claims" name="Claims" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {tab === 'ai' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.08))', borderRadius: 14, padding: '1.2rem 1.5rem', border: '1px solid rgba(99,102,241,.2)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text,#1e293b)', fontSize: '0.95rem' }}>AI Item Matching</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-3,#94a3b8)' }}>Using text similarity to suggest possible lost ↔ found item matches. Review and reach out to the finders manually.</div>
              </div>
              <span style={{ marginLeft: 'auto', background: '#ede9fe', color: '#5b21b6', padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>{matches.length} matches</span>
            </div>
            {matches.length === 0 ? (
              <div style={{ background: 'var(--surface,#fff)', borderRadius: 14, padding: '3rem', textAlign: 'center', border: '1px solid var(--border,#e2e8f0)', color: 'var(--text-3,#94a3b8)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🔍</div>
                <p>No matches found yet. Add more items to see AI suggestions.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {matches.map((m, i) => (
                  <div key={i} style={{ background: 'var(--surface,#fff)', borderRadius: 14, border: '1px solid var(--border,#e2e8f0)', padding: '1.2rem 1.4rem', boxShadow: '0 2px 10px rgba(0,0,0,.04)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Lost item */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>🔴 Lost</div>
                      <div style={{ fontWeight: 700, color: 'var(--text,#1e293b)', fontSize: '0.9rem' }}>{m.lostItem.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-3,#94a3b8)', marginTop: 2 }}>📍 {m.lostItem.location} · {m.lostItem.category}</div>
                    </div>
                    {/* Score */}
                    <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: m.score >= 40 ? '#10b981' : m.score >= 25 ? '#f59e0b' : '#6366f1' }}>{m.score}%</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-3,#94a3b8)', fontWeight: 600 }}>MATCH</div>
                    </div>
                    {/* Found item */}
                    <div style={{ flex: 1, minWidth: 200, textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>🟢 Found</div>
                      <div style={{ fontWeight: 700, color: 'var(--text,#1e293b)', fontSize: '0.9rem' }}>{m.foundItem.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-3,#94a3b8)', marginTop: 2 }}>📍 {m.foundItem.location} · {m.foundItem.category}</div>
                    </div>
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
