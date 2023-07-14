export function debounce(f, d) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => f(...a), d);
  };
}
