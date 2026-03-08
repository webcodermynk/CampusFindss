import React, { useState, useEffect } from 'react';
import ItemCard from '../../components/ItemCard.jsx';
import SharePrintBar from '../../components/SharePrintBar.jsx';
import { formatDate, getImageUrl, capitalizeFirstLetter } from '../../utils';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Accessories', 'Keys', 'Wallet', 'Phone', 'ID', 'Sports', 'Other'];
const ITEMS_PER_PAGE = 6;

const SkeletonCard = () => (
    <div className="col-md-4">
        <div className="card shadow-sm p-3">
            <div className="placeholder-glow">
                <div className="placeholder rounded w-100 mb-3" style={{ height: "180px" }}></div>
                <h5 className="card-title placeholder-glow"><span className="placeholder col-6"></span></h5>
                <p className="card-text placeholder-glow">
                    <span className="placeholder col-7"></span>
                    <span className="placeholder col-4"></span>
                </p>
            </div>
        </div>
    </div>
);

const LostItemsPage = ({ showPage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        const fetchLostItems = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/lost-items');
                const data = await res.json();
                const itemsWithType = data.map(item => ({ ...item, type: 'lost' }));
                setItems(itemsWithType);
            } catch (err) {
                console.error('Error fetching lost items:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLostItems();
    }, []);

    useEffect(() => {
        let result = items.filter(i => i.type === 'lost');
        if (activeCategory !== 'All') {
            result = result.filter(item =>
                (item.category || '').toLowerCase() === activeCategory.toLowerCase()
            );
        }
        if (searchTerm) {
            result = result.filter(item =>
                (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        if (dateFrom) {
            result = result.filter(item => item.dateLost && new Date(item.dateLost) >= new Date(dateFrom));
        }
        if (dateTo) {
            const toEnd = new Date(dateTo);
            toEnd.setHours(23, 59, 59, 999);
            result = result.filter(item => item.dateLost && new Date(item.dateLost) <= toEnd);
        }
        setFilteredItems(result);
        setCurrentPage(1);
    }, [searchTerm, items, activeCategory, dateFrom, dateTo]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    if (selectedItem) {
        const st = selectedItem.status?.toLowerCase() || 'lost';
        const STATUS_MAP = { lost:{bg:'#fee2e2',c:'#991b1b',t:'🔴 Lost'}, found:{bg:'#d1fae5',c:'#065f46',t:'🟢 Found'}, returned:{bg:'#dbeafe',c:'#1e40af',t:'✅ Returned'}, claimed:{bg:'#ede9fe',c:'#5b21b6',t:'📋 Claimed'} };
        const statusStyle = STATUS_MAP[st] || STATUS_MAP.lost;
        return (
            <div style={{ background:'var(--bg-color,#f8f9fa)', minHeight:'100vh', padding:'2rem 0 4rem' }}>
                <div className="container" style={{ maxWidth:960 }}>
                    <button onClick={() => setSelectedItem(null)} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'var(--card-bg,#fff)', border:'1.5px solid var(--border-color,#dee2e6)', borderRadius:10, padding:'0.5rem 1.2rem', fontWeight:600, cursor:'pointer', color:'var(--text-color,#2c3e50)', marginBottom:'1.5rem', fontSize:'0.9rem' }}>
                        ← Back to Lost Items
                    </button>

                    <div style={{ background:'var(--card-bg,#fff)', borderRadius:20, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.10)', border:'1px solid var(--border-color,#dee2e6)' }}>
                        {/* Hero image */}
                        <div style={{ position:'relative', background:'linear-gradient(135deg,#f1f5f9,#e2e8f0)', minHeight:240 }}>
                            {selectedItem.imageUrl
                                ? <img src={getImageUrl(selectedItem.imageUrl)} alt={selectedItem.title} style={{ width:'100%', height:280, objectFit:'contain', objectPosition:'center', display:'block', padding:'16px' }}/>
                                : <div style={{ height:240, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'0.5rem' }}>
                                    <span style={{ fontSize:'4rem' }}>📦</span>
                                    <span style={{ color:'#94a3b8', fontSize:'0.85rem' }}>No image provided</span>
                                  </div>
                            }
                            <span style={{ position:'absolute', top:14, left:14, background:statusStyle.bg, color:statusStyle.c, borderRadius:20, padding:'0.3rem 0.9rem', fontWeight:700, fontSize:'0.8rem' }}>{statusStyle.t}</span>
                        </div>

                        <div style={{ padding:'2rem' }}>
                            <div style={{ marginBottom:'1.5rem' }}>
                                <h2 style={{ fontWeight:900, color:'var(--text-color,#1e293b)', marginBottom:'0.3rem', fontSize:'1.6rem' }}>{selectedItem.title}</h2>
                                <span style={{ background:'#f1f5f9', color:'#64748b', padding:'0.25rem 0.8rem', borderRadius:20, fontSize:'0.78rem', fontWeight:600 }}>
                                    📂 {capitalizeFirstLetter(selectedItem.category || 'Other')}
                                </span>
                            </div>

                            {selectedItem.description && (
                                <p style={{ color:'var(--text-muted,#64748b)', lineHeight:1.7, marginBottom:'1.5rem' }}>{selectedItem.description}</p>
                            )}

                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
                                {[['📍 Location Lost', selectedItem.location], ['📅 Date Lost', formatDate(selectedItem.dateLost)], ['📞 Contact', selectedItem.contact]].map(([label,val]) => val && (
                                    <div key={label} style={{ background:'var(--hover-bg,#f8fafc)', borderRadius:12, padding:'1rem', border:'1px solid var(--border-color,#e2e8f0)' }}>
                                        <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--text-muted,#94a3b8)', marginBottom:'0.3rem' }}>{label}</div>
                                        <div style={{ fontWeight:600, color:'var(--text-color,#1e293b)' }}>{val}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background:'#fffbeb', border:'1px solid #fbbf24', borderRadius:12, padding:'1rem 1.2rem', marginBottom:'1.5rem' }}>
                                <p style={{ color:'#92400e', margin:0, fontSize:'0.9rem', lineHeight:1.6 }}>
                                    💡 <strong>Found this item?</strong> Please contact the owner directly, or use the{' '}
                                    <button style={{ background:'none', border:'none', color:'#b45309', fontWeight:700, cursor:'pointer', padding:0, textDecoration:'underline' }} onClick={() => showPage('contact')}>Contact page</button>{' '}
                                    to reach campus security.
                                </p>
                            </div>

                            <div style={{ borderTop:'1px solid var(--border-color,#e2e8f0)', paddingTop:'1rem' }}>
                                <p style={{ fontSize:'0.8rem', color:'var(--text-muted,#94a3b8)', marginBottom:'0.5rem', fontWeight:600 }}>📤 Share this item</p>
                                <SharePrintBar item={selectedItem} label="Lost" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="lost-items-page" className="page">
            {/* Page Header */}
            <div style={{ background:'linear-gradient(135deg,#7f1d1d 0%,#991b1b 40%,#dc2626 70%,#ef4444 100%)', color:'#fff', padding:'3.5rem 0 5rem', position:'relative', overflow:'hidden', marginBottom:0 }}>
                <div style={{ position:'absolute', top:'-30%', right:'-5%', width:260, height:260, borderRadius:'50%', background:'rgba(255,255,255,.1)', filter:'blur(60px)' }}/>
                <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center' }}>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', borderRadius:50, padding:'0.35rem 1rem', marginBottom:'1rem', fontSize:'0.8rem', fontWeight:600 }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:'#fca5a5', display:'inline-block' }}/>
                        Lost Item Reports
                    </div>
                    <h1 style={{ fontSize:'2.4rem', fontWeight:900, letterSpacing:'-0.5px', marginBottom:'0.5rem' }}>🔴 Lost Items</h1>
                    <p style={{ opacity:.85, maxWidth:500, margin:'0 auto' }}>Browse items reported as lost by students on campus</p>
                </div>
                <div style={{ position:'absolute', bottom:0, left:0, right:0 }}>
                    <svg viewBox="0 0 1440 56" fill="none" style={{ display:'block' }}><path d="M0,40 C360,0 1080,56 1440,16 L1440,56 L0,56 Z" fill="var(--bg-color,#f8f9fa)"/></svg>
                </div>
            </div>

            <div className="container pb-5">
                {/* Search bar */}
                <div className="search-bar-enhanced mx-auto mb-3" style={{ maxWidth: '560px' }}>
                    <input
                        type="text"
                        placeholder="Search by name, description..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setSearchTerm(inputValue)}
                    />
                    <button className="search-bar-btn" onClick={() => setSearchTerm(inputValue)}>
                        🔍 Search
                    </button>
                </div>

                {/* Category filter chips */}
                <div className="category-filter-wrap justify-content-center">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Date filter bar */}
                <div className="date-filter-bar">
                    <label>📅 Date Range:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
                        <input
                            type="date"
                            className="date-filter-input"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            title="From date"
                        />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>→</span>
                        <input
                            type="date"
                            className="date-filter-input"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            title="To date"
                        />
                    </div>
                    {(dateFrom || dateTo) && (
                        <button className="date-filter-clear" onClick={() => { setDateFrom(''); setDateTo(''); }}>
                            ✕ Clear dates
                        </button>
                    )}
                </div>

                {/* Active filter badges */}
                {(dateFrom || dateTo || activeCategory !== 'All' || searchTerm) && !loading && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                        {searchTerm && (
                            <span className="active-filter-badge">
                                🔍 "{searchTerm}" <button onClick={() => { setSearchTerm(''); setInputValue(''); }}>×</button>
                            </span>
                        )}
                        {activeCategory !== 'All' && (
                            <span className="active-filter-badge">
                                📂 {activeCategory} <button onClick={() => setActiveCategory('All')}>×</button>
                            </span>
                        )}
                        {dateFrom && (
                            <span className="active-filter-badge">
                                📅 From {dateFrom} <button onClick={() => setDateFrom('')}>×</button>
                            </span>
                        )}
                        {dateTo && (
                            <span className="active-filter-badge">
                                📅 To {dateTo} <button onClick={() => setDateTo('')}>×</button>
                            </span>
                        )}
                    </div>
                )}

                {/* Results count */}
                {!loading && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                        Showing {paginatedItems.length} of {filteredItems.length} items
                        {activeCategory !== 'All' && ` in "${activeCategory}"`}
                        {searchTerm && ` for "${searchTerm}"`}
                    </p>
                )}

                {/* Items grid */}
                {loading ? (
                    <div className="row g-4">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <>
                        <div className="row g-4">
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map(item => {
                                    const st = item.status?.toLowerCase() || 'lost';
                                    const STATUS_MAP = {
                                        lost:     { text:'🔴 Lost',      badgeClass:'bg-danger',  fullText:'Lost'     },
                                        found:    { text:'🟢 Found',     badgeClass:'bg-success', fullText:'Found'    },
                                        returned: { text:'✅ Returned',  badgeClass:'bg-primary', fullText:'Returned' },
                                        claimed:  { text:'📋 Claimed',   badgeClass:'bg-info',    fullText:'Claimed'  },
                                    };
                                    return <ItemCard key={item._id} item={item} showItemDetail={() => setSelectedItem(item)} statusInfo={STATUS_MAP[st]||STATUS_MAP.lost} />;
                                })
                            ) : (
                                <div className="col-12 empty-state">
                                    <span className="empty-state-icon">🔍</span>
                                    <h4>No items found</h4>
                                    <p>Try a different search term or category.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination-wrap">
                                <button className="pagination-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                ))}
                                <button className="pagination-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LostItemsPage;
