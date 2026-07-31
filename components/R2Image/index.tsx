import { getImageSrcSet, getTransformedImageUrl } from '@/libs/image';

type Props = {
  src?: string;
  alt: string;
  className?: string;
  sizes: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  fallbackWidth?: 480 | 960 | 1440;
};

export default function R2Image({
  src,
  alt,
  className,
  sizes,
  loading = 'lazy',
  fetchPriority,
  fallbackWidth = 960,
}: Props) {
  const transformedSrc = getTransformedImageUrl(src, fallbackWidth);
  const srcSet = getImageSrcSet(src);

  if (!transformedSrc || !srcSet) {
    return (
      <span className={className} role="img" aria-label={`画像を表示できません: ${alt}`}>
        画像を表示できません: {alt}
      </span>
    );
  }

  return (
    <img
      src={transformedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
    />
  );
}
