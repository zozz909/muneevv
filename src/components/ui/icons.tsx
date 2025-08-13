// مكتبة الأيقونات المحسنة والخفيفة - Ultra-Light Icons Library
// أيقونات SVG مخصصة لتوفير أكثر من 80MB!

// مكونات الأيقونات المخصصة
interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// أيقونة الرفع
export const Upload = ({ size = 16, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,5 17,10" />
    <line x1="12" y1="5" x2="12" y2="15" />
  </svg>
);

// أيقونة الإغلاق
export const X = ({ size = 16, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// أيقونة التحميل
export const Loader = ({ size = 16, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}>
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

// أيقونة المجلد المفتوح
export const FolderOpen = ({ size = 16, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <path d="M2 7h20" />
  </svg>
);

// أيقونة الصورة
export const ImageIcon = ({ size = 16, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </svg>
);

// أيقونة النار (للسعرات الحرارية)
export const Flame = ({ size = 16, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <path d="M12 2c1.5 0 3 1.2 3 3.5 0 2-1 3.5-2 4.5 1 0 2 .5 2 2 0 1.5-1 3-3 3s-3-1.5-3-3c0-1.5 1-2 2-2-1-1-2-2.5-2-4.5C9 3.2 10.5 2 12 2z" />
  </svg>
);

// أيقونة الريال السعودي (مخصصة)
export const RiyalIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

// مكون موحد للأيقونات (اختياري)
export const Icon = {
  Upload: (props: IconProps) => <Upload {...props} />,
  Close: (props: IconProps) => <X {...props} />,
  Loading: (props: IconProps) => <Loader {...props} />,
  Image: (props: IconProps) => <ImageIcon {...props} />,
  FolderOpen: (props: IconProps) => <FolderOpen {...props} />,
  Fire: (props: IconProps) => <Flame {...props} />,
  Riyal: (props: IconProps) => <RiyalIcon size={props.size || 16} className={props.className} />,
};
