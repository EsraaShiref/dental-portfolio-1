import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX, X } from "lucide-react";
import { introPosterSrc, introVideoSrc } from "@/data/portfolio";

const MP4_TYPE = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

/** Full-screen intro video shown on every page load. Starts muted (iOS-safe); a tap enables sound. */
export function IntroSplash() {
  const [state, setState] = useState<"open" | "closing" | "closed">("open");
  const [muted, setMuted] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<Element | null>(null);
  const playingRef = useRef(false);

  const close = () => setState((s) => (s === "open" ? "closing" : s));

  useEffect(() => {
    previousFocus.current = document.activeElement;
    skipRef.current?.focus();
    const v = videoRef.current;
    if (!v) return;
    if (v.canPlayType(MP4_TYPE) === "") {
      close();
      return;
    }
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.playsInline = true;
    const timer = window.setTimeout(() => {
      if (!playingRef.current) setNeedsTap(true);
    }, 1500);
    v.play().catch(() => setNeedsTap(true));
    return () => window.clearTimeout(timer);
  }, []);

  // Position-safe scroll lock (works in iOS Safari) + Escape to close.
  useEffect(() => {
    if (state === "closed") return;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      Object.assign(body.style, prev);
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [state === "closed"]);

  useEffect(() => {
    if (state !== "closing") return;
    videoRef.current?.pause();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => {
      setState("closed");
      const prev = previousFocus.current;
      if (prev instanceof HTMLElement && prev !== document.body) prev.focus();
      else document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
    }, reduce ? 0 : 500);
    return () => window.clearTimeout(t);
  }, [state]);

  const playWithSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    setNeedsTap(false);
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => setNeedsTap(true));
    });
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
          poster={introPosterSrc}
          muted
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          onClick={muted || needsTap ? playWithSound : undefined}
          onPlaying={() => {
            playingRef.current = true;
            setNeedsTap(false);
          }}
          onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
          onEnded={close}
          onError={close}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
          }}
        >
          <source src={introVideoSrc} type="video/mp4" onError={close} />
        </video>
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
      {needsTap ? (
        <button type="button" className="intro-play" onClick={playWithSound}>
          <span className="intro-play-circle">
            <Play size={30} fill="currentColor" />
          </span>
          Tap to play
        </button>
      ) : (
        muted && (
          <button type="button" className="intro-sound" onClick={playWithSound}>
            <VolumeX size={20} /> Tap to turn sound on
          </button>
        )
      )}
      <p className="intro-caption">Dr. Mohamed Samy</p>
      <div className="intro-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}
