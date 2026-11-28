export const MOBILE_NAV_HEIGHT = 64;
export const MOBILE_ANCHOR_OFFSET = MOBILE_NAV_HEIGHT + 8;
export function navigationOffset(width: number) {
  return width < 768 ? MOBILE_ANCHOR_OFFSET : 160;
}
export function scrollingDown(previous: number, current: number) {
  return current > previous && current > MOBILE_NAV_HEIGHT;
}