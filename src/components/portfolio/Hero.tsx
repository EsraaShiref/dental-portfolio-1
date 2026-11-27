import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, ChevronDown, FileCheck, GraduationCap, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { heroStats } from "@/data/hero";
import { AppointmentButton } from "./shared";

function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (time: number) => {
      const progress = Math.min((time - start) / 1100, 1);
      setCount(Math.round((1 - (1 - progress) ** 3) * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);
  return <span ref={ref} aria-hidden="true">{(reduced ? value : count).toString().padStart(2, "0")}</span>;
}

const chipIcons = [GraduationCap, BadgeCheck, ShieldCheck, FileCheck];

export function Hero() {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const entrance = (step: number) => ({
    initial: reduced ? false as const : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.5, delay: reduced ? 0 : step * 0.08 },
  });
  return (
    <section id="home" className="hero">
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.div {...entrance(0)} className="hero-badge">
            <span aria-hidden="true" />General Dentist • Dental Content Creator
          </motion.div>
          <h1>
            <motion.span {...entrance(1)} className="hero-title-line">Precise dentistry.</motion.span>
            <motion.span {...entrance(2)} className="hero-title-line hero-title-accent">
              Patient-centered <span className="hero-care">care.
                <svg viewBox="0 0 180 16" fill="none" aria-hidden="true" preserveAspectRatio="none">
                  <path d="M3 9C22 1 36 14 55 7S87 13 107 6s36 6 69-2" pathLength="1" />
                </svg>
              </span>
            </motion.span>
          </h1>
          <motion.div {...entrance(3)} className="hero-text">
            <p className="hero-subheading">General Dentist focused on esthetic dentistry, endodontics and patient-centered care.</p>
            <p className="hero-description">Delivering precise, comfortable and natural-looking dental results — with care that puts you first.</p>
          </motion.div>
          <motion.div {...entrance(4)} className="hero-actions">
            <AppointmentButton />
            <Button variant="outline" size="lg" asChild><a href="#portfolio">View My Work<ArrowUpRight /></a></Button>
          </motion.div>
          <motion.div {...entrance(5)} className="credential-chips">
            {profile.chips.map((chip, index) => {
              const Icon = chipIcons[index];
              return <span key={chip}>{Icon && <Icon aria-hidden="true" />}{chip}</span>;
            })}
          </motion.div>
          <motion.dl {...entrance(6)} className="hero-stats">
            {heroStats.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd aria-label={`${stat.value}`}><Count value={stat.value} /></dd></div>)}
          </motion.dl>
        </div>
        <motion.div className="hero-portrait" initial={reduced ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.16 }}>
          <img src={profile.portrait} alt="Dr. Mohamed Samy wearing navy dental scrubs" loading="eager" fetchPriority="high" width="768" height="841" />
          <div className="portrait-label"><span aria-hidden="true" />PRECISION MEETS COMPASSION</div>
          <div className="portrait-license"><BadgeCheck aria-hidden="true" /><span>Saudi License Holder</span></div>
          <div className="portrait-card">
            <span className="icon-tile"><Sparkles aria-hidden="true" /></span>
            <div><strong>Esthetic &amp; Restorative</strong><span>Dentistry with a personal touch</span></div>
          </div>
          <div className="portrait-location"><MapPin size={14} aria-hidden="true" /><span>{profile.location}</span></div>
        </motion.div>
      </div>
      <a href="#about" className={`hero-scroll${scrolled ? " hero-scroll--hidden" : ""}`} tabIndex={scrolled ? -1 : 0} aria-hidden={scrolled ? true : undefined}>Scroll<ChevronDown size={18} /></a>
    </section>
  );
}