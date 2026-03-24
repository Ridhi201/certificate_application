const BASE_WIDTH = 375; // same reference width as React Native

export function scale(size) {
  if (typeof window === "undefined") return size;
  return (window.innerWidth / BASE_WIDTH) * size;
}
