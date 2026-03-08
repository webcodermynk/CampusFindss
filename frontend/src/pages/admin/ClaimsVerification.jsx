import React, { useState, useEffect, useMemo } from "react";
import { getClaims, updateClaim, getLostItems, getFoundItems } from "../../api/adminService.js";

const PageBanner = ({ count, pending }) => (
  <div style={{ background: "linear-gradient(135deg,#78350f 0%,#92400e 40%,#b45309 70%,#f59e0b 100%)", color: "#fff", padding: "3rem 0 4rem", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 280, height: 280, borderRadius: "50%", background: "rgba(245,158,11,0.15)", filter: "blur(60px)" }} />
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 2 }}>
      <div style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>📋</div>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-1px", marginBottom: "0.3rem" }}>Claims & Verification</h1>
      <p style={{ color: "rgba(255,255,255,0.65)", margin: 0 }}>
        {count} total · <strong style={{ color: "#fde68a" }}>{pending} pending review</strong>
      </p>
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
      <svg viewBox="0 0 1440 48" fill="none" style={{ display: "block" }}><path d="M0,32 C360,0 1080,48 1440,12 L1440,48 L0,48 Z" fill="#f8fafc" /></svg>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = { waiting: { bg: "#fef3c7", c: "#92400e", l: "⏳ Pending" }, pending: { bg: "#fef3c7", c: "#92400e", l: "⏳ Pending" }, approved: { bg: "#d1fae5", c: "#065f46", l: "✅ Approved" }, rejected: { bg: "#fee2e2", c: "#991b1b", l: "❌ Rejected" } };
  const s = map[status?.toLowerCase()] || { bg: "#f1f5f9", c: "#475569", l: status };
  return <span style={{ background: s.bg, color: s.c, padding: "0.25rem 0.7rem", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap" }}>{s.l}</span>;
};

const Btn = ({ children, onClick, color, bg }) => (
  <button onClick={onClick} style={{ background: bg, color, border: "none", borderRadius: 8, padding: "0.35rem 0.8rem", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", transition: "filter 0.15s" }}
    onMouseEnter={e => e.currentTarget.style.filter = "brightness(0.9)"}
    onMouseLeave={e => e.currentTarget.style.filter = ""}>{children}</button>
);

const Modal = ({ open, onClose, title, children }) => open ? (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "var(--card-bg,#fff)", borderRadius: 16, padding: "1.8rem", maxWidth: 560, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
        <h4 style={{ fontWeight: 800, color: "var(--text-color,#2c3e50)", margin: 0 }}>{title}</h4>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--text-muted,#6c757d)", lineHeight: 1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
) : null;

const Field = ({ label, value }) => value ? (
  <div style={{ marginBottom: "0.7rem" }}>
    <div style={{ fontSize: "0.74rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted,#6c757d)", marginBottom: "0.2rem" }}>{label}</div>
    <div style={{ fontSize: "0.9rem", color: "var(--text-color,#2c3e50)" }}>{value}</div>
  </div>
) : null;

export default function ClaimsVerification({ toast }) {
  const [claims, setClaims] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [claimsData, lost, found] = await Promise.all([getClaims(), getLostItems(), getFoundItems()]);
        setClaims(Array.isArray(claimsData) ? claimsData : []);
        setAllItems([...(lost || []), ...(found || [])]);
      } catch { toast?.error("Failed to load claims"); }
      finally { setLoading(false); }
    })();
  }, []);

  const getItemTitle = (itemId) => allItems.find(it => it._id === itemId)?.title || `Item #${itemId?.slice(-4)}`;

  const filtered = useMemo(() => {
    return claims
      .filter(c => filterStatus === "all" || c.status?.toLowerCase() === filterStatus || (filterStatus === "pending" && c.status?.toLowerCase() === "waiting"))
      .filter(c => [c.claimantName, c.claimantEmail, c.itemId].join(" ").toLowerCase().includes(search.toLowerCase()));
  }, [claims, search, filterStatus]);

  const pending = claims.filter(c => ["pending","waiting"].includes(c.status?.toLowerCase())).length;

  const doUpdate = async (id, status) => {
    setUpdating(true);
    try {
      await updateClaim(id, { status });
      setClaims(p => p.map(c => c._id === id ? { ...c, status } : c));
      toast?.success(`Claim ${status}`);
      setSelected(null);
    } catch { toast?.error("Update failed"); }
    finally { setUpdating(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><div style={{ width: 44, height: 44, border: "4px solid var(--border-color,#dee2e6)", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  const filterChips = [
    { label: "All", value: "all" },
    { label: "⏳ Pending", value: "pending" },
    { label: "✅ Approved", value: "approved" },
    { label: "❌ Rejected", value: "rejected" },
  ];

  return (
    <div style={{ background: "var(--bg-color,#f8f9fa)", minHeight: "100vh" }}>
      <PageBanner count={claims.length} pending={pending} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
              style={{ width: "100%", padding: "0.65rem 1rem 0.65rem 2.5rem", borderRadius: 10, border: "1.5px solid var(--border-color,#dee2e6)", background: "var(--card-bg,#fff)", color: "var(--text-color,#2c3e50)", fontSize: "0.9rem", outline: "none" }} />
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {filterChips.map(chip => (
            <button key={chip.value} onClick={() => setFilterStatus(chip.value)} style={{
              padding: "0.4rem 1rem", borderRadius: 20, border: "1.5px solid", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s",
              background: filterStatus === chip.value ? "linear-gradient(135deg,#f59e0b,#d97706)" : "var(--card-bg,#fff)",
              color: filterStatus === chip.value ? "#fff" : "var(--text-muted,#6c757d)",
              borderColor: filterStatus === chip.value ? "#f59e0b" : "var(--border-color,#dee2e6)",
            }}>{chip.label}</button>
          ))}
          <span style={{ marginLeft: "auto", color: "var(--text-muted,#6c757d)", fontSize: "0.85rem", fontWeight: 600, alignSelf: "center" }}>{filtered.length} claims</span>
        </div>

        {/* Table */}
        <div style={{ background: "var(--card-bg,#fff)", borderRadius: 14, border: "1.5px solid var(--border-color,#dee2e6)", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
              <thead>
                <tr style={{ background: "var(--hover-bg,#f8f9fa)", borderBottom: "1.5px solid var(--border-color,#dee2e6)" }}>
                  {["Claim ID","Item","Claimant","Contact","Status","Actions"].map(h => (
                    <th key={h} style={{ padding: "0.8rem 1rem", textAlign: h === "Actions" ? "center" : "left", fontWeight: 700, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted,#6c757d)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted,#6c757d)" }}>No claims found</td></tr>
                ) : filtered.map((claim, i) => (
                  <tr key={claim._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border-color,#dee2e6)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--hover-bg,#f8f9fa)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted,#6c757d)", fontFamily: "monospace", fontSize: "0.8rem" }}>#{claim._id?.slice(-6)}</td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 600, color: "var(--text-color,#2c3e50)" }}>{getItemTitle(claim.itemId)}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "var(--text-color,#2c3e50)" }}>{claim.claimantName}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted,#6c757d)", fontSize: "0.82rem" }}>{claim.claimantEmail}</td>
                    <td style={{ padding: "0.85rem 1rem" }}><StatusBadge status={claim.status} /></td>
                    <td style={{ padding: "0.85rem 1rem", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center" }}>
                        <Btn onClick={() => setSelected(claim)} color="#1e40af" bg="#dbeafe">👁 View</Btn>
                        {["pending","waiting"].includes(claim.status?.toLowerCase()) && <>
                          <Btn onClick={() => doUpdate(claim._id, "approved")} color="#065f46" bg="#d1fae5">✅</Btn>
                          <Btn onClick={() => doUpdate(claim._id, "rejected")} color="#991b1b" bg="#fee2e2">❌</Btn>
                        </>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="📋 Claim Details">
        {selected && <>
          <Field label="Claim ID"   value={selected._id} />
          <Field label="Item"       value={getItemTitle(selected.itemId)} />
          <Field label="Claimant"   value={selected.claimantName} />
          <Field label="Email"      value={selected.claimantEmail} />
          <Field label="Phone"      value={selected.claimantPhone} />
          <Field label="Message"    value={selected.message} />
          <Field label="Submitted"  value={selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"} />
          <div style={{ marginBottom: "1.5rem" }}><StatusBadge status={selected.status} /></div>
          {selected.status?.toLowerCase() === "pending" && (
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button onClick={() => doUpdate(selected._id, "approved")} disabled={updating} style={{ flex: 1, padding: "0.75rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {updating ? "…" : "✅ Approve"}
              </button>
              <button onClick={() => doUpdate(selected._id, "rejected")} disabled={updating} style={{ flex: 1, padding: "0.75rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {updating ? "…" : "❌ Reject"}
              </button>
            </div>
          )}
        </>}
      </Modal>
    </div>
  );
}
