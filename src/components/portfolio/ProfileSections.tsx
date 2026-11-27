import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCheck,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Monitor,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { education, experience, experienceHighlights, profile, skillGroups } from "@/data/profile";
import { AppointmentButton, Reveal, SectionHeading } from "./shared";
import { Courses } from "./Courses";
function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCount(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (time: number) => {
      const progress = Math.min((time - start) / 1100, 1);
      setCount(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);
  return <span ref={ref}>{count.toString().padStart(2, "0")}</span>;
}
export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <Reveal className="hero-copy">
          <div className="hero-badge">
            <span />
            General Dentist • Dental Content Creator
          </div>
          <h2 className="hero-headline">
            <span className="hero-headline-line">Precise dentistry.</span>
            <span className="hero-headline-line hero-headline-accent"><span className="hero-patient-centered">Patient‑centered</span> care.</span>
          </h2>
          <p className="hero-subheading">
            General Dentist focused on esthetic dentistry, endodontics and patient-centered care.
          </p>
          <p className="hero-description">
            Delivering precise, comfortable and natural-looking dental results — with care that puts you first.
          </p>
          <div className="hero-actions">
            <AppointmentButton />
            <Button variant="outline" size="lg" asChild>
              <a href="#portfolio">
                View My Work
                <ArrowUpRight />
              </a>
            </Button>
          </div>
          <div className="credential-chips">
            {profile.chips.map((chip) => (
              <span key={chip}>
                <BadgeCheck />
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal className="hero-portrait">
          <div className="portrait-label">
            <span />
            PRECISION MEETS COMPASSION
          </div>
          <img
            src={profile.portrait}
            alt="Dr. Mohamed Samy wearing navy dental scrubs"
            fetchPriority="high"
            width="768"
            height="841"
          />
          <div className="portrait-card">
            <span className="icon-tile">
              <Sparkles />
            </span>
            <div>
              <strong>Esthetic & Restorative</strong>
              <span>Dentistry with a personal touch</span>
            </div>
            <BadgeCheck className="text-accent" />
          </div>
          <div className="portrait-location">
            <MapPin size={14} /> Tanta, Egypt
          </div>
        </Reveal>
      </div>
      <div className="hero-bottom container">
        <div className="stat">
          <strong>
            <Count value={3} />
          </strong>
          <span>
            Clinics
            <br />
            <b>Clinical experience</b>
          </span>
        </div>
        <div className="stat">
          <strong>
            <Count value={19} />
          </strong>
          <span>
            Professional skills
            <br />
            <b>Clinical & digital expertise</b>
          </span>
        </div>
        <div className="hero-license">
          <ShieldCheck />
          <span>
            Saudi licensed.
            <br />
            <b>Ready for the next chapter.</b>
          </span>
        </div>
        <a href="#about" className="explore-link">
          GET TO KNOW ME
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}
export function About() {
  const highlightIcons = [Sparkles, Stethoscope, Monitor, HeartHandshake];
  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <Reveal className="about-image">
          <img
            src={profile.portrait}
            alt="Dr. Mohamed Samy, General Dentist in Tanta"
            loading="lazy"
            width="768"
            height="841"
          />
          <div className="about-image-caption">
            <span className="eyebrow">A PATIENT-FIRST APPROACH</span>
            <h3>
              Care that goes
              <br />
              beyond the clinic.
            </h3>
            <span>
              <MapPin size={15} />
              Tanta, Egypt
            </span>
          </div>
        </Reveal>
        <div>
          <SectionHeading
            eyebrow="About Me"
            title="Dedicated to healthy, confident smiles"
          />
          <Reveal>
            <p className="bio">{profile.bio}</p>
            <div className="highlight-grid">
              {profile.highlights.map((text, index) => {
                const Icon = highlightIcons[index];
                return (
                  <div className="highlight" key={text}>
                    {Icon && <Icon />}
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
            <div className="credentials-block">
              <h3>
                <ShieldCheck />
                Credentials & Licenses
              </h3>
              <div>
                {profile.credentials.map((text) => (
                  <span key={text}>
                    <CheckCheck />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
export function Education() {
  return (
    <section id="education" className="section section-alt">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Education & Experience"
          title="Academic background & clinical journey"
          subtitle="A strong foundation. Hands-on clinical care."
        />
        <div className="education-layout">
          <Reveal>
            <div className="education-card">
              <span className="icon-tile">
                <GraduationCap />
              </span>
              <span className="eyebrow">EDUCATION</span>
              <h3>{education.degree}</h3>
              <p>{education.university}</p>
              <span className="education-line" />
              <span className="degree-badge">
                <Check />
                BDS · General Dentistry
              </span>
            </div>
          </Reveal>
          <div className="timeline">
            {experience.map((entry, i) => (
              <Reveal key={entry.id} className="timeline-item">
                <span className="timeline-icon">
                  <Building2 />
                </span>
                <div>
                  <span className="timeline-number">CLINICAL EXPERIENCE / 0{i + 1}</span>
                  <h3>{entry.clinic}</h3>
                  <span className="role">{entry.role}</span>
                  {entry.period && <span className="timeline-period type-small">{entry.period}</span>}
                  {entry.description && <p>{entry.description}</p>}
                  {experienceHighlights(entry).length > 0 && (
                    <ul className="timeline-highlights">
                      {experienceHighlights(entry).map((highlight, index) => (
                        <li key={`${entry.id}-${index}`}>
                          <Check aria-hidden="true" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Courses />
      </div>
    </section>
  );
}
export function Skills() {
  const icons = [Stethoscope, ShieldCheck, Monitor];
  return (
    <section id="skills" className="section section-alt">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Skills"
          title="Clinical expertise & modern tools"
          subtitle="A considered blend of clinical care, digital precision and clear communication."
        />
        <div className="skills-grid">
          {skillGroups.map((group, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={group.title} className="skill-card">
                <div className="skill-header">
                  <span className="icon-tile">{Icon && <Icon />}</span>
                  <span className="skill-number">0{i + 1}</span>
                </div>
                <h3>{group.title}</h3>
                <p>{group.subtitle}</p>
                <div className="skill-pills">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
