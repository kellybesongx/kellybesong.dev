import { useState } from "react";

const stats = [
  { value: "100+", label: "People Helped", icon: "👥" },
  { value: "4+",   label: "Industries",    icon: "🏭" },
  { value: "12+",  label: "Projects Done", icon: "🚀" },
  { value: "95 %",  label: "Return & Refer",icon: "⭐" },
];

export default function ProfileCard() {
  const [imgError, setImgError] = useState(false);
  const [paused, setPaused] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap');

        .pc-outer {
          position: relative;
          // width: 360px;
          // height: 360px;
           width: 460px;
           height: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin: 0 auto;
        }

        /* ── Orbit ring ── */
        .pc-orbit-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px dashed rgba(255,255,255,0.18);
          animation: pc-spin 16s linear infinite;
        }
        .pc-orbit-ring.paused { animation-play-state: paused; }
        @keyframes pc-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Stat cards ── */
        .pc-stat {
          position: absolute;
          // width: 100px;
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 14px;
          width: 120px;
          padding: 10px;
          text-align: center;
          /* counter-rotate so text always reads upright */
          animation: pc-counter 16s linear infinite;
          box-shadow: 0 4px 18px rgba(0,0,0,0.22);
          cursor: default;
          transition: background 0.25s, transform 0.03s ease-out;
        }
        .pc-stat.paused { animation-play-state: paused; }
        .pc-stat:hover  { background: rgba(255,255,255,0.26); 
        // transform: scale(1.2) !important;
        // transform-origin: center center !important; /* Ensures scaling from center */
        // rotate: 0deg !important; /* Modern CSS property to reset rotation */}
        @keyframes pc-counter {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        .pc-stat-0 { top: -56px;  left: 50%; margin-left: -57px; width:30%;}
        .pc-stat-1 { top: 50%;    right: -56px; margin-top: -48px; width:30%;}
        .pc-stat-2 { bottom: -56px; left: 50%; margin-left: -57px; width:30%;}
        .pc-stat-3 { top: 50%;    left: -56px; margin-top: -48px; width:30%;}

        .pc-stat-icon  { font-size: 1.2rem; display: block; line-height: 1; margin-bottom: 3px; }
        .pc-stat-value {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.15rem; font-weight: 800;
          color: #fff; line-height: 1;
          text-shadow: 0 1px 6px rgba(0,0,0,0.3);
        }
        .pc-stat-label {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 0.65rem; font-weight: 400;
          color: rgba(255,255,255,0.78);
          margin-top: 3px; line-height: 1.3;
        }

        /* ── Profile card ── */
        .pc-card {
          font-family: 'Bricolage Grotesque', sans-serif;
          position: relative; z-index: 2;
          // width: 180px;
          width: 230px;
          height: 250px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 22px;
          overflow: hidden;
          box-shadow:
            0 24px 60px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.35);
        }

        .pc-band {
          // height: 80px;
            height: 100px;
          background: linear-gradient(135deg,
            rgba(192,132,252,0.55) 0%,
            rgba(16,185,129,0.45) 100%);
        }

        .pc-avatar-wrap {
          position: absolute;
          // top: 40px; left: 50%;
          top: 52px;
          transform: translateX(-50%);
          z-index: 3;
        }

        .pc-avatar {
          // width: 76px; height: 76px;
           width: 96px; height: 96px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.85);
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.15);
          box-shadow: 0 6px 20px rgba(0,0,0,0.28);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.3s ease;
          cursor: pointer;
        }
        .pc-avatar:hover {
          transform: scale(1.22);
          box-shadow: 0 12px 32px rgba(167,139,250,0.55);
        }

        .pc-content {
          // padding: 46px 14px 18px;
           padding: 60px 18px 22px;
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
          color: rgba(167,239,200,0.95);
          margin-top: 3px;
        }

        .pc-divider {
          height: 1px;
          background: rgba(255,255,255,0.15);
          margin: 10px 0;
        }

        .pc-status {
          display: flex; align-items: center;
          justify-content: center; gap: 5px;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.7);
        }

        .pc-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: pc-blink 2s ease infinite;
          flex-shrink: 0;
        }
        @keyframes pc-blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
      `}</style>

      <div className="pc-outer">

        {/* Orbit ring — hover pauses everything */}
        <div
          className={`pc-orbit-ring ${paused ? "paused" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {stats.map((s, i) => (
            <div key={i} className={`pc-stat pc-stat-${i} ${paused ? "paused" : ""} flex flex-col gap-2 w-28 items-center text-center px-3 py-2`}>
              <span className="pc-stat-icon">{s.icon}</span>
              <div className="flex gap-1 justify-center items-center whitespace-nowrap min-w-[120px]"> 
              <div className="pc-stat-value">{s.value}</div>
              <div className="pc-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="pc-card">
          <div className="pc-band" />

          <div className="pc-avatar-wrap">
            <div className="pc-avatar">
              {imgError ? (
                <svg xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "2.2rem", height: "2.2rem", color: "rgba(255,255,255,0.65)" }}
                  viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              ) : (
                <img
                  src="/assets/kelly-besong.png"
                  alt="Kelly Besong"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </div>

          <div className="pc-content">
            <div className="pc-name">Kelly Besong</div>
            <div className="pc-role">Software Engineer</div>
            <div className="pc-divider" />
            {/* <div className="pc-status">
              <div className="pc-dot" />
              Available for work
            </div> */}
          </div>
        </div>

      </div>
    </>
  );
}