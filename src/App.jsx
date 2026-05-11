import { useState, useEffect, useRef, useCallback } from "react";

const API = "http://165.232.41.239:3001";
const LOGO = "/omnix-logo.jpeg.JPG";   // ← Fixed path

// Icons (keep all your icons)
const I = { /* ... your full icons object ... */ };

// Wallets + helper functions (keep yours)
const WALLETS = [ /* your full array */ ];

async function getSol(pk: string) { /* your function */ }

export default function App() {
  const [tab, setTab] = useState("overview");
  const [showW, setShowW] = useState(false);
  const [wallet, setWallet] = useState({connected: false, address: "", name: "", balance: 0});

  return (
    <div style={{ minHeight: "100vh", background: "#04091c", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ background: "#0a0f1c", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1e2a4a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img 
            src={LOGO} 
            alt="OMNIX" 
            style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover" }}
            onError={(e) => e.currentTarget.src = "https://via.placeholder.com/48/1e2937/2dd4bf?text=Ω"}
          />
          <span style={{ fontSize: "1.6rem", fontWeight: 900 }}>OMNIX</span>
        </div>
        <button onClick={() => setShowW(true)} style={{ padding: "12px 24px", background: "#22d3ee", color: "#000", borderRadius: "9999px", fontWeight: 700 }}>
          Join Waitlist
        </button>
      </div>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "3rem 1rem", background: "#0a0f1c" }}>
        <img 
          src={LOGO} 
          alt="OMNIX" 
          style={{ width: "160px", height: "160px", borderRadius: "32px", boxShadow: "0 0 70px rgba(45,212,191,0.5)" }}
          onError={(e) => e.currentTarget.style.display = "none"}
        />
        <h1 style={{ fontSize: "2.8rem", fontWeight: 900, margin: "1.5rem 0 0.5rem" }}>OMNIX Protocol</h1>
      </div>

      {/* Wallet Modal */}
      {showW && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#111827", padding: "2rem", borderRadius: "20px", width: "90%", maxWidth: "360px" }}>
            <img src={LOGO} alt="OMNIX" style={{ width: "80px", height: "80px", borderRadius: "16px", margin: "0 auto 1rem" }} />
            <h2 style={{ textAlign: "center" }}>Connect Wallet</h2>
            <button onClick={() => setShowW(false)} style={{ marginTop: "1rem", width: "100%" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
