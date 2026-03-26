import { useState, useEffect, useRef } from "react";

type ProjectType =
  | ""
  | "portfolio"
  | "landing-page"
  | "web-app"
  | "mobile-app"
  | "ecommerce"
  | "other";

interface FormData {
  name: string;
  projectType: ProjectType;
  message: string;
}

interface FormErrors {
  name?: string;
  projectType?: string;
  message?: string;
}

interface WorkWithMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_OPTIONS: { value: ProjectType; label: string }[] = [
  { value: "", label: "Select a project type..." },
  { value: "portfolio", label: "Portfolio Website" },
  { value: "landing-page", label: "Landing Page" },
  { value: "web-app", label: "Web Application" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "ecommerce", label: "E-Commerce Store" },
  { value: "other", label: "Something Else" },
];

export default function WorkWithMeModal({ isOpen, onClose }: WorkWithMeModalProps) {
  const [form, setForm] = useState<FormData>({ name: "", projectType: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.projectType) newErrors.projectType = "Please select a project type";
    if (!form.message.trim()) newErrors.message = "Tell me about your project";
    else if (form.message.trim().length < 20) newErrors.message = "Please add a bit more detail (20+ chars)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", projectType: "", message: "" });
    setErrors({});
    setSubmitted(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .wwm-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(10, 10, 18, 0.75);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: overlayIn 0.25s ease forwards;
        }
        .wwm-overlay.closing { animation: overlayOut 0.3s ease forwards; }

        @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes overlayOut { from { opacity: 1 } to { opacity: 0 } }

        .wwm-card {
          font-family: 'DM Sans', sans-serif;
          background: #0f0f17;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          width: 100%; max-width: 520px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
          animation: cardIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }

        .wwm-header {
          padding: 2rem 2rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
        }

        .wwm-tag {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a78bfa;
          background: rgba(167, 139, 250, 0.1);
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 100px;
          padding: 0.25rem 0.75rem;
          margin-bottom: 0.75rem;
        }

        .wwm-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.9rem;
          color: #f0eeff;
          line-height: 1.1;
          margin: 0;
        }

        .wwm-title em {
          font-style: italic;
          color: #a78bfa;
        }

        .wwm-subtitle {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          margin-top: 0.5rem;
          font-weight: 300;
        }

        .wwm-close {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.5);
          transition: all 0.2s;
          font-size: 1rem;
        }
        .wwm-close:hover { background: rgba(255,255,255,0.12); color: #fff; }

        .wwm-body { padding: 1.75rem 2rem 2rem; display: flex; flex-direction: column; gap: 1.25rem; }

        .wwm-field { display: flex; flex-direction: column; gap: 0.4rem; }

        .wwm-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        .wwm-input, .wwm-select, .wwm-textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #f0eeff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          padding: 0.75rem 1rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .wwm-input::placeholder, .wwm-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .wwm-input:focus, .wwm-select:focus, .wwm-textarea:focus {
          border-color: rgba(167, 139, 250, 0.5);
          background: rgba(167, 139, 250, 0.05);
        }
        .wwm-input.error, .wwm-select.error, .wwm-textarea.error {
          border-color: rgba(248, 113, 113, 0.5);
        }

        .wwm-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
          cursor: pointer;
        }
        .wwm-select option { background: #1a1a2e; color: #f0eeff; }

        .wwm-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }

        .wwm-error {
          font-size: 0.75rem;
          color: #f87171;
          margin-top: 0.1rem;
        }

        .wwm-submit {
          width: 100%;
          padding: 0.85rem;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 0.25rem;
        }
        .wwm-submit:hover { opacity: 0.9; transform: translateY(-1px); }
        .wwm-submit:active { transform: translateY(0); }

        .wwm-success {
          padding: 3rem 2rem;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
        }
        .wwm-success-icon {
          width: 56px; height: 56px;
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem;
        }
        .wwm-success-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.6rem;
          color: #f0eeff;
        }
        .wwm-success-sub { font-size: 0.85rem; color: rgba(255,255,255,0.4); line-height: 1.6; }
        .wwm-success-btn {
          margin-top: 0.5rem;
          padding: 0.6rem 1.5rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .wwm-success-btn:hover { background: rgba(255,255,255,0.06); color: #fff; }
      `}</style>

      <div
        ref={overlayRef}
        className="wwm-overlay"
        onClick={handleOverlayClick}
      >
        <div className="wwm-card" role="dialog" aria-modal="true" aria-label="Work With Me">

          {!submitted ? (
            <>
              <div className="wwm-header">
                <div className="wwm-tag">Open for work</div>
                <h2 className="wwm-title">Let's build something <em>great</em></h2>
                <p className="wwm-subtitle">Fill in the details and I'll get back to you within 24 hours.</p>
                <button className="wwm-close" onClick={onClose} aria-label="Close modal">✕</button>
              </div>

              <div className="wwm-body">
                {/* Name */}
                <div className="wwm-field">
                  <label className="wwm-label">Your Name</label>
                  <input
                    className={`wwm-input ${errors.name ? "error" : ""}`}
                    type="text"
                    placeholder="e.g. John Mensah"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name && <span className="wwm-error">{errors.name}</span>}
                </div>

                {/* Project Type */}
                <div className="wwm-field">
                  <label className="wwm-label">Project Type</label>
                  <select
                    className={`wwm-select ${errors.projectType ? "error" : ""}`}
                    value={form.projectType}
                    onChange={e => setForm(f => ({ ...f, projectType: e.target.value as ProjectType }))}
                  >
                    {PROJECT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.projectType && <span className="wwm-error">{errors.projectType}</span>}
                </div>

                {/* Message */}
                <div className="wwm-field">
                  <label className="wwm-label">Tell Me About Your Project</label>
                  <textarea
                    className={`wwm-textarea ${errors.message ? "error" : ""}`}
                    placeholder="Describe your idea, goals, timeline, or anything else that's helpful..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                  {errors.message && <span className="wwm-error">{errors.message}</span>}
                </div>

                <button className="wwm-submit" onClick={handleSubmit}>
                  Send Message →
                </button>
              </div>
            </>
          ) : (
            <div className="wwm-success">
              <div className="wwm-success-icon">✦</div>
              <h3 className="wwm-success-title">Message sent!</h3>
              <p className="wwm-success-sub">
                Thanks, <strong style={{ color: "#a78bfa" }}>{form.name}</strong>! I've received your inquiry
                about your <strong style={{ color: "#a78bfa" }}>
                  {PROJECT_OPTIONS.find(o => o.value === form.projectType)?.label}
                </strong> project and will be in touch soon.
              </p>
              <button className="wwm-success-btn" onClick={handleReset}>Send another message</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// --- Demo wrapper so you can preview it ---
export function WorkWithMeDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#07070f", fontFamily: "'DM Sans', sans-serif"
    }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "0.8rem 2rem", borderRadius: "10px",
          background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
          border: "none", color: "#fff", fontSize: "0.95rem",
          fontWeight: 600, cursor: "pointer"
        }}
      >
        Work With Me
      </button>
      <WorkWithMeModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}