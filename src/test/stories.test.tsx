import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type PatientStory, allStories, visibleStories, stories, STORY_DURATION_MS } from "@/data/stories";
import { Stories } from "@/components/portfolio/Stories";

const motionState = vi.hoisted(() => ({ inView: true, reduced: false, mobile: false }));
vi.mock("@/hooks/use-mobile", () => ({ useIsMobile: () => motionState.mobile }));
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const make = (tag: string) => React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) => {
    const { initial, animate, exit, transition, whileInView, viewport, ...rest } = props;
    return React.createElement(tag, { ...rest, ref });
  });
  return {
    motion: { div: make("div"), span: make("span") },
    AnimatePresence: ({ children }: { children: import("react").ReactNode }) => children,
    useInView: () => motionState.inView,
    useReducedMotion: () => motionState.reduced,
  };
});
vi.mock("@/components/portfolio/Portfolio", () => ({ CaseMedia: () => null }));

const items: PatientStory[] = [
  { verified: true, id: "test-1", name: "One K.", quote: "Test input one", treatment: "Restorative", caseId: "restorative-1" },
  { verified: true, id: "test-2", name: "Two K.", quote: "Test input two", treatment: "Endodontics" },
  { verified: true, id: "test-3", name: "Three K.", quote: "Test input three", treatment: "Check-up" },
];
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));
const selected = () => screen.getAllByRole("tab").findIndex((tab) => tab.getAttribute("aria-selected") === "true");

beforeEach(() => {
  motionState.inView = true;
  motionState.reduced = false;
  motionState.mobile = false;
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "performance"] });
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("Patient Stories rules", () => {
  it("never autoplays on phones while pager selection remains manual", () => {
    motionState.mobile = true;
    render(<Stories items={items} />);
    advance(36000);
    expect(screen.getByRole("region", { name: "Story from One" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next story" }));
    expect(screen.getByRole("region", { name: "Story from Two" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Previous story" }));
    expect(screen.getByRole("region", { name: "Story from One" })).toBeInTheDocument();
  });
  it("resets the phone quote expansion when the story changes", () => {
    motionState.mobile = true;
    render(<Stories items={items} />);
    fireEvent.click(screen.getByRole("button", { name: "Read more" }));
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "Next story" }));
    expect(screen.getByRole("button", { name: "Read more" })).toHaveAttribute("aria-expanded", "false");
  });
  it("shows the four unverified stories only while the unverified flag is on", () => {
    expect(stories.map((story) => story.id)).toEqual(["story-1", "story-2", "story-3", "story-4"]);
    expect(visibleStories(allStories, false)).toEqual([]);
  });
  it("renders nothing when real stories are empty", () => {
    const { container } = render(<Stories items={[]} demo={false} />);
    expect(container.childElementCount).toBe(0);
  });
  it("hides the picker when there is just one real story", () => {
    render(<Stories items={items.slice(0, 1)} demo={false} />);
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
  });
  it("advances after exactly twelve seconds and wraps after the last story", () => {
    expect(STORY_DURATION_MS).toBe(12000);
    render(<Stories items={items} demo={false} />);
    advance(11950); expect(selected()).toBe(0);
    advance(50); expect(selected()).toBe(1);
    advance(STORY_DURATION_MS); expect(selected()).toBe(2);
    advance(STORY_DURATION_MS); expect(selected()).toBe(0);
  });
  it("pauses on hover and resumes the remaining duration", () => {
    const { container } = render(<Stories items={items} demo={false} />);
    const layout = container.querySelector(".stories-layout");
    if (!layout) throw new Error("Missing story layout");
    advance(6000); fireEvent.mouseEnter(layout); advance(20000);
    expect(selected()).toBe(0);
    fireEvent.mouseLeave(layout); advance(6000); expect(selected()).toBe(1);
  });
  it("pauses while focus is inside the section", () => {
    render(<Stories items={items} demo={false} />);
    fireEvent.focus(screen.getByRole("tabpanel"));
    advance(24000); expect(selected()).toBe(0);
    fireEvent.blur(screen.getByRole("tabpanel"));
    advance(STORY_DURATION_MS); expect(selected()).toBe(1);
  });
  it("pauses when out of view", () => {
    const { rerender } = render(<Stories items={items} demo={false} />);
    advance(6000);
    motionState.inView = false;
    rerender(<Stories items={items} demo={false} />);
    advance(24000); expect(selected()).toBe(0);
    motionState.inView = true;
    rerender(<Stories items={items} demo={false} />);
    advance(6000); expect(selected()).toBe(1);
  });
  it("restarts the timer when a story is selected manually", () => {
    render(<Stories items={items} demo={false} />);
    advance(11000);
    const tab = screen.getAllByRole("tab")[2];
    if (!tab) throw new Error("Missing third tab");
    fireEvent.click(tab);
    advance(1000); expect(selected()).toBe(2);
    advance(11000); expect(selected()).toBe(0);
  });
  it("disables autoplay for reduced motion but permits arrow-key selection", () => {
    motionState.reduced = true;
    render(<Stories items={items} demo={false} />);
    advance(24000); expect(selected()).toBe(0);
    const tab = screen.getAllByRole("tab")[0];
    if (!tab) throw new Error("Missing first tab");
    fireEvent.keyDown(tab, { key: "ArrowRight" }); expect(selected()).toBe(1);
    expect(document.activeElement).toBe(screen.getAllByRole("tab")[1]);
  });
  it("opens the selected story's exact case through the existing portfolio event", () => {
    const listener = vi.fn();
    window.addEventListener("portfolio:open-case", listener);
    render(<Stories items={items.slice(0, 1)} demo={false} />);
    fireEvent.click(screen.getByRole("button", { name: /View full case/ }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0]?.[0] as CustomEvent<string>).detail).toBe("restorative-1");
    window.removeEventListener("portfolio:open-case", listener);
  });
});