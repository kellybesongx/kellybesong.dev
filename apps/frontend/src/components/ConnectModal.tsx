import { useState, useEffect, useRef } from "react";

interface SocialLink {
  id: string;
  name: string;
  handle: string;
  url: string;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
  description: string;
}

interface ConnectWithMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);

const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "x",
    name: "X (Twitter)",
    handle: "@Besongmaris",
    url: "https://x.com/BesongMaris",
    color: "#e2e8f0",
    hoverColor: "#ffffff",
    icon: <XIcon />,
    description: "Thoughts & updates",
  },
  {
    id: "github",
    name: "GitHub",
    handle: "kellybesongx",
    url: "https://github.com/kellybesongx",
    color: "#c4b5fd",
    hoverColor: "#ddd6fe",
    icon: <GitHubIcon />,
    description: "Code & projects",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "Kelly Besong",
    url: "https://www.linkedin.com/in/kelly-besong-b33074237",
    color: "#93c5fd",
    hoverColor: "#bfdbfe",
    icon: <LinkedInIcon />,
    description: "Professional profile",
  },
  {
    id: "email",
    name: "Email",
    handle: "kelwilson@icloud.com",
    url: "mailto:kelwilson_achienu@icloud.com",
    color: "#6ee7b7",
    hoverColor: "#a7f3d0",
    icon: <EmailIcon />,
    description: "Direct message",
  },
];

