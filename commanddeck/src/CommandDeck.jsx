import { useEffect, useState } from "react";
import {
  Landmark, Users2, UserCog, CalendarClock, Award, Fingerprint,
  Orbit, ShieldAlert, Calculator, Wallet, UtensilsCrossed, Globe2,
  Search, ChevronDown,
} from "lucide-react";

const MODULES = [
  { key: "school", label: "School", icon: Landmark, statKey: "schools", unit: "campus", path: "/Modules.php?modname=School_Setup/Schools.php", color: "#4CE0D2" },
  { key: "students", label: "Students", icon: Users2, statKey: "students", unit: "enrolled", path: "/Modules.php?modname=Students/Student.php", color: "#4CE0D2" },
  { key: "users", label: "Users", icon: UserCog, statKey: "staff", unit: "accounts", path: "/Modules.php?modname=Users/User.php", color: "#7C5CFC" },
  { key: "scheduling", label: "Scheduling", icon: CalendarClock, statKey: "courses", unit: "courses", path: "/Modules.php?modname=Scheduling/Schedule.php", color: "#7C5CFC" },
  { key: "grades", label: "Grades", icon: Award, statKey: "grades", unit: "records", path: "/Modules.php?modname=Grades/Grades.php", color: "#FFB454" },
  { key: "attendance", label: "Attendance", icon: Fingerprint, statKey: "attendance", unit: "% today", path: "/Modules.php?modname=Attendance/TakeAttendance.php", color: "#4CE0D2" },
  { key: "activities", label: "Activities", icon: Orbit, statKey: "activities", unit: "active", path: "/Modules.php?modname=Eligibility/Activities.php", color: "#7C5CFC" },
  { key: "discipline", label: "Discipline", icon: ShieldAlert, statKey: "discipline", unit: "open cases", path: "/Modules.php?modname=Discipline/Referrals.php", color: "#FF6B6B" },
  { key: "accounting", label: "Accounting", icon: Calculator, statKey: "accounting", unit: "ledgers", path: "/Modules.php?modname=Accounting/Incomes.php", color: "#4CE0D2" },
  { key: "billing", label: "Student Billing", icon: Wallet, statKey: "billing", unit: "invoices", path: "/Modules.php?modname=Student_Billing/StudentFees.php", color: "#FFB454" },
  { key: "food", label: "Food Service", icon: UtensilsCrossed, statKey: "food", unit: "program", path: "/Modules.php?modname=Food_Service/Menus.php", color: "#7C5CFC" },
  { key: "resources", label: "Resources", icon: Globe2, statKey: "resources", unit: "assets", path: "/Modules.php?modname=Resources/Resources.php", color: "#4CE0D2" },
];

function Counter({ to }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const dur = 700;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n}</span>;
}

function DockingPort({ mod, index, stat }) {
  const Icon = mod.icon;
  return (
    <a
      className="dock group"
      href={mod.path}
      style={{ "--c": mod.color, animationDelay: `${index * 60}ms` }}
    >
      <div className="dock-ring" />
      <div className="dock-core">
        <Icon size={26} strokeWidth={1.5} color={mod.color} />
      </div>
      <div className="dock-pulse" />
      <div className="dock-body">
        <div className="dock-label">{mod.label}</div>
        <div className="dock-readout">
          <Counter to={stat} /> <span className="unit">{mod.unit}</span>
        </div>
      </div>
    </a>
  );
}

export default function CommandDeck() {
  const [stats, setStats] = useState({});
  useEffect(() => {
    fetch("/commanddeck-stats.php", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const title = stats.title || "KerrFairtex Student Information System";

  return (
    <div className="deck">
      <style>{`
        .deck {
          min-height: 100vh;
          background: radial-gradient(ellipse at 50% -10%, #101830 0%, #05070D 55%, #030408 100%);
          color: #E8ECF7;
          font-family: Inter, system-ui, sans-serif;
          padding: 28px 20px 60px;
          position: relative;
          overflow: hidden;
        }
        .deck::before {
          content: "";
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(76,224,210,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(76,224,210,0.05) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%);
          pointer-events: none;
        }
        .deck::after {
          content: "";
          position: absolute; left:0; right:0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(76,224,210,0.5), transparent);
          animation: sweep 6s linear infinite;
          pointer-events: none;
        }
        @keyframes sweep { 0%{top:-2%;} 100%{top:102%;} }
        @media (prefers-reduced-motion: reduce) {
          .deck::after { animation: none; display:none; }
          .dock { animation: none; opacity: 1; }
          .dock-pulse { animation: none; }
        }

        .hud {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          border: 1px solid rgba(124,92,252,0.25);
          background: rgba(13,18,32,0.6);
          backdrop-filter: blur(10px);
          border-radius: 14px;
          padding: 16px 18px;
          margin-bottom: 22px;
        }
        .hud-title {
          font-family: "Space Grotesk", Inter, sans-serif;
          letter-spacing: 0.08em;
          font-size: 12px;
          color: #7C88A6;
          text-transform: uppercase;
        }
        .hud-name {
          font-size: 20px;
          font-weight: 600;
          margin-top: 2px;
        }
        .hud-params {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .chip {
          display: flex; align-items: center; gap: 6px;
          border: 1px solid rgba(76,224,210,0.25);
          background: rgba(76,224,210,0.06);
          color: #C9EFEA;
          font-size: 12px;
          padding: 7px 10px;
          border-radius: 8px;
          font-family: "JetBrains Mono", monospace;
        }
        .search {
          display:flex; align-items:center; gap:8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 8px 12px; border-radius: 8px;
          color: #7C88A6; font-size: 13px;
          text-decoration: none;
        }
        .search:hover { border-color: rgba(76,224,210,0.4); color: #C9EFEA; }

        .grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 14px;
        }

        .dock {
          position: relative;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
          border-radius: 16px;
          padding: 18px 14px 16px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          gap: 10px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          opacity: 0;
          animation: rise 480ms ease forwards;
          transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dock:hover, .dock:focus-visible {
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--c) 50%, transparent);
          box-shadow: 0 10px 30px -12px color-mix(in srgb, var(--c) 40%, transparent);
          outline: none;
        }

        .dock-core {
          position: relative;
          width: 54px; height: 54px;
          border-radius: 999px;
          display: flex; align-items: center; justify-content: center;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), rgba(0,0,0,0.3));
          border: 1px solid color-mix(in srgb, var(--c) 35%, transparent);
        }
        .dock-ring {
          position: absolute;
          top: 6px; width: 66px; height: 66px;
          border-radius: 999px;
          border: 1.5px dashed color-mix(in srgb, var(--c) 35%, transparent);
          transition: all 300ms ease;
        }
        .dock:hover .dock-ring, .dock:focus-visible .dock-ring {
          border-style: solid;
          border-color: var(--c);
          transform: rotate(90deg);
        }
        .dock-pulse {
          position: absolute; top: 14px; right: 40%;
          width: 6px; height: 6px; border-radius: 999px;
          background: var(--c);
          box-shadow: 0 0 8px 1px var(--c);
          animation: breathe 2.2s ease-in-out infinite;
        }
        @keyframes breathe {
          0%,100% { opacity: 0.4; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .dock-label {
          font-size: 13px; font-weight: 600; letter-spacing: 0.02em;
        }
        .dock-readout {
          font-family: "JetBrains Mono", monospace;
          font-size: 12px; color: var(--c);
        }
        .dock-readout .unit { color: #7C88A6; margin-left: 3px; }
      `}</style>

      <div className="hud">
        <div>
          <div className="hud-title">Command Deck // Ops Console</div>
          <div className="hud-name">{title}</div>
        </div>
        <div className="hud-params">
          <div className="chip">CYCLE 2026–2027</div>
          <div className="chip">PHASE Q1 <ChevronDown size={12} /></div>
          <a className="search" href="/Modules.php?modname=misc/Portal.php">
            <Search size={14} /> Classic menu
          </a>
        </div>
      </div>

      <div className="grid">
        {MODULES.map((m, i) => (
          <DockingPort mod={m} index={i} key={m.key} stat={stats[m.statKey] ?? 0} />
        ))}
      </div>
    </div>
  );
}
