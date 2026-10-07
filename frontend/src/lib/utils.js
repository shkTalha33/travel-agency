/**
 * Utility function to combine class names cleanly.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
