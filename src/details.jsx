import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  ArrowRight,
  X,
  Plus,
  Pause,
  Play,
  Check,
  Award,
  Layers,
} from "lucide-react";
import gsap from "gsap";
import CreativeCase from "./creative-case";
import {
  platforms,
  platformGroups,
  companies,
  caseStudies,
  credentials,
} from "./content";

export function PlatformTicker({ motion, onOpen }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className={`platform-marquee ${!motion || paused ? "is-paused" : ""}`}>
      <div className="ticker-label">
        CONNECTED
        <br />
        TOOLKIT <span>{platforms.length} technologies</span>
      </div>
      <div className="ticker-window">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <div
              className="ticker-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {platforms.map((p) => (
                <button
                  tabIndex={copy === 1 ? -1 : 0}
                  key={p.id}
                  onClick={() => onOpen({ kind: "platform", data: p })}
                >
                  <span style={{ color: p.color }}>{p.mark}</span>
                  {p.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        className="ticker-pause"
        aria-label={paused ? "Resume platform motion" : "Pause platform motion"}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
      </button>
    </div>
  );
}

export function PlatformExplorer({ motion, onOpen }) {
  const [group, setGroup] = useState("All");
  const priority = ["looker", "ga4", "gtm"];
  const filtered = platforms
    .filter((p) => group === "All" || p.group === group)
    .sort((a, b) => {
      const rank = (p) =>
        priority.includes(p.id) ? priority.indexOf(p.id) : 3;
      return rank(a) - rank(b);
    });
  const ref = useRef();
  useEffect(() => {
    if (!motion) return;
    const ctx = gsap.context(
      () =>
        gsap.fromTo(
          ".platform-chip",
          { y: 14, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.025,
            duration: 0.45,
            ease: "power2.out",
          },
        ),
      ref,
    );
    return () => ctx.revert();
  }, [group, motion]);
  return (
    <section id="platforms" className="section platform-section">
      <div className="section-top reveal">
        <div>
          <div className="eyebrow">THE CONNECTED TOOLKIT</div>
          <h2>
            Different platforms.
            <br />
            <span>One connected approach.</span>
          </h2>
        </div>
        <p>
          Activation, audiences, automation and operations.
          <br />
          Select a technology to see where it fits.
        </p>
      </div>
      <div className="platform-tabs" role="group" aria-label="Filter platforms">
        {platformGroups.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            aria-pressed={group === g}
          >
            {g}
            {g === "All" && <span>{platforms.length}</span>}
          </button>
        ))}
      </div>
      <div className="platform-grid" ref={ref}>
        {filtered.map((p) => (
          <button
            key={p.id}
            className="platform-chip"
            style={{ "--platform-color": p.color }}
            onClick={() => onOpen({ kind: "platform", data: p })}
          >
            <span className="platform-mark">{p.mark}</span>
            <span className="platform-chip-copy">
              <strong>{p.name}</strong>
              <small>{p.status}</small>
            </span>
            <ArrowUpRight size={15} />
          </button>
        ))}
      </div>
      <div className="platform-legend">
        <span>
          <i />
          Current work and operational toolkit
        </span>
        <span>
          Earlier experience, certifications and prototypes are labeled.
        </span>
      </div>
    </section>
  );
}

