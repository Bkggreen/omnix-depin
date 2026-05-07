import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────
const API = "http://165.232.41.239:3001";
const LOGO = "/omnix-logo.jpg"; // Upload omnix-logo.jpg to your GitHub public/ folder

// ─────────────────────────────────────────────
//  INLINE SVG ICONS
// ─────────────────────────────────────────────
const Icon = {
  Globe:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Cpu:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  Bot:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Clock:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Radio:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>,
  Check:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Copy:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  LogOut: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Play:   () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Stop:   () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  Link:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Mobile: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
};

// ─────────────────────────────────────────────
//  WALLET PROVIDERS
// ─────────────────────────────────────────────
const WALLETS = [
  {
    id: "mobile",
    name: "Solana Mobile",
    emoji: "📱",
    url: "https://solanamobile.com",
    desc: "Saga / Chapter 2",
    detect: () => {
      if (typeof window === "undefined") return false;
      // Solana Mobile dApp store injected provider
      return !!(window?.solana?.isSolanaMobile || window?.solanaMobile);
    },
    getProvider: () => window?.solanaMobile || window?.solana,
  },
  {
    id: "phantom",
    name: "Phantom",
    emoji: "👻",
    url: "https://phantom.app",
    desc: "Most popular",
    detect: () => typeof window !== "undefined" && !!window?.solana?.isPhantom,
    getProvider: () => window?.solana,
  },
  {
    id: "solflare",
    name: "Solflare",
    emoji: "☀️",
    url: "https://solflare.com",
    desc: "Solana native",
    detect: () => typeof window !== "undefined" && !!window?.solflare?.isSolflare,
    getProvider: () => window?.solflare,
  },
  {
    id: "backpack",
    name: "Backpack",
    emoji: "🎒",
    url: "https://backpack.app",
    desc: "xNFT wallet",
    detect: () => typeof window !== "undefined" && !!window?.backpack,
    getProvider: () => window?.backpack,
  },
  {
    id: "glow",
    name: "Glow",
    emoji: "✨",
    url: "https://glow.app",
    desc: "Fast & clean",
    detect: () => typeof window !== "undefined" && !!window?.glow,
    getProvider: () => window?.glow,
  },
  {
    id: "exodus",
    name: "Exodus",
    emoji: "🚀",
    url: "https://exodus.com",
    desc: "Multi-chain",
    detect: () => typeof window !== "undefined" && !!window?.exodus?.solana,
    getProvider: () => window?.exodus?.solana,
  },
];

async function getSolBalance(pubkey) {
  try {
    const r = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [pubkey, { commitment: "confirmed" }] }),
    });
    const d = await r.json();
    return (d?.result?.value ?? 0) / 1e9;
  } catch { return 0; }
}

const fmtAddr = (a) => a ? `${a.slice(0, 4)}...${a.slice(-4)}` : "";
const fmtTime = (d) => d instanceof Date ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";

// ─────────────────────────────────────────────
//  WALLET MODAL
// ─────────────────────────────────────────────
function WalletModal({ onClose, onConnect }) {
  const [detected, setDetected] = useState({});

  useEffect(() => {
    const d = {};
    WALLETS.forEach(w => { d[w.id] = w.detect(); });
    setDetected(d);
  }, []);

  const handleClick = async (wallet) => {
    if (detected[wallet.id]) {
      const provider = wallet.getProvider();
      if (provider) onConnect(provider, wallet.name, wallet.id);
    } else {
      window.open(wallet.url, "_blank");
    }
  };

  const detectedWallets = WALLETS.filter(w => detected[w.id]);
  const otherWallets = WALLETS.filter(w => !detected[w.id]);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "1.25rem", padding: "1.5rem", width: "100%", maxWidth: "26rem", boxShadow: "0 0 80px rgba(45,212,191,0.08), 0 32px 64px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src={LOGO} alt="OMNIX" style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", objectFit: "cover" }} />
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em" }}>Connect Wallet</span>
          </div>
          <button onClick={onClose} style={{ color: "#475569", background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        {/* Notice */}
        <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: "0.75rem", padding: "0.75rem", marginBottom: "1.25rem" }}>
          <p style={{ color: "#f59e0b", fontSize: "0.72rem", lineHeight: 1.6, margin: 0 }}>
            ⚠️ Pre-launch mode — connecting joins the waitlist. You'll be first when OMNIX launches on Solana mainnet.
          </p>
        </div>

        {/* Detected wallets */}
        {detectedWallets.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ color: "#334155", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Detected on this device</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {detectedWallets.map(w => (
                <button key={w.id} onClick={() => handleClick(w)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", borderRadius: "0.75rem", cursor: "pointer", background: "rgba(45,212,191,0.05)", border: "1px solid rgba(45,212,191,0.2)", transition: "all 0.15s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(45,212,191,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(45,212,191,0.05)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{w.emoji}</span>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.875rem", margin: 0 }}>{w.name}</p>
                      <p style={{ color: "#334155", fontSize: "0.68rem", margin: "0.1rem 0 0" }}>{w.desc}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.68rem", padding: "0.25rem 0.625rem", borderRadius: "9999px", background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)", fontWeight: 700 }}>Connect</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other wallets */}
        {otherWallets.length > 0 && (
          <div>
            <p style={{ color: "#334155", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Install a wallet</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {otherWallets.map(w => (
                <button key={w.id} onClick={() => handleClick(w)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: "0.75rem", cursor: "pointer", background: "transparent", border: "1px solid #1a2744", transition: "all 0.15s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d3f66"; e.currentTarget.style.background = "#0d1629"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a2744"; e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.4rem" }}>{w.emoji}</span>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.825rem", margin: 0 }}>{w.name}</p>
                      <p style={{ color: "#1e293b", fontSize: "0.65rem", margin: "0.1rem 0 0" }}>{w.desc}</p>
                    </div>
                  </div>
                  <span style={{ color: "#334155", fontSize: "0.7rem" }}>Install →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <p style={{ color: "#1e293b", fontSize: "0.68rem", textAlign: "center", marginTop: "1rem" }}>
          On Solana Mobile device? Saga / Chapter 2 detected automatically.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  NODE RUNNER
// ─────────────────────────────────────────────
function NodeRunner({ wallet, onConnectWallet }) {
  const [running, setRunning] = useState(false);
  const [metrics, setMetrics] = useState({ storage: 0, compute: 0, bandwidth: 0, health: 0 });
  const [uptime, setUptime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const timerRef = useRef(null);
  const metricsRef = useRef(null);

  const start = useCallback(() => {
    setRunning(true);
    setUptime(0);
    setEarnings(0);
    setMetrics({ storage: 74, compute: 61, bandwidth: 87, health: 97.4 });
    timerRef.current = setInterval(() => {
      setUptime(u => u + 1);
      setEarnings(e => +(e + 0.000001111).toFixed(9));
    }, 1000);
    metricsRef.current = setInterval(() => {
      setMetrics(m => ({
        storage:   Math.min(100, Math.max(55, +(m.storage   + (Math.random() - 0.4) * 2.2).toFixed(1))),
        compute:   Math.min(100, Math.max(40, +(m.compute   + (Math.random() - 0.4) * 3.1).toFixed(1))),
        bandwidth: Math.min(100, Math.max(65, +(m.bandwidth + (Math.random() - 0.4) * 1.6).toFixed(1))),
        health:    Math.min(100, Math.max(94, +(m.health    + (Math.random() - 0.35) * 0.3).toFixed(1))),
      }));
    }, 1800);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
    clearInterval(timerRef.current);
    clearInterval(metricsRef.current);
  }, []);

  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(metricsRef.current); }, []);

  const fmtUptime = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const Bar = ({ value, color, label }) => (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
        <span style={{ color: "#64748b", fontSize: "0.775rem" }}>{label}</span>
        <span style={{ color, fontFamily: "monospace", fontWeight: 700, fontSize: "0.775rem" }}>{value.toFixed(1)}%</span>
      </div>
      <div style={{ height: "5px", background: "#080d1c", borderRadius: "9999px", overflow: "hidden", border: "1px solid #1a2744" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: "9999px", transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 6px ${color}55` }} />
      </div>
    </div>
  );

  if (!wallet.connected) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", textAlign: "center", background: "#080d1c", border: "1px dashed #1a2744", borderRadius: "1rem" }}>
        <img src={LOGO} alt="OMNIX" style={{ width: "4rem", height: "4rem", borderRadius: "0.875rem", objectFit: "cover", marginBottom: "1rem", opacity: 0.5 }} />
        <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>Connect Wallet to Run a Node</h3>
        <p style={{ color: "#334155", fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: "22rem" }}>
          Join the waitlist with your Solana wallet — including Solana Mobile (Saga / Chapter 2). You'll be first to stake and earn $OMX at launch.
        </p>
        <button onClick={onConnectWallet}
          style={{ padding: "0.75rem 2rem", borderRadius: "0.75rem", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem", background: "rgba(45,212,191,0.1)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.25)", transition: "all 0.15s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(45,212,191,0.18)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(45,212,191,0.1)"; }}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Pre-launch banner */}
      <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: "0.875rem", padding: "0.875rem 1rem", marginBottom: "1.25rem", display: "flex", gap: "0.75rem" }}>
        <div style={{ width: "1rem", height: "1rem", color: "#f59e0b", flexShrink: 0, marginTop: "0.1rem" }}><Icon.Alert /></div>
        <p style={{ color: "#f59e0b", fontSize: "0.72rem", lineHeight: 1.6, margin: 0 }}>
          <strong>Pre-Launch Mode.</strong> The node runner simulates real contribution metrics locally. On-chain staking, proof submission, and $OMX earnings activate after smart contract deployment on Solana mainnet.
        </p>
      </div>

      {/* Wallet info */}
      <div style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "0.875rem", padding: "1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <img src={LOGO} alt="" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.625rem", objectFit: "cover", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ color: "#475569", fontSize: "0.68rem", margin: "0 0 0.2rem" }}>{wallet.name} · Connected</p>
          <p style={{ color: "#e2e8f0", fontFamily: "monospace", fontSize: "0.775rem", fontWeight: 600, margin: 0 }}>{wallet.address}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "#f59e0b", fontFamily: "monospace", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>{wallet.balance.toFixed(4)}</p>
          <p style={{ color: "#334155", fontSize: "0.65rem", margin: 0 }}>SOL</p>
        </div>
      </div>

      {/* Node control panel */}
      <div style={{ background: "#080d1c", border: `1px solid ${running ? "rgba(45,212,191,0.2)" : "#1a2744"}`, borderRadius: "1rem", padding: "1.25rem", marginBottom: "1.25rem", transition: "border-color 0.4s ease", boxShadow: running ? "0 0 40px rgba(45,212,191,0.04)" : "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
              <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", background: running ? "#2dd4bf" : "#1e293b", animation: running ? "pulse 2s infinite" : "none" }} />
              <span style={{ color: running ? "#2dd4bf" : "#334155", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {running ? "Node Active" : "Node Offline"}
              </span>
            </div>
            <h3 style={{ color: "#e2e8f0", fontWeight: 800, fontSize: "1rem", margin: "0 0 0.25rem", letterSpacing: "-0.02em" }}>Node Runner</h3>
            <p style={{ color: "#334155", fontSize: "0.72rem", margin: 0 }}>
              {running ? `Uptime: ${fmtUptime(uptime)}` : "Pre-launch simulation · No real stake required"}
            </p>
          </div>
          <button onClick={running ? stop : start}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "0.75rem", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem", transition: "all 0.15s ease", background: running ? "rgba(239,68,68,0.1)" : "rgba(45,212,191,0.1)", color: running ? "#ef4444" : "#2dd4bf", border: running ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(45,212,191,0.25)" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.75"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            <div style={{ width: "0.85rem", height: "0.85rem" }}>{running ? <Icon.Stop /> : <Icon.Play />}</div>
            {running ? "Stop Node" : "Start Node"}
          </button>
        </div>

        {/* Metric bars */}
        <div style={{ opacity: running ? 1 : 0.25, transition: "opacity 0.5s ease" }}>
          <Bar value={metrics.storage}   color="#f59e0b" label="Storage Contribution" />
          <Bar value={metrics.compute}   color="#2dd4bf" label="Compute Contribution" />
          <Bar value={metrics.bandwidth} color="#a78bfa" label="Bandwidth Contribution" />
          <Bar value={metrics.health}    color="#34d399" label="Node Health Score" />
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem", marginTop: "0.75rem" }}>
          {[
            { label: "Session Earned", value: running ? `${earnings.toFixed(6)}` : "—", unit: "$OMX", color: "#f59e0b" },
            { label: "Health",         value: running ? `${metrics.health.toFixed(1)}` : "—", unit: "%", color: "#34d399" },
            { label: "Status",         value: running ? "Active" : "Offline", unit: "", color: running ? "#2dd4bf" : "#334155" },
          ].map(s => (
            <div key={s.label} style={{ background: "#040812", border: "1px solid #1a2744", borderRadius: "0.75rem", padding: "0.75rem", textAlign: "center" }}>
              <p style={{ color: "#334155", fontSize: "0.62rem", margin: "0 0 0.3rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
              <p style={{ color: s.color, fontFamily: "monospace", fontWeight: 700, fontSize: "0.825rem", margin: 0 }}>
                {s.value}{s.unit && <span style={{ fontSize: "0.6rem", marginLeft: "0.2rem", opacity: 0.7 }}>{s.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reward mechanisms */}
      <div style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "1rem", padding: "1.25rem" }}>
        <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.875rem", margin: "0 0 1rem", letterSpacing: "-0.01em" }}>Reward Mechanisms — Locked Until Mainnet</p>
        {[
          { name: "Proof-of-Coverage",  desc: "Uptime + location verified every 15 min", rate: "0.012 $OMX/hr" },
          { name: "Proof-of-Compute",   desc: "CPU/GPU tasks verified on-chain",          rate: "0.016 $OMX/task" },
          { name: "Bandwidth Relay",    desc: "Traffic routed through your node",         rate: "0.008 $OMX/GB" },
          { name: "AI Task Bounties",   desc: "Inference & embeddings from clients",      rate: "0.04 $OMX/task" },
          { name: "Node Running Bonus", desc: "Base reward for keeping node online",      rate: "0.004 $OMX/hr" },
        ].map(r => (
          <div key={r.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", borderRadius: "0.75rem", background: running ? "rgba(45,212,191,0.03)" : "transparent", border: `1px solid ${running ? "rgba(45,212,191,0.08)" : "#0d1629"}`, marginBottom: "0.5rem", transition: "all 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <div style={{ width: "0.4rem", height: "0.4rem", borderRadius: "9999px", background: running ? "#2dd4bf" : "#1e293b", flexShrink: 0, transition: "background 0.3s ease" }} />
              <div>
                <p style={{ color: running ? "#e2e8f0" : "#334155", fontSize: "0.775rem", fontWeight: 600, margin: 0, transition: "color 0.3s ease" }}>{r.name}</p>
                <p style={{ color: "#1e293b", fontSize: "0.65rem", margin: "0.1rem 0 0" }}>{r.desc}</p>
              </div>
            </div>
            <span style={{ color: running ? "#f59e0b" : "#1e293b", fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap", transition: "color 0.3s ease" }}>{r.rate}</span>
          </div>
        ))}
        <p style={{ color: "#1a2744", fontSize: "0.65rem", textAlign: "center", marginTop: "0.75rem" }}>🔒 On-chain rewards activate after smart contract deployment</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", Icon: Icon.Globe },
  { id: "node",     label: "My Node",  Icon: Icon.Cpu },
  { id: "agent",    label: "AI Agent", Icon: Icon.Bot },
  { id: "roadmap",  label: "Roadmap",  Icon: Icon.Clock },
  { id: "social",   label: "Social",   Icon: Icon.Radio },
];

export default function App() {
  const [tab, setTab]                           = useState("overview");
  const [showWalletModal, setShowWalletModal]   = useState(false);
  const [showWalletMenu, setShowWalletMenu]     = useState(false);
  const [wallet, setWallet]                     = useState({ connected: false, address: "", name: "", id: "", balance: 0 });
  const [copied, setCopied]                     = useState(false);
  const [agentOnline, setAgentOnline]           = useState(false);
  const [apiStats, setApiStats]                 = useState(null);
  const [agentLogs, setAgentLogs]               = useState([]);
  const [lastSync, setLastSync]                 = useState("");
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  // ── Fetch API stats ──────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API}/stats`, { signal: AbortSignal.timeout(5000) });
        if (r.ok) {
          const d = await r.json();
          setApiStats(d);
          setAgentOnline(true);
          setLastSync(new Date(d.lastUpdated || Date.now()).toLocaleTimeString());
          if (Array.isArray(d.agentLogs) && d.agentLogs.length > 0) {
            setAgentLogs(d.agentLogs.slice(0, 40).map((l, i) => ({ ...l, id: i, ts: new Date(l.timestamp || Date.now()) })));
          }
        }
      } catch { setAgentOnline(false); }
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  // ── Canvas animation ─────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const C = ["#2dd4bf", "#f59e0b", "#a78bfa", "#34d399"];
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.4 + 0.5, c: C[Math.floor(Math.random() * 4)], ph: Math.random() * Math.PI * 2,
    }));
    let f = 0;
    const draw = () => {
      f++;
      ctx.fillStyle = "rgba(4,9,28,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      pts.forEach((a, i) => {
        for (let j = i + 1; j < Math.min(i + 5, pts.length); j++) {
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 90) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `rgba(45,212,191,${0.08 * (1 - d / 90)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
        const p = Math.sin(a.ph + f * 0.016) * 0.5 + 0.5;
        ctx.globalAlpha = 0.5 + p * 0.5;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r * (1 + p * 0.3), 0, Math.PI * 2); ctx.fillStyle = a.c; ctx.fill(); ctx.globalAlpha = 1;
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
        if (a.y < 0 || a.y > canvas.height) a.vy *= -1;
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // ── Wallet ───────────────────────────────
  const connectWallet = useCallback(async (provider, name, id) => {
    try {
      await provider.connect();
      const pubkey = provider.publicKey?.toString();
      if (!pubkey) throw new Error("No public key returned");
      const bal = await getSolBalance(pubkey);
      setWallet({ connected: true, address: pubkey, name, id, balance: bal });
      setShowWalletModal(false);
    } catch (e) { console.error("Wallet connect failed:", e.message); }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({ connected: false, address: "", name: "", id: "", balance: 0 });
    setShowWalletMenu(false);
  }, []);

  const copyAddr = useCallback(() => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [wallet.address]);

  // ── OVERVIEW ─────────────────────────────
  const OverviewTab = () => (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", borderRadius: "1rem", overflow: "hidden", marginBottom: "1.25rem", border: "1px solid #1a2744", height: "260px" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#04091c" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1.5rem" }}>
          <img src={LOGO} alt="OMNIX Protocol" style={{ width: "4.5rem", height: "4.5rem", borderRadius: "1rem", objectFit: "cover", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 30px rgba(45,212,191,0.15)" }} />
          <span style={{ fontSize: "0.65rem", padding: "0.275rem 0.75rem", borderRadius: "9999px", background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.22)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            🚀 Pre-Launch · Raising Funds
          </span>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem,5vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 0.5rem", lineHeight: 1.1 }}>OMNIX Protocol</h1>
          <p style={{ color: "#475569", fontSize: "0.825rem", maxWidth: "26rem", lineHeight: 1.65, margin: "0 0 1rem" }}>
            The world's first fully autonomous multi-layer DePIN on Solana. Storage + Compute + Bandwidth.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[["Compute", "#2dd4bf"], ["Storage", "#f59e0b"], ["Bandwidth", "#a78bfa"]].map(([l, c]) => (
              <span key={l} style={{ fontSize: "0.68rem", padding: "0.25rem 0.75rem", borderRadius: "9999px", background: `${c}12`, color: c, border: `1px solid ${c}30`, fontWeight: 600 }}>● {l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.16)", borderRadius: "0.875rem", padding: "1rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <div style={{ width: "1.1rem", height: "1.1rem", color: "#f59e0b", flexShrink: 0, marginTop: "0.1rem" }}><Icon.Alert /></div>
          <div>
            <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 0.3rem" }}>Pre-Launch Status</p>
            <p style={{ color: "#64748b", fontSize: "0.75rem", lineHeight: 1.65, margin: 0 }}>
              OMNIX is in pre-launch. AI agent is running 24/7, smart contracts are written and ready. We are raising funds to deploy on Solana mainnet. Node registration and the $OMX token launch after deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {[
          { label: "Registered Nodes",  value: apiStats?.totalNodes ?? 0,          sub: "0 until mainnet",      color: "#2dd4bf", pre: true },
          { label: "$OMX Distributed",  value: apiStats?.rewardsDistributed ?? 0,  sub: "0 until token launch", color: "#f59e0b", pre: true },
          { label: "Agent Status",      value: agentOnline ? "Online ✓" : "Offline", sub: agentOnline ? `Synced ${lastSync}` : "Check server", color: agentOnline ? "#34d399" : "#ef4444", pre: false },
          { label: "Current Epoch",     value: apiStats?.currentEpoch ?? "—",      sub: "Advances every 24h",   color: "#a78bfa", pre: false },
        ].map(s => (
          <div key={s.label} style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "0.875rem", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
              <span style={{ color: "#334155", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
              {s.pre && <span style={{ fontSize: "0.58rem", padding: "0.15rem 0.45rem", borderRadius: "9999px", background: "rgba(245,158,11,0.07)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.14)", fontWeight: 700 }}>Pre-Launch</span>}
            </div>
            <p style={{ color: s.color, fontFamily: "monospace", fontWeight: 700, fontSize: "1.1rem", margin: "0 0 0.2rem" }}>{s.value}</p>
            <p style={{ color: "#1e293b", fontSize: "0.62rem", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "1rem", padding: "1.25rem", marginBottom: "1.25rem" }}>
        <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.875rem", margin: "0 0 1rem", letterSpacing: "-0.01em" }}>What's live right now</p>
        {[
          { text: "AI Agent running 24/7 on DigitalOcean London", done: true },
          { text: "Smart contracts written in Anchor/Rust",        done: true },
          { text: "Web dashboard deployed and live",               done: true },
          { text: "GitHub repository open source",                 done: true },
          { text: "Solana Foundation grant application submitted", done: true },
          { text: "Smart contract deployed to Solana mainnet",     done: false },
          { text: "$OMX SPL token created",                        done: false },
          { text: "Node registration open (1,000 $OMX stake)",     done: false },
          { text: "$OMX listed on Raydium / Jupiter",              done: false },
          { text: "Solana Mobile node runner app",                 done: false },
        ].map(item => (
          <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
            <div style={{ width: "1rem", height: "1rem", flexShrink: 0, color: item.done ? "#34d399" : "#1e293b" }}>{item.done ? <Icon.Check /> : <Icon.Clock />}</div>
            <span style={{ color: item.done ? "#e2e8f0" : "#334155", fontSize: "0.78rem" }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      {wallet.connected ? (
        <div style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: "0.875rem", padding: "1rem", textAlign: "center" }}>
          <div style={{ width: "1.5rem", height: "1.5rem", color: "#34d399", margin: "0 auto 0.5rem" }}><Icon.Check /></div>
          <p style={{ color: "#34d399", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 0.25rem" }}>You're on the waitlist!</p>
          <p style={{ color: "#334155", fontSize: "0.72rem", fontFamily: "monospace", margin: 0 }}>{wallet.address}</p>
        </div>
      ) : (
        <button onClick={() => setShowWalletModal(true)}
          style={{ width: "100%", padding: "0.9rem", borderRadius: "0.875rem", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", background: "rgba(45,212,191,0.08)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.22)", transition: "all 0.15s ease", letterSpacing: "-0.01em" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(45,212,191,0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(45,212,191,0.08)"; }}
        >
          Connect Wallet — Join Waitlist
        </button>
      )}
    </div>
  );

  // ── AGENT TAB ────────────────────────────
  const AgentTab = () => (
    <div>
      <div style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "1rem", padding: "1.25rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div style={{ width: "3rem", height: "3rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,rgba(45,212,191,0.18),rgba(167,139,250,0.18))", border: "1px solid rgba(45,212,191,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2dd4bf", flexShrink: 0 }}>
            <Icon.Bot />
          </div>
          <div>
            <h2 style={{ color: "#e2e8f0", fontWeight: 800, fontSize: "1rem", margin: "0 0 0.3rem", letterSpacing: "-0.02em" }}>OMNIX Autonomous Agent</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <div style={{ width: "0.45rem", height: "0.45rem", borderRadius: "9999px", background: agentOnline ? "#34d399" : "#334155", animation: agentOnline ? "pulse 2s infinite" : "none" }} />
              <span style={{ color: agentOnline ? "#34d399" : "#475569", fontSize: "0.72rem", fontWeight: 600 }}>{agentOnline ? "Online · Running autonomously" : "Connecting..."}</span>
            </div>
            <p style={{ color: "#1e293b", fontSize: "0.65rem", margin: "0.2rem 0 0" }}>DigitalOcean London · Claude AI (Anthropic)</p>
            {lastSync && <p style={{ color: "#1a2744", fontSize: "0.62rem", margin: "0.15rem 0 0" }}>Last sync: {lastSync}</p>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
          {[
            { label: "Server",   value: "165.232.41.239", color: "#2dd4bf" },
            { label: "Location", value: "London, UK",     color: "#a78bfa" },
            { label: "Runtime",  value: "Node.js 18",     color: "#34d399" },
            { label: "AI Model", value: "Claude Sonnet",  color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} style={{ background: "#040812", border: "1px solid #1a2744", borderRadius: "0.75rem", padding: "0.75rem" }}>
              <p style={{ color: "#1e293b", fontSize: "0.6rem", margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
              <p style={{ color: s.color, fontFamily: "monospace", fontSize: "0.775rem", fontWeight: 700, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { name: "Node Governance",   desc: "Audits nodes, slashes fraud" },
            { name: "Reward Rebalancing",desc: "Optimizes pool weights per epoch" },
            { name: "Anti-Sybil Defense",desc: "ML detection of fake clusters" },
            { name: "Treasury Routing",  desc: "10% fees → Bkggreen.sol founder" },
          ].map(c => (
            <div key={c.name} style={{ background: "#040812", border: "1px solid #1a2744", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.3rem" }}>
                <div style={{ width: "0.375rem", height: "0.375rem", borderRadius: "9999px", background: "#2dd4bf", animation: "pulse 2s infinite" }} />
                <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.775rem", margin: 0 }}>{c.name}</p>
              </div>
              <p style={{ color: "#334155", fontSize: "0.68rem", margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "1rem", padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
          <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "-0.01em" }}>Agent Activity Log</span>
          <span style={{ fontSize: "0.65rem", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: agentOnline ? "rgba(52,211,153,0.07)" : "rgba(30,41,59,0.5)", color: agentOnline ? "#34d399" : "#334155", border: agentOnline ? "1px solid rgba(52,211,153,0.18)" : "1px solid #1e293b", fontWeight: 700 }}>
            {agentOnline ? "● Live" : "Offline"}
          </span>
        </div>
        {agentLogs.length > 0 ? (
          <div style={{ maxHeight: "22rem", overflowY: "auto" }}>
            {agentLogs.map(l => (
              <div key={l.id} style={{ display: "flex", gap: "0.625rem", padding: "0.6rem 0", borderBottom: "1px solid #0a1020" }}>
                <p style={{ color: "#64748b", fontSize: "0.775rem", flex: 1, lineHeight: 1.55, margin: 0 }}>{l.msg || l.message || JSON.stringify(l)}</p>
                <span style={{ color: "#1a2744", fontSize: "0.62rem", fontFamily: "monospace", whiteSpace: "nowrap", marginTop: "0.1rem" }}>{fmtTime(l.ts)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "2.5rem", textAlign: "center" }}>
            <p style={{ color: "#334155", fontSize: "0.775rem", lineHeight: 1.6, margin: 0 }}>
              {agentOnline ? "Agent running — logs appear as the AI makes decisions every 15 minutes." : "Cannot reach agent server. Run omnix-api.ts on your DigitalOcean droplet."}
            </p>
            <code style={{ color: "#1a2744", fontSize: "0.65rem", display: "block", marginTop: "0.625rem" }}>pm2 start omnix-api.ts --interpreter tsx --name omnix-api</code>
          </div>
        )}
      </div>
    </div>
  );

  // ── ROADMAP ──────────────────────────────
  const RoadmapTab = () => (
    <div style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "1rem", padding: "1.5rem" }}>
      <h2 style={{ color: "#e2e8f0", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em", margin: "0 0 1.5rem" }}>OMNIX Launch Roadmap</h2>
      {[
        { phase: "Phase 1 — Foundation",     status: "complete", color: "#34d399", items: ["AI agent deployed & running 24/7", "Smart contracts written (Anchor/Rust)", "Web dashboard live & deployed", "GitHub open sourced", "Grant applications submitted"] },
        { phase: "Phase 2 — Funding",        status: "active",   color: "#2dd4bf", items: ["Solana Foundation grant (applied ✓)", "Superteam grant application", "Whitelist pre-sale to early operators", "Smart contract security audit"] },
        { phase: "Phase 3 — Mainnet Launch", status: "upcoming", color: "#a78bfa", items: ["Deploy smart contracts to Solana mainnet", "Create $OMX SPL token", "Open node registration (1,000 $OMX stake)", "Initial liquidity on Raydium / Jupiter"] },
        { phase: "Phase 4 — Growth",         status: "upcoming", color: "#f59e0b", items: ["Solana Mobile node runner app", "500+ active node operators", "Instagram autonomous posting live", "CEX listing campaign"] },
      ].map((p, pi, arr) => (
        <div key={p.phase} style={{ position: "relative", paddingLeft: "2rem", paddingBottom: pi < arr.length - 1 ? "2rem" : 0 }}>
          {pi < arr.length - 1 && <div style={{ position: "absolute", left: "0.43rem", top: "1.2rem", bottom: 0, width: "1px", background: "#1a2744" }} />}
          <div style={{ position: "absolute", left: 0, top: "0.2rem", width: "0.875rem", height: "0.875rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", background: p.status === "complete" ? p.color : p.status === "active" ? p.color : "#080d1c", border: p.status === "upcoming" ? "2px solid #1a2744" : "none", boxShadow: p.status === "active" ? `0 0 12px ${p.color}44` : "none" }}>
            {p.status === "complete" && <div style={{ width: "0.5rem", height: "0.5rem", color: "#000" }}><Icon.Check /></div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
            <h3 style={{ color: p.status === "upcoming" ? "#334155" : "#e2e8f0", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>{p.phase}</h3>
            {p.status === "active" && <span style={{ fontSize: "0.62rem", padding: "0.18rem 0.5rem", borderRadius: "9999px", background: `${p.color}12`, color: p.color, border: `1px solid ${p.color}30`, fontWeight: 700 }}>In Progress</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {p.items.map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "0.3rem", height: "0.3rem", borderRadius: "9999px", flexShrink: 0, background: p.status === "upcoming" ? "#1a2744" : p.color }} />
                <span style={{ fontSize: "0.75rem", color: p.status === "upcoming" ? "#334155" : "#64748b" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ── SOCIAL ───────────────────────────────
  const SocialTab = () => (
    <div>
      <div style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "1rem", padding: "1.25rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "1rem", background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
            <img src={LOGO} alt="OMNIX" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
          </div>
          <div>
            <p style={{ color: "#e2e8f0", fontWeight: 800, fontSize: "1.05rem", margin: 0, letterSpacing: "-0.02em" }}>@omnixprotocol</p>
            <p style={{ color: "#334155", fontSize: "0.72rem", margin: "0.25rem 0 0" }}>Instagram · AI-managed autonomous account</p>
          </div>
        </div>
        <a href="https://instagram.com/omnixprotocol" target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.875rem", borderRadius: "0.875rem", textDecoration: "none", background: "linear-gradient(135deg,rgba(240,148,51,0.1),rgba(188,24,136,0.1))", color: "#e2e8f0", fontWeight: 700, fontSize: "0.85rem", border: "1px solid rgba(188,24,136,0.18)", marginBottom: "1rem" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.75"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          <div style={{ width: "0.9rem", height: "0.9rem" }}><Icon.Link /></div>
          Follow @omnixprotocol on Instagram
        </a>
        <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.14)", borderRadius: "0.75rem", padding: "0.875rem" }}>
          <p style={{ color: "#f59e0b", fontSize: "0.72rem", lineHeight: 1.6, margin: 0 }}>
            📸 Live Instagram feed integration requires Instagram Basic Display API credentials. The AI agent is fully built and ready to post autonomously.
          </p>
        </div>
      </div>
      <div style={{ background: "#080d1c", border: "1px solid #1a2744", borderRadius: "1rem", padding: "1.25rem" }}>
        <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.875rem", margin: "0 0 0.875rem", letterSpacing: "-0.01em" }}>Community Links</p>
        {[
          { label: "Instagram", sub: "@omnixprotocol",            url: "https://instagram.com/omnixprotocol",     icon: "📸" },
          { label: "GitHub",    sub: "Bkggreen/omnix-depin",      url: "https://github.com/Bkggreen/omnix-depin", icon: "💻" },
          { label: "Website",   sub: "omnix-depin.vercel.app",    url: "https://omnix-depin.vercel.app",          icon: "🌐" },
        ].map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem", borderRadius: "0.75rem", textDecoration: "none", border: "1px solid #1a2744", marginBottom: "0.5rem", transition: "all 0.15s ease" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d3f66"; e.currentTarget.style.background = "#0d1629"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a2744"; e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.2rem" }}>{l.icon}</span>
              <div>
                <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{l.label}</p>
                <p style={{ color: "#334155", fontSize: "0.68rem", margin: "0.15rem 0 0" }}>{l.sub}</p>
              </div>
            </div>
            <div style={{ width: "0.85rem", height: "0.85rem", color: "#334155" }}><Icon.Link /></div>
          </a>
        ))}
      </div>
    </div>
  );

  const panels = {
    overview: <OverviewTab />,
    node:     <NodeRunner wallet={wallet} onConnectWallet={() => setShowWalletModal(true)} />,
    agent:    <AgentTab />,
    roadmap:  <RoadmapTab />,
    social:   <SocialTab />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#04091c", color: "#e2e8f0", fontFamily: "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:#040812;}
        ::-webkit-scrollbar-thumb{background:#1a2744;border-radius:2px;}
        a{text-decoration:none;}
        button{font-family:inherit;}
      `}</style>

      {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} onConnect={connectWallet} />}
      {showWalletMenu && <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowWalletMenu(false)} />}

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid #0d1629", background: "rgba(4,9,28,0.96)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0.875rem 1rem 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>

            {/* Logo + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <img src={LOGO} alt="OMNIX" style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.6rem", objectFit: "cover", border: "1px solid rgba(255,255,255,0.06)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.03em" }}>OMNIX</span>
                <span style={{ fontSize: "0.58rem", padding: "0.18rem 0.5rem", borderRadius: "9999px", background: "rgba(245,158,11,0.07)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.18)", fontWeight: 700 }}>Pre-Launch</span>
              </div>
            </div>

            {/* Wallet button */}
            <div style={{ position: "relative" }}>
              {wallet.connected ? (
                <>
                  <button onClick={() => setShowWalletMenu(v => !v)}
                    style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.45rem 0.875rem", borderRadius: "0.75rem", cursor: "pointer", background: "rgba(45,212,191,0.08)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.22)", fontWeight: 700, fontSize: "0.72rem", transition: "all 0.15s ease" }}>
                    <div style={{ width: "0.4rem", height: "0.4rem", borderRadius: "9999px", background: "#2dd4bf" }} />
                    {fmtAddr(wallet.address)}
                  </button>
                  {showWalletMenu && (
                    <div style={{ position: "absolute", right: 0, top: "2.75rem", background: "#080d1c", border: "1px solid #1a2744", borderRadius: "0.875rem", padding: "0.5rem", width: "13rem", zIndex: 50, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
                      <div style={{ padding: "0.625rem 0.75rem", borderBottom: "1px solid #0d1629", marginBottom: "0.375rem" }}>
                        <p style={{ color: "#334155", fontSize: "0.62rem", margin: "0 0 0.2rem" }}>{wallet.name}</p>
                        <p style={{ color: "#f59e0b", fontFamily: "monospace", fontWeight: 700, fontSize: "0.875rem", margin: 0 }}>{wallet.balance.toFixed(4)} SOL</p>
                        <p style={{ color: "#34d399", fontSize: "0.62rem", margin: "0.2rem 0 0" }}>✓ On waitlist</p>
                      </div>
                      {[
                        { label: copied ? "Copied!" : "Copy Address", icon: <Icon.Copy />, action: copyAddr, color: "#94a3b8" },
                        { label: "Disconnect",                         icon: <Icon.LogOut />, action: disconnect, color: "#ef4444" },
                      ].map(btn => (
                        <button key={btn.label} onClick={btn.action}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", cursor: "pointer", background: "transparent", border: "none", color: btn.color, fontSize: "0.775rem", transition: "background 0.15s ease" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#0d1629"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                          <div style={{ width: "0.8rem", height: "0.8rem" }}>{btn.icon}</div>
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button onClick={() => setShowWalletModal(true)}
                  style={{ padding: "0.45rem 0.875rem", borderRadius: "0.75rem", cursor: "pointer", background: "rgba(45,212,191,0.08)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.22)", fontWeight: 700, fontSize: "0.72rem", transition: "all 0.15s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(45,212,191,0.16)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(45,212,191,0.08)"; }}
                >
                  Join Waitlist
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
            {TABS.map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.6rem 0.875rem", cursor: "pointer", background: "transparent", border: "none", borderBottom: `2px solid ${active ? "#2dd4bf" : "transparent"}`, color: active ? "#2dd4bf" : "#334155", fontSize: "0.775rem", fontWeight: active ? 700 : 500, whiteSpace: "nowrap", transition: "all 0.15s ease" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#64748b"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#334155"; }}
                >
                  <div style={{ width: "0.825rem", height: "0.825rem" }}><t.Icon /></div>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
        {panels[tab]}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid #0d1629", padding: "0.875rem 1rem" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src={LOGO} alt="" style={{ width: "1.25rem", height: "1.25rem", borderRadius: "0.25rem", objectFit: "cover", opacity: 0.4 }} />
            <span style={{ color: "#1a2744", fontSize: "0.68rem" }}>OMNIX Protocol · Built on Solana · Open Source</span>
          </div>
          <a href="https://github.com/Bkggreen/omnix-depin" target="_blank" rel="noopener noreferrer"
            style={{ color: "#1a2744", fontSize: "0.68rem", transition: "color 0.15s ease" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#334155"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#1a2744"; }}
          >
            GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
