"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, MoreHorizontal, Loader2, Image as ImageIcon } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";

// أنواع البيانات
interface Banner {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    display_order: ''
  });
  const { toast } = useToast();

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/promotions');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      } else {
        toast({
          title: "خطأ",
          description: "فشل في جلب البنرات",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب البنرات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      display_order: ''
    });
    setEditingBanner(null);
  };

  const handleOpenDialog = () => {
    console.log('Opening banner dialog...');
    resetForm();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log('Closing banner dialog...');
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Banner form submitted:', formData);
    setSubmitting(true);

    try {
      const url = editingBanner ? `/api/promotions/${editingBanner.id}` : '/api/promotions';
      const method = editingBanner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: editingBanner ? "تم تحديث البنر بنجاح" : "تم إضافة البنر بنجاح",
        });
        handleCloseDialog();
        fetchBanners();
      } else {
        const error = await response.json();
        toast({
          title: "خطأ",
          description: error.error || (editingBanner ? "فشل في تحديث البنر" : "فشل في إضافة البنر"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: "خطأ",
        description: editingBanner ? "فشل في تحديث البنر" : "فشل في إضافة البنر",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image_url: banner.image_url || '',
      display_order: banner.display_order.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا البنر نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) return;

    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف البنر بنجاح",
        });
        fetchBanners();
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف البنر",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف البنر",
        variant: "destructive",
      });
    }
  };

  const getSafeImageUrl = (url?: string, fallback: string = 'https://placehold.co/120x80.png') => {
    if (!url || url.trim() === '') return fallback;

    // التحقق من صحة الرابط
    try {
      new URL(url);
      return url;
    } catch {
      return fallback;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="mr-2">جاري التحميل...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              البنرات الترويجية
            </CardTitle>
            <CardDescription>إدارة البنرات والإعلانات الترويجية في الموقع.</CardDescription>
          </div>
          
          {/* زر إضافة بنر مع Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="gap-1"
                onClick={handleOpenDialog}
              >
                <PlusCircle className="h-4 w-4" />
                إضافة بنر
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingBanner ? 'تعديل البنر' : 'إضافة بنر جديد'}</DialogTitle>
                <DialogDescription>
                  {editingBanner ? 'قم بتعديل تفاصيل البنر الترويجي.' : 'أدخل تفاصيل البنر الترويجي الجديد.'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  {/* عنوان البنر */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">عنوان البنر *</Label>
                    <Input
                      id="title"
                      placeholder="مثال: عرض خاص - خصم 50%"
                      className="col-span-3"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  {/* وصف البنر */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">الوصف</Label>
                    <Textarea
                      id="description"
                      placeholder="وصف تفصيلي للعرض أو البنر"
                      className="col-span-3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  {/* رابط الصورة */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image_url" className="text-right">رابط الصورة</Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="image_url"
                        placeholder="https://example.com/banner.jpg"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      />
                      {/* معاينة الصورة */}
                      {formData.image_url && (
                        <div className="mt-2">
                          <SafeImage
                            src={getSafeImageUrl(formData.image_url)}
                            alt="معاينة البنر"
                            width={200}
                            height={100}
                            className="rounded-md object-cover border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* ترتيب العرض */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="display_order" className="text-right">ترتيب العرض</Label>
                    <Input
                      id="display_order"
                      type="number"
                      placeholder="0"
                      className="col-span-3"
                      value={formData.display_order}
                      onChange={(e) => setFormData({...formData, display_order: e.target.value})}
                    />
                  </div>
                </div>
                
                {/* أزرار الحفظ والإلغاء */}
                <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDialog}
                    disabled={submitting}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      editingBanner ? 'تحديث' : 'إضافة'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {/* جدول البنرات */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">الصورة</TableHead>
              <TableHead className="text-right">العنوان</TableHead>
              <TableHead className="text-right">الوصف</TableHead>
              <TableHead className="text-right">ترتيب العرض</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell className="hidden sm:table-cell">
                  <SafeImage
                    src={getSafeImageUrl(banner.image_url)}
                    alt={banner.title}
                    width={120}
                    height={80}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{banner.title}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs">
                  {banner.description ? (
                    <span className="line-clamp-2">{banner.description}</span>
                  ) : (
                    'لا يوجد وصف'
                  )}
                </TableCell>
                <TableCell>{banner.display_order}</TableCell>
                <TableCell>
                  <Badge variant={banner.is_active ? "default" : "secondary"}>
                    {banner.is_active ? 'نشط' : 'غير نشط'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(banner)}>
                        <Edit className="ml-2 h-4 w-4" />تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="ml-2 h-4 w-4" />حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* رسالة عدم وجود بنرات */}
        {banners.length === 0 && (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">لا توجد بنرات ترويجية حالياً</p>
            <Button onClick={handleOpenDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة أول بنر
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
