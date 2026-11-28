import { describe, expect, it } from "vitest";
import { swipeDirection, STORY_SWIPE_THRESHOLD, toggleTrack } from "@/lib/mobile-sections";
describe("phone section interactions", () => {
  it("accepts a 50px horizontal story swipe but leaves vertical scrolling alone", () => {
    expect(STORY_SWIPE_THRESHOLD).toBe(50);
    expect(swipeDirection(-49, 0)).toBe(0);
    expect(swipeDirection(-50, 10)).toBe(1);
    expect(swipeDirection(50, 10)).toBe(-1);
    expect(swipeDirection(60, 80)).toBe(0);
  });
  it("opens only the selected track and allows it to close", () => {
    expect(toggleTrack(0, 1)).toBe(1);
    expect(toggleTrack(1, 1)).toBeNull();
    expect(toggleTrack(null, 0)).toBe(0);
  });
});