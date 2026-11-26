import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronsLeftRight, ImagePlus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  activeCategories,
  INITIAL_VISIBLE,
  caseAlt,
  categoryLabel,
  cases,
  filterCases,
  type Category,
  videos,
  type ComparisonCase,
  type DentalCase,
  type DentalVideo,
} from "@/data/portfolio";
import { Reveal, SectionHeading } from "./shared";
function CaseImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="image-fallback">
      <ImagePlus />
      <span>Add image</span>
    </div>
  ) : (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  );
}
export function BeforeAfterSlider({
  dentalCase,
  fit = "cover",
}: {
  dentalCase: ComparisonCase;
  /** "cover" fills the card edge to edge; "contain" keeps the whole film visible. */
  fit?: "cover" | "contain";
}) {
  const [position, setPosition] = useState(50);
  return (
    <div
      className={[
        "comparison",
        fit === "contain" && "comparison--contain",
        dentalCase.aspect === "square" && "comparison--square",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="comparison-image">
        <CaseImage src={dentalCase.after} alt={caseAlt(dentalCase, "after")} />
      </div>
      <div className="comparison-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <CaseImage src={dentalCase.before} alt={caseAlt(dentalCase, "before")} />
      </div>
      <span className="comparison-label before-label">Before</span>
      <span className="comparison-label after-label">After</span>
      <div className="comparison-line" style={{ left: `${position}%` }}>
        <span>
          <ChevronsLeftRight size={20} />
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="comparison-range"
        aria-label={`Before and after comparison for ${dentalCase.title}`}
      />
    </div>
  );
}
export function SingleCaseImage({
  dentalCase,
  fit = "cover",
}: {
  dentalCase: Extract<DentalCase, { kind: "single" }>;
  fit?: "cover" | "contain";
}) {
  return (
    <div
      className={[
        "comparison",
        fit === "contain" && "comparison--contain",
        dentalCase.aspect === "square" && "comparison--square",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="comparison-image">
        <CaseImage src={dentalCase.image} alt={dentalCase.alt} />
      </div>
    </div>
  );
}
export function CaseMedia({ dentalCase, fit }: { dentalCase: DentalCase; fit?: "cover" | "contain" }) {
  return dentalCase.kind === "single" ? (
    <SingleCaseImage dentalCase={dentalCase} {...(fit ? { fit } : {})} />
  ) : (
    <BeforeAfterSlider dentalCase={dentalCase} {...(fit ? { fit } : {})} />
  );
}
export function CaseCard({ dentalCase, onOpen }: { dentalCase: DentalCase; onOpen: () => void }) {
  return (
    <Reveal className="case-card">
      <CaseMedia dentalCase={dentalCase} />
      <Button
        variant="ghost"
        className="case-details"
        onClick={onOpen}
        aria-label={`Open ${dentalCase.title} case`}
      >
        <span>
          <span className="category-badge">{categoryLabel(dentalCase.category)}</span>
          <strong>{dentalCase.title}</strong>
        </span>
        <ArrowUpRight />
      </Button>
    </Reveal>
  );
}
export function VideoCard({ video, onOpen }: { video: DentalVideo; onOpen: () => void }) {
  return (
    <Reveal className="video-card">
      <Button
        variant="ghost"
        className="video-poster"
        onClick={onOpen}
        aria-label={`Play ${video.title}`}
      >
        <video src={`${video.src}#t=0.5`} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true" />
        <span className="video-play">
          <Play fill="currentColor" />
        </span>
      </Button>
      <div className="video-details">
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </Reveal>
  );
}
export function Lightbox({
  selection,
  onClose,
}: {
  selection: { kind: "case"; item: DentalCase } | { kind: "video"; item: DentalVideo } | null;
  onClose: () => void;
}) {
  const [videoMissing, setVideoMissing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <Dialog
      open={selection !== null}
      onOpenChange={(open) => {
        if (!open) {
          const v = videoRef.current;
          if (v) {
            v.pause();
            v.currentTime = 0;
          }
          onClose();
          setVideoMissing(false);
        }
      }}
    >
      <DialogContent className="media-lightbox">
        <DialogTitle>{selection?.item.title}</DialogTitle>
        <DialogDescription>
          {selection?.kind === "case" ? selection.item.category : selection?.item.description}
        </DialogDescription>
        {selection?.kind === "case" && (
          <CaseMedia key={selection.item.id} dentalCase={selection.item} fit="contain" />
        )}
        {selection?.kind === "video" && (
          <>
            <video
              key={selection.item.id}
              ref={videoRef}
              className="lightbox-video"
              controls
              playsInline
              autoPlay
              preload="metadata"
              onError={() => setVideoMissing(true)}
              src={selection.item.src}
              aria-label={selection.item.title}
            />
            {videoMissing && <p className="video-unavailable">Video not yet available.</p>}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
export function Portfolio() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [expanded, setExpanded] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const filtered = filterCases(cases, filter);
  const shown = expanded ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const [selection, setSelection] = useState<
    { kind: "case"; item: DentalCase } | { kind: "video"; item: DentalVideo } | null
  >(null);
  useEffect(() => {
    const onOpen = (e: Event) => {
      const item = cases.find((c) => c.id === (e as CustomEvent<string>).detail);
      if (item) setSelection({ kind: "case", item });
    };
    window.addEventListener("portfolio:open-case", onOpen);
    return () => window.removeEventListener("portfolio:open-case", onOpen);
  }, []);
  return (
    <section id="portfolio" className="section">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Portfolio"
          title="Cases & content"
          subtitle="Clinical work and dental education, brought together."
        />
        <Tabs defaultValue="cases" className="portfolio-tabs-root">
          <TabsList className="portfolio-tabs">
            <TabsTrigger value="cases">
              <ChevronsLeftRight size={16} />
              Before & After Cases
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Play size={15} />
              Videos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cases">
            <div className="filter-chips" aria-label="Filter dental cases">
              {(["All", ...activeCategories] as const).map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "default" : "ghost"}
                  size="sm"
                  aria-pressed={filter === category}
                  onClick={() => {
                    setFilter(category);
                    setExpanded(false);
                  }}
                >
                  {category === "All" ? "All" : categoryLabel(category)}
                </Button>
              ))}
            </div>
            <div className="case-grid" id="case-grid" ref={galleryRef}>
              {shown.map((item, index) => (
                <div
                  key={item.id}
                  className={index >= INITIAL_VISIBLE ? "case-reveal" : undefined}
                >
                  <CaseCard
                    dentalCase={item}
                    onOpen={() => setSelection({ kind: "case", item })}
                  />
                </div>
              ))}
            </div>
            {filtered.length > INITIAL_VISIBLE && (
              <div className="see-more">
                <Button
                  variant="outline"
                  aria-expanded={expanded}
                  aria-controls="case-grid"
                  onClick={() => {
                    if (expanded) {
                      galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                    setExpanded(!expanded);
                  }}
                >
                  {expanded ? "Show less" : "See more"}
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="videos">
            <div className="video-grid">
              {videos.map((item) => (
                <VideoCard
                  key={item.id}
                  video={item}
                  onOpen={() => setSelection({ kind: "video", item })}
                />
              ))}
            </div>
            <p className="videos-note">Dental content to educate and inspire patients.</p>
          </TabsContent>
        </Tabs>
        <Lightbox selection={selection} onClose={() => setSelection(null)} />
      </div>
    </section>
  );
}
