// One shared, reference-counted lock for dialogs and mobile navigation.
let locks = 0;
let previousOverflow = '';
let previousPadding = '';
export function lockScroll() {
  if (locks++ === 0) {
    previousOverflow = document.body.style.overflow;
    previousPadding = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    }
  };
}
