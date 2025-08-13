"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import { FolderOpen, Image as ImageIcon, Trash2, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  path: string;
  size: number;
  type: string;
  category: 'products' | 'categories' | 'banners';
  uploadDate: string;
}

export default function UploadsPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  // محاكاة جلب الملفات (يمكن استبدالها بـ API حقيقي)
  useEffect(() => {
    const mockFiles: UploadedFile[] = [
      {
        name: '1703123456789_abc123def.jpg',
        path: '/uploads/products/1703123456789_abc123def.jpg',
        size: 245760,
        type: 'image/jpeg',
        category: 'products',
        uploadDate: '2024-01-15T10:30:00Z'
      },
      {
        name: '1703123456790_def456ghi.png',
        path: '/uploads/categories/1703123456790_def456ghi.png',
        size: 189440,
        type: 'image/png',
        category: 'categories',
        uploadDate: '2024-01-15T11:45:00Z'
      },
      {
        name: '1703123456791_ghi789jkl.webp',
        path: '/uploads/banners/1703123456791_ghi789jkl.webp',
        size: 567890,
        type: 'image/webp',
        category: 'banners',
        uploadDate: '2024-01-15T14:20:00Z'
      }
    ];

    setTimeout(() => {
      setFiles(mockFiles);
      setLoading(false);
    }, 1000);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'products': return '📦';
      case 'categories': return '📁';
      case 'banners': return '🎨';
      default: return '📂';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'products': return 'bg-blue-100 text-blue-800';
      case 'categories': return 'bg-green-100 text-green-800';
      case 'banners': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFiles = selectedCategory === 'all' 
    ? files 
    : files.filter(file => file.category === selectedCategory);

  const handleDelete = (fileName: string) => {
    // محاكاة حذف الملف
    setFiles(files.filter(file => file.name !== fileName));
    toast({
      title: 'تم الحذف',
      description: 'تم حذف الملف بنجاح',
    });
  };

  const handleDownload = (filePath: string, fileName: string) => {
    // محاكاة تحميل الملف
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const handleView = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>جاري تحميل الملفات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الملفات المرفوعة</h1>
          <p className="text-muted-foreground">عرض وإدارة جميع الصور المرفوعة في المشروع</p>
        </div>
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">/public/uploads/</span>
        </div>
      </div>

      {/* فلاتر */}
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          الكل ({files.length})
        </Button>
        <Button
          variant={selectedCategory === 'products' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('products')}
        >
          📦 المنتجات ({files.filter(f => f.category === 'products').length})
        </Button>
        <Button
          variant={selectedCategory === 'categories' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('categories')}
        >
          📁 الأصناف ({files.filter(f => f.category === 'categories').length})
        </Button>
        <Button
          variant={selectedCategory === 'banners' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('banners')}
        >
          🎨 البنرات ({files.filter(f => f.category === 'banners').length})
        </Button>
      </div>

      {/* قائمة الملفات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.name} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-square">
                <SafeImage
                  src={file.path}
                  alt={file.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={`text-xs ${getCategoryColor(file.category)}`}>
                    {getCategoryIcon(file.category)} {file.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-sm truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(file.uploadDate)}
                  </p>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleView(file.path)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownload(file.path, file.name)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDelete(file.name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">لا توجد ملفات</h3>
          <p className="text-muted-foreground">
            {selectedCategory === 'all' 
              ? 'لم يتم رفع أي ملفات بعد'
              : `لا توجد ملفات في فئة ${selectedCategory}`
            }
          </p>
        </div>
      )}
    </div>
  );
}
