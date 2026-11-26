import { describe, expect, it } from "vitest";
import { MOBILE_NAV_HEIGHT, navigationOffset, scrollingDown } from "@/lib/mobile-navigation";

describe("mobile navigation rules", () => {
  it("uses the 64px navbar plus 8px anchor clearance below 768px", () => {
    expect(MOBILE_NAV_HEIGHT).toBe(64);
    expect(navigationOffset(360)).toBe(72);
    expect(navigationOffset(767)).toBe(72);
    expect(navigationOffset(768)).toBe(160);
  });
  it("hides the floating contact button only when scrolling down past the navbar", () => {
    expect(scrollingDown(80, 120)).toBe(true);
    expect(scrollingDown(120, 80)).toBe(false);
    expect(scrollingDown(20, 40)).toBe(false);
    expect(scrollingDown(120, 120)).toBe(false);
  });
});