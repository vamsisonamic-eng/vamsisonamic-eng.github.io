import React, { useState } from "react";
import { Quote, ArrowUpRight } from "lucide-react";
const testimonials = [
  {
    name: "Nicole Howell",
    initials: "NH",
    role: "Senior Specialist, Activation · New Stream Media",
    theme: "RESPONSIVE EXECUTION",
    quote:
      "Thank you, Bharath! Everything looks great. This has to be a record on quickest PoP turnaround ever!!",
    context:
      "Feedback on proof-of-performance reporting and activation support.",
    date: "September 2024",
  },
  {
    name: "Raymond Hall",
    initials: "RH",
    role: "Activation team · Dentsu",
    theme: "TEAM TRUST",
    quote: "amazing, we're lucky to have you on the team!",
    context: "Recognition during the pacing and optimization handover.",
    date: "March 2025",
  },
  {
    name: "Katherine Maring",
    initials: "KM",
    role: "Group Director · New Stream Media",
    theme: "OPTIMIZATION INITIATIVE",
    quote:
      "Very excited about this new optimization initiative. Thank you, Bharat and Raymond!",
    context: "Recognition of a collaborative optimization initiative.",
    date: "March 2025",
  },
  {
    name: "Chloe Mietelka",
    initials: "CM",
    role: "Activation team · Dentsu",
    theme: "KNOWLEDGE SHARING",
    quote: "Thanks for the extra context, super helpful!",
    context: "Feedback on DV360 bidding, targeting and pacing guidance.",
    date: "May 2026",
  },
  {
    name: "Kyle Lower",
    initials: "KL",
    role: "Activation team · Dentsu",
    theme: "TECHNICAL JUDGMENT",
    quote: "100% agree and appreciate your extra QA.",
    context: "Acknowledgment of landing-page tracking-parameter analysis.",
    date: "May 2026",
  },
];
testimonials.push(
  {
    name: "Chloe Nicholas",
    initials: "CN",
    role: "Activation team · Dentsu",
    theme: "PACING OWNERSHIP",
    quote:
      "Hello! Wonderful- thank you SO much for helping stay on top of this one!!!",
    context:
      "Appreciation for ongoing pacing updates and cross-platform monitoring.",
    date: "May 2026",
  },
  {
    name: "Chloe Nicholas",
    initials: "CN",
    role: "Activation team · Dentsu",
    theme: "TARGETING QA",
    quote: "Amazing - thanks for catching that and making those changes!!",
    context:
      "Feedback after identifying and correcting a GAM category-targeting key.",
    date: "Written feedback",
  },
  {
    name: "Nicole Howell",
    initials: "NH",
    role: "Activation team · Dentsu",
    theme: "PROACTIVE COMMUNICATION",
    quote: "Ah! I see you already did that. You're a rockstar!",
    context:
      "Recognition for proactively updating the optimization log after flagging a creative issue.",
    date: "Written feedback",
  },
  {
    name: "Raymond Hall",
    initials: "RH",
    role: "Activation team · Dentsu",
    theme: "PILOT RECOGNITION",
    quote:
      "also congrats on being selected for the 30b Pilot program! So well deserving",
    context:
      "Recognition of selection for a pilot program, separate from the later role promotion.",
    date: "October 2025",
  },
  {
    name: "Raymond Hall",
    initials: "RH",
    role: "Activation team · Dentsu",
    theme: "RESPONSIVE SUPPORT",
    quote: "you're doing amazing! and Happy Friday!",
    context: "Appreciation for accommodating an urgent campaign request.",
    date: "Written feedback",
  },
  {
    name: "Chloe Mietelka",
    initials: "CM",
    role: "Activation team · Dentsu",
    theme: "OPTIMIZATION SUPPORT",
    quote:
      "Thanks again for taking a look at this campaign, appreciate the support!!",
    context: "Feedback on reviewing DV360 bidding and pacing diagnostics.",
    date: "May 2026",
  },
  {
    name: "Raymond Hall",
    initials: "RH",
    role: "Activation team · Dentsu",
    theme: "REPORTING RELIABILITY",
    quote:
      "Hey Bharath! great work this week with the large number of PoP decks",
    context:
      "An excerpt from recognition of proof-of-performance reporting and fast campaign updates.",
    date: "Written feedback",
  },
);
export default function Testimonials() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="testimonials" className="section testimonials">
      <div className="section-top reveal">
        <div>
          <div className="eyebrow">WORDS FROM THE PEOPLE I WORK WITH</div>
          <h2>
            Trust, earned
            <br />
            <span>in the everyday.</span>
          </h2>
        </div>
        <p>
          Selected excerpts from colleague
          <br />
          and stakeholder feedback.
        </p>
      </div>
      <div className="testimonial-grid">
        {testimonials
          .slice(0, expanded ? testimonials.length : 5)
          .map((t, i) => (
            <figure
              className={`testimonial glass ${i < 5 ? "reveal" : "testimonial-extra"} ${i === 0 ? "testimonial-featured" : ""}`}
              key={t.theme}
            >
              <div className="testimonial-top">
                <span>{t.theme}</span>
                <Quote aria-hidden="true" size={i === 0 ? 38 : 24} />
              </div>
              <blockquote>“{t.quote}”</blockquote>
              <p className="testimonial-context">{t.context}</p>
              <figcaption>
                <span className="testimonial-avatar" aria-hidden="true">
                  {t.initials}
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                  <span className="testimonial-date">{t.date}</span>
                </span>
              </figcaption>
            </figure>
          ))}
      </div>
      <button
        className="button testimonial-expand"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded
          ? "Show selected testimonials"
          : `View all ${testimonials.length} testimonials`}{" "}
        <ArrowUpRight size={16} />
      </button>
      <div className="testimonial-foot">
        <span>
          Excerpts from written feedback · Titles reflect the source at the
          time.
        </span>
        <a className="text-link" href="#work">
          See the work behind the words <ArrowUpRight size={15} />
        </a>
      </div>
    </section>
  );
}
