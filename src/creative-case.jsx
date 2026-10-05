import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  ShieldCheck,
  GitBranch,
  ArrowRight,
} from "lucide-react";
import "./creative-case.css";
const stages = [
  {
    label: "Detect",
    icon: AlertTriangle,
    status: "Destination not crawlable",
    heading: "The rejection was a symptom.",
    text: "Recurring DV360 creative rejections and unsuccessful appeals were putting delivery at risk. I tracked rejected creatives, appealability, pacing and flight end dates to make the problem visible.",
    nodes: ["DV360 creative", "Ad review", "Destination access"],
    notes: [
      "Rejected",
      "Could not verify destination",
      "Crawl access in question",
    ],
    date: "September 2025",
  },
  {
    label: "Diagnose",
    icon: Search,
    status: "Crawl-access finding",
    heading: "Follow the destination, not just the creative.",
    text: "I compared rejected landing-page patterns and reviewed the client’s robots.txt. I documented potentially blocked paths and explained why another appeal alone might not address the underlying access issue.",
    nodes: ["Rejected URLs", "Crawl rules", "Documented findings"],
    notes: [
      "Compare path patterns",
      "Review robots.txt access",
      "Propose remediation",
    ],
    date: "17 September 2025",
  },
  {
    label: "Validate",
    icon: ShieldCheck,
    status: "Corroborated by Google support",
    heading: "Turn an investigation into a shared plan.",
    text: "The onshore team escalated the findings to Google. Support agreed with the blocked-path assessment and the next steps with client developers. My recommendations included reviewing crawler access or using alternate crawlable landing URLs.",
    nodes: ["My diagnosis", "Onshore escalation", "Google support"],
    notes: [
      "Analysis and recommendations",
      "Stakeholder coordination",
      "Blocked-path assessment agreed",
    ],
    date: "Escalation: 18 September 2025 · Reply date not shown",
  },
  {
    label: "Follow through",
    icon: GitBranch,
    status: "Client implementation",
    heading: "Keep delivery moving while the fix is owned elsewhere.",
    text: "I continued monitoring, appeals and mitigation recommendations while website changes were outstanding. Client developers later implemented remediation with client approval. I reported healthy pacing and no recurrence of this specific crawl-access issue after implementation.",
    nodes: ["Campaign monitoring", "Client developers", "Ongoing observation"],
    notes: [
      "Appeals and mitigation",
      "Implementation ownership",
      "Issue-specific follow-through",
    ],
    date: "26–30 September follow-up · Implementation date unspecified",
  },
];
export default function CreativeCase() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  const Icon = stage.icon;
  return (
    <div className="creative-case">
      <div className="case-scope">
        <div>
          <strong>50+</strong>
          <span>distinct advertisers / brands</span>
        </div>
        <div>
          <strong>DV360</strong>
          <span>retail media network</span>
        </div>
        <div>
          <strong>2025</strong>
          <span>Account Manager period</span>
        </div>
      </div>
      <div
        className="investigation-controls"
        role="group"
        aria-label="Explore investigation stages"
      >
        {stages.map((s, i) => (
          <button
            key={s.label}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            {s.label}
          </button>
        ))}
      </div>
      <div className={`investigation-visual stage-${active}`}>
        <div className="investigation-status">
          <Icon size={16} />
          <span>{stage.status}</span>
          <small>ILLUSTRATIVE SYSTEM MAP</small>
        </div>
        <div className="investigation-flow" key={active}>
          {stage.nodes.map((n, i) => (
            <React.Fragment key={n}>
              <div className="investigation-node">
                <span>0{i + 1}</span>
                <strong>{n}</strong>
                <small>{stage.notes[i]}</small>
              </div>
              {i < 2 && (
                <div className="investigation-connector" aria-hidden="true">
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="investigation-copy" aria-live="polite">
          <span>{stage.date}</span>
          <h3>{stage.heading}</h3>
          <p>{stage.text}</p>
        </div>
      </div>
      <div className="evidence-timeline">
        <h3>The documented sequence</h3>
        {[
          [
            "17 Sep 2025",
            "Investigation",
            "Landing-page and robots.txt findings shared with onshore colleagues.",
          ],
          [
            "18 Sep 2025",
            "Escalation",
            "Onshore team contacts Google with the blocked-path assessment.",
          ],
          [
            "26–30 Sep 2025",
            "Operational follow-through",
            "Appeals, pacing monitoring and remediation options continue while website updates are outstanding.",
          ],
          [
            "After implementation",
            "Reported outcome",
            "Client developers implement remediation; issue-specific non-recurrence and healthy pacing reported in my account experience.",
          ],
        ].map(([date, title, text]) => (
          <div key={date}>
            <span>{date}</span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="case-ownership">
        <h3>My contribution</h3>
        <p>
          Technical diagnosis, clear recommendations, campaign QA and sustained
          cross-team follow-through.
        </p>
        <h3>Implementation ownership</h3>
        <p>
          The client’s developers implemented the website change. The exact
          deployed rule or alternate-URL change is not documented in the
          available records.
        </p>
      </div>
      <details className="case-evidence">
        <summary>Evidence & attribution</summary>
        <p>
          Reviewed source material: 12 screenshots and a seven-slide supporting
          deck. Contemporary messages support the investigation, Google
          corroboration and operational follow-up. Advertiser scope, developer
          implementation and ongoing outcome reflect my reported account
          experience. Original correspondence and campaign identifiers are kept
          private.
        </p>
        <p>
          The system map explains the investigation; it is not a replay of
          platform logs or the client’s deployed configuration.
        </p>
        <a
          href="https://support.google.com/displayvideo/answer/7455777?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          DV360 crawlability guidance ↗
        </a>
      </details>
    </div>
  );
}
