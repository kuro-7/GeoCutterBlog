export const IMAGE_WIDTHS = [480, 960, 1440] as const;

const R2_HOSTNAME = 'cdn.geocutter.com';

export function getAllowedImageUrl(value: string | undefined | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (
      url.protocol !== 'https:' ||
      url.hostname !== R2_HOSTNAME ||
      url.port ||
      url.username ||
      url.password ||
      !url.pathname.startsWith('/blog/')
    ) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function getTransformedImageUrl(source: string | undefined | null, width: number) {
  const safeSource = getAllowedImageUrl(source);
  if (!safeSource || !IMAGE_WIDTHS.includes(width as (typeof IMAGE_WIDTHS)[number])) {
    return null;
  }
  return `/cdn-cgi/image/width=${width},quality=80,format=auto,fit=scale-down,onerror=redirect/${safeSource}`;
}

export function getImageSrcSet(source: string | undefined | null) {
  const safeSource = getAllowedImageUrl(source);
  if (!safeSource) {
    return null;
  }
  return IMAGE_WIDTHS.map((width) => `${getTransformedImageUrl(safeSource, width)} ${width}w`).join(', ');
}
