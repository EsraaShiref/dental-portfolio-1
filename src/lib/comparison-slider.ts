export const clampComparisonPosition = (position: number) => Math.min(100, Math.max(0, position));

export function comparisonPositionFromPointer(clientX: number, left: number, width: number) {
  return width > 0 ? clampComparisonPosition(((clientX - left) / width) * 100) : 50;
}

export function comparisonLabels(position: number) {
  return { before: position > 15, after: position < 85 };
}

export function comparisonKeyboardPosition(position: number, key: string): number | undefined {
  switch (key) {
    case "ArrowLeft": return clampComparisonPosition(position - 5);
    case "ArrowRight": return clampComparisonPosition(position + 5);
    case "Home": return 0;
    case "End": return 100;
    default: return undefined;
  }
}