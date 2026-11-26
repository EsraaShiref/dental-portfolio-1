import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, Baby, Camera, ChevronDown, Crosshair, GraduationCap, Megaphone, Monitor, RotateCw, Scissors, Smile, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toggleTrack } from "@/lib/mobile-sections";
import { type CourseIcon, courses, courseTracks } from "@/data/profile";
import { SectionHeading } from "./shared";

const icons: Record<CourseIcon, typeof Activity> = {
  Activity, Baby, Camera, Crosshair, Megaphone, Monitor, RotateCw, Scissors, Smile, Sparkles, Zap,
};

function canLink() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function CourseOrbit({ active }: { active: string | null }) {
  return (
    <div className="course-orbit" data-active={active ?? undefined} aria-hidden="true">
      <span className="course-orbit-ring" />
      <span className="course-orbit-ring course-orbit-ring--inner" />
      <div className="course-orbit-spin">
        {courseTracks.map((track, index) => {
          const Icon = icons[track.icon];
          return (
            <span key={track.title} className="course-orbit-slot" style={{ ["--a" as string]: `${index * 90}deg` }}>
              <span className={`course-orbit-chip${active === track.title ? " is-active" : ""}`}><Icon /></span>
            </span>
          );
        })}
      </div>
      <span className="course-orbit-core"><GraduationCap /></span>
    </div>
  );
}

export function Courses() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [openTrack, setOpenTrack] = useState<number | null>(0);
  const [active, setActive] = useState<string | null>(null);
  const link = (title: string | null) => () => {
    if (reduced || (title && !canLink())) return;
    setActive(title);
  };
  return (
    <div className="courses">
      <SectionHeading align="center" eyebrow="CONTINUING EDUCATION" title="Courses & training"
        subtitle="Ongoing postgraduate training to stay current with modern dental techniques." />
      <div className="course-bento">
        <svg className="course-connectors" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="50" y1="0" x2="50" y2="100" /><line x1="0" y1="50" x2="100" y2="50" />
        </svg>
        <motion.div className="course-intro" role="img" aria-label="Continuing education" initial={reduced ? false : { opacity: 0, scale: 0.8 }} animate={reduced ? { opacity: 1, scale: 1 } : false}
          whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduced ? 0 : 0.45 }}>
          <CourseOrbit active={active} />
        </motion.div>
        {courseTracks.map((track, index) => {
          const Icon = icons[track.icon];
          const dx = index % 2 === 0 ? -24 : 24;
          const dy = index < 2 ? -24 : 24;
          return (
            <motion.div key={track.title} className={`course-cell course-cell--${index}`} initial={reduced ? false : { opacity: 0, x: dx, y: dy }}
              animate={reduced ? { opacity: 1, x: 0, y: 0 } : false} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.3 + index * 0.06 }}>
              <article className="course-track" tabIndex={mobile ? undefined : 0}
                onMouseEnter={link(track.title)} onMouseLeave={link(null)} onFocus={link(track.title)} onBlur={link(null)}>
                {mobile ? <Button variant="ghost" className="course-accordion-trigger" aria-expanded={openTrack === index} aria-controls={`course-list-${index}`}
                  onClick={() => setOpenTrack((open) => toggleTrack(open, index))}>
                  <span className="course-track-icon"><Icon aria-hidden="true" /></span>
                  <span className="course-accordion-copy"><span className="course-accordion-title">{track.title}</span><span>{track.descriptor}</span></span>
                  <ChevronDown aria-hidden="true" />
                </Button> : <div className="course-track-header">
                  <span className="course-track-icon"><Icon aria-hidden="true" /></span>
                  <div><h3>{track.title}</h3><span>{track.descriptor}</span></div>
                </div>}
                <motion.div id={`course-list-${index}`} className={mobile ? "course-accordion-panel" : undefined}
                  inert={mobile && openTrack !== index} aria-hidden={mobile && openTrack !== index ? true : undefined}
                  initial={false} animate={mobile ? { height: openTrack === index ? "auto" : 0, opacity: openTrack === index ? 1 : 0 } : { height: "auto", opacity: 1 }}
                  transition={{ duration: reduced ? 0 : 0.25 }}>
                <motion.ul initial={reduced ? false : "hidden"} animate={reduced ? "visible" : false} whileInView="visible" viewport={{ once: true, amount: 0.15 }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: reduced ? 0 : (index + 1) * 0.06 + 0.15 } } }}>
                  {track.courseNames.map((name) => {
                    const course = courses.find((item) => item.title === name);
                    if (!course) return null;
                    const RowIcon = icons[course.icon];
                    return <motion.li key={name} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reduced ? 0 : 0.25 }}>
                      <div className="course-row"><span className="course-row-icon"><RowIcon aria-hidden="true" /></span><span>{name}</span></div>
                    </motion.li>;
                  })}
                </motion.ul>
                </motion.div>
              </article>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
