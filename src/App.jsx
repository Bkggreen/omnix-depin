import { useState, useEffect, useRef, useCallback } from "react";

const API = "http://165.232.41.239:3001";
const LOGO = "/omnix-logo.jpeg";   // ← Your new chain logo

// ── Icons ─────────────────────────────────────────────────────
const I = {
  Globe: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Cpu:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  Bot:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Clock:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Radio:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>,
  Check:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Copy:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Out:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Play:   () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Stop:   () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  Link:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

// ── Wallet definitions ─────────────────────────────────────────
const WALLETS = [
  { id:"mobile",   name:"Solana Mobile",  emoji:"📱", desc:"Saga / Chapter 2",    url:"https://solanamobile.com",   detect:()=>!!(window as any)?.solana?.isMobileWallet,                          get:()=>(window as any)?.solana },
  { id:"phantom",  name:"Phantom",        emoji:"👻", desc:"Most popular",        url:"https://phantom.app",        detect:()=>!!(window as any)?.solana?.isPhantom && !(window as any)?.solana?.isMobileWallet, get:()=>(window as any)?.solana },
  { id:"solflare", name:"Solflare",       emoji:"☀️", desc:"Mobile & desktop",    url:"https://solflare.com",       detect:()=>!!(window as any)?.solflare?.isSolflare,                            get:()=>(window as any)?.solflare },
  { id:"backpack", name:"Backpack",       emoji:"🎒", desc:"By Coral / xNFT",     url:"https://backpack.app",       detect:()=>!!(window as any)?.backpack,                                        get:()=>(window as any)?.backpack },
  { id:"glow",     name:"Glow",           emoji:"✨", desc:"iOS & Android",        url:"https://glow.app",           detect:()=>!!(window as any)?.glow,                                            get:()=>(window as any)?.glow },
  { id:"exodus",   name:"Exodus",         emoji:"🚀", desc:"Multi-chain wallet",   url:"https://exodus.com",         detect:()=>!!(window as any)?.exodus?.solana,                                  get:()=>(window as any)?.exodus?.solana },
];

async function getSol(pk: string) {
  try {
    const r = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [pk, { commitment: "confirmed" }] })
    });
    const d = await r.json();
    return (d?.result?.value ?? 0) / 1e9;
  } catch { return 0; }
}

const sh = (a: string) => a ? `${a.slice(0,4)}...${a.slice(-4)}` : "";
const ft = (d: Date) => d instanceof Date ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";

