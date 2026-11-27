import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFooterVisible } from "@/hooks/use-footer-visible";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); document.body.innerHTML = ""; });

function setup(width: number) {
  vi.stubGlobal("innerWidth", width);
  document.body.innerHTML = "<footer></footer>";
  let callback: IntersectionObserverCallback | undefined;
  const observe = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal("IntersectionObserver", class {
    constructor(cb: IntersectionObserverCallback, options: IntersectionObserverInit) {
      callback = cb;
      expect(options.threshold).toBe(0.1);
    }
    observe = observe;
    disconnect = disconnect;
  });
  const hook = renderHook(useFooterVisible);
  const emit = (ratio: number) => act(() => {
    callback?.([{ isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry], {} as IntersectionObserver);
  });
  return { ...hook, emit, disconnect };
}

describe("Footer visibility at every breakpoint", () => {
  it.each([360, 390, 414, 768, 1024, 1440])("hides controls at the 0.1 threshold and restores them at %ipx", (width) => {
    const hook = setup(width);
    hook.emit(0.09);
    expect(hook.result.current).toBe(false);
    hook.emit(0.1);
    expect(hook.result.current).toBe(true);
    hook.emit(0);
    expect(hook.result.current).toBe(false);
    hook.unmount();
    expect(hook.disconnect).toHaveBeenCalledOnce();
  });
});