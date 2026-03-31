import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBuildingColumns, faRankingStar, faDiagramPredecessor } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const stats = [
  { value: "100+", label: "People Helped",  icon: <FontAwesomeIcon icon={faUsers} className="text-xl text-white/80 hover:text-indigo-400 transition"/> },
  { value: "4+",   label: "Industries",     icon: <FontAwesomeIcon icon={faBuildingColumns} className="text-xl text-white/80 hover:text-indigo-400 transition"/> },
  { value: "12+",  label: "Projects Done",  icon: <FontAwesomeIcon icon={faDiagramPredecessor} className="text-xl text-white/80 hover:text-indigo-400 transition"/> },
  { value: "95%",  label: "Return & Refer", icon: <FontAwesomeIcon icon={faRankingStar} className="text-xl text-white/80 hover:text-indigo-400 transition"/> },
];

export default function ProfileCard() {
  const [imgError, setImgError] = useState(false);
  const [paused, setPaused]     = useState(false);

  const Avatar = () =>
    imgError ? (
      <svg xmlns="http://www.w3.org/2000/svg"
        style={{ width: "2.2rem", height: "2.2rem", color: "rgba(255,255,255,0.65)" }}
        viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    ) : (
      <img src="/assets/kelly-besong.png" alt="Kelly Besong"
        style={{ width: "115%", height: "115%", objectFit: "cover" }}
        onError={() => setImgError(true)}
      />
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap');

        /* ════════════════════════════
           SHARED TOKENS
        ════════════════════════════ */
        .pc-stat-icon  { font-size: 1.2rem; display: block; line-height: 1; margin-bottom: 4px; }
        .pc-stat-value {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.15rem; font-weight: 800;
          color: #fff; line-height: 1;
          text-shadow: 0 1px 6px rgba(0,0,0,0.3);
        }
        .pc-stat-label {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 0.62rem; font-weight: 400;
          color: rgba(255,255,255,0.78);
          margin-top: 3px; line-height: 1.3;
        }

        .pc-band {
          height: 100px;
          background: linear-gradient(135deg,
            rgba(192,132,252,0.55) 0%,
            rgba(16,185,129,0.45) 100%);
        }

        .pc-avatar-circle {
          width: 120px; height: 120px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.85);
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.15);
          box-shadow: 0 6px 20px rgba(0,0,0,0.28);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
          cursor: pointer;
        }
        .pc-avatar-circle:hover {
          transform: scale(1.22);
          box-shadow: 0 12px 32px rgba(167,139,250,0.55);
        }

        .pc-card-shell {
          font-family: 'Bricolage Grotesque', sans-serif;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35);
          position: relative;
        }

        .pc-card-body {
          padding: 60px 25px 30px;
          text-align: center;
        }

        .pc-name {
          font-size: 1.2rem; font-weight: 800;
          color: #fff; letter-spacing: -0.02em;
          text-shadow: 0 1px 8px rgba(0,0,0,0.3);
        }
        .pc-role {
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(167,239,200,0.95); margin-top: 3px;
        }
        .pc-hr {
          height: 1px; background: rgba(255,255,255,0.15); margin: 10px 0;
        }
        .pc-status {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; font-size: 0.6rem; color: rgba(255,255,255,0.7);
          font-family: 'Bricolage Grotesque', sans-serif;
        }
        .pc-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 6px #4ade80;
          animation: pc-blink 2s ease infinite; flex-shrink: 0;
        }
        @keyframes pc-blink { 0%,100%{opacity:1} 50%{opacity:.35} }

        /* ════════════════════════════
           DESKTOP — orbit layout
        ════════════════════════════ */
        .pc-desktop {
          position: relative;
          width: 460px; height: 460px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin: 0 auto;
        }

        .pc-orbit-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 1px dashed rgba(255,255,255,0.18);
          animation: pc-spin 16s linear infinite;
        }
        .pc-orbit-ring.paused { animation-play-state: paused; }
        @keyframes pc-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .pc-orb-stat {
          position: absolute;
          width: 115px;
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 14px;
          padding: 10px 8px;
          text-align: center;
          animation: pc-counter 16s linear infinite;
          box-shadow: 0 4px 18px rgba(0,0,0,0.22);
          cursor: default;
          transition: background 0.25s;
        }
        .pc-orb-stat.paused { animation-play-state: paused; }
        .pc-orb-stat:hover  { background: rgba(255,255,255,0.26); }
        @keyframes pc-counter { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }

        .pc-orb-inner {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .pc-orb-stat:hover .pc-orb-inner { transform: scale(1.18); }

        .pc-orb-stat-0 { top:-56px;    left:50%; margin-left:-57px; width:30%;}
        .pc-orb-stat-1 { top:50%;      right:-56px; margin-top:-48px; width:30%;}
        .pc-orb-stat-2 { bottom:-56px; left:50%; margin-left:-57px; width:30%;}
        .pc-orb-stat-3 { top:50%;      left:-56px; margin-top:-48px; width:30%;}

        .pc-desktop .pc-card-shell { width: 230px; z-index: 2; }

        .pc-desktop .pc-avatar-wrap {
          position: absolute;
          top: 52px; left: 50%;
          transform: translateX(-50%);
          z-index: 3;
        }

        /* ════════════════════════════
           MOBILE — stacked layout
        ════════════════════════════ */
        .pc-mobile {
          display: none;
          flex-direction: column;
          align-items: center;
          width: 100%;
          gap: 20px;
          padding: 0 1rem;
          box-sizing: border-box;
        }

        .pc-mobile .pc-card-shell {
          width: 100%;
          max-width: 320px;
        }

        .pc-mobile .pc-avatar-wrap {
          position: absolute;
          top: 52px; left: 50%;
          transform: translateX(-50%);
          z-index: 3;
        }

        .pc-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
          max-width: 320px;
        }

        .pc-grid-stat {
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 14px;
          padding: 14px 10px;
          text-align: center;
          box-shadow: 0 4px 18px rgba(0,0,0,0.2);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.25s;
          cursor: default;
        }
        .pc-grid-stat:hover {
          transform: scale(1.06);
          background: rgba(255,255,255,0.22);
        }

        /* ════════════════════════════
           BREAKPOINT
        ════════════════════════════ */
        @media (max-width: 640px) {
          .pc-desktop { display: none; }
          .pc-mobile  { display: flex; }
        }
      `}</style>

      {/* ── DESKTOP ── */}
      <div className="pc-desktop">
        <div
          className={`pc-orbit-ring ${paused ? "paused" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {stats.map((s, i) => (
            <div key={i} className={`pc-orb-stat pc-orb-stat-${i} ${paused ? "paused" : ""}`}>
              <div className="pc-orb-inner">
                <span className="pc-stat-icon">{s.icon}</span>
               <div className="flex gap-1 justify-center items-center whitespace-nowrap min-w-[120px]"> 
               <div className="pc-stat-value">{s.value}</div>
               <div className="pc-stat-label">{s.label}</div>
               </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pc-card-shell">
          <div className="pc-band" />
          <div className="pc-avatar-wrap">
            <div className="pc-avatar-circle"><Avatar /></div>
          </div>
          <div className="pc-card-body">
            {/* <div className="pc-name">Kelly Besong</div>
            <div className="pc-role">Software Engineer</div> */}
            <div className="pc-hr" />
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="pc-mobile">

        {/* 1 — Profile card */}
        <div className="pc-card-shell">
          <div className="pc-band" />
          <div className="pc-avatar-wrap">
            <div className="pc-avatar-circle"><Avatar /></div>
          </div>
          <div className="pc-card-body">
            {/* <div className="pc-name">Kelly Besong</div>
            <div className="pc-role">Software Engineer</div> */}
            <div className="pc-hr" />
          </div>
        </div>

        {/* 2 — Stat grid */}
        <div className="pc-stat-grid">
          {stats.map((s, i) => (
            <div key={i} className="pc-grid-stat">
              <span className="pc-stat-icon">{s.icon}</span>
              <div className="pc-stat-value">{s.value}</div>
              <div className="pc-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}