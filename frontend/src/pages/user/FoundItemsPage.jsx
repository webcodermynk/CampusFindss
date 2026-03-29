import React, { useState, useEffect } from 'react';
import ItemCard from '../../components/ItemCard.jsx';
import SuccessModal from '../../components/SuccessModal.jsx';
import { formatDate, getImageUrl, capitalizeFirstLetter } from '../../utils';

const CATEGORIES = ['All','Electronics','Books','Clothing','Accessories','Keys','Wallet','Phone','ID','Sports','Other'];
const ITEMS_PER_PAGE = 6;

const SkeletonCard = () => (
  <div className="col-md-4">
    <div className="card shadow-sm p-3">
      <div className="placeholder-glow">
        <div className="placeholder rounded w-100 mb-3" style={{ height:'180px' }}></div>
        <h5 className="placeholder-glow"><span className="placeholder col-6"></span></h5>
        <p className="placeholder-glow"><span className="placeholder col-7"></span></p>
      </div>
    </div>
  </div>
);

const FoundItemsPage = ({ showPage, currentUser }) => {
  const [searchTerm, setSearchTerm]     = useState('');
  const [inputValue, setInputValue]     = useState('');
  const [items, setItems]               = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimData, setClaimData]       = useState({ name:'', email:currentUser?.email||'', contact:'', message:'' });
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage]   = useState(1);
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');
  const [showSuccess, setShowSuccess]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [claimError, setClaimError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res  = await fetch('/api/found-items');
        const data = await res.json();
        setItems(data.map(item => ({ ...item, type:'found' })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    let result = [...items];
    if (activeCategory !== 'All')
      result = result.filter(i => (i.category||'').toLowerCase() === activeCategory.toLowerCase());
    if (searchTerm)
      result = result.filter(i =>
        (i.title||'').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.description||'').toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (dateFrom) result = result.filter(i => i.dateFound && new Date(i.dateFound) >= new Date(dateFrom));
    if (dateTo) {
      const end = new Date(dateTo); end.setHours(23,59,59,999);
      result = result.filter(i => i.dateFound && new Date(i.dateFound) <= end);
    }
    setFilteredItems(result);
    setCurrentPage(1);
  }, [searchTerm, items, activeCategory, dateFrom, dateTo]);

  const totalPages    = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage-1)*ITEMS_PER_PAGE, currentPage*ITEMS_PER_PAGE);

  const submitClaim = async () => {
    setClaimError('');
    if (!claimData.name || !claimData.contact || !claimData.message)
      return setClaimError('Please fill in your Name, Contact, and Message.');
    setSubmitting(true);
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          itemId:       selectedItem._id,
          itemType:     'found',
          claimantName: claimData.name,
          claimantEmail: claimData.email || '',
          contact:      claimData.contact,
          message:      claimData.message,
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || 'Server error');
      setShowClaimForm(false);
      setClaimData({ name:'', email:'', contact:'', message:'' });
      setShowSuccess(true);
    } catch (err) {
      setClaimError(err.message || 'Failed to submit. Please try again.');
    } finally { setSubmitting(false); }
  };

  const goBack = () => { setSelectedItem(null); setShowClaimForm(false); setClaimError(''); setClaimData({ name:'', email:'', contact:'', message:'' }); };

  /* ─── Item detail view ─── */
  if (selectedItem) return (
    <div style={{ background:'var(--bg,#f8fafc)', minHeight:'100vh', padding:'2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth:960 }}>
        <button
          onClick={goBack}
          style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'var(--surface,#fff)', border:'1.5px solid var(--border,#e2e8f0)', borderRadius:10, padding:'0.5rem 1.2rem', fontWeight:600, cursor:'pointer', color:'var(--text,#1e293b)', marginBottom:'1.5rem', fontSize:'0.9rem' }}
        >
          ← Back to Found Items
        </button>

        <div style={{ background:'var(--surface,#fff)', borderRadius:20, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.10)', border:'1px solid var(--border,#e2e8f0)' }}>
          {/* Hero image */}
          <div style={{ position:'relative', background:'linear-gradient(135deg,#f1f5f9,#e2e8f0)', minHeight:220 }}>
            {selectedItem.imageUrl
              ? <img src={getImageUrl(selectedItem.imageUrl)} alt={selectedItem.title}
                  style={{ width:'100%', height:280, objectFit:'contain', objectPosition:'center', display:'block', background:'#f8fafc', padding:'16px' }}/>
              : <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'0.5rem' }}>
                  <span style={{ fontSize:'4rem' }}>📦</span>
                  <span style={{ color:'rgba(255,255,255,.4)', fontSize:'0.85rem' }}>No image provided</span>
                </div>
            }
            {(() => {
              const st = selectedItem.status?.toLowerCase() || 'found';
              const M = { found:{bg:'#10b981',t:'🟢 Found'}, claimed:{bg:'#8b5cf6',t:'📋 Claimed'}, returned:{bg:'#3b82f6',t:'✅ Returned'} };
              const s = M[st]||M.found;
              return <span style={{ position:'absolute', top:14, left:14, background:s.bg, color:'#fff', borderRadius:20, padding:'0.3rem 0.9rem', fontWeight:700, fontSize:'0.8rem' }}>{s.t}</span>;
            })()}
          </div>

          <div style={{ padding:'2rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'1rem', alignItems:'start', marginBottom:'1.5rem' }}>
              <div>
                <h2 style={{ fontWeight:900, color:'var(--text,#1e293b)', marginBottom:'0.3rem', fontSize:'1.6rem' }}>{selectedItem.title}</h2>
                <span style={{ background:'#f1f5f9', color:'#64748b', padding:'0.25rem 0.8rem', borderRadius:20, fontSize:'0.78rem', fontWeight:600 }}>
                  📂 {capitalizeFirstLetter(selectedItem.category||'Other')}
                </span>
              </div>
            </div>

            {selectedItem.description && (
              <p style={{ color:'var(--text-2,#475569)', lineHeight:1.7, marginBottom:'1.5rem' }}>{selectedItem.description}</p>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
              {[['📍 Location Found', selectedItem.location], ['📅 Date Found', formatDate(selectedItem.dateFound)], ['📞 Contact', selectedItem.contact]].map(([label,val]) => val && (
                <div key={label} style={{ background:'var(--hover,#f8fafc)', borderRadius:12, padding:'1rem', border:'1px solid var(--border,#e2e8f0)' }}>
                  <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--text-3,#94a3b8)', marginBottom:'0.3rem' }}>{label}</div>
                  <div style={{ fontWeight:600, color:'var(--text,#1e293b)' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Claim button */}
            <button
              onClick={() => { setShowClaimForm(p=>!p); setClaimError(''); }}
              style={{ width:'100%', padding:'0.9rem', borderRadius:12, border:'none', fontWeight:700, fontSize:'1rem', cursor:'pointer', marginBottom:'0.5rem',
                background: showClaimForm ? '#f1f5f9' : 'linear-gradient(135deg,#10b981,#059669)',
                color: showClaimForm ? '#64748b' : '#fff' }}
            >
              {showClaimForm ? '✕ Cancel Claim' : '🙋 Claim This Item'}
            </button>

            {/* Claim form */}
            {showClaimForm && (
              <div style={{ background:'var(--hover,#f8fafc)', borderRadius:16, padding:'1.5rem', border:'1px solid var(--border,#e2e8f0)', marginTop:'0.5rem' }}>
                <h5 style={{ fontWeight:800, color:'var(--text,#1e293b)', marginBottom:'1rem' }}>🙋 Submit Your Claim</h5>
                <p style={{ fontSize:'0.83rem', color:'var(--text-2,#475569)', marginBottom:'1rem' }}>
                  Fill in your details. The admin will verify and connect you with the finder.
                </p>

                {claimError && (
                  <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'0.75rem 1rem', marginBottom:'1rem', color:'#991b1b', fontSize:'0.85rem', fontWeight:500 }}>
                    ⚠️ {claimError}
                  </div>
                )}

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem', marginBottom:'0.8rem' }}>
                  <div>
                    <label style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', color:'#94a3b8', display:'block', marginBottom:'0.3rem' }}>Your Name *</label>
                    <input
                      type="text" placeholder="Full name"
                      value={claimData.name}
                      onChange={e => setClaimData(p=>({...p,name:e.target.value}))}
                      style={{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:9, border:'1.5px solid var(--border,#e2e8f0)', background:'var(--surface,#fff)', color:'var(--text,#1e293b)', fontSize:'0.9rem', outline:'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', color:'#94a3b8', display:'block', marginBottom:'0.3rem' }}>Phone / Contact *</label>
                    <input
                      type="text" placeholder="Your contact number"
                      value={claimData.contact}
                      onChange={e => setClaimData(p=>({...p,contact:e.target.value}))}
                      style={{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:9, border:'1.5px solid var(--border,#e2e8f0)', background:'var(--surface,#fff)', color:'var(--text,#1e293b)', fontSize:'0.9rem', outline:'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom:'0.8rem' }}>
                  <label style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', color:'#94a3b8', display:'block', marginBottom:'0.3rem' }}>Email (optional — for status updates)</label>
                  <input
                    type="email" placeholder="your@email.com"
                    value={claimData.email}
                    onChange={e => setClaimData(p=>({...p,email:e.target.value}))}
                    style={{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:9, border:'1.5px solid var(--border,#e2e8f0)', background:'var(--surface,#fff)', color:'var(--text,#1e293b)', fontSize:'0.9rem', outline:'none' }}
                  />
                </div>

                <div style={{ marginBottom:'1rem' }}>
                  <label style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', color:'#94a3b8', display:'block', marginBottom:'0.3rem' }}>Proof of Ownership *</label>
                  <textarea
                    placeholder="Describe why this item is yours — unique marks, what was inside, when/where you last had it..."
                    rows={3}
                    value={claimData.message}
                    onChange={e => setClaimData(p=>({...p,message:e.target.value}))}
                    style={{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:9, border:'1.5px solid var(--border,#e2e8f0)', background:'var(--surface,#fff)', color:'var(--text,#1e293b)', fontSize:'0.9rem', outline:'none', resize:'vertical', fontFamily:'inherit' }}
                  />
                </div>

                <button
                  onClick={submitClaim}
                  disabled={submitting}
                  style={{ width:'100%', padding:'0.85rem', borderRadius:12, border:'none', background: submitting ? '#94a3b8' : 'linear-gradient(135deg,#10b981,#059669)', color:'#fff', fontWeight:700, fontSize:'1rem', cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? '⏳ Submitting...' : '✅ Submit Claim'}
                </button>
              </div>
            )}


          </div>
        </div>
      </div>

      <SuccessModal show={showSuccess} onClose={() => { setShowSuccess(false); goBack(); }} isClaim={true} claimData={claimData} />
    </div>
  );

  /* ─── Main list view ─── */
  return (
    <div id="found-items-page" className="page">
      {/* Beautiful page header — green theme */}
      <div style={{ background:'linear-gradient(135deg,#064e3b 0%,#065f46 40%,#047857 70%,#10b981 100%)', color:'#fff', padding:'3.5rem 0 5rem', position:'relative', overflow:'hidden', marginBottom:0 }}>
        <div style={{ position:'absolute', top:'-30%', right:'-5%', width:280, height:280, borderRadius:'50%', background:'rgba(16,185,129,.25)', filter:'blur(60px)' }}/>
        <div style={{ position:'absolute', bottom:'-20%', left:'5%', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.08)', filter:'blur(40px)' }}/>
        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', borderRadius:50, padding:'0.35rem 1rem', marginBottom:'1rem', fontSize:'0.8rem', fontWeight:600 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#6ee7b7', display:'inline-block' }}/>
            Browse &amp; Claim Items
          </div>
          <h1 style={{ fontSize:'2.5rem', fontWeight:900, letterSpacing:'-1px', marginBottom:'0.5rem' }}>🟢 Found Items</h1>
          <p style={{ opacity:.8, maxWidth:500, margin:'0 auto' }}>Items found and submitted by fellow students — is yours here?</p>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <svg viewBox="0 0 1440 56" fill="none" style={{ display:'block' }}>
            <path d="M0,40 C360,0 1080,56 1440,16 L1440,56 L0,56 Z" fill="var(--bg,#f8fafc)"/>
          </svg>
        </div>
      </div>

      <div className="container pb-5">
        {/* Search */}
        <div className="search-bar-enhanced mx-auto mb-3" style={{ maxWidth:'560px' }}>
          <input type="text" placeholder="Search by name, description..." value={inputValue}
            onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key==='Enter' && setSearchTerm(inputValue)}/>
          <button className="search-bar-btn" onClick={() => setSearchTerm(inputValue)}>🔍 Search</button>
        </div>

        {/* Category chips */}
        <div className="category-filter-wrap justify-content-center">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`filter-chip ${activeCategory===cat?'active':''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>

        {/* Date filter */}
        <div className="date-filter-bar">
          <label>📅 Date Range:</label>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', flex:1 }}>
            <input type="date" className="date-filter-input" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}/>
            <span style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>→</span>
            <input type="date" className="date-filter-input" value={dateTo} onChange={e=>setDateTo(e.target.value)}/>
          </div>
          {(dateFrom||dateTo) && <button className="date-filter-clear" onClick={() => { setDateFrom(''); setDateTo(''); }}>✕ Clear</button>}
        </div>

        {!loading && (
          <p style={{ color:'var(--text-muted)', fontSize:'0.88rem', marginBottom:'1.5rem' }}>
            Showing {paginatedItems.length} of {filteredItems.length} items
            {activeCategory!=='All' && ` in "${activeCategory}"`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="row g-4">{[...Array(6)].map((_,i) => <SkeletonCard key={i}/>)}</div>
        ) : (
          <>
            <div className="row g-4">
              {paginatedItems.length > 0
                ? paginatedItems.map(item => {
                    const st = item.status?.toLowerCase() || 'found';
                    const STATUS_MAP = {
                        found:    { text:'🟢 Found',     badgeClass:'bg-success', fullText:'Found'    },
                        claimed:  { text:'📋 Claimed',   badgeClass:'bg-info',    fullText:'Claimed'  },
                        returned: { text:'✅ Returned',  badgeClass:'bg-primary', fullText:'Returned' },
                    };
                    return <ItemCard key={item._id} item={item} showItemDetail={() => setSelectedItem(item)} statusInfo={STATUS_MAP[st]||STATUS_MAP.found}/>;
                  })
                : <div className="col-12 empty-state"><span className="empty-state-icon">🔍</span><h4>No items found</h4><p>Try a different search or filter.</p></div>
              }
            </div>
            {totalPages > 1 && (
              <div className="pagination-wrap">
                <button className="pagination-btn" onClick={()=>setCurrentPage(p=>p-1)} disabled={currentPage===1}>‹</button>
                {[...Array(totalPages)].map((_,i) => (
                  <button key={i} className={`pagination-btn ${currentPage===i+1?'active':''}`} onClick={()=>setCurrentPage(i+1)}>{i+1}</button>
                ))}
                <button className="pagination-btn" onClick={()=>setCurrentPage(p=>p+1)} disabled={currentPage===totalPages}>›</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default FoundItemsPage;
