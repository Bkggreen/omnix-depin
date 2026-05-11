import { useState, useEffect, useRef, useCallback } from "react";
import { Analytics } from '@vercel/analytics/react';

const API = "http://165.232.41.239:3001";
const LOGO = "data:image/jpeg;base64,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";

// ── Icons ─────────────────────────────────────────────────────
const I = {
  Globe:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Cpu:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  Bot:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Clock:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Radio:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>,
  Check:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Copy:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Out:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Play:   ()=><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Stop:   ()=><svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  Link:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

// ── Wallet definitions ─────────────────────────────────────────
const WALLETS = [
  { id:"mobile",   name:"Solana Mobile",  emoji:"📱", desc:"Saga / Chapter 2",    url:"https://solanamobile.com",   detect:()=>!!(window as any)?.solana?.isMobileWallet,                          get:()=>(window as any)?.solana },
  { id:"phantom",  name:"Phantom",        emoji:"👻", desc:"Most popular",        url:"https://phantom.app",        detect:()=>!!(window as any)?.solana?.isPhantom && !(window as any)?.solana?.isMobileWallet, get:()=>(window as any)?.solana },
  { id:"solflare", name:"Solflare",       emoji:"🌞", desc:"Mobile & desktop",    url:"https://solflare.com",       detect:()=>!!(window as any)?.solflare?.isSolflare,                            get:()=>(window as any)?.solflare },
  { id:"backpack", name:"Backpack",       emoji:"🎒", desc:"By Coral / xNFT",     url:"https://backpack.app",       detect:()=>!!(window as any)?.backpack,                                        get:()=>(window as any)?.backpack },
  { id:"glow",     name:"Glow",           emoji:"✨", desc:"iOS & Android",        url:"https://glow.app",           detect:()=>!!(window as any)?.glow,                                            get:()=>(window as any)?.glow },
  { id:"exodus",   name:"Exodus",         emoji:"🚀", desc:"Multi-chain wallet",   url:"https://exodus.com",         detect:()=>!!(window as any)?.exodus?.solana,                                  get:()=>(window as any)?.exodus?.solana },
];

async function getSol(pk:string){
  try{
    const r=await fetch("https://api.mainnet-beta.solana.com",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"getBalance",params:[pk,{commitment:"confirmed"}]})});
    const d=await r.json();
    return (d?.result?.value??0)/1e9;
  }catch{return 0;}
}

const sh=(a:string)=>a?`${a.slice(0,4)}...${a.slice(-4)}`:"";
const ft=(d:Date)=>d instanceof Date?d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"";

// ── S = inline style helper ─────────────────────────────────
const S:any=(obj:any)=>obj;

// ── Wallet Modal ──────────────────────────────────────────���────
function WalletModal({onClose,onConnect}:{onClose:()=>void;onConnect:(p:any,n:string)=>void}){
  const [det,setDet]=useState<Record<string,boolean>>({});
  useEffect(()=>{const d:Record<string,boolean>={};WALLETS.forEach(w=>{try{d[w.id]=w.detect();}catch{d[w.id]=false;}});setDet(d);},[]);
  const pick=async(w:typeof WALLETS[0])=>{
    if(det[w.id]){const p=w.get();if(p)onConnect(p,w.name);}
    else window.open(w.url,"_blank");
  };
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem",backdropFilter:"blur(10px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"1.25rem",padding:"1.5rem",width:"100%",maxWidth:"25rem",boxShadow:"0 0 80px rgba(45,212,191,0.07),0 32px 64px rgba(0,0,0,0.7)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.625rem"}}>
            <img src={LOGO} alt="OMNIX" style={{width:"2rem",height:"2rem",borderRadius:"0.5rem",objectFit:"cover"}}/>
            <span style={{color:"#fff",fontWeight:800,fontSize:"1rem",letterSpacing:"-0.02em"}}>Connect Wallet</span>
          </div>
          <button onClick={onClose} style={{color:"#475569",background:"none",border:"none",fontSize:"1.3rem",cursor:"pointer",lineHeight:1,padding:"0.2rem"}}>✕</button>
        </div>
        <div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.18)",borderRadius:"0.75rem",padding:"0.75rem",marginBottom:"1.25rem"}}>
          <p style={{color:"#f59e0b",fontSize:"0.72rem",lineHeight:1.55,margin:0}}>⚠️ Smart contract not yet deployed. Connecting joins the founding operator waitlist.</p>
        </div>
        <p style={{color:"#1e293b",fontSize:"0.63rem",textTransform:"uppercase",letterSpacing:"0.09em",fontWeight:700,margin:"0 0 0.5rem"}}>Select Wallet</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
          {WALLETS.map(w=>(
            <button key={w.id} onClick={()=>pick(w)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.8rem 1rem",borderRadius:"0.75rem",cursor:"pointer",background:det[w.id]?"rgba(45,212,191,0.04)":"transparent",border:`1px solid ${det[w.id]?"rgba(45,212,191,0.2)":"#182440"}`,transition:"all 0.15s ease"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#2dd4bf44";(e.currentTarget as HTMLElement).style.background="#0c1628";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=det[w.id]?"rgba(45,212,191,0.2)":"#182440";(e.currentTarget as HTMLElement).style.background=det[w.id]?"rgba(45,212,191,0.04)":"transparent";}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                <span style={{fontSize:"1.4rem",lineHeight:1}}>{w.emoji}</span>
                <div style={{textAlign:"left"}}>
                  <p style={{color:"#e2e8f0",fontWeight:600,fontSize:"0.875rem",margin:0}}>{w.name}</p>
                  <p style={{color:"#1e293b",fontSize:"0.67rem",margin:"0.1rem 0 0"}}>{w.desc}</p>
                </div>
              </div>
              {det[w.id]
                ?<span style={{fontSize:"0.63rem",padding:"0.22rem 0.6rem",borderRadius:"9999px",background:"rgba(52,211,153,0.1)",color:"#34d399",border:"1px solid rgba(52,211,153,0.2)",fontWeight:700}}>Detected</span>
                :<span style={{color:"#1e293b",fontSize:"0.7rem"}}>Install →</span>}
            </button>
          ))}
        </div>
        <p style={{color:"#1a2744",fontSize:"0.66rem",textAlign:"center",marginTop:"0.875rem"}}>On Solana Mobile? Tap "Solana Mobile" above</p>
      </div>
    </div>
  );
}

