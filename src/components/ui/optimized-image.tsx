"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  lazy?: boolean;
  quality?: number;
  placeholder?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width = 400, 
  height = 300, 
  className = '', 
  fill = false,
  priority = false,
  sizes,
  lazy = true,
  quality = 75,
  placeholder = true
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inView, setInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer للـ lazy loading
  useEffect(() => {
    if (!lazy || priority || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '100px' // تحميل الصورة قبل 100px من الوصول إليها
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, inView]);

  // إذا لم يكن هناك src أو حدث خطأ، اعرض placeholder
  if (!src || error) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-100 flex items-center justify-center border border-gray-200 ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-center text-gray-400">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">لا توجد صورة</span>
        </div>
      </div>
    );
  }

  // إذا لم تكن الصورة في المشاهدة بعد، اعرض placeholder
  if (!inView) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-100 animate-pulse ${className}`}
        style={fill ? {} : { width, height }}
      />
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`} 
      style={fill ? {} : { width, height }}
    >
      {loading && placeholder && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10"
          style={fill ? {} : { width, height }}
        >
          <div className="text-center text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-1"></div>
            <span className="text-xs">جاري التحميل...</span>
          </div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes || (fill ? '100vw' : `${width}px`)}
        quality={quality}
        className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 object-cover`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        placeholder={placeholder ? "blur" : "empty"}
        blurDataURL={placeholder ? generateBlurDataURL(width, height) : undefined}
      />
    </div>
  );
}

// دالة لإنشاء blur placeholder
function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // إنشاء gradient بسيط
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

// مكون مبسط للصور الصغيرة
export function SimpleImage({ src, alt, className = '', width = 100, height = 100 }: {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  if (!src) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-xs">لا توجد صورة</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      quality={60}
      unoptimized={src.startsWith('data:') || src.includes('placehold.co')}
    />
  );
}
