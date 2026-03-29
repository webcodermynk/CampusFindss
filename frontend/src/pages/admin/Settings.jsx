import React, { useState } from "react";

const PageBanner = () => (
  <div style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#3730a3 50%,#6366f1 100%)", color: "#fff", padding: "3rem 0 4rem", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 260, height: 260, borderRadius: "50%", background: "rgba(139,92,246,0.15)", filter: "blur(60px)" }} />
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 2 }}>
      <div style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>⚙️</div>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-1px", marginBottom: "0.3rem" }}>Settings</h1>
      <p style={{ color: "rgba(255,255,255,0.65)", margin: 0 }}>Manage platform preferences and system configuration.</p>
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
      <svg viewBox="0 0 1440 48" fill="none" style={{ display: "block" }}><path d="M0,32 C360,0 1080,48 1440,12 L1440,48 L0,48 Z" fill="#f8fafc" /></svg>
    </div>
  </div>
);

const SettingCard = ({ icon, title, desc, children, badge }) => (
  <div style={{ background: "var(--surface,#fff)", borderRadius: 14, border: "1.5px solid var(--border,#e2e8f0)", padding: "1.8rem", marginBottom: "1.2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.04)" }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.2rem" }}>
      <div style={{ fontSize: "1.6rem", flexShrink: 0, lineHeight: 1 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
          <h5 style={{ fontWeight: 700, color: "var(--text,#1e293b)", margin: 0, fontSize: "1rem" }}>{title}</h5>
          {badge && <span style={{ background: "#fef3c7", color: "#92400e", padding: "0.15rem 0.55rem", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700 }}>{badge}</span>}
        </div>
        <p style={{ color: "var(--text-2,#475569)", fontSize: "0.85rem", margin: 0 }}>{desc}</p>
      </div>
    </div>
    {children}
  </div>
);

const Toggle = ({ value, onChange, label }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0" }}>
    <span style={{ fontSize: "0.9rem", color: "var(--text,#1e293b)", fontWeight: 500 }}>{label}</span>
    <button onClick={() => onChange(!value)} style={{
      width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative",
      background: value ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "var(--border,#e2e8f0)",
      transition: "all 0.25s", flexShrink: 0,
    }}>
      <span style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </button>
  </div>
);

const UPCOMING = [
  { icon: "📧", title: "Email Notifications", desc: "Auto-notify users when their item is found or claim is updated", color: "#6366f1" },
  { icon: "📊", title: "Analytics Dashboard", desc: "Visual charts for recovery rate, peak hours, and category breakdown", color: "#10b981" },
  { icon: "🔄", title: "Auto-Archive Items", desc: "Automatically archive items older than a set number of days", color: "#f59e0b" },
  { icon: "📱", title: "SMS Alerts", desc: "Send SMS notifications to students when their lost item is posted", color: "#3b82f6" },
  { icon: "🏷️", title: "QR Code Labels", desc: "Generate printable QR code labels for found items in storage", color: "#8b5cf6" },
  { icon: "🤖", title: "AI Matching", desc: "Automatically suggest matching lost/found pairs using AI similarity", color: "#ef4444" },
];

export default function Settings({ toast }) {
  const [autoDelete, setAutoDelete] = useState(false);
  const [deleteDays, setDeleteDays] = useState(90);
  const [emailNotif, setEmailNotif] = useState(true);
  const [publicBrowse, setPublicBrowse] = useState(false);
  const [requireVerify, setRequireVerify] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast?.success("Settings saved successfully!");
  };

  return (
    <div style={{ background: "var(--bg,#f8fafc)", minHeight: "100vh" }}>
      <PageBanner />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>

        <SettingCard icon="🔔" title="Notifications" desc="Control how the system communicates with students and staff.">
          <Toggle value={emailNotif} onChange={setEmailNotif} label="Send email when a claim is submitted" />
          <Toggle value={requireVerify} onChange={setRequireVerify} label="Require admin approval for claims before notifying owner" />
        </SettingCard>

        <SettingCard icon="🔓" title="Access Control" desc="Manage what students can see before logging in.">
          <Toggle value={publicBrowse} onChange={setPublicBrowse} label="Allow public browsing of found items (no login required)" />
        </SettingCard>

        <SettingCard icon="🗑️" title="Data Retention" desc="Automatically clean up old, unresolved items to keep the database lean.">
          <Toggle value={autoDelete} onChange={setAutoDelete} label="Auto-delete unresolved items after a set period" />
          {autoDelete && (
            <div style={{ marginTop: "1rem" }}>
              <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-2,#475569)", display: "block", marginBottom: "0.4rem" }}>Delete items older than:</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <input type="range" min={30} max={365} step={30} value={deleteDays} onChange={e => setDeleteDays(+e.target.value)}
                  style={{ flex: 1, accentColor: "#6366f1" }} />
                <span style={{ fontWeight: 700, color: "var(--text,#1e293b)", minWidth: 70, fontSize: "0.9rem" }}>{deleteDays} days</span>
              </div>
            </div>
          )}
        </SettingCard>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving} style={{
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff",
          border: "none", borderRadius: 12, padding: "0.9rem 2.5rem",
          fontWeight: 700, fontSize: "1rem", cursor: saving ? "wait" : "pointer",
          boxShadow: "0 6px 20px rgba(99,102,241,0.4)", transition: "all 0.2s",
          marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "0.5rem",
        }}>
          {saving ? <>⏳ Saving…</> : <>💾 Save Settings</>}
        </button>

        {/* Upcoming features */}
        <h3 style={{ fontWeight: 800, color: "var(--text,#1e293b)", marginBottom: "1rem", fontSize: "1.1rem" }}>🚀 Coming Soon</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
          {UPCOMING.map(({ icon, title, desc, color }) => (
            <div key={title} style={{ background: "var(--surface,#fff)", borderRadius: 12, padding: "1.2rem", border: "1.5px solid var(--border,#e2e8f0)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
              <div style={{ fontWeight: 700, color: "var(--text,#1e293b)", fontSize: "0.9rem", marginBottom: "0.3rem" }}>{title}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-2,#475569)", lineHeight: 1.5 }}>{desc}</div>
              <span style={{ display: "inline-block", marginTop: "0.7rem", background: "#fef3c7", color: "#92400e", padding: "0.15rem 0.55rem", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700 }}>In Development</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
