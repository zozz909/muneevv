"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SafeImage } from '@/components/ui/safe-image';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadLocalProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  type?: 'products' | 'banners';
  label?: string;
  className?: string;
}

export function ImageUploadLocal({
  value,
  onChange,
  type = 'products',
  label = 'الصورة',
  className = ''
}: ImageUploadLocalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'خطأ',
        description: 'نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, WebP)',
        variant: 'destructive'
      });
      return;
    }

    // التحقق من حجم الملف (1MB max for local storage)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      toast({
        title: 'خطأ',
        description: 'حجم الملف كبير جداً. الحد الأقصى 1MB',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      // تحويل الملف إلى base64
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // حفظ في localStorage (اختياري)
          const imageId = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          try {
            localStorage.setItem(imageId, result);
            console.log('Image saved to localStorage with ID:', imageId);
          } catch (storageError) {
            console.warn('Could not save to localStorage:', storageError);
          }
          
          // إرجاع الـ data URL مباشرة
          onChange(result);
          
          toast({
            title: 'نجح',
            description: 'تم رفع الصورة بنجاح',
          });
        }
        setIsUploading(false);
      };

      reader.onerror = () => {
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء قراءة الملف',
          variant: 'destructive'
        });
        setIsUploading(false);
      };

      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء رفع الصورة',
        variant: 'destructive'
      });
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative">
          <SafeImage
            src={value}
            alt="معاينة الصورة"
            width={200}
            height={150}
            className="rounded-md object-cover border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    اختر صورة
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              أو اسحب الصورة هنا
            </p>
            <p className="text-xs text-gray-400">
              JPG, PNG, WebP (حد أقصى 1MB)
            </p>
          </div>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
