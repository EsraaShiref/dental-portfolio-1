import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { swipeDirection } from "@/lib/mobile-sections";
import { Button } from "@/components/ui/button";
import { cases } from "@/data/portfolio";
import { stories, STORY_DURATION_MS, type PatientStory } from "@/data/stories";
import { CaseMedia } from "./Portfolio";
import { Reveal } from "./shared";

const firstName = (story: PatientStory) => story.id.startsWith("demo-") ? story.name : (story.name.trim().split(/\s+/)[0] ?? story.name);

export function Stories({ items = stories, demo = false }: { items?: PatientStory[]; demo?: boolean }) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { amount: 0.15 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const previousActive = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const current = items[active] ?? items[0];
  const auto = !mobile && !reduced && inView && !hovered && !focused && items.length > 1;
  const select = (index: number) => {
    elapsedRef.current = 0;
    setElapsed(0);
    setActive(index);
    setExpanded(false);
  };
  useEffect(() => {
    if (!auto) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsedRef.current += now - last;
      last = now;
      if (elapsedRef.current >= STORY_DURATION_MS) {
        elapsedRef.current = 0;
        setActive((index) => (index + 1) % items.length);
      }
      setElapsed(elapsedRef.current);
    }, 50);
    return () => window.clearInterval(timer);
  }, [auto, items.length]);
  useEffect(() => {
    if (previousActive.current === active) return;
    previousActive.current = active;
    if (!mobile) tabs.current[active]?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "nearest", inline: "nearest" });
  }, [active, reduced, mobile]);
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight": case "ArrowDown": next = (index + 1) % items.length; break;
      case "ArrowLeft": case "ArrowUp": next = (index - 1 + items.length) % items.length; break;
      case "Home": next = 0; break;
      case "End": next = items.length - 1; break;
      default: return;
    }
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus({ preventScroll: true });
  };
  if (!current) return null;
  const dentalCase = current.caseId === undefined ? undefined : cases.find((item) => item.id === current.caseId);
  const hasPicker = items.length > 1;
  const openCase = () => {
    if (!dentalCase) return;
    document.getElementById("portfolio")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    window.dispatchEvent(new CustomEvent("portfolio:open-case", { detail: dentalCase.id }));
  };
  return (
    <section id="stories" ref={section} className="section section-alt" aria-labelledby="stories-title">
      <div className="container">
        {demo && <span className="stories-demo">Demo content</span>}
        <Reveal className="section-heading section-heading--center stories-heading">
          <h2 id="stories-title">Patient Stories</h2>
          <span className="stories-bar" aria-hidden="true" />
          <p>Real feedback from patients who experienced precision, care, and comfort first-hand.</p>
        </Reveal>
        <div className={hasPicker ? "stories-layout" : "stories-layout stories-layout--single"}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
          <div className={`story-feature${expanded ? " story-feature--expanded" : ""}`} role={mobile ? "region" : "tabpanel"} id="story-panel"
            onTouchStart={(event) => { const touch = event.touches[0]; if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY }; }}
            onTouchEnd={(event) => {
              const start = touchStart.current; const touch = event.changedTouches[0]; touchStart.current = null;
              if (!mobile || !start || !touch || !hasPicker) return;
              const direction = swipeDirection(touch.clientX - start.x, touch.clientY - start.y);
              if (direction) select((active + direction + items.length) % items.length);
            }} onTouchCancel={() => { touchStart.current = null; }}
            aria-labelledby={!mobile && hasPicker ? `story-tab-${current.id}` : undefined}
            aria-label={mobile || !hasPicker ? `Story from ${firstName(current)}` : undefined} aria-live={mobile ? "polite" : "off"} tabIndex={0}>
            <div className="story-stage">
            {!mobile && !dentalCase && !current.image && items.map((story) => <figure key={`sizer-${story.id}`} className="story-quote story-sizer" aria-hidden="true">
              <Quote className="story-quote-icon" />
              <blockquote><p>“{story.quote}”</p></blockquote>
              <figcaption><strong>{firstName(story)}</strong><span className="story-treatment">{story.treatment}</span></figcaption>
            </figure>)}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={current.id} className={dentalCase || current.image ? "story-feature-content story-feature-content--media" : "story-feature-content"}
                initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : 0.25 }}>
                <figure className="story-quote">
                  <Quote className="story-quote-icon" aria-hidden="true" />
                  <blockquote><p id="active-story-quote">“{current.quote}”</p></blockquote>
                  {mobile && <Button variant="link" className="story-read-more" aria-expanded={expanded} aria-controls="active-story-quote" onClick={() => setExpanded((value) => !value)}>{expanded ? "Show less" : "Read more"}</Button>}
                  <figcaption><strong>{firstName(current)}</strong><span className="story-treatment">{current.treatment}</span></figcaption>
                </figure>
                {dentalCase ? <div className="story-case"><CaseMedia key={dentalCase.id} dentalCase={dentalCase} />
                  <Button variant="link" className="story-case-link" onClick={openCase}>View full case <ArrowUpRight /></Button>
                </div> : current.image ? <img className="story-photo" src={current.image} alt={`Shared by ${firstName(current)}`} loading="lazy" /> : null}
              </motion.div>
            </AnimatePresence>
            </div>
            {hasPicker && !mobile && <motion.span className="story-progress" aria-hidden="true" animate={{ scaleX: elapsed / STORY_DURATION_MS }} transition={{ duration: 0 }} />}
          </div>
          {hasPicker && mobile ? <div className="story-mobile-pager">
            <div className="story-pager-controls">
              <Button variant="ghost" size="icon" aria-label="Previous story" onClick={() => select((active - 1 + items.length) % items.length)}><ChevronLeft /></Button>
              {items.map((story, index) => <Button key={story.id} variant="ghost" size="icon" className="story-pager-dot" aria-label={`Show story ${index + 1}`} aria-current={index === active ? "true" : undefined} onClick={() => select(index)}><span aria-hidden="true" /></Button>)}
              <Button variant="ghost" size="icon" aria-label="Next story" onClick={() => select((active + 1) % items.length)}><ChevronRight /></Button>
            </div><span className="story-pager-counter">{active + 1} / {items.length}</span>
          </div> : hasPicker && <div className="story-picker" role="tablist" aria-label="Patient stories">
            {items.map((story, index) => <Button key={story.id} variant="ghost" role="tab"
              id={`story-tab-${story.id}`} aria-controls="story-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1}
              ref={(element) => { tabs.current[index] = element; }}
              className="story-picker-row" onClick={() => select(index)} onKeyDown={(event) => onKey(event, index)}>
              <span className="story-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="story-picker-copy"><strong>{firstName(story)}</strong><span>{story.treatment}</span><small>{story.quote}</small></span>
            </Button>)}
          </div>}
        </div>
      </div>
    </section>
  );
}
