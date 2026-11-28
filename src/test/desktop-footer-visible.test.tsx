import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDesktopFooterVisible } from "@/hooks/use-desktop-footer-visible";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); document.body.innerHTML = ""; });

function setup(desktop: boolean) {
  document.body.innerHTML = "<footer></footer>";
  let callback: IntersectionObserverCallback | undefined;
  const observe = vi.fn();
  const disconnect = vi.fn();
  const media = { matches: desktop, addEventListener: vi.fn(), removeEventListener: vi.fn() };
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(cb: IntersectionObserverCallback, options: IntersectionObserverInit) {
      callback = cb;
      expect(options.threshold).toBe(0.1);
    }
    observe = observe;
    disconnect = disconnect;
  });
  const hook = renderHook(useDesktopFooterVisible);
  const emit = (ratio: number) => act(() => {
    callback?.([{ isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry], {} as IntersectionObserver);
  });
  return { ...hook, emit, disconnect };
}

describe("Desktop footer visibility", () => {
  it("hides controls at the requested 0.1 threshold and restores them below it", () => {
    const hook = setup(true);
    hook.emit(0.09);
    expect(hook.result.current).toBe(false);
    hook.emit(0.1);
    expect(hook.result.current).toBe(true);
    hook.emit(0);
    expect(hook.result.current).toBe(false);
    hook.unmount();
    expect(hook.disconnect).toHaveBeenCalledOnce();
  });
  it("does not hide mobile controls when the footer is visible", () => {
    const hook = setup(false);
    hook.emit(1);
    expect(hook.result.current).toBe(false);
  });
});