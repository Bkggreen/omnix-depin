import { useState, useEffect, useRef } from "react";
import {
  Activity, Cpu, Database, Globe, Zap, Shield, DollarSign,
  Radio, Bot, Play, Square, Wifi, BarChart3, Users, TrendingUp,
  RefreshCw, CheckCircle2, AlertTriangle, Star
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const TABS = [
  { id: "overview",  label: "Overview",  Icon: Globe },
  { id: "node",      label: "My Node",   Icon: Cpu },
  { id: "agent",     label: "AI Agent",  Icon: Bot },
  { id: "earnings",  label: "Earnings",  Icon: DollarSign },
  { id: "social",    label: "Social",    Icon: Radio },
];

const LOG_POOL = [
  { type: "slash",   icon: "⚡", msg: "Node #3341 slashed — repeated coverage fraud (−500 $OMX stake burned)" },
  { type: "social",  icon: "📣", msg: "Posted to @OmnixProtocol: 'Epoch 847 rewards up 23%' — 12.4K impressions" },
  { type: "pool",    icon: "⚖️", msg: "Reward pool rebalanced: compute +8%, storage −3%, bandwidth −5%" },
  { type: "recruit", icon: "🤝", msg: "Recruited 17 new node operators via X DM targeting campaign" },
  { type: "reward",  icon: "💰", msg: "Distributed 52,410 $OMX to 1,024 active operators — epoch 847 complete" },
  { type: "social",  icon: "📸", msg: "Instagram post: ecosystem infographic — 6.1K reach, 847 saves, 234 shares" },
  { type: "action",  icon: "🌐", msg: "New region activated: Sub-Saharan Africa — 31 nodes onboarded successfully" },
  { type: "action",  icon: "🤖", msg: "AI batch: 1,847 inference tasks completed — 14.3 $OMX distributed to nodes" },
  { type: "pool",    icon: "🔄", msg: "Auto-compounded rewards for 2,847 stakers — $103,441 total compounded" },
  { type: "action",  icon: "🔍", msg: "Audit complete: 847 nodes checked — 3 flagged, 1 slashed, 2 on probation" },
  { type: "social",  icon: "📈", msg: "Trending #DePIN on X — boosted 14 posts, gained 2,340 new followers today" },
  { type: "action",  icon: "💎", msg: "Epoch 848 started — reward multiplier 1.31x, base rate 0.04 $OMX/hr/node" },
  { type: "recruit", icon: "🛡️", msg: "Deployed anti-Sybil v2.4 — 23 fake node clusters detected and removed" },
  { type: "action",  icon: "🔧", msg: "Bandwidth routes optimized: SEA cluster latency reduced by 18ms average" },
  { type: "reward",  icon: "✨", msg: "Top performer bonus: Node #247 awarded 120 $OMX for 100% uptime streak" },
];

const EARNINGS_DATA = [
  { day: "Mon", coverage: 8.2,  compute: 11.4, bandwidth: 4.1, tasks: 2.8 },
  { day: "Tue", coverage: 9.1,  compute: 13.2, bandwidth: 3.8, tasks: 3.1 },
  { day: "Wed", coverage: 7.8,  compute: 10.9, bandwidth: 4.5, tasks: 2.5 },
  { day: "Thu", coverage: 10.4, compute: 14.8, bandwidth: 5.2, tasks: 3.7 },
  { day: "Fri", coverage: 11.2, compute: 15.1, bandwidth: 4.9, tasks: 4.2 },
  { day: "Sat", coverage: 9.8,  compute: 12.7, bandwidth: 4.3, tasks: 3.9 },
  { day: "Sun", coverage: 8.9,  compute: 11.3, bandwidth: 3.7, tasks: 3.1 },
];

const PIE_DATA = [
  { name: "Compute",   value: 40, color: "#a78bfa" },
  { name: "Coverage",  value: 35, color: "#2dd4bf" },
  { name: "Bandwidth", value: 15, color: "#f59e0b" },
  { name: "AI Tasks",  value: 10, color: "#34d399" },
];

const LOG_COLOR = {
  slash: "text-red-400", social: "text-sky-400", pool: "text-purple-400",
  recruit: "text-green-400", reward: "text-amber-400", action: "text-teal-400",
};

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className={`font-mono text-lg font-bold ${color}`}>{value}</p>
      {sub && <p className="text-slate-600 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

function Meter({ label, value, color, trackColor }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className={`text-sm font-mono font-medium ${color}`}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${trackColor}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Badge({ children, color }) {
  const map = {
    teal: "bg-teal-400/10 text-teal-400 border-teal-400/20",
    amber: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    purple: "bg-purple-400/10 text-purple-400 border-purple-400/20",
    green: "bg-green-400/10 text-green-400 border-green-400/20",
    sky: "bg-sky-400/10 text-sky-400 border-sky-400/20",
    pink: "bg-pink-400/10 text-pink-400 border-pink-400/20",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${map[color]}`}>{children}</span>
  );
}

export default function OmnixProtocol() {
  const [tab, setTab] = useState("overview");
  const [nodeOn, setNodeOn] = useState(false);
  const [logs, setLogs] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [stats, setStats] = useState({ nodes: 14293, tasks: 9821043, uptime: 99.97, mcap: 84.2 });
  const [nodeStats, setNodeStats] = useState({ storage: 0, compute: 0, bandwidth: 0, health: 0, earn24h: 0, rank: 247 });
  const [earnings, setEarnings] = useState({ total: 2841.52, pending: 14.37, today: 0, week: 203.40 });

  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const logIdxRef = useRef(0);

  // Animated particle network canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = w; canvas.height = h;

    const COLORS = ["#2dd4bf", "#f59e0b", "#a78bfa"];
    const pts = Array.from({ length: 75 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
      c: COLORS[Math.floor(Math.random() * 3)],
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.fillStyle = "rgba(2,6,23,0.18)";
      ctx.fillRect(0, 0, w, h);
      pts.forEach((a, i) => {
        for (let j = i + 1; j < Math.min(i + 7, pts.length); j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(45,212,191,${0.13 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
        const p = Math.sin(a.phase + frame * 0.018) * 0.5 + 0.5;
        ctx.globalAlpha = 0.65 + p * 0.35;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r * (1 + p * 0.25), 0, Math.PI * 2);
        ctx.fillStyle = a.c; ctx.fill(); ctx.globalAlpha = 1;
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Live stat updates
  useEffect(() => {
    const iv = setInterval(() => {
      setStats(s => ({
        ...s,
        nodes: s.nodes + (Math.random() > 0.6 ? 1 : 0),
        tasks: s.tasks + Math.floor(Math.random() * 80 + 30),
        mcap: +(s.mcap + (Math.random() - 0.35) * 0.08).toFixed(2),
      }));
      if (nodeOn) {
        setNodeStats(s => ({
          storage:  Math.min(100, Math.max(60, +(s.storage  + (Math.random() - 0.4) * 1.8).toFixed(1))),
          compute:  Math.min(100, Math.max(45, +(s.compute  + (Math.random() - 0.4) * 2.5).toFixed(1))),
          bandwidth:Math.min(100, Math.max(70, +(s.bandwidth + (Math.random() - 0.4) * 1.2).toFixed(1))),
          health:   Math.min(100, Math.max(96, +(s.health   + (Math.random() - 0.4) * 0.4).toFixed(1))),
          earn24h:  +(s.earn24h + 0.038 + Math.random() * 0.018).toFixed(3),
          rank:     Math.max(100, s.rank + (Math.random() > 0.7 ? -1 : 0)),
        }));
        setEarnings(e => ({
          ...e,
          pending: +(e.pending + 0.007 + Math.random() * 0.004).toFixed(3),
          today:   +(e.today + 0.038 + Math.random() * 0.018).toFixed(3),
        }));
      }
    }, 1600);
    return () => clearInterval(iv);
  }, [nodeOn]);

  useEffect(() => {
    if (nodeOn) setNodeStats({ storage: 78.4, compute: 62.1, bandwidth: 91.7, health: 98.4, earn24h: 31.7, rank: 247 });
    else setNodeStats(s => ({ ...s, storage: 0, compute: 0, bandwidth: 0, health: 0, earn24h: 0 }));
  }, [nodeOn]);

  // AI agent live logs
  useEffect(() => {
    const init = LOG_POOL.slice(0, 5).map((l, i) => ({
      ...l, id: i, ts: new Date(Date.now() - (4 - i) * 200000)
    }));
    setLogs(init); logIdxRef.current = 5;
    const iv = setInterval(() => {
      setLogs(prev => [{
        ...LOG_POOL[logIdxRef.current % LOG_POOL.length],
        id: Date.now(), ts: new Date(),
      }, ...prev.slice(0, 29)]);
      logIdxRef.current++;
    }, 5500);
    return () => clearInterval(iv);
  }, []);

  const fmtNum = n => n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n);
  const fmtT = d => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // ─── OVERVIEW ───────────────────────────────────────────────────────────────
  const OverviewTab = () => (
    <div>
      <div className="relative rounded-xl overflow-hidden mb-5 border border-slate-800" style={{ height: 260 }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "#020617" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-teal-400 text-xs tracking-widest uppercase mb-2 font-medium">Multi-Layer DePIN · Solana Mainnet</p>
          <h1 className="text-white text-4xl font-bold tracking-tight mb-1.5">OMNIX Protocol</h1>
          <p className="text-slate-400 text-sm max-w-md">The world's first fully autonomous multi-layer DePIN network. No human input. Ever.</p>
          <div className="flex gap-2.5 mt-5">
            {[["Compute","teal"],["Storage","amber"],["Bandwidth","purple"]].map(([l,c]) => (
              <div key={l} className={`flex items-center gap-1.5 text-xs border rounded-full px-3 py-1 bg-${c}-400/10 text-${c}-400 border-${c}-400/20`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-${c}-400 animate-pulse`} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-4">
        <StatCard label="Active Nodes"     value={fmtNum(stats.nodes)} sub="+2 in last hour"    color="text-teal-400" />
        <StatCard label="Tasks Completed"  value={fmtNum(stats.tasks)} sub="all-time total"      color="text-purple-400" />
        <StatCard label="Network Uptime"   value={stats.uptime.toFixed(2) + "%"} sub="last 30 days" color="text-green-400" />
        <StatCard label="$OMX Market Cap"  value={"$" + stats.mcap + "M"} sub="live estimate"   color="text-amber-400" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-sm font-semibold">AI Agent — Live Activity Feed</span>
          </div>
          <span className="text-slate-600 text-xs font-mono">{fmtNum(stats.tasks)} decisions made</span>
        </div>
        <div className="space-y-0 max-h-52 overflow-y-auto">
          {logs.slice(0, 7).map(l => (
            <div key={l.id} className="flex items-start gap-2.5 py-2.5 border-b border-slate-800 last:border-0">
              <span className="text-sm leading-none mt-0.5 flex-shrink-0">{l.icon}</span>
              <p className={`text-sm flex-1 ${LOG_COLOR[l.type] || "text-slate-300"}`}>{l.msg}</p>
              <span className="text-slate-600 text-xs font-mono whitespace-nowrap flex-shrink-0">{fmtT(l.ts)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Storage Layer", desc: "IPFS-compatible distributed storage across 14K+ nodes globally", icon: Database, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
          { label: "Compute Layer", desc: "GPU/CPU inference, ML tasks, rendering distributed to node operators", icon: Cpu, color: "text-teal-400", bg: "bg-teal-400/10", border: "border-teal-400/20" },
          { label: "Bandwidth Layer", desc: "P2P relay, VPN mesh, CDN acceleration through operator network", icon: Wifi, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
        ].map(c => (
          <div key={c.label} className={`rounded-xl p-4 border ${c.bg} ${c.border}`}>
            <c.icon className={`w-5 h-5 ${c.color} mb-2`} />
            <p className={`font-semibold text-sm ${c.color} mb-1`}>{c.label}</p>
            <p className="text-slate-400 text-xs leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── MY NODE ─────────────────────────────────────────────────────────────────
  const NodeTab = () => (
    <div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold text-lg">Node Runner</h2>
            <p className="text-slate-500 text-sm">Node #{fmtNum(stats.nodes)} · Solana Mainnet</p>
          </div>
          <button
            onClick={() => setNodeOn(v => !v)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
              nodeOn
                ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                : "bg-teal-400/20 text-teal-400 border-teal-400/30 hover:bg-teal-400/30"
            }`}
          >
            {nodeOn ? <><Square className="w-4 h-4" /> Stop Node</> : <><Play className="w-4 h-4" /> Start Node</>}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { label: "24h Earnings", value: nodeOn ? `${nodeStats.earn24h.toFixed(3)} $OMX` : "—", color: "text-amber-400" },
            { label: "Global Rank",  value: nodeOn ? `#${nodeStats.rank}` : "—", color: "text-purple-400" },
            { label: "Health Score", value: nodeOn ? `${nodeStats.health.toFixed(1)}%` : "—", color: "text-green-400" },
          ].map(s => (
            <div key={s.label} className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-slate-500 text-xs mb-1">{s.label}</p>
              <p className={`font-mono font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className={`transition-opacity duration-500 ${nodeOn ? "opacity-100" : "opacity-25 pointer-events-none"}`}>
          <Meter label="Storage Contribution"   value={nodeStats.storage}   color="text-amber-400"  trackColor="bg-amber-400" />
          <Meter label="Compute Contribution"   value={nodeStats.compute}   color="text-teal-400"   trackColor="bg-teal-400" />
          <Meter label="Bandwidth Contribution" value={nodeStats.bandwidth} color="text-purple-400" trackColor="bg-purple-400" />
        </div>

        {!nodeOn && (
          <div className="mt-3 border border-slate-700/40 bg-slate-800/30 rounded-lg p-3 text-center">
            <p className="text-slate-500 text-sm">Start your node to begin earning $OMX across all three layers</p>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
        <h3 className="text-white font-semibold mb-4 text-sm">Reward Mechanisms Active</h3>
        <div className="space-y-2">
          {[
            { label: "Proof-of-Coverage", desc: "Uptime + location attestation verified every 15 min", rate: "0.012 $OMX/hr", ok: true },
            { label: "Proof-of-Compute", desc: "CPU/GPU tasks completed and verified on-chain", rate: "0.016 $OMX/task", ok: nodeOn },
            { label: "Bandwidth Relay", desc: "Traffic routed through your node, verified by peers", rate: "0.008 $OMX/GB", ok: nodeOn },
            { label: "AI Task Bounties", desc: "Inference, embeddings, image tasks from clients", rate: "0.04 $OMX/task", ok: nodeOn },
            { label: "Node Running Bonus", desc: "Simply running the node earns a base epoch reward", rate: "0.004 $OMX/hr", ok: true },
          ].map(r => (
            <div key={r.label} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${r.ok && nodeOn ? "border-teal-400/20 bg-teal-400/5" : "border-slate-800 bg-slate-800/20"}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${r.ok && nodeOn ? "bg-green-400 animate-pulse" : "bg-slate-600"}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${r.ok && nodeOn ? "text-white" : "text-slate-600"}`}>{r.label}</p>
                <p className="text-slate-600 text-xs">{r.desc}</p>
              </div>
              <span className={`text-xs font-mono ${r.ok && nodeOn ? "text-amber-400" : "text-slate-700"}`}>{r.rate}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-3 text-sm">Solana Mobile Integration</h3>
        <div className="flex items-start gap-3 p-3 bg-purple-400/5 border border-purple-400/20 rounded-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-400/20 flex items-center justify-center flex-shrink-0">
            <Radio className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Run on Solana Saga / Chapter 2</p>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">Your node runs natively on Solana Mobile hardware. Earn passive $OMX 24/7 with zero configuration — the dApp handles everything via the Seed Vault keypair.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── AI AGENT ────────────────────────────────────────────────────────────────
  const AgentTab = () => (
    <div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400/30 to-purple-500/30 border border-teal-400/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h2 className="text-white font-bold">OMNIX Autonomous Agent</h2>
            <p className="text-green-400 text-xs flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Active · Fully Self-Directing · Zero Human Input Required
            </p>
            <p className="text-slate-500 text-xs mt-1">Powered by Claude Sonnet on Anthropic API + custom Solana tooling</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 mb-5">
          {[
            { label: "Actions/Day",   value: "8,471", color: "text-teal-400" },
            { label: "Decisions/Hr",  value: "847",   color: "text-purple-400" },
            { label: "Accuracy",      value: "99.7%", color: "text-green-400" },
            { label: "Avg Latency",   value: "1.2s",  color: "text-amber-400" },
          ].map(s => (
            <div key={s.label} className="bg-slate-800 rounded-lg p-3 text-center">
              <p className="text-slate-500 text-xs">{s.label}</p>
              <p className={`font-mono font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { label: "Network Governance",   desc: "Monitors all nodes, auto-slashes cheaters, maintains integrity" },
            { label: "Social Media Growth",  desc: "Posts to X & Instagram, runs campaigns, grows the community" },
            { label: "Operator Recruitment", desc: "Finds & DMs targets on X, auto-onboards via referral flows" },
            { label: "Reward Optimization",  desc: "Rebalances pools by epoch, auto-compounds staker yields" },
            { label: "Anti-Sybil Defense",   desc: "ML cluster detection, removes fake nodes, burns slashed stake" },
            { label: "Market Intelligence",  desc: "Monitors DePIN ecosystem, adjusts tokenomics autonomously" },
            { label: "Content Generation",   desc: "Creates infographics, threads, data reports automatically" },
            { label: "Treasury Management",  desc: "Routes protocol fees, manages buyback & burn mechanics" },
          ].map(c => (
            <div key={c.label} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">{c.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold text-sm">Live Decision Log</span>
          <Badge color="green">Auto-updating every 5s</Badge>
        </div>
        <div className="max-h-80 overflow-y-auto space-y-0">
          {logs.map(l => (
            <div key={l.id} className="flex items-start gap-2.5 py-2.5 border-b border-slate-800 last:border-0">
              <span className="text-sm leading-none mt-0.5 flex-shrink-0">{l.icon}</span>
              <p className={`text-sm flex-1 ${LOG_COLOR[l.type] || "text-slate-300"}`}>{l.msg}</p>
              <span className="text-slate-600 text-xs font-mono whitespace-nowrap flex-shrink-0">{fmtT(l.ts)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── EARNINGS ────────────────────────────────────────────────────────────────
  const EarningsTab = () => (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
        <StatCard label="Total Earned (USD)"  value={"$" + earnings.total.toFixed(2)}          color="text-amber-400" />
        <StatCard label="Pending Rewards"     value={earnings.pending.toFixed(3) + " $OMX"}    color="text-teal-400" />
        <StatCard label="Earned Today"        value={earnings.today.toFixed(3) + " $OMX"}      color="text-purple-400" />
        <StatCard label="This Week"           value={earnings.week.toFixed(2) + " $OMX"}       color="text-green-400" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
        <h3 className="text-white font-semibold text-sm mb-4">7-Day Earnings Breakdown</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={EARNINGS_DATA} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} />
            <Bar dataKey="coverage"  stackId="a" fill="#2dd4bf" />
            <Bar dataKey="compute"   stackId="a" fill="#a78bfa" />
            <Bar dataKey="bandwidth" stackId="a" fill="#f59e0b" />
            <Bar dataKey="tasks"     stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-3">
          {PIE_DATA.map(d => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              {d.name} ({d.value}%)
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-3">Reward Source Split</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((d, i) => <Cell key={i} fill={d.color} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Claim & Stake</h3>
            <div className="space-y-2 mb-4">
              {[
                { label: "Claimable Now", value: `${earnings.pending.toFixed(3)} $OMX`, color: "text-teal-400" },
                { label: "Est. Weekly Yield", value: `${earnings.week.toFixed(2)} $OMX`, color: "text-purple-400" },
                { label: "APY (staked)", value: "47.3%", color: "text-green-400" },
                { label: "Epoch", value: "#847", color: "text-amber-400" },
              ].map(s => (
                <div key={s.label} className="flex justify-between">
                  <span className="text-slate-500 text-sm">{s.label}</span>
                  <span className={`font-mono text-sm font-medium ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full py-2.5 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 hover:bg-amber-400/30 transition-all text-sm font-semibold">
              Claim {earnings.pending.toFixed(3)} $OMX
            </button>
            <button className="w-full py-2.5 rounded-xl bg-purple-400/10 text-purple-400 border border-purple-400/20 hover:bg-purple-400/20 transition-all text-sm font-medium">
              Auto-Compound (47.3% APY)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── SOCIAL ──────────────────────────────────────────────────────────────────
  const SocialTab = () => (
    <div>
      <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 mb-4 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-amber-400 text-xs">Accounts must be created manually once — after that, the AI agent manages everything autonomously: posting, engagement, DMs, growth, and analytics.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        {[
          {
            platform: "X (Twitter)", handle: "@OmnixProtocol", color: "sky",
            stats: [{ l: "Followers", v: "47.2K" }, { l: "Posts Today", v: "12" }, { l: "Engagement", v: "4.8%" }, { l: "DMs Sent", v: "847" }],
            post: "Epoch 847 is live 🚀 Node operators earned a combined 52,410 $OMX this epoch. Rewards up 23% — and we're just getting started.",
            time: "8 min ago", reach: "12.4K impressions",
          },
          {
            platform: "Instagram", handle: "@omnixprotocol", color: "pink",
            stats: [{ l: "Followers", v: "23.8K" }, { l: "Posts/Week", v: "7" }, { l: "Avg Reach", v: "6.1K" }, { l: "Story Views", v: "4.2K" }],
            post: "Our node network now spans 47 countries 🌍 The future of decentralized infrastructure is here — and you can be part of it.",
            time: "2 hrs ago", reach: "6.1K reach",
          },
        ].map(p => (
          <div key={p.platform} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className={`font-bold text-${p.color}-400`}>{p.platform}</p>
                <p className="text-slate-500 text-xs">{p.handle}</p>
              </div>
              <Badge color={p.color}>AI Managed</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {p.stats.map(s => (
                <div key={s.l} className="bg-slate-800/50 rounded-lg p-2.5">
                  <p className="text-slate-500 text-xs">{s.l}</p>
                  <p className={`font-mono font-bold text-sm text-${p.color}-400`}>{s.v}</p>
                </div>
              ))}
            </div>
            <div className={`p-3 rounded-lg bg-${p.color}-400/5 border border-${p.color}-400/20`}>
              <p className="text-slate-300 text-xs leading-relaxed">{p.post}</p>
              <div className="flex justify-between mt-2">
                <span className="text-slate-600 text-xs">{p.time}</span>
                <span className={`text-xs text-${p.color}-400`}>{p.reach}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-3 text-sm">Autonomous Social Capabilities</h3>
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
          {[
            "Posts epoch updates, reward stats, and network milestones",
            "Engages with DePIN & Solana ecosystem accounts daily",
            "Runs automated follower growth campaigns 24/7",
            "DMs potential node operators with personalized pitches",
            "Generates infographics and data visualization content",
            "Responds to community questions and comments",
            "A/B tests post formats for maximum engagement lift",
            "Schedules posts across time zones for peak global reach",
            "Tracks competitor growth and adapts content strategy",
            "Auto-reposts top-performing content in new formats",
          ].map(c => (
            <div key={c} className="flex items-center gap-2.5 py-2 border-b border-slate-800 last:border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              <p className="text-slate-400 text-sm">{c}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PANELS = { overview: <OverviewTab />, node: <NodeTab />, agent: <AgentTab />, earnings: <EarningsTab />, social: <SocialTab /> };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-400/20 border border-teal-400/30 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <span className="text-white font-bold tracking-wide">OMNIX</span>
            <span className="text-slate-600 text-sm">Protocol</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-green-400/10 border border-green-400/20 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Mainnet Live</span>
            </div>
            <button
              onClick={() => setWalletConnected(v => !v)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                walletConnected
                  ? "bg-teal-400/20 text-teal-400 border-teal-400/30"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
              }`}
            >
              {walletConnected ? "◉ Connected" : "Connect Wallet"}
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                tab === t.id ? "border-teal-400 text-teal-400" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <t.Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">{PANELS[tab]}</div>

      <div className="border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-slate-700 text-xs">OMNIX Protocol v1.0.0 · Built on Solana · AI-Powered</span>
          <span className="text-slate-700 text-xs font-mono">$OMX · Ticker live on Raydium + Jupiter</span>
        </div>
      </div>
    </div>
  );
}
