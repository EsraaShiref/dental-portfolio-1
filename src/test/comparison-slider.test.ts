import { describe, expect, it } from "vitest";
import { comparisonKeyboardPosition, comparisonLabels, comparisonPositionFromPointer } from "@/lib/comparison-slider";

describe("Comparison slider rules", () => {
  it("hides Before within 15 percent of the left edge", () => {
    expect(comparisonLabels(0).before).toBe(false);
    expect(comparisonLabels(15).before).toBe(false);
    expect(comparisonLabels(15.1).before).toBe(true);
    expect(comparisonLabels(100).before).toBe(true);
  });
  it("hides After within 15 percent of the right edge", () => {
    expect(comparisonLabels(0).after).toBe(true);
    expect(comparisonLabels(84.9).after).toBe(true);
    expect(comparisonLabels(85).after).toBe(false);
    expect(comparisonLabels(100).after).toBe(false);
    expect(comparisonLabels(50)).toEqual({ before: true, after: true });
  });
  it("uses the full 0–100 reveal range even when dragging beyond the image", () => {
    expect(comparisonPositionFromPointer(20, 20, 320)).toBe(0);
    expect(comparisonPositionFromPointer(180, 20, 320)).toBe(50);
    expect(comparisonPositionFromPointer(340, 20, 320)).toBe(100);
    expect(comparisonPositionFromPointer(-100, 20, 320)).toBe(0);
    expect(comparisonPositionFromPointer(500, 20, 320)).toBe(100);
  });
  it("moves by 5 percent using Left/Right and stops at the endpoints", () => {
    expect(comparisonKeyboardPosition(50, "ArrowLeft")).toBe(45);
    expect(comparisonKeyboardPosition(50, "ArrowRight")).toBe(55);
    expect(comparisonKeyboardPosition(2, "ArrowLeft")).toBe(0);
    expect(comparisonKeyboardPosition(98, "ArrowRight")).toBe(100);
  });
  it("jumps to 0 and 100 using Home and End", () => {
    expect(comparisonKeyboardPosition(50, "Home")).toBe(0);
    expect(comparisonKeyboardPosition(50, "End")).toBe(100);
    expect(comparisonKeyboardPosition(50, "Tab")).toBeUndefined();
  });
});