import { useState, useEffect } from 'react';
import { getImage } from '../data/imageStorage';

interface ImageLoaderProps {
  imageUrl?: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

/**
 * ImageLoader - Loads images from IndexedDB or regular URLs
 * Handles both "indexeddb:imageId" and regular "https://..." URLs
 */
export function ImageLoader({ imageUrl, alt, className, onError }: ImageLoaderProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | undefined>(imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      if (!imageUrl) {
        setResolvedUrl(undefined);
        setHasError(false);
        return;
      }

      // If it's an IndexedDB reference, load from IndexedDB
      if (imageUrl.startsWith('indexeddb:')) {
        const imageId = imageUrl.replace('indexeddb:', '');
        setIsLoading(true);
        
        try {
          const dataUrl = await getImage(imageId);
          if (dataUrl) {
            setResolvedUrl(dataUrl);
            setHasError(false);
          } else {
            // Image not found in IndexedDB - silently fallback (don't spam console)
            setResolvedUrl(undefined);
            setHasError(true);
          }
        } catch (error) {
          // Silent error handling - just show fallback
          setResolvedUrl(undefined);
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      } else if (imageUrl.startsWith('https://drive.google.com/') || imageUrl.startsWith('https://lh3.googleusercontent.com/')) {
        // Proxy Google Drive URLs through Next.js API to bypass CORS restrictions
        setResolvedUrl(`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`);
        setHasError(false);
      } else {
        // Regular URL
        setResolvedUrl(imageUrl);
        setHasError(false);
      }
    }

    loadImage();
  }, [imageUrl, onError]);

  if (isLoading) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse`} />
    );
  }

  if (hasError || !resolvedUrl) {
    // Return null to use parent's default background
    return null;
  }

  return (
    <img
      src={resolvedUrl}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        setHasError(true);
        if (onError) onError();
      }}
    />
  );
}