// ── Node Runner ────────────────────────────────────────────────
function NodeRunner({wallet,onOpen}:{wallet:any;onOpen:()=>void}){
  const [on,setOn]=useState(false);
  const [m,setM]=useState({s:0,c:0,b:0,h:0});
  const [up,setUp]=useState(0);
  const [earn,setEarn]=useState(0);
  const t1=useRef<any>(null),t2=useRef<any>(null);

  const start=useCallback(()=>{
    setOn(true);setUp(0);setEarn(0);setM({s:74,c:61,b:88,h:97.4});
    t1.current=setInterval(()=>{setUp(u=>u+1);setEarn(e=>+(e+0.000001111).toFixed(9));},1000);
    t2.current=setInterval(()=>setM(m=>({
      s:Math.min(100,Math.max(55,+(m.s+(Math.random()-0.4)*2.2).toFixed(1))),
      c:Math.min(100,Math.max(38,+(m.c+(Math.random()-0.4)*3.5).toFixed(1))),
      b:Math.min(100,Math.max(68,+(m.b+(Math.random()-0.4)*1.8).toFixed(1))),
      h:Math.min(100,Math.max(94,+(m.h+(Math.random()-0.3)*0.4).toFixed(1))),
    })),1800);
  },[]);

  const stop=useCallback(()=>{setOn(false);clearInterval(t1.current);clearInterval(t2.current);},[]);
  useEffect(()=>()=>{clearInterval(t1.current);clearInterval(t2.current);},[]);

  const fmt=(s:number)=>{const h=Math.floor(s/3600),mi=Math.floor((s%3600)/60),sc=s%60;return`${String(h).padStart(2,"0")}:${String(mi).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;};

  const Bar=({v,col,lbl}:{v:number;col:string;lbl:string})=>(
    <div style={{marginBottom:"0.9rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.35rem"}}>
        <span style={{color:"#64748b",fontSize:"0.77rem"}}>{lbl}</span>
        <span style={{color:col,fontSize:"0.77rem",fontFamily:"monospace",fontWeight:700}}>{v.toFixed(1)}%</span>
      </div>
      <div style={{height:"6px",background:"#070d1e",borderRadius:"9999px",overflow:"hidden",border:"1px solid #182440"}}>
        <div style={{height:"100%",width:`${v}%`,background:`linear-gradient(90deg,${col}77,${col})`,borderRadius:"9999px",transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)",boxShadow:`0 0 8px ${col}44`}}/>
      </div>
    </div>
  );

  if(!wallet.connected)return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3.5rem 1.5rem",textAlign:"center",background:"#070d1e",border:"1px dashed #182440",borderRadius:"1rem"}}>
      <img src={LOGO} alt="OMNIX" style={{width:"4rem",height:"4rem",borderRadius:"1rem",objectFit:"cover",marginBottom:"1rem",opacity:0.4}}/>
      <h3 style={{color:"#e2e8f0",fontWeight:700,fontSize:"1rem",margin:"0 0 0.5rem"}}>Connect Wallet to Run a Node</h3>
      <p style={{color:"#334155",fontSize:"0.8rem",lineHeight:1.6,marginBottom:"1.5rem",maxWidth:"22rem"}}>You'll need a Solana wallet with 1,000 $OMX to register as a node operator. Join the waitlist now and be first at launch.</p>
      <button onClick={onOpen} style={{padding:"0.75rem 2rem",borderRadius:"0.75rem",cursor:"pointer",fontWeight:700,fontSize:"0.875rem",background:"rgba(45,212,191,0.1)",color:"#2dd4bf",border:"1px solid rgba(45,212,191,0.25)",transition:"all 0.15s ease"}}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(45,212,191,0.18)";}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(45,212,191,0.1)";}}>
        Connect Wallet
      </button>
    </div>
  );

  return(
    <div>
      {/* Pre-launch notice */}
      <div style={{background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.17)",borderRadius:"0.875rem",padding:"0.875rem 1rem",marginBottom:"1.25rem",display:"flex",gap:"0.75rem"}}>
        <div style={{width:"1rem",height:"1rem",color:"#f59e0b",flexShrink:0,marginTop:"0.1rem"}}><I.Alert/></div>
        <p style={{color:"#f59e0b",fontSize:"0.74rem",lineHeight:1.6,margin:0}}><strong>Pre-Launch Mode.</strong> Node metrics simulate real contribution locally. On-chain staking, proof submission, and real $OMX earnings go live after smart contract deployment. All rates shown are the final mainnet values.</p>
      </div>

      {/* Wallet info */}
      <div style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"0.875rem",padding:"1rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:"0.875rem"}}>
        <img src={LOGO} alt="OMNIX" style={{width:"2.5rem",height:"2.5rem",borderRadius:"0.625rem",objectFit:"cover",flexShrink:0,border:"1px solid #182440"}}/>
        <div style={{flex:1}}>
          <p style={{color:"#334155",fontSize:"0.67rem",margin:"0 0 0.2rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{wallet.name} · Connected</p>
          <p style={{color:"#e2e8f0",fontFamily:"monospace",fontSize:"0.78rem",fontWeight:600,margin:0,wordBreak:"break-all"}}>{wallet.address}</p>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <p style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:700,fontSize:"0.9rem",margin:0}}>{wallet.balance.toFixed(4)}</p>
          <p style={{color:"#1e293b",fontSize:"0.63rem",margin:0}}>SOL</p>
        </div>
      </div>

      {/* Node control */}
      <div style={{background:"#070d1e",border:`1px solid ${on?"rgba(45,212,191,0.2)":"#182440"}`,borderRadius:"1rem",padding:"1.25rem",marginBottom:"1.25rem",transition:"border-color 0.4s,box-shadow 0.4s",boxShadow:on?"0 0 40px rgba(45,212,191,0.04)":"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.25rem"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"0.45rem",marginBottom:"0.3rem"}}>
              <div style={{width:"0.45rem",height:"0.45rem",borderRadius:"9999px",background:on?"#2dd4bf":"#1e293b",animation:on?"pulse 2s infinite":"none"}}/>
              <span style={{color:on?"#2dd4bf":"#334155",fontSize:"0.68rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.09em"}}>{on?"Node Active":"Node Offline"}</span>
            </div>
            <h3 style={{color:"#e2e8f0",fontWeight:800,fontSize:"1rem",margin:0}}>OMNIX Node Runner</h3>
            <p style={{color:"#1e293b",fontSize:"0.72rem",margin:"0.2rem 0 0"}}>{on?`Uptime: ${fmt(up)}`:"Pre-launch simulation mode"}</p>
          </div>
          <button onClick={on?stop:start} style={{display:"flex",alignItems:"center",gap:"0.45rem",padding:"0.6rem 1.2rem",borderRadius:"0.75rem",cursor:"pointer",fontWeight:700,fontSize:"0.8rem",background:on?"rgba(239,68,68,0.09)":"rgba(45,212,191,0.09)",color:on?"#ef4444":"#2dd4bf",border:`1px solid ${on?"rgba(239,68,68,0.2)":"rgba(45,212,191,0.2)"}`,transition:"all 0.15s ease"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity="0.7";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="1";}}>
            <div style={{width:"0.875rem",height:"0.875rem"}}>{on?<I.Stop/>:<I.Play/>}</div>
            {on?"Stop Node":"Start Node"}
          </button>
        </div>

        <div style={{opacity:on?1:0.2,transition:"opacity 0.5s",pointerEvents:on?"auto":"none"}}>
          <Bar v={m.s} col="#f59e0b" lbl="Storage Contribution"/>
          <Bar v={m.c} col="#2dd4bf" lbl="Compute Contribution"/>
          <Bar v={m.b} col="#a78bfa" lbl="Bandwidth Contribution"/>
          <Bar v={m.h} col="#34d399" lbl="Node Health Score"/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.6rem",marginTop:on?"0.5rem":"0"}}>
          {[
            {lbl:"Session Earnings",val:on?`${earn.toFixed(6)}`:"—",unit:"$OMX",col:"#f59e0b"},
            {lbl:"Health Score",   val:on?`${m.h.toFixed(1)}`:"—",   unit:"%",   col:"#34d399"},
            {lbl:"Status",         val:on?"Active":"Offline",          unit:"",    col:on?"#2dd4bf":"#334155"},
          ].map(s=>(
            <div key={s.lbl} style={{background:"#040910",border:"1px solid #182440",borderRadius:"0.75rem",padding:"0.75rem",textAlign:"center"}}>
              <p style={{color:"#1e293b",fontSize:"0.6rem",margin:"0 0 0.3rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.lbl}</p>
              <p style={{color:s.col,fontFamily:"monospace",fontWeight:700,fontSize:"0.875rem",margin:0}}>{s.val}{s.unit&&<span style={{fontSize:"0.58rem",marginLeft:"0.2rem",opacity:0.7}}>{s.unit}</span>}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reward table */}
      <div style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"1rem",padding:"1.25rem"}}>
        <p style={{color:"#e2e8f0",fontWeight:700,fontSize:"0.875rem",margin:"0 0 0.875rem"}}>Reward Mechanisms — Locked Until Mainnet</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
          {[
            {n:"Proof-of-Coverage",  d:"Uptime + location every 15 min",    r:"0.012 $OMX/hr"},
            {n:"Proof-of-Compute",   d:"CPU/GPU tasks verified on-chain",    r:"0.016 $OMX/task"},
            {n:"Bandwidth Relay",    d:"Traffic routed through your node",   r:"0.008 $OMX/GB"},
            {n:"AI Task Bounties",   d:"Inference & embeddings from clients", r:"0.04 $OMX/task"},
            {n:"Node Running Bonus", d:"Base reward for staying online",      r:"0.004 $OMX/hr"},
          ].map(r=>(
            <div key={r.n} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.7rem",borderRadius:"0.75rem",background:on?"rgba(45,212,191,0.03)":"transparent",border:`1px solid ${on?"rgba(45,212,191,0.09)":"#0d1829"}`,transition:"all 0.35s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
                <div style={{width:"0.38rem",height:"0.38rem",borderRadius:"9999px",background:on?"#2dd4bf":"#1e293b",transition:"background 0.35s ease",flexShrink:0}}/>
                <div>
                  <p style={{color:on?"#e2e8f0":"#1e293b",fontSize:"0.78rem",fontWeight:600,margin:0}}>{r.n}</p>
                  <p style={{color:"#1e293b",fontSize:"0.65rem",margin:"0.1rem 0 0"}}>{r.d}</p>
                </div>
              </div>
              <span style={{color:on?"#f59e0b":"#1e293b",fontFamily:"monospace",fontSize:"0.7rem",fontWeight:700,whiteSpace:"nowrap",transition:"color 0.35s ease"}}>{r.r}</span>
            </div>
          ))}
        </div>
        <p style={{color:"#182440",fontSize:"0.65rem",textAlign:"center",marginTop:"0.875rem"}}>🔒 On-chain rewards activate after mainnet smart contract deployment</p>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────
const TABS=[
  {id:"overview",label:"Overview",Ic:I.Globe},
  {id:"node",    label:"My Node",  Ic:I.Cpu},
  {id:"agent",   label:"AI Agent", Ic:I.Bot},
  {id:"roadmap", label:"Roadmap",  Ic:I.Clock},
  {id:"social",  label:"Social",   Ic:I.Radio},
];

export default function App(){
  const [tab,setTab]=useState("overview");
  const [showW,setShowW]=useState(false);
  const [showM,setShowM]=useState(false);
  const [wallet,setWallet]=useState({connected:false,address:"",name:"",balance:0});
  const [cp,setCp]=useState(false);
  const [online,setOnline]=useState(false);
  const [stats,setStats]=useState<any>(null);
  const [logs,setLogs]=useState<any[]>([]);
  const [sync,setSync]=useState("");
  const cvs=useRef<HTMLCanvasElement>(null);
  const anim=useRef<number>(0);

  useEffect(()=>{
    const load=async()=>{
      try{
        const r=await fetch(`${API}/stats`,{signal:AbortSignal.timeout(5000)});
        if(r.ok){
          const d=await r.json();
          setStats(d);setOnline(true);
          setSync(new Date(d.lastUpdated||Date.now()).toLocaleTimeString());
          if(Array.isArray(d.agentLogs)&&d.agentLogs.length>0)
            setLogs(d.agentLogs.slice(0,40).map((l:any,i:number)=>({...l,id:i,ts:new Date(l.timestamp||Date.now())})));
        }
      }catch{setOnline(false);}
    };
    load();
    const iv=setInterval(load,30000);
    return()=>clearInterval(iv);
  },[]);

  useEffect(()=>{
    const c=cvs.current;if(!c)return;
    const ctx=c.getContext("2d")!;
    c.width=c.offsetWidth;c.height=c.offsetHeight;
    const C=["#2dd4bf","#f59e0b","#a78bfa","#34d399"];
    const pts=Array.from({length:55},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-0.5)*0.28,vy:(Math.random()-0.5)*0.28,r:Math.random()*1.5+0.5,col:C[Math.floor(Math.random()*4)],ph:Math.random()*Math.PI*2}));
    let f=0;
    const draw=()=>{
      f++;
      ctx.fillStyle="rgba(4,10,28,0.2)";ctx.fillRect(0,0,c.width,c.height);
      pts.forEach((a,i)=>{
        for(let j=i+1;j<Math.min(i+5,pts.length);j++){
          const b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
          if(d<90){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(45,212,191,${0.08*(1-d/90)})`;ctx.lineWidth=0.5;ctx.stroke();}
        }
        const p=Math.sin(a.ph+f*0.016)*0.5+0.5;
        ctx.globalAlpha=0.5+p*0.5;ctx.beginPath();ctx.arc(a.x,a.y,a.r*(1+p*0.3),0,Math.PI*2);ctx.fillStyle=a.col;ctx.fill();ctx.globalAlpha=1;
        a.x+=a.vx;a.y+=a.vy;
        if(a.x<0||a.x>c.width)a.vx*=-1;if(a.y<0||a.y>c.height)a.vy*=-1;
      });
      anim.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(anim.current);
  },[]);

  const connect=useCallback(async(provider:any,name:string)=>{
    try{
      await provider.connect();
      const pk=provider.publicKey?.toString();
      if(!pk)throw new Error("No public key");
      const bal=await getSol(pk);
      setWallet({connected:true,address:pk,name,balance:bal});
      setShowW(false);
    }catch(e:any){console.error("Wallet error:",e?.message);}
  },[]);

  const disc=useCallback(()=>{setWallet({connected:false,address:"",name:"",balance:0});setShowM(false);},[]);
  const copy=useCallback(()=>{if(wallet.address){navigator.clipboard.writeText(wallet.address);setCp(true);setTimeout(()=>setCp(false),2000);}},[wallet.address]);

  const Overview=()=>(
    <div>
      <div style={{position:"relative",borderRadius:"1rem",overflow:"hidden",marginBottom:"1.25rem",border:"1px solid #182440",height:"260px"}}>
        <canvas ref={cvs} style={{position:"absolute",inset:0,width:"100%",height:"100%",background:"#04091c"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"1.5rem"}}>
          <img src={LOGO} alt="OMNIX" style={{width:"5rem",height:"5rem",borderRadius:"1.1rem",objectFit:"cover",marginBottom:"0.875rem",boxShadow:"0 0 40px rgba(0,0,0,0.9)",border:"1px solid rgba(255,255,255,0.08)"}}/>
          <span style={{fontSize:"0.67rem",padding:"0.25rem 0.875rem",borderRadius:"9999px",background:"rgba(245,158,11,0.09)",color:"#f59e0b",border:"1px solid rgba(245,158,11,0.2)",fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:"0.7rem"}}>🚀 Pre-Launch · Raising Funds</span>
          <h1 style={{color:"#fff",fontSize:"clamp(1.75rem,5vw,2.75rem)",fontWeight:900,letterSpacing:"-0.04em",margin:"0 0 0.5rem",lineHeight:1.05}}>OMNIX Protocol</h1>
          <p style={{color:"#475569",fontSize:"0.84rem",maxWidth:"26rem",lineHeight:1.6,margin:"0 0 0.875rem"}}>The world's first fully autonomous multi-layer DePIN on Solana.</p>
          <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",justifyContent:"center"}}>
            {[["Compute","#2dd4bf"],["Storage","#f59e0b"],["Bandwidth","#a78bfa"]].map(([l,c])=>(
              <span key={l} style={{fontSize:"0.69rem",padding:"0.22rem 0.75rem",borderRadius:"9999px",background:`${c}11`,color:c,border:`1px solid ${c}2e`,fontWeight:600}}>● {l}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.14)",borderRadius:"0.875rem",padding:"1rem",marginBottom:"1.25rem"}}>
        <div style={{display:"flex",gap:"0.75rem"}}>
          <div style={{width:"1.1rem",height:"1.1rem",color:"#f59e0b",flexShrink:0,marginTop:"0.15rem"}}><I.Alert/></div>
          <div>
            <p style={{color:"#e2e8f0",fontWeight:700,fontSize:"0.875rem",margin:"0 0 0.3rem"}}>Pre-Launch Status</p>
            <p style={{color:"#64748b",fontSize:"0.775rem",lineHeight:1.65,margin:0}}>OMNIX is in pre-launch. The AI agent runs 24/7 and smart contracts are written. We are raising funds to deploy on Solana mainnet. Node registration and the $OMX token go live after deployment.</p>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1.25rem"}}>
        {[
          {lbl:"Registered Nodes",val:stats?.totalNodes??0,         sub:"0 until mainnet",      col:"#2dd4bf",pre:true},
          {lbl:"$OMX Distributed",val:stats?.rewardsDistributed??0, sub:"0 until token launch", col:"#f59e0b",pre:true},
          {lbl:"Agent Status",    val:online?"Online ✓":"Offline",  sub:online?`Synced ${sync}`:"Check server",col:online?"#34d399":"#ef4444",pre:false},
          {lbl:"Current Epoch",   val:stats?.currentEpoch??"—",      sub:"Advances every 24h",   col:"#a78bfa",pre:false},
        ].map(s=>(
          <div key={s.lbl} style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"0.875rem",padding:"1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.4rem"}}>
              <span style={{color:"#1e293b",fontSize:"0.65rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.lbl}</span>
              {s.pre&&<span style={{fontSize:"0.57rem",padding:"0.12rem 0.4rem",borderRadius:"9999px",background:"rgba(245,158,11,0.07)",color:"#f59e0b",border:"1px solid rgba(245,158,11,0.14)",fontWeight:700}}>Pre-Launch</span>}
            </div>
            <p style={{color:s.col,fontFamily:"monospace",fontWeight:800,fontSize:"1.05rem",margin:"0 0 0.2rem"}}>{s.val}</p>
            <p style={{color:"#1a2744",fontSize:"0.6rem",margin:0}}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"1rem",padding:"1.25rem",marginBottom:"1.25rem"}}>
        <p style={{color:"#e2e8f0",fontWeight:700,fontSize:"0.875rem",margin:"0 0 0.875rem"}}>What's live right now</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
          {[
            {t:"AI Agent running 24/7 on DigitalOcean London",done:true},
            {t:"Smart contracts written in Anchor / Rust",    done:true},
            {t:"Web dashboard deployed & live",               done:true},
            {t:"GitHub repository open source",               done:true},
            {t:"Solana Foundation grant application submitted",done:true},
            {t:"Smart contract deployed to Solana mainnet",   done:false},
            {t:"$OMX SPL token created",                      done:false},
            {t:"Node registration open",                      done:false},
            {t:"$OMX listed on Raydium / Jupiter",            done:false},
            {t:"Solana Mobile node runner app",               done:false},
          ].map(x=>(
            <div key={x.t} style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
              <div style={{width:"0.95rem",height:"0.95rem",flexShrink:0,color:x.done?"#34d399":"#182440"}}>{x.done?<I.Check/>:<I.Clock/>}</div>
              <span style={{color:x.done?"#e2e8f0":"#1e293b",fontSize:"0.79rem"}}>{x.t}</span>
            </div>
          ))}
        </div>
      </div>

      {wallet.connected?(
        <div style={{background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.17)",borderRadius:"0.875rem",padding:"1rem",textAlign:"center"}}>
          <div style={{width:"1.4rem",height:"1.4rem",color:"#34d399",margin:"0 auto 0.5rem"}}><I.Check/></div>
          <p style={{color:"#34d399",fontWeight:700,fontSize:"0.9rem",margin:"0 0 0.25rem"}}>You're on the waitlist!</p>
          <p style={{color:"#1e293b",fontSize:"0.7rem",fontFamily:"monospace",margin:0,wordBreak:"break-all"}}>{wallet.address}</p>
        </div>
      ):(
        <button onClick={()=>setShowW(true)} style={{width:"100%",padding:"0.9rem",borderRadius:"0.875rem",cursor:"pointer",fontWeight:700,fontSize:"0.9rem",background:"rgba(45,212,191,0.07)",color:"#2dd4bf",border:"1px solid rgba(45,212,191,0.2)",transition:"all 0.15s ease"}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(45,212,191,0.14)";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(45,212,191,0.07)";}}>
          Connect Wallet — Join Waitlist
        </button>
      )}
    </div>
  );

  const Agent=()=>(
    <div>
      <div style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"1rem",padding:"1.25rem",marginBottom:"1.25rem"}}>
        <div style={{display:"flex",gap:"0.875rem",marginBottom:"1.25rem"}}>
          <img src={LOGO} alt="OMNIX" style={{width:"3.25rem",height:"3.25rem",borderRadius:"0.875rem",objectFit:"cover",flexShrink:0,border:"1px solid #182440"}}/>
          <div>
            <h2 style={{color:"#e2e8f0",fontWeight:800,fontSize:"1rem",margin:"0 0 0.3rem"}}>OMNIX Autonomous Agent</h2>
            <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
              <div style={{width:"0.45rem",height:"0.45rem",borderRadius:"9999px",background:online?"#34d399":"#334155",animation:online?"pulse 2s infinite":"none"}}/>
              <span style={{color:online?"#34d399":"#475569",fontSize:"0.72rem",fontWeight:600}}>{online?"Online · Running autonomously":"Connecting..."}</span>
            </div>
            <p style={{color:"#1e293b",fontSize:"0.67rem",margin:"0.2rem 0 0"}}>DigitalOcean London · Claude AI (Anthropic)</p>
            {sync&&<p style={{color:"#182440",fontSize:"0.6rem",margin:"0.1rem 0 0"}}>Last sync: {sync}</p>}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"1rem"}}>
          {[["Server","165.232.41.239","#2dd4bf"],["Location","London, UK","#a78bfa"],["Runtime","Node.js 18","#34d399"],["AI Model","Claude Sonnet","#f59e0b"]].map(([l,v,c])=>(
            <div key={l} style={{background:"#040910",border:"1px solid #182440",borderRadius:"0.75rem",padding:"0.75rem"}}>
              <p style={{color:"#1e293b",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 0.2rem"}}>{l}</p>
              <p style={{color:c,fontFamily:"monospace",fontSize:"0.79rem",fontWeight:700,margin:0}}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
          {[["Node Governance","Audits nodes, slashes fraud"],["Reward Rebalancing","Optimizes pool weights each epoch"],["Anti-Sybil Defense","ML detection removes fake clusters"],["Treasury Routing","10% fees → Bkggreen.sol"]].map(([n,d])=>(
            <div key={n} style={{background:"#040910",border:"1px solid #182440",borderRadius:"0.75rem",padding:"0.875rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.3rem"}}>
                <div style={{width:"0.35rem",height:"0.35rem",borderRadius:"9999px",background:"#2dd4bf",animation:"pulse 2s infinite"}}/>
                <p style={{color:"#e2e8f0",fontWeight:700,fontSize:"0.77rem",margin:0}}>{n}</p>
              </div>
              <p style={{color:"#334155",fontSize:"0.67rem",margin:0,lineHeight:1.5}}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"1rem",padding:"1.25rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.875rem"}}>
          <span style={{color:"#e2e8f0",fontWeight:700,fontSize:"0.875rem"}}>Agent Activity Log</span>
          <span style={{fontSize:"0.63rem",padding:"0.2rem 0.6rem",borderRadius:"9999px",background:online?"rgba(52,211,153,0.07)":"rgba(30,41,59,0.5)",color:online?"#34d399":"#334155",border:online?"1px solid rgba(52,211,153,0.17)":"1px solid #1e293b",fontWeight:700}}>
            {online?"● Live":"Offline"}
          </span>
        </div>
        {logs.length>0?(
          <div style={{maxHeight:"22rem",overflowY:"auto"}}>
            {logs.map(l=>(
              <div key={l.id} style={{display:"flex",gap:"0.625rem",padding:"0.6rem 0",borderBottom:"1px solid #0c1625"}}>
                <p style={{color:"#64748b",fontSize:"0.77rem",flex:1,lineHeight:1.55,margin:0}}>{l.msg||l.message||JSON.stringify(l)}</p>
                <span style={{color:"#182440",fontSize:"0.62rem",fontFamily:"monospace",whiteSpace:"nowrap"}}>{ft(l.ts)}</span>
              </div>
            ))}
          </div>
        ):(
          <div style={{padding:"2.5rem",textAlign:"center"}}>
            <p style={{color:"#1e293b",fontSize:"0.77rem",lineHeight:1.6,margin:0}}>{online?"Agent running — logs appear every 15 min as decisions are made.":"Cannot reach agent server. Run omnix-api.ts on your DigitalOcean droplet."}</p>
            <code style={{color:"#182440",fontSize:"0.63rem",display:"block",marginTop:"0.5rem"}}>pm2 start omnix-api.ts --interpreter tsx --name omnix-api</code>
          </div>
        )}
      </div>
    </div>
  );

  const Roadmap=()=>(
    <div style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"1rem",padding:"1.5rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.5rem"}}>
        <img src={LOGO} alt="OMNIX" style={{width:"2.5rem",height:"2.5rem",borderRadius:"0.625rem",objectFit:"cover",border:"1px solid #182440"}}/>
        <h2 style={{color:"#e2e8f0",fontWeight:900,fontSize:"1.05rem",letterSpacing:"-0.02em",margin:0}}>OMNIX Launch Roadmap</h2>
      </div>
      {[
        {ph:"Phase 1 — Foundation",    st:"complete",col:"#34d399",items:["AI agent deployed & running 24/7","Smart contracts written (Anchor/Rust)","Web dashboard live & deployed","GitHub open sourced","Grant applications submitted"]},
        {ph:"Phase 2 — Funding",       st:"active",  col:"#2dd4bf",items:["Solana Foundation grant (applied ✓)","Superteam grant application","Whitelist pre-sale to early operators","Smart contract security audit"]},
        {ph:"Phase 3 — Mainnet Launch",st:"upcoming",col:"#a78bfa",items:["Deploy contracts to Solana mainnet","Create $OMX SPL token","Open node registration (1,000 $OMX)","Initial liquidity on Raydium / Jupiter"]},
        {ph:"Phase 4 — Growth",        st:"upcoming",col:"#f59e0b",items:["Solana Mobile node runner app","500+ active node operators","Instagram autonomous posting live","CEX listing campaign"]},
      ].map((p,pi,arr)=>(
        <div key={p.ph} style={{position:"relative",paddingLeft:"2rem",paddingBottom:pi<arr.length-1?"2rem":"0"}}>
          {pi<arr.length-1&&<div style={{position:"absolute",left:"0.43rem",top:"1.2rem",bottom:0,width:"1px",background:"#182440"}}/>}
          <div style={{position:"absolute",left:0,top:"0.2rem",width:"0.875rem",height:"0.875rem",borderRadius:"9999px",display:"flex",alignItems:"center",justifyContent:"center",background:p.st==="upcoming"?"#070d1e":p.col,border:p.st==="upcoming"?"2px solid #182440":"none",boxShadow:p.st==="active"?`0 0 12px ${p.col}44`:"none"}}>
            {p.st==="complete"&&<div style={{width:"0.5rem",height:"0.5rem",color:"#fff"}}><I.Check/></div>}
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.6rem"}}>
              <h3 style={{color:p.st==="upcoming"?"#1e293b":"#e2e8f0",fontWeight:700,fontSize:"0.875rem",margin:0}}>{p.ph}</h3>
              {p.st==="active"&&<span style={{fontSize:"0.6rem",padding:"0.17rem 0.5rem",borderRadius:"9999px",background:`${p.col}11`,color:p.col,border:`1px solid ${p.col}2e`,fontWeight:700}}>In Progress</span>}
            </div>
            {p.items.map(it=>(
              <div key={it} style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.38rem"}}>
                <div style={{width:"0.3rem",height:"0.3rem",borderRadius:"9999px",flexShrink:0,background:p.st==="upcoming"?"#182440":p.col}}/>
                <span style={{fontSize:"0.77rem",color:p.st==="upcoming"?"#1e293b":"#64748b"}}>{it}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const Social=()=>(
    <div>
      <div style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"1rem",padding:"1.25rem",marginBottom:"1.25rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.25rem"}}>
          <div style={{width:"3.5rem",height:"3.5rem",borderRadius:"1rem",background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:"1.5rem",flexShrink:0}}>O</div>
          <div>
            <p style={{color:"#e2e8f0",fontWeight:800,fontSize:"1.05rem",margin:0}}>@omnixprotocol</p>
            <p style={{color:"#334155",fontSize:"0.75rem",margin:"0.2rem 0 0"}}>Instagram · AI-managed autonomous account</p>
          </div>
        </div>
        <a href="https://instagram.com/omnixprotocol" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0.875rem",borderRadius:"0.875rem",textDecoration:"none",background:"linear-gradient(135deg,rgba(240,148,51,0.09),rgba(188,24,136,0.09))",color:"#e2e8f0",fontWeight:700,fontSize:"0.875rem",border:"1px solid rgba(188,24,136,0.17)",marginBottom:"0.875rem"}}>
          <div style={{width:"1rem",height:"1rem"}}><I.Link/></div>
          Follow @omnixprotocol on Instagram
        </a>
        <div style={{background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.11)",borderRadius:"0.75rem",padding:"0.875rem"}}>
          <p style={{color:"#92400e",fontSize:"0.72rem",lineHeight:1.6,margin:0}}>📸 Live Instagram feed requires Basic Display API credentials. AI agent is built and ready — connecting the feed once credentials are configured.</p>
        </div>
      </div>
      <div style={{background:"#070d1e",border:"1px solid #182440",borderRadius:"1rem",padding:"1.25rem"}}>
        <p style={{color:"#e2e8f0",fontWeight:700,fontSize:"0.875rem",margin:"0 0 0.875rem"}}>Community & Links</p>
        {[
          {lbl:"Instagram",sub:"@omnixprotocol",       url:"https://instagram.com/omnixprotocol",     icon:"📸"},
          {lbl:"GitHub",   sub:"Bkggreen/omnix-depin", url:"https://github.com/Bkggreen/omnix-depin", icon:"💻"},
          {lbl:"Website",  sub:"omnix-depin.vercel.app",url:"https://omnix-depin.vercel.app",          icon:"🌐"},
        ].map(l=>(
          <a key={l.lbl} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.875rem",borderRadius:"0.75rem",textDecoration:"none",border:"1px solid #182440",marginBottom:"0.5rem",transition:"all 0.15s ease"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#2d3748";(e.currentTarget as HTMLElement).style.background="#0c1628";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#182440";(e.currentTarget as HTMLElement).style.background="transparent";}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
              <span style={{fontSize:"1.25rem"}}>{l.icon}</span>
              <div>
                <p style={{color:"#e2e8f0",fontWeight:600,fontSize:"0.875rem",margin:0}}>{l.lbl}</p>
                <p style={{color:"#1e293b",fontSize:"0.7rem",margin:"0.1rem 0 0"}}>{l.sub}</p>
              </div>
            </div>
            <div style={{width:"0.875rem",height:"0.875rem",color:"#1e293b"}}><I.Link/></div>
          </a>
        ))}
      </div>
    </div>
  );

  const panels:Record<string,JSX.Element>={
    overview:<Overview/>,
    node:<NodeRunner wallet={wallet} onOpen={()=>setShowW(true)}/>,
    agent:<Agent/>,
    roadmap:<Roadmap/>,
    social:<Social/>,
  };

  return(
    <div style={{minHeight:"100vh",background:"#04091c",color:"#e2e8f0",fontFamily:"system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:3px;height:3px;}::-webkit-scrollbar-track{background:#04091c;}::-webkit-scrollbar-thumb{background:#182440;border-radius:2px;}a,button{font-family:inherit;}`}</style>

      {showW&&<WalletModal onClose={()=>setShowW(false)} onConnect={connect}/>}
      {showM&&<div style={{position:"fixed",inset:0,zIndex:40}} onClick={()=>setShowM(false)}/>}

      {/* HEADER */}
      <div style={{borderBottom:"1px solid #0c1625",background:"rgba(4,9,28,0.97)",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:30}}>
        <div style={{maxWidth:"48rem",margin:"0 auto",padding:"0 1rem"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.75rem 0 0.625rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.625rem"}}>
              <img src={LOGO} alt="OMNIX" style={{width:"2.25rem",height:"2.25rem",borderRadius:"0.6rem",objectFit:"cover",border:"1px solid #182440"}}/>
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                <span style={{color:"#fff",fontWeight:900,fontSize:"1rem",letterSpacing:"-0.03em"}}>OMNIX</span>
                <span style={{color:"#1e293b",fontSize:"0.8rem"}}>Protocol</span>
                <span style={{fontSize:"0.58rem",padding:"0.16rem 0.5rem",borderRadius:"9999px",background:"rgba(245,158,11,0.07)",color:"#f59e0b",border:"1px solid rgba(245,158,11,0.17)",fontWeight:700}}>Pre-Launch</span>
              </div>
            </div>

            <div style={{position:"relative"}}>
              {wallet.connected?(
                <>
                  <button onClick={()=>setShowM(v=>!v)} style={{display:"flex",alignItems:"center",gap:"0.45rem",padding:"0.48rem 0.875rem",borderRadius:"0.75rem",cursor:"pointer",background:"rgba(45,212,191,0.07)",color:"#2dd4bf",border:"1px solid rgba(45,212,191,0.19)",fontWeight:700,fontSize:"0.72rem"}}>
                    <div style={{width:"0.42rem",height:"0.42rem",borderRadius:"9999px",background:"#2dd4bf"}}/>
                    {sh(wallet.address)}
                  </button>
                  {showM&&(
                    <div style={{position:"absolute",right:0,top:"2.75rem",background:"#070d1e",border:"1px solid #182440",borderRadius:"0.875rem",padding:"0.5rem",width:"13.5rem",zIndex:50,boxShadow:"0 16px 48px rgba(0,0,0,0.6)"}}>
                      <div style={{padding:"0.625rem 0.75rem",borderBottom:"1px solid #0c1625",marginBottom:"0.375rem"}}>
                        <p style={{color:"#1e293b",fontSize:"0.62rem",margin:"0 0 0.2rem"}}>{wallet.name}</p>
                        <p style={{color:"#f59e0b",fontFamily:"monospace",fontWeight:700,fontSize:"0.875rem",margin:0}}>{wallet.balance.toFixed(4)} SOL</p>
                        <p style={{color:"#34d399",fontSize:"0.6rem",margin:"0.2rem 0 0"}}>✓ Waitlisted</p>
                      </div>
                      {[{lbl:cp?"Copied!":"Copy Address",ic:<I.Copy/>,fn:copy,col:"#94a3b8"},{lbl:"Disconnect",ic:<I.Out/>,fn:disc,col:"#ef4444"}].map(b=>(
                        <button key={b.lbl} onClick={b.fn} style={{width:"100%",display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.5rem 0.75rem",borderRadius:"0.5rem",cursor:"pointer",background:"transparent",border:"none",color:b.col,fontSize:"0.79rem",transition:"background 0.15s"}}
                          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#0c1628";}}
                          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";}}>
                          <div style={{width:"0.875rem",height:"0.875rem"}}>{b.ic}</div>{b.lbl}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ):(
                <button onClick={()=>setShowW(true)} style={{padding:"0.48rem 0.875rem",borderRadius:"0.75rem",cursor:"pointer",background:"rgba(45,212,191,0.07)",color:"#2dd4bf",border:"1px solid rgba(45,212,191,0.19)",fontWeight:700,fontSize:"0.72rem",transition:"all 0.15s ease"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(45,212,191,0.14)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(45,212,191,0.07)";}}>
                  Join Waitlist
                </button>
              )}
            </div>
          </div>

          <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
            {TABS.map(t=>{
              const active=tab===t.id;
              return(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:"0.35rem",padding:"0.6rem 0.875rem",cursor:"pointer",background:"transparent",border:"none",borderBottom:`2px solid ${active?"#2dd4bf":"transparent"}`,color:active?"#2dd4bf":"#1e293b",fontSize:"0.77rem",fontWeight:active?700:500,whiteSpace:"nowrap",transition:"all 0.15s ease"}}
                  onMouseEnter={e=>{if(!active)(e.currentTarget as HTMLElement).style.color="#475569";}}
                  onMouseLeave={e=>{if(!active)(e.currentTarget as HTMLElement).style.color="#1e293b";}}>
                  <div style={{width:"0.78rem",height:"0.78rem"}}><t.Ic/></div>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:"48rem",margin:"0 auto",padding:"1.5rem 1rem 4rem"}}>
        {panels[tab]}
      </div>

      {/* FOOTER */}
      <div style={{borderTop:"1px solid #0c1625",padding:"1rem"}}>
        <div style={{maxWidth:"48rem",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <img src={LOGO} alt="" style={{width:"1.2rem",height:"1.2rem",borderRadius:"0.3rem",objectFit:"cover",opacity:0.35}}/>
            <span style={{color:"#182440",fontSize:"0.67rem"}}>OMNIX Protocol · Built on Solana · Open Source</span>
          </div>
          <a href="https://github.com/Bkggreen/omnix-depin" target="_blank" rel="noopener noreferrer" style={{color:"#182440",fontSize:"0.67rem",transition:"color 0.15s"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#334155";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#182440";}}>
            GitHub →
          </a>
        </div>
      </div>
      <Analytics />
    </div>
  );
}