// ── Wallet Modal ───────────────────────────────────────────────
function WalletModal({ onClose, onConnect }: { onClose: () => void; onConnect: (p: any, n: string) => void }) {
  const [det, setDet] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const d: Record<string, boolean> = {};
    WALLETS.forEach(w => { try { d[w.id] = w.detect(); } catch { d[w.id] = false; } });
    setDet(d);
  }, []);

  const pick = async (w: typeof WALLETS[0]) => {
    if (det[w.id]) {
      const p = w.get();
      if (p) onConnect(p, w.name);
    } else window.open(w.url, "_blank");
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem", backdropFilter: "blur(10px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#070d1e", border: "1px solid #182440", borderRadius: "1.25rem", padding: "1.5rem", width: "100%", maxWidth: "25rem", boxShadow: "0 0 80px rgba(45,212,191,0.07), 0 32px 64px rgba(0,0,0,0.7)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <img src={LOGO} alt="OMNIX" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", objectFit: "cover", border: "1px solid #182440" }} />
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>Connect Wallet</span>
          </div>
          <button onClick={onClose} style={{ color: "#475569", background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
        </div>
        {/* rest of modal unchanged */}
        {/* ... (the rest of WalletModal stays exactly the same) ... */}
      </div>
    </div>
  );
}

// ── Node Runner (with your logo) ─────────────────────────────────
function NodeRunner({ wallet, onOpen }: { wallet: any; onOpen: () => void }) {
  // ... all your existing NodeRunner code ...

  // Only change: logo images
  return (
    <div>
      {/* Wallet info with new logo */}
      <div style={{ background: "#070d1e", border: "1px solid #182440", borderRadius: "0.875rem", padding: "1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <img src={LOGO} alt="OMNIX" style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", objectFit: "cover", border: "1px solid #182440" }} />
        {/* rest unchanged */}
      </div>
      {/* ... rest of NodeRunner stays the same ... */}
    </div>
  );
}

// ── Main App with your new logo everywhere ───────────────────────
const TABS = [
  { id: "overview", label: "Overview", Ic: I.Globe },
  { id: "node", label: "My Node", Ic: I.Cpu },
  { id: "agent", label: "AI Agent", Ic: I.Bot },
  { id: "roadmap", label: "Roadmap", Ic: I.Clock },
  { id: "social", label: "Social", Ic: I.Radio },
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const [showW, setShowW] = useState(false);
  const [showM, setShowM] = useState(false);
  const [wallet, setWallet] = useState({ connected: false, address: "", name: "", balance: 0 });
  const [cp, setCp] = useState(false);
  const [online, setOnline] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [sync, setSync] = useState("");
  const cvs = useRef<HTMLCanvasElement>(null);
  const anim = useRef<number>(0);

  // ... your existing useEffect, connect, disc, copy functions remain unchanged ...

  const Overview = () => (
    <div>
      <div style={{ position: "relative", borderRadius: "1.5rem", overflow: "hidden", marginBottom: "1.5rem", border: "1px solid #182440", height: "280px" }}>
        <canvas ref={cvs} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#04091c" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1.5rem" }}>
          <img 
            src={LOGO} 
            alt="OMNIX" 
            style={{ 
              width: "7rem", 
              height: "7rem", 
              borderRadius: "1.5rem", 
              objectFit: "cover", 
              marginBottom: "1rem",
              boxShadow: "0 0 70px rgba(45,212,191,0.45)",
              border: "2px solid rgba(255,255,255,0.1)"
            }} 
          />
          <span style={{ fontSize: "0.75rem", padding: "0.35rem 1rem", borderRadius: "9999px", background: "rgba(245,158,11,0.09)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)", fontWeight: 700 }}>Pre-Launch</span>
          <h1 style={{ color: "#fff", fontSize: "clamp(2.2rem, 7vw, 3.4rem)", fontWeight: 900, letterSpacing: "-0.05em", margin: "0.8rem 0 0.4rem" }}>OMNIX Protocol</h1>
          <p style={{ color: "#64748b", maxWidth: "28rem", lineHeight: 1.6 }}>The world's first fully autonomous multi-layer DePIN on Solana.</p>
        </div>
      </div>
      {/* rest of Overview unchanged */}
    </div>
  );

  // Agent, Roadmap, Social, etc. also use LOGO where needed (header, cards)

  return (
    <div style={{ minHeight: "100vh", background: "#04091c", color: "#e2e8f0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>

      {showW && <WalletModal onClose={() => setShowW(false)} onConnect={connect} />}
      
      {/* HEADER - Your new logo */}
      <div style={{ borderBottom: "1px solid #0c1625", background: "rgba(4,9,28,0.97)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0 0.625rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <img src={LOGO} alt="OMNIX" style={{ width: "2.6rem", height: "2.6rem", borderRadius: "0.75rem", objectFit: "cover", border: "1px solid #182440" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.04em" }}>OMNIX</span>
                <span style={{ color: "#64748b", fontSize: "1rem" }}>Protocol</span>
              </div>
            </div>
            {/* Wallet button etc. unchanged */}
          </div>
          {/* Tabs unchanged */}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
        {tab === "overview" && <Overview />}
        {tab === "node" && <NodeRunner wallet={wallet} onOpen={() => setShowW(true)} />}
        {tab === "agent" && <Agent />}
        {tab === "roadmap" && <Roadmap />}
        {tab === "social" && <Social />}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #0c1625", padding: "2rem 1rem", textAlign: "center" }}>
        <img src={LOGO} alt="OMNIX" style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", opacity: 0.6 }} />
        <p style={{ color: "#334155", marginTop: "0.75rem", fontSize: "0.85rem" }}>
          OMNIX Protocol • Built on Solana • Open Source
        </p>
      </div>
    </div>
  );
}
