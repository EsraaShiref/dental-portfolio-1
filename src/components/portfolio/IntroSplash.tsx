import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { introVideoSrc } from "@/data/portfolio";

/** Full-screen intro video shown on every page load (skipped for reduced motion). */
export function IntroSplash() {
  const [state, setState] = useState<"open" | "closing" | "closed">("open");
  const [muted, setMuted] = useState(false);
  const [needsSound, setNeedsSound] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<Element | null>(null);

  const close = () => setState((s) => (s === "open" ? "closing" : s));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("closed");
      return;
    }
    previousFocus.current = document.activeElement;
    skipRef.current?.focus();
    const v = videoRef.current;
    if (!v) return;
    // Try with sound first; browsers may block unmuted autoplay, so fall back to muted.
    v.muted = false;
    v.volume = 1;
    v.play().catch(() => {
      v.muted = true;
      setNeedsSound(true);
      v.play().catch(() => close());
    });
  }, []);

  useEffect(() => {
    if (state === "closed") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [state]);

  useEffect(() => {
    if (state !== "closing") return;
    videoRef.current?.pause();
    const t = window.setTimeout(() => {
      setState("closed");
      const prev = previousFocus.current;
      if (prev instanceof HTMLElement && prev !== document.body) prev.focus();
      else document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
    }, 500);
    return () => window.clearTimeout(t);
  }, [state]);

  const turnSoundOn = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    setNeedsSound(false);
  };

  if (state === "closed") return null;
  return (
    <div
      className={state === "closing" ? "intro-splash is-closing" : "intro-splash"}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction video"
    >
      <div className="intro-frame">
        <video
          ref={videoRef}
          src={introVideoSrc}
          onClick={needsSound ? turnSoundOn : undefined}
          onVolumeChange={(e) => {
            setMuted(e.currentTarget.muted);
            if (!e.currentTarget.muted) setNeedsSound(false);
          }}
          playsInline
          preload="auto"
          onEnded={close}
          onError={close}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
          }}
        />
        <button
          type="button"
          className="intro-mute"
          onClick={() => {
            const v = videoRef.current;
            if (v) v.muted = !v.muted;
          }}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
      <button ref={skipRef} type="button" className="intro-skip" onClick={close}>
        Skip <X size={16} />
      </button>
      {needsSound && (
        <button type="button" className="intro-sound" onClick={turnSoundOn}>
          <VolumeX size={20} /> Tap to turn sound on
        </button>
      )}
      <p className="intro-caption">Dr. Mohamed Samy</p>
      <div className="intro-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}
