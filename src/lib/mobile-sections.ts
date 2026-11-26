export const STORY_SWIPE_THRESHOLD = 50;
export function swipeDirection(dx: number, dy: number) {
  if (Math.abs(dx) < STORY_SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return 0;
  return dx < 0 ? 1 : -1;
}
export function toggleTrack(open: number | null, selected: number) {
  return open === selected ? null : selected;
}