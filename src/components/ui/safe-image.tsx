"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fallbackText?: string;
  unoptimized?: boolean;
  [key: string]: any; // للخصائص الإضافية
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  className = "",
  fallbackText = "صورة غير متاحة",
  unoptimized = true,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // تحديث المصدر عند تغيير src
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    console.log('Image failed to load:', imgSrc);
    setHasError(true);
    setIsLoading(false);
    // تجنب إعادة تحميل placeholder إذا كان فاشل بالفعل
    if (!imgSrc.includes('placehold.co')) {
      const fallbackUrl = `https://placehold.co/${width || 400}x${height || 300}.png?text=${encodeURIComponent(fallbackText)}`;
      setImgSrc(fallbackUrl);
    }
  };

  const handleLoad = () => {
    setHasError(false);
    setIsLoading(false);
  };

  // إذا كانت الصورة فاشلة وليست fill، اعرض div بدلاً من ذلك
  if (hasError && !fill && imgSrc.includes('placehold.co')) {
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center text-gray-500 text-sm border`}
        style={{ width: width || 'auto', height: height || 'auto' }}
        {...props}
      >
        {fallbackText}
      </div>
    );
  }

  const imageProps = {
    src: imgSrc,
    alt,
    className: `${className} ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`,
    onError: handleError,
    onLoad: handleLoad,
    unoptimized: true, // دائماً استخدم unoptimized لتجنب مشاكل SSL
    priority,
    ...props
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
      sizes={sizes}
    />
  );
}
