import type { SyntheticEvent } from 'react';

// Keep the fallback embedded so a failed remote image never triggers another
// request for an asset that may not exist in the deployment.
export const FALLBACK_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23f1f5f9"/%3E%3Cg fill="none" stroke="%2394a3b8" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="285" y="120" width="230" height="210" rx="24"/%3E%3Ccircle cx="355" cy="190" r="25"/%3E%3Cpath d="m310 295 72-72 48 48 36-36 24 24"/%3E%3C/g%3E%3C/svg%3E';

export const handleImageError = (
  event: SyntheticEvent<HTMLImageElement>
) => {
  const image = event.currentTarget;

  // Prevent an error loop if a browser cannot render the embedded fallback.
  image.onerror = null;
  image.src = FALLBACK_IMAGE;
};
