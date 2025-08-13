"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SafeImage } from '@/components/ui/safe-image';
import { Upload, X, Loader2, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadFolderProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  type?: 'products' | 'categories' | 'banners';
  label?: string;
  className?: string;
  accept?: string;
}

export function ImageUploadFolder({
  value,
  onChange,
  type = 'products',
  label = 'الصورة',
  className = '',
  accept = 'image/*'
}: ImageUploadFolderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'خطأ',
        description: 'نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, WebP, GIF)',
        variant: 'destructive'
      });
      return;
    }

    // التحقق من حجم الملف (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: 'خطأ',
        description: 'حجم الملف كبير جداً. الحد الأقصى 10MB',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      console.log(`📤 Uploading ${file.name} to ${type} folder...`);

      // تحديد طريقة الرفع حسب البيئة
      const isProduction = process.env.NODE_ENV === 'production' ||
                          (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));

      const uploadMethods = isProduction ? [
        '/api/upload-vercel',    // Vercel Blob للإنتاج
        '/api/upload-base64'     // الطريقة الاحتياطية
      ] : [
        '/api/upload',           // الطريقة الأساسية للتطوير
        '/api/upload-simple',    // الطريقة البسيطة
        '/api/upload-base64'     // الطريقة الاحتياطية
      ];

      let result = null;
      let lastError = null;

      // جرب كل طريقة حتى تنجح واحدة
      for (const method of uploadMethods) {
        try {
          console.log(`🔄 Trying upload method: ${method}`);
          const response = await fetch(method, {
            method: 'POST',
            body: formData,
          });

          const methodResult = await response.json();

          if (methodResult.success) {
            result = methodResult;
            console.log(`✅ Upload successful with ${method}:`, result);
            break;
          } else {
            lastError = methodResult.error;
            console.log(`❌ Method ${method} failed:`, methodResult.error);
          }
        } catch (methodError) {
          console.log(`❌ Method ${method} error:`, methodError);
          lastError = methodError;
          continue;
        }
      }

      if (result && result.success) {
        onChange(result.imageUrl);
        setUploadInfo({
          fileName: result.fileName,
          fileSize: result.fileSize,
          fileType: result.fileType,
          uploadPath: result.uploadPath || result.blobUrl
        });

        toast({
          title: 'نجح الرفع! 🎉',
          description: `تم رفع ${file.name} بنجاح ${isProduction ? 'إلى التخزين السحابي' : `إلى مجلد ${type}`}`,
        });
      } else {
        throw new Error(lastError || 'فشل في جميع طرق الرفع');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast({
        title: 'خطأ في الرفع',
        description: 'حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
    } finally {
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
    setUploadInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFolderIcon = () => {
    switch (type) {
      case 'products': return '📦';
      case 'categories': return '📁';
      case 'banners': return '🎨';
      default: return '📂';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <FolderOpen className="h-3 w-3" />
          <span>/uploads/{type}/</span>
          <span>{getFolderIcon()}</span>
        </div>
      </div>
      
      {value ? (
        <div className="space-y-3">
          <div className="relative inline-block">
            <SafeImage
              src={value}
              alt="معاينة الصورة"
              width={200}
              height={150}
              className="rounded-lg object-cover border shadow-sm"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          {uploadInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                <ImageIcon className="h-4 w-4" />
                <span>معلومات الصورة</span>
              </div>
              <div className="space-y-1 text-green-600">
                <div><strong>الاسم:</strong> {uploadInfo.fileName}</div>
                <div><strong>الحجم:</strong> {formatFileSize(uploadInfo.fileSize)}</div>
                <div><strong>النوع:</strong> {uploadInfo.fileType}</div>
                <div><strong>المسار:</strong> {value}</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            dragActive
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
            </div>
            
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="relative"
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
            
            <div className="text-sm text-gray-500">
              <p>أو اسحب الصورة هنا</p>
              <p className="text-xs mt-1">JPG, PNG, WebP, GIF (حد أقصى 10MB)</p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>سيتم الحفظ في:</span>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                <FolderOpen className="h-3 w-3" />
                <span>/public/uploads/{type}/</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