export function ExperienceTimeline({ onOpen }) {
  return (
    <div className="timeline">
      {companies.slice(0, 4).map((company, i) => (
        <button
          className="role reveal role-button"
          key={company.id}
          aria-label={`Explore ${company.name}`}
          aria-haspopup="dialog"
          onClick={() => onOpen({ kind: "company", data: company })}
        >
          <span className="timeline-dot" />
          <span className="role-index">0{i + 1}</span>
          <span className="role-content">
            <span className="role-category">{company.period}</span>
            <span className="role-company">{company.name}</span>
            {company.badge && (
              <span className="promotion-badge">
                <span /> {company.badge}
              </span>
            )}
            <span className="role-description">{company.summary}</span>
            <span className="role-explore">
              Open chapter <ArrowRight size={12} />
            </span>
          </span>
          <Plus size={19} />
        </button>
      ))}
      <div className="career-foundations">
        <span>THE FOUNDATIONS · 2015–2018</span>
        {companies.slice(4).map((c) => (
          <button
            key={c.id}
            aria-label={`Explore ${c.name}`}
            onClick={() => onOpen({ kind: "company", data: c })}
          >
            {c.name}
            <ArrowUpRight size={13} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function SelectedWork({ onOpen }) {
  return (
    <section id="work" className="section selected-work">
      <div className="section-top reveal">
        <div>
          <div className="eyebrow">THE WORK BEHIND THE NUMBERS</div>
          <h2>
            Small fixes.
            <br />
            <span>Outsized impact.</span>
          </h2>
        </div>
        <p>
          Three challenges. Three practical responses.
          <br />
          Open a story to see the thinking behind it.
        </p>
      </div>
      <div className="case-list">
        {caseStudies.map((c, i) => (
          <button
            className="case-row reveal"
            key={c.id}
            aria-label={`Read case study: ${c.name}`}
            onClick={() => onOpen({ kind: "case", data: c })}
          >
            <span className="case-index">0{i + 1}</span>
            <span className="case-title">
              <small>{c.type}</small>
              <strong>{c.name}</strong>
            </span>
            <span className="case-metric">
              <strong>{c.metric}</strong>
              <small>{c.unit}</small>
            </span>
            <span className="case-open">
              <ArrowUpRight />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function Credentials({ onOpen }) {
  return (
    <section className="section credentials">
      <div className="credential-intro">
        <Award size={26} />
        <h2>
          Always learning.
          <br />
          <span>Always building.</span>
        </h2>
        <p>Platform credentials that support the practice.</p>
        <button
          className="text-link"
          onClick={() =>
            onOpen({
              kind: "credentials",
              data: { name: "Credentials & recognition" },
            })
          }
        >
          View credentials & education <ArrowUpRight size={16} />
        </button>
      </div>
      <div className="credential-grid">
        {credentials.slice(0, 4).map(([issuer, title, date]) => (
          <div className="credential" key={title}>
            <span>{issuer}</span>
            <strong>{title}</strong>
            <small>{date}</small>
            <Check size={14} />
          </div>
        ))}
      </div>
    </section>
  );
}

function RoleContent({ data }) {
  return (
    <>
      <p className="detail-intro">{data.intro}</p>
      {data.progression && (
        <div className="progression">
          <div className="progression-line" />
          {data.progression.map(([date, title], i) => (
            <div
              className={`progression-step ${i ? "current" : ""}`}
              key={title}
            >
              <span>{date}</span>
              <strong>{title}</strong>
              {i > 0 && <small>Promoted · July 2026</small>}
            </div>
          ))}
        </div>
      )}
      {data.chart && (
        <div className="roas-story">
          <span>ROAS progression</span>
          <svg
            viewBox="0 0 500 140"
            role="img"
            aria-label="ROAS approximately 0.78 at baseline, 1.2 in month one, and 4.8 in month six"
          >
            <path
              className="chart-line"
              d="M30 115 C100 110 110 95 180 90 S350 60 460 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle cx="30" cy="115" r="5" />
            <circle cx="180" cy="90" r="5" />
            <circle cx="460" cy="20" r="5" />
            <text x="30" y="99">
              ~0.78
            </text>
            <text x="180" y="72">
              1.2
            </text>
            <text x="444" y="47">
              4.8
            </text>
          </svg>
          <div>
            <span>Baseline</span>
            <span>Month one</span>
            <span>Month six</span>
          </div>
        </div>
      )}
      {data.metrics && (
        <div className="detail-metrics">
          {data.metrics.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
      <div className="detail-columns">
        <div>
          <h3>What I do{data.id === "dentsu" ? " today" : ""}</h3>
          <ul>
            {data.responsibilities.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        {data.outcomes.length > 0 && (
          <div>
            <h3>What changed</h3>
            <ul>
              {data.outcomes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {data.recognition && (
        <div className="recognition-band">
          <Award size={22} />
          <div>
            <span>RECOGNITION</span>
            {data.recognition.map(([year, name]) => (
              <strong key={name}>
                {name}
                <small>{year}</small>
              </strong>
            ))}
          </div>
        </div>
      )}
      <div className="tags">
        {data.tools.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      {data.note && <p className="detail-note">{data.note}</p>}
    </>
  );
}

function CaseContent({ data }) {
  return (
    <>
      <p className="detail-intro">{data.intro}</p>
      {data.id === "diagnosis" && <CreativeCase />}
      {data.id !== "diagnosis" && (
        <div className="workflow" aria-label="Illustrative workflow">
          {data.steps.map((step, i) => (
            <div className="workflow-step" key={step}>
              <span>0{i + 1}</span>
              <strong>{step}</strong>
              <Check size={14} />
            </div>
          ))}
        </div>
      )}
      <div className="case-story">
        {[
          ["The challenge", data.situation],
          ["My contribution", data.contribution],
          ["The outcome", data.outcome],
        ].map(([title, text], i) => (
          <div key={title}>
            <span>0{i + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="tags">
        {data.tools.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <p className="detail-note">{data.note}</p>
    </>
  );
}

export function DetailDialog({ selection, onClose, motion }) {
  const ref = useRef();
  const panel = useRef();
  const closing = useRef(false);
  const { kind, data } = selection;
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const ctx = gsap.context(() => {
      if (!motion) return;
      gsap.fromTo(
        panel.current,
        { y: 35, scale: 0.97, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: "power3.out" },
      );
      gsap.fromTo(
        ".detail-body > *",
        { y: 18, opacity: 0.3 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: "power2.out" },
      );
      gsap.fromTo(
        ".workflow-step",
        { opacity: 0.2, y: 12 },
        { opacity: 1, y: 0, stagger: 0.22, duration: 0.45, delay: 0.25 },
      );
      gsap.fromTo(
        ".progression-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, delay: 0.25, ease: "power3.out" },
      );
      gsap.fromTo(
        ".chart-line",
        { strokeDasharray: 550, strokeDashoffset: 550 },
        { strokeDashoffset: 0, duration: 1.3, delay: 0.25, ease: "power2.out" },
      );
    }, dialog);
    return () => {
      ctx.revert();
      dialog.close();
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => {
        if (opener instanceof HTMLElement && opener.isConnected)
          opener.focus({ preventScroll: true });
      });
    };
  }, [motion]);
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (motion)
      gsap.to(panel.current, {
        y: 15,
        opacity: 0,
        duration: 0.18,
        onComplete: onClose,
      });
    else onClose();
  };
  return createPortal(
    <dialog
      ref={ref}
      className="detail-dialog"
      aria-labelledby="detail-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className={`detail-panel ${kind === "platform" ? "platform-detail" : ""}`}
        ref={panel}
        style={{ "--detail-accent": data.color || "#b5f493" }}
      >
        <div className="detail-header">
          <span>
            {kind === "company"
              ? "CAREER CHAPTER"
              : kind === "case"
                ? "SELECTED WORK"
                : kind === "platform"
                  ? "CONNECTED TOOLKIT"
                  : "CONTINUOUS LEARNING"}
          </span>
          <button autoFocus aria-label="Close details" onClick={close}>
            <X size={21} />
          </button>
        </div>
        <div className="detail-heading">
          {kind === "platform" && (
            <span className="detail-platform-mark">{data.mark}</span>
          )}
          <span className="detail-subtitle">
            {data.period ||
              data.type ||
              data.group ||
              "CERTIFICATIONS · EDUCATION · RECOGNITION"}
          </span>
          <h2 id="detail-title">{data.name}</h2>
          {data.role && <p>{data.role}</p>}
          {data.status && <span className="detail-status">{data.status}</span>}
        </div>
        <div className="detail-body">
          {kind === "company" && <RoleContent data={data} />}{" "}
          {kind === "case" && <CaseContent data={data} />}{" "}
          {kind === "platform" && (
            <>
              <p className="detail-intro">{data.description}</p>
              <div className="platform-context">
                <Layers size={19} />
                <span>{data.group}</span>
              </div>
              <p className="detail-note">
                A tool is one part of the system. Its value comes from the
                decisions and workflows around it.
              </p>
            </>
          )}
          {kind === "credentials" && (
            <>
              <div className="full-credentials">
                {credentials.map(([issuer, title, date]) => (
                  <div key={title}>
                    <Award size={20} />
                    <div>
                      <strong>{title}</strong>
                      <span>
                        {issuer} · {date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="education">
                <h3>Education</h3>
                <p>
                  Bachelor of Commerce (B.Com)
                  <br />
                  Andhra University
                </p>
              </div>
              <div className="education">
                <h3>Dentsu recognition</h3>
                <p>
                  Make It Real Award · 2026
                  <br />
                  Climb High Award · 2025
                </p>
              </div>
            </>
          )}
        </div>
        <div className="detail-footer">
          <span>BHARAT VAMSI REDDY · MEDIA × INTELLIGENCE</span>
          <button onClick={close}>
            Back to the portfolio <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