export default function ConnectWithMeModal({ isOpen, onClose }: ConnectWithMeModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setTimeout(() => setVisible(false), 300);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleCopy = (e: React.MouseEvent, link: SocialLink) => {
    e.stopPropagation(); // don't open the link when copying
    const textToCopy = link.id === "email" ? link.handle : link.url;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(link.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCardClick = (link: SocialLink) => {
    if (link.id === "email") {
      window.location.href = link.url;
    } else {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Mulish:wght@300;400;500;600&display=swap');

        .cwm-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(4, 8, 20, 0.8);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: cwmOverlayIn 0.25s ease forwards;
        }
        @keyframes cwmOverlayIn { from { opacity: 0 } to { opacity: 1 } }

        .cwm-card {
          font-family: 'Mulish', sans-serif;
          background: linear-gradient(160deg, #0d1117 0%, #0a0e1a 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          width: 100%; max-width: 460px;
          overflow: hidden;
          box-shadow: 0 50px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: cwmCardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes cwmCardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.96) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }

        .cwm-header { padding: 2rem 2rem 1.25rem; position: relative; }

        .cwm-dot-grid {
          position: absolute; top: 0; right: 0;
          width: 160px; height: 120px;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 16px 16px;
          mask-image: radial-gradient(ellipse at top right, black, transparent 70%);
          pointer-events: none;
        }

        .cwm-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-bottom: 0.6rem;
        }

        .cwm-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.75rem; font-weight: 800;
          color: #f1f5f9; line-height: 1.15; margin: 0 0 0.4rem;
        }
        .cwm-title span {
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .cwm-subtitle { font-size: 0.82rem; color: rgba(255,255,255,0.35); font-weight: 300; line-height: 1.5; }

        .cwm-close {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%; width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.4);
          transition: all 0.2s; font-size: 0.9rem;
        }
        .cwm-close:hover { background: rgba(255,255,255,0.1); color: #fff; transform: rotate(90deg); }

        .cwm-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          margin: 0 2rem;
        }

        .cwm-links { padding: 1.25rem 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 0.6rem; }

        /* Each card is fully clickable */
        .cwm-link-item {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.22s ease;
          position: relative; overflow: hidden;
          animation: cwmItemIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
          user-select: none;
        }
        .cwm-link-item:nth-child(1) { animation-delay: 0.05s }
        .cwm-link-item:nth-child(2) { animation-delay: 0.1s }
        .cwm-link-item:nth-child(3) { animation-delay: 0.15s }
        .cwm-link-item:nth-child(4) { animation-delay: 0.2s }

        @keyframes cwmItemIn {
          from { opacity: 0; transform: translateX(-10px) }
          to   { opacity: 1; transform: translateX(0) }
        }

        .cwm-link-item:hover {
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          transform: translateX(4px);
        }

        .cwm-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.22s;
        }
        .cwm-link-item:hover .cwm-icon-wrap {
          background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.18);
        }

        .cwm-link-info { flex: 1; min-width: 0; }

        .cwm-link-name {
          font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 600;
          color: rgba(255,255,255,0.85); display: block;
        }
        .cwm-link-handle {
          font-size: 0.75rem; color: rgba(255,255,255,0.35); display: block;
          margin-top: 0.1rem; white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; font-weight: 300;
        }
        .cwm-link-desc {
          font-size: 0.68rem; color: rgba(255,255,255,0.2);
          margin-top: 0.15rem; display: block; font-weight: 300; letter-spacing: 0.02em;
        }

        /* Arrow hint — always visible, fades out when actions appear */
        .cwm-hint {
          font-size: 0.75rem; color: rgba(255,255,255,0.2);
          flex-shrink: 0; transition: opacity 0.2s ease;
        }
        .cwm-link-item:hover .cwm-hint { opacity: 0; pointer-events: none; }

        /* Action buttons — hidden until hover */
        .cwm-actions {
          position: absolute; right: 1.25rem;
          display: flex; align-items: center; gap: 0.4rem;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }
        .cwm-link-item:hover .cwm-actions {
          opacity: 1; transform: translateX(0); pointer-events: all;
        }

        .cwm-action-btn {
          width: 30px; height: 30px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.6);
          transition: all 0.15s; flex-shrink: 0; text-decoration: none;
        }
        .cwm-action-btn:hover {
          background: rgba(255,255,255,0.18); color: #fff;
          border-color: rgba(255,255,255,0.25);
        }
        .cwm-action-btn.copied {
          color: #6ee7b7; border-color: rgba(110,231,183,0.4);
          background: rgba(110,231,183,0.1);
        }

        .cwm-footer {
          padding: 1rem 2rem 1.5rem; text-align: center;
          font-size: 0.72rem; color: rgba(255,255,255,0.18);
          font-weight: 300; letter-spacing: 0.02em;
        }
      `}</style>

      <div ref={overlayRef} className="cwm-overlay" onClick={handleOverlayClick}>
        <div className="cwm-card" role="dialog" aria-modal="true" aria-label="Connect With Me">

          <div className="cwm-header">
            <div className="cwm-dot-grid" />
            <p className="cwm-eyebrow">Let's connect</p>
            <h2 className="cwm-title">Find me <span>online</span></h2>
            <p className="cwm-subtitle">Click any card to visit · hover to copy the link.</p>
            <button className="cwm-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          <div className="cwm-divider" />

          <div className="cwm-links">
            {SOCIAL_LINKS.map((link) => (
              <div
                key={link.id}
                className="cwm-link-item"
                onClick={() => handleCardClick(link)}
                onMouseEnter={() => setHoveredId(link.id)}
                onMouseLeave={() => setHoveredId(null)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCardClick(link)}
                aria-label={`Visit ${link.name}`}
              >
                {/* Icon */}
                <div className="cwm-icon-wrap" style={{ color: link.color }}>
                  {link.icon}
                </div>

                {/* Info */}
                <div className="cwm-link-info">
                  <span className="cwm-link-name">{link.name}</span>
                  <span className="cwm-link-handle">{link.handle}</span>
                  <span className="cwm-link-desc">{link.description}</span>
                </div>

                {/* Arrow hint before hover */}
                <span className="cwm-hint">↗</span>

                {/* Action buttons revealed on hover */}
                <div className="cwm-actions">
                  <button
                    className={`cwm-action-btn ${copiedId === link.id ? "copied" : ""}`}
                    onClick={(e) => handleCopy(e, link)}
                    title={copiedId === link.id ? "Copied!" : "Copy link"}
                    aria-label="Copy link"
                  >
                    {copiedId === link.id ? <CheckIcon /> : <CopyIcon />}
                  </button>

                  <a
                    href={link.url}
                    target={link.id === "email" ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="cwm-action-btn"
                    title={`Open ${link.name}`}
                    aria-label={`Open ${link.name}`}
                    style={{ color: link.color }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="cwm-footer">
            Click a card to open · hover to copy or open in new tab
          </div>
        </div>
      </div>
    </>
  );
}

// --- Demo wrapper ---
export function ConnectWithMeDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#04080f", fontFamily: "'Syne', sans-serif",
    }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "0.8rem 2rem", borderRadius: "10px",
          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
          border: "none", color: "#fff", fontSize: "0.9rem",
          fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif",
          letterSpacing: "0.04em"
        }}
      >
        Connect With Me
      </button>
      <ConnectWithMeModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}