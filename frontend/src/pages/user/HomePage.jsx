import React, { useState, useEffect, useRef } from "react";
import ItemCard from '../../components/ItemCard.jsx';
import SuccessModal from '../../components/SuccessModal.jsx';
import { formatDate, getImageUrl, capitalizeFirstLetter } from '../../utils';

const getStatusDisplay = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "found and submitted") {
        return { text: "F & Submitted", badgeClass: "bg-success", fullText: "Found and Submitted" };
    }
    return { text: "Found", badgeClass: "bg-primary", fullText: "Found" };
};

// Animated counter hook
const useCounter = (target, duration = 1500) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started) {
                setStarted(true);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [started, target, duration]);

    return { count, ref };
};

const STATS = [
    { icon: '📦', label: 'Items Reported', target: 248 },
    { icon: '✅', label: 'Successfully Returned', target: 183 },
    { icon: '👥', label: 'Active Students', target: 620 },
    { icon: '⚡', label: 'Avg. Response Time (hrs)', target: 4 },
];

const SUCCESS_STORIES = [
    {
        text: "I lost my wallet near the library and thought I'd never see it again. Someone posted it on CampusFinds and I got it back the same day!",
        author: "Priya S.",
        department: "Computer Science",
        item: "💛 Wallet",
        initials: "PS"
    },
    {
        text: "My laptop bag with all my notes went missing before exams. A kind student found it and I recovered everything within hours through this platform.",
        author: "Rahul M.",
        department: "Engineering",
        item: "💻 Laptop Bag",
        initials: "RM"
    },
    {
        text: "Found someone's ID card and used CampusFinds to return it. The owner was so relieved! This platform makes our campus a kinder place.",
        author: "Anjali K.",
        department: "Commerce",
        item: "🪪 Student ID",
        initials: "AK"
    },
];

const StatCard = ({ icon, label, target }) => {
    const { count, ref } = useCounter(target);
    return (
        <div className="col-6 col-md-3" ref={ref}>
            <div className="stat-card">
                <span className="stat-icon">{icon}</span>
                <span className="stat-number">{count.toLocaleString()}+</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );
};

const HomePage = ({ showPage }) => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showClaimForm, setShowClaimForm] = useState(false);
    const [claimData, setClaimData] = useState({ name: '', contact: '', message: '' });
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [claimError, setClaimError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchRecentFound = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/found-items');
                const data = await res.json();
                const sorted = data
                    .sort((a, b) => new Date(b.dateFound) - new Date(a.dateFound))
                    .slice(0, 3)
                    .map(item => ({ ...item, type: 'found' }));
                setItems(sorted);
            } catch (err) {
                console.error('Error fetching recent found items:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentFound();
    }, []);

    const submitClaim = async () => {
        setClaimError('');
        if (!claimData.name || !claimData.contact || !claimData.message)
            return setClaimError('Please fill in Name, Contact, and Message.');
        setSubmitting(true);
        try {
            const res = await fetch('/api/claims', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId: selectedItem._id,
                    itemType: 'found',
                    claimantName: claimData.name,
                    contact: claimData.contact,
                    message: claimData.message,
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || json.message || 'Server error');
            setShowClaimForm(false);
            setClaimData({ name: '', contact: '', message: '' });
            setShowSuccess(true);
        } catch (err) {
            setClaimError(err.message || 'Failed to submit claim. Please try again.');
        } finally { setSubmitting(false); }
    };

    if (selectedItem) {
        const statusInfo = getStatusDisplay(selectedItem.status);
        return (
            <div className="container my-4 d-flex justify-content-center">
                <div style={{ maxWidth: "1000px", width: "100%" }}>
                    <button className="btn btn-outline-secondary mb-3"
                        onClick={() => { setSelectedItem(null); setShowClaimForm(false); setClaimData({ name: '', contact: '', message: '' }); }}>
                        ← Back
                    </button>
                    <div className="card p-3 shadow-sm">
                        <div className="row g-0 align-items-center">
                            <div className="col-md-4 d-flex flex-column align-items-center">
                                <div style={{ border: "5px solid #e9ecef", borderRadius: "12px", overflow: "hidden", width: "250px", height: "250px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                                    {selectedItem.imageUrl ? (
                                        <img src={getImageUrl(selectedItem.imageUrl)} alt={selectedItem.title} className="img-fluid" style={{ width: "100%", maxHeight: "210px", objectFit: "cover", borderRadius: "8px" }} />
                                    ) : <span>No Image</span>}
                                </div>
                                <span className={`badge ${statusInfo.badgeClass} mt-3 mb-2`} style={{ fontSize: "1.1rem" }}>{statusInfo.fullText}</span>
                            </div>
                            <div className="col-md-8 ps-md-4">
                                <h3>{selectedItem.title}</h3>
                                <p className="text-muted">Category: {capitalizeFirstLetter(selectedItem.category || "Uncategorized")}</p>
                                <p>{selectedItem.description}</p>
                                <div className="mt-4 p-3 border rounded bg-light">
                                    <h5>Found Details</h5>
                                    <p><strong>📍 Location:</strong> {selectedItem.location || "Not provided"}</p>
                                    <p><strong>📅 Date:</strong> {formatDate(selectedItem.dateFound)}</p>
                                    <p><strong>📧 Contact:</strong> {selectedItem.contact || "Not provided"}</p>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-primary w-100" onClick={() => setShowClaimForm(!showClaimForm)}>
                                        {showClaimForm ? "Cancel Claim" : "Claim This Item"}
                                    </button>
                                </div>
                                {showClaimForm && (
                                    <div className="mt-3 p-3 border rounded bg-light">
                                        <input type="text" placeholder="Your Name" className="form-control mb-2" value={claimData.name} onChange={(e) => setClaimData({ ...claimData, name: e.target.value })} />
                                        <input type="text" placeholder="Your Contact Number" className="form-control mb-2" value={claimData.contact} onChange={(e) => setClaimData({ ...claimData, contact: e.target.value })} />
                                        <textarea placeholder="Message to finder" className="form-control mb-2" value={claimData.message} onChange={(e) => setClaimData({ ...claimData, message: e.target.value })} />
                                        {claimError && (
                                            <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'0.65rem 0.9rem', marginBottom:'0.8rem', color:'#991b1b', fontSize:'0.83rem', fontWeight:500 }}>⚠️ {claimError}</div>
                                        )}
                                        <button className="btn btn-success w-100" onClick={submitClaim} disabled={submitting}>{submitting ? '⏳ Submitting...' : '✅ Submit Claim'}</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <SuccessModal show={showSuccess} onClose={() => { setShowSuccess(false); setSelectedItem(null); }} isClaim={true} claimData={claimData} />
            </div>
        );
    }

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

    return (
        <div id="home-page" className="page">

            {/* ── HERO SECTION ── */}
            <section className="hero-section text-center">
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="mb-3" style={{ fontSize: '3.5rem' }}>🔍</div>
                    <h1 className="display-4 fw-bold mb-3">Lost Something on Campus?</h1>
                    <p className="lead mb-4">CampusFinds connects students to recover their belongings fast. Report, browse, and claim items — all in one place.</p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <button className="hero-btn-primary" onClick={() => showPage('report')}>
                            📝 Report Item
                        </button>
                        <button className="hero-btn-secondary" onClick={() => showPage('foundItems')}>
                            🔎 Browse Found Items
                        </button>
                    </div>
                </div>
            </section>

            {/* ── STATS SECTION ── */}
            <section className="stats-section">
                <div className="container">
                    <div className="row g-3 justify-content-center">
                        {STATS.map((s) => (
                            <StatCard key={s.label} {...s} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title mx-auto" style={{ display: 'inline-block' }}>How It Works</h2>
                        <p className="section-subtitle">Three simple steps to recover your belongings</p>
                    </div>
                    <div className="row g-4">
                        {[
                            { step: '01', icon: '🚨', bg: '#fee2e2', title: 'Report Lost Item', desc: 'Fill out our simple form with details about your lost item — title, category, location, and an image.', color: '#ef4444' },
                            { step: '02', icon: '🔍', bg: '#dbeafe', title: 'Browse Found Items', desc: 'Search through items others have found and submitted to our database. Filter by category or keyword.', color: '#3b82f6' },
                            { step: '03', icon: '🤝', bg: '#d1fae5', title: 'Claim Your Item', desc: 'Found a match? Submit a claim with your details. The finder will verify and arrange a safe handoff.', color: '#10b981' },
                        ].map(({ step, icon, bg, title, desc, color }) => (
                            <div className="col-md-4" key={step}>
                                <div className="how-it-works-card">
                                    <span className="step-number">{step}</span>
                                    <div className="how-it-works-icon" style={{ background: bg }}>
                                        <span>{icon}</span>
                                    </div>
                                    <h5 className="fw-bold mb-2" style={{ color: 'var(--text-color)' }}>{title}</h5>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── RECENTLY FOUND ITEMS ── */}
            <section className="py-5" style={{ background: 'var(--section-bg)' }}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
                        <div>
                            <h2 className="section-title" style={{ display: 'inline-block' }}>Recently Found</h2>
                            <p className="section-subtitle mb-0">Latest items turned in by fellow students</p>
                        </div>
                        <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={() => showPage('foundItems')}>
                            View All →
                        </button>
                    </div>
                    <div className="row g-4">
                        {loading ? (
                            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
                        ) : items.length > 0 ? (
                            items.map(item => (
                                <ItemCard
                                    key={item._id}
                                    item={item}
                                    showItemDetail={() => setSelectedItem(item)}
                                    statusInfo={getStatusDisplay(item.status)}
                                />
                            ))
                        ) : (
                            <div className="col-12 empty-state">
                                <span className="empty-state-icon">📭</span>
                                <h4>No recent found items</h4>
                                <p>Check back later or report a lost item.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── SUCCESS STORIES ── */}
            <section className="success-stories-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title mx-auto" style={{ display: 'inline-block' }}>Success Stories</h2>
                        <p className="section-subtitle">Real students, real reunions 💚</p>
                    </div>
                    <div className="row g-4">
                        {SUCCESS_STORIES.map((story, i) => (
                            <div className="col-md-4" key={i}>
                                <div className="success-story-card">
                                    <span className="quote-mark">"</span>
                                    <p className="story-text">{story.text}</p>
                                    <div className="story-author">
                                        <div className="story-avatar">{story.initials}</div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-color)' }}>{story.author}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{story.department}</div>
                                            <span className="story-item-recovered">✅ {story.item}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
