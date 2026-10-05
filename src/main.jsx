import React, { useEffect, useState, useRef, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  Download,
  Cpu,
  Network,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@fontsource-variable/manrope";
import "@fontsource-variable/space-grotesk";
const HeroScene = React.lazy(() => import("./scene"));
import "./styles.css";
import "./experience.css";
import "./testimonials.css";
import "./themes.css";
import Testimonials from "./testimonials";
import {
  PlatformTicker,
  PlatformExplorer,
  ExperienceTimeline,
  SelectedWork,
  Credentials,
  DetailDialog,
} from "./details";
gsap.registerPlugin(ScrollTrigger);
const modes = ["Programmatic", "Retail media", "AI & automation"];
function Tilt({ children, className = "" }) {
  const ref = useRef();
  return (
    <article
      ref={ref}
      className={`glass ${className}`}
      onPointerMove={(e) => {
        if (document.documentElement.dataset.motion === "off") return;
        if (
          !matchMedia(
            "(hover:hover) and (prefers-reduced-motion:no-preference)",
          ).matches
        )
          return;
        const r = e.currentTarget.getBoundingClientRect();
        gsap.to(ref.current, {
          rotateY: ((e.clientX - r.left) / r.width - 0.5) * 9,
          rotateX: -((e.clientY - r.top) / r.height - 0.5) * 9,
          duration: 0.35,
          transformPerspective: 900,
        });
      }}
      onPointerLeave={() =>
        gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.5 })
      }
    >
      {children}
    </article>
  );
}
function App() {
  const [mode, setMode] = useState(0),
    [project, setProject] = useState(0),
    [menu, setMenu] = useState(false),
    [motion, setMotion] = useState(
      !matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [status, setStatus] = useState(""),
    [emailDraft, setEmailDraft] = useState(""),
    [selection, setSelection] = useState(null),
    [theme, setTheme] = useState(() => {
      try {
        return localStorage.getItem("portfolio-theme") === "day"
          ? "day"
          : "night";
      } catch {
        return "night";
      }
    });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
    if (!motion) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", {
        y: 25,
        opacity: 0,
        stagger: 0.09,
        duration: 1,
        ease: "power3.out",
      });
      gsap.utils.toArray(".reveal").forEach((el) =>
        gsap.fromTo(
          el,
          { y: 42, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        ),
      );
      gsap.utils.toArray(".role").forEach((el) =>
        gsap.fromTo(
          el,
          { z: -120, rotateX: 7 },
          {
            z: 0,
            rotateX: 0,
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 55%",
              scrub: 1,
            },
          },
        ),
      );
    });
    return () => ctx.revert();
  }, [motion]);
  const projects = [
    {
      name: "ProgrammaticOS",
      type: "AI-POWERED LEARNING",
      description:
        "Turning complex ad tech into a connected learning system. A place to explore programmatic media with AI at the core.",
      label: "Ask about ProgrammaticOS",
      screen: "programmatic.os",
      tags: ["AI learning", "Ad tech", "Independent build"],
    },
    {
      name: "Myvash",
      type: "PERFORMANCE MARKETING CONSULTANCY",
      description:
        "Strategy meets execution. My digital marketing consultancy connecting media, measurable performance, and smarter workflows.",
      label: "Discuss a Myvash project",
      screen: "myvash.studio",
      tags: ["Consulting", "Growth strategy", "Performance"],
    },
  ];
  function contact(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    setEmailDraft(
      `mailto:vamsisonamic@gmail.com?subject=${encodeURIComponent("Portfolio inquiry from " + data.get("name"))}&body=${encodeURIComponent(body)}`,
    );
    setStatus(
      "Your draft is ready. Open it in your email app, then send it to complete your inquiry.",
    );
  }
  return (
    <>
      <a className="skip" href="#engine">
        Skip to content
      </a>
      <header>
        <a className="brand" href="#home">
          <span className="brand-icon">
            bv<span>·</span>
          </span>
          <span>
            BHARAT VAMSI<small>MEDIA × INTELLIGENCE</small>
          </span>
        </a>
        <nav className={menu ? "open" : ""} aria-label="Main navigation">
          {[
            ["The engine", "engine"],
            ["Platforms", "platforms"],
            ["Experience", "experience"],
            ["Innovation lab", "lab"],
            ["Testimonials", "testimonials"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="header-contact">
          Let’s connect <ArrowUpRight size={15} />
        </a>
        <button
          className="mobile-menu"
          aria-label={menu ? "Close menu" : "Open menu"}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main>
        <section id="home" className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> STRATEGY. SYSTEMS. SCALE.
            </div>
            <h1>
              Architecting
              <br />
              the future of
              <br />
              <span>programmatic</span>
              <br />
              media <span className="amp">&</span> AI
              <span className="period">.</span>
            </h1>
            <p>
              I connect the dots between advertising, data, and artificial
              intelligence. Building smarter systems. Driving meaningful growth.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#lab">
                Explore my work <ArrowUpRight size={18} />
              </a>
              <a className="text-link" href="#engine">
                Meet the strategist <ArrowRight size={16} />
              </a>
            </div>
            <div className="hero-person">
              <span className="avatar">BV</span>
              <div>
                Bharat Vamsi Reddy
                <small>Enterprise Programmatic & Retail Media Strategist</small>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="scene-meta">
              <span>
                <span className="status-dot" /> CONNECTED INTELLIGENCE
              </span>
              <span>INTERACTIVE 3D</span>
            </div>
            <Suspense
              fallback={
                <div className="scene-loading">INITIALIZING NETWORK</div>
              }
            >
              <HeroScene mode={mode} motion={motion} theme={theme} />
            </Suspense>
            <div className="node-label label-one">
              <i />{" "}
              {["DSP / EXCHANGE", "ONSITE / OFFSITE", "WORKFLOW / API"][mode]}
            </div>
            <div className="node-label label-two">
              <i /> {["AUDIENCE SIGNAL", "RETAIL SIGNAL", "AI AGENT"][mode]}
            </div>
            <div className="visual-footer">
              <span>ONE ECOSYSTEM. INFINITE POSSIBILITIES.</span>
              <span>↗</span>
            </div>
            <div className="mode-switch" aria-label="Network layer">
              {modes.map((m, i) => (
                <button
                  key={m}
                  aria-pressed={mode === i}
                  onClick={() => setMode(i)}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="simulation-note">Conceptual network visualization</p>
          </div>
          <div className="hero-bottom">
            <span>BASED IN HYDERABAD · THINKING GLOBALLY</span>
            <div className="view-controls">
              <button
                className="theme-switch"
                onClick={() => setTheme(theme === "night" ? "day" : "night")}
                aria-label={`Switch to ${theme === "night" ? "Day" : "Night"} vision`}
              >
                {theme === "night" ? <Sun size={15} /> : <Moon size={15} />}{" "}
                {theme === "night" ? "DAY VISION" : "NIGHT VISION"}
              </button>
              <button onClick={() => setMotion(!motion)} aria-pressed={motion}>
                MOTION {motion ? "ON" : "OFF"}{" "}
                <span className={motion ? "switch on" : "switch"} />
              </button>
            </div>
          </div>
        </section>
        <PlatformTicker motion={motion} onOpen={setSelection} />
        <section id="engine" className="section engine">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow">THE ENGINE ROOM</div>
              <h2>
                Complex ecosystems.
                <br />
                <span>Connected thinking.</span>
              </h2>
            </div>
            <p>
              Media expertise with an engineer’s mindset.
              <br />
              Three disciplines. One integrated advantage.
            </p>
          </div>
          <div className="competencies">
            <Tilt className="competency reveal">
              <Network className="card-icon" />
              <div className="card-number">01 / EXECUTE</div>
              <h3>
                Omnichannel
                <br />
                execution
              </h3>
              <p>
                The right audience. The right moment. Precision across every
                channel.
              </p>
              <div className="tags">
                <span>DV360</span>
                <span>The Trade Desk</span>
                <span>Meta</span>
                <span>Amazon DSP certified</span>
              </div>
              <ArrowUpRight className="card-arrow" />
            </Tilt>
            <Tilt className="competency featured reveal">
              <Cpu className="card-icon" />
              <div className="card-number">02 / AUTOMATE</div>
              <h3>
                AI &<br />
                automation
              </h3>
              <p>
                Less repetitive work. More strategic thinking. AI woven into the
                workflow.
              </p>
              <div className="tags">
                <span>Google AI Studio</span>
                <span>Copilot Studio · beta</span>
                <span>API / AdReform</span>
              </div>
              <ArrowUpRight className="card-arrow" />
            </Tilt>
            <Tilt className="competency reveal">
              <ShoppingBag className="card-icon" />
              <div className="card-number">03 / ACCELERATE</div>
              <h3>
                Retail
                <br />
                media
              </h3>
              <p>
                Connecting commerce signals to campaigns that move the business
                forward.
              </p>
              <div className="tags">
                <span>Onsite / Offsite</span>
                <span>Audience forecasting</span>
              </div>
              <ArrowUpRight className="card-arrow" />
            </Tilt>
          </div>
        </section>
        <PlatformExplorer motion={motion} onOpen={setSelection} />
        <section id="experience" className="section experience">
          <div className="experience-intro reveal">
            <h2>
              Built through experience.
              <br />
              <span>Proven in execution.</span>
            </h2>
            <p>
              From technology operations to enterprise media.
              <br />A journey of turning complexity into performance.
            </p>
            <div className="impact">
              <div>
                <strong>
                  98%<sup>+</sup>
                </strong>
                <span>CAMPAIGN DELIVERY RATE</span>
              </div>
              <div>
                <strong>
                  619K<sup>+</sup>
                </strong>
                <span>RECOVERED IMPRESSIONS</span>
              </div>
            </div>
          </div>
          <ExperienceTimeline onOpen={setSelection} />
        </section>
        <SelectedWork onOpen={setSelection} />
        <section id="lab" className="section lab">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow">INDEPENDENT THINKING. REAL BUILDS.</div>
              <h2>
                The innovation lab<span className="period">.</span>
              </h2>
            </div>
            <div className="carousel-controls">
              <button
                aria-label="Previous project"
                onClick={() => setProject((project + 1) % 2)}
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Next project"
                onClick={() => setProject((project + 1) % 2)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="project-showcase glass">
            <div className="project-art">
              <div className="project-orbit" />
              <div className="mockup" key={project}>
                <div className="mockup-bar">
                  <span>● ● ●</span>
                  <span>{projects[project].screen}</span>
                  <span>↗</span>
                </div>
                <div className="mockup-content">
                  <span className="mini-logo">{project ? "m/" : "p/os"}</span>
                  <span className="mockup-kicker">
                    {project
                      ? "STRATEGY, WITH MOMENTUM."
                      : "YOUR NEXT LEVEL STARTS HERE."}
                  </span>
                  <h3>
                    {project
                      ? "Make your next\nmove matter."
                      : "Master the\nprogrammatic world."}
                  </h3>
                  <div className="mockup-button">
                    {project ? "Build with Myvash" : "Start exploring"} ↗
                  </div>
                  <div className="mockup-grid">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
              <span className="concept-label">INTERFACE CONCEPT</span>
            </div>
            <div className="project-copy" aria-live="polite">
              <span className="card-number">{projects[project].type}</span>
              <h3>
                {projects[project].name}
                <ArrowUpRight />
              </h3>
              <p>{projects[project].description}</p>
              <div className="tags">
                {projects[project].tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a
                href={`mailto:vamsisonamic@gmail.com?subject=${encodeURIComponent(project ? "Myvash project inquiry" : "ProgrammaticOS inquiry")}`}
                className="text-link"
              >
                {projects[project].label} <ArrowUpRight size={17} />
              </a>
              <div className="project-pagination">
                {projects.map((p, i) => (
                  <button
                    key={p.name}
                    className={project === i ? "selected" : ""}
                    onClick={() => setProject(i)}
                    aria-label={`Show ${p.name}`}
                    aria-pressed={project === i}
                  />
                ))}
                <span>0{project + 1} / 02</span>
              </div>
            </div>
          </div>
        </section>
        <Credentials onOpen={setSelection} />
        <Testimonials />
        <section id="contact" className="section contact">
          <div className="contact-copy reveal">
            <div className="eyebrow">
              <span className="status-dot" /> OPEN TO WHAT’S NEXT
            </div>
            <h2>
              Let’s build
              <br />
              what’s <span>next.</span>
              <ArrowUpRight />
            </h2>
            <p>
              A complex media challenge. An ambitious idea.
              <br />A better way to work. Let’s connect the dots.
            </p>
            <a className="email" href="mailto:vamsisonamic@gmail.com">
              vamsisonamic@gmail.com <ArrowUpRight size={18} />
            </a>
            <a
              className="button resume"
              href={`${import.meta.env.BASE_URL}Bharat-Vamsi-Reddy-Resume.pdf`}
              download="Bharat-Vamsi-Reddy-Resume.pdf"
            >
              <Download size={17} /> Download ATS-Optimized Resume
            </a>
            <small className="resume-note">
              Master resume · 2 pages · Selectable text
            </small>
          </div>
          <form className="terminal glass" onSubmit={contact}>
            <div className="terminal-header">
              <span>● ● ●</span>
              <span>new_connection.sh</span>
              <span>↗</span>
            </div>
            <p>
              <span className="terminal-green">$</span> initiate_connection
              <span className="cursor">▌</span>
            </p>
            <label htmlFor="name">
              01 &nbsp; YOUR NAME
              <input
                id="name"
                name="name"
                placeholder="How should I call you?"
                required
                autoComplete="name"
                maxLength={100}
              />
            </label>
            <label htmlFor="email">
              02 &nbsp; EMAIL ADDRESS
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </label>
            <label htmlFor="message">
              03 &nbsp; YOUR IDEA
              <textarea
                id="message"
                name="message"
                placeholder="Tell me what you have in mind…"
                required
                maxLength={3000}
              />
            </label>
            <button className="button primary" type="submit">
              Create email draft <ArrowUpRight size={18} />
            </button>
            {emailDraft && (
              <a className="text-link" href={emailDraft}>
                Open draft in email app <ArrowUpRight size={17} />
              </a>
            )}
            <small role="status">
              {status ||
                "Opens your email app. Your message is sent from there."}
            </small>
          </form>
        </section>
      </main>
      {selection && (
        <DetailDialog
          selection={selection}
          motion={motion}
          onClose={() => setSelection(null)}
        />
      )}
      <footer>
        <a className="footer-brand" href="#home">
          bv<span>·</span>
        </a>
        <span>© 2026 BHARAT VAMSI</span>
        <span>CRAFTED AT THE INTERSECTION OF MEDIA & AI</span>
        <div>
          <a
            href="https://www.linkedin.com/in/bharath-vamsi-reddy"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight size={13} />
          </a>
          <a
            href="https://github.com/vamsisonamic-eng"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
