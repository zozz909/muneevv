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
import { PlusCircle, Edit, Trash2, MoreHorizontal, Loader2, FolderOpen } from "lucide-react";

// أنواع البيانات
interface Category {
  id: number;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    description: '',
    description_en: '',
    display_order: ''
  });
  const { toast } = useToast();

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        toast({
          title: "خطأ",
          description: "فشل في جلب الأصناف",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب الأصناف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_en: '',
      description: '',
      description_en: '',
      display_order: ''
    });
    setEditingCategory(null);
  };

  const handleOpenDialog = () => {
    console.log('Opening category dialog...');
    resetForm();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log('Closing category dialog...');
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Category form submitted:', formData);
    setSubmitting(true);

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

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
          description: editingCategory ? "تم تحديث الصنف بنجاح" : "تم إضافة الصنف بنجاح",
        });
        handleCloseDialog();
        fetchCategories();
      } else {
        const error = await response.json();
        toast({
          title: "خطأ",
          description: error.error || (editingCategory ? "فشل في تحديث الصنف" : "فشل في إضافة الصنف"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "خطأ",
        description: editingCategory ? "فشل في تحديث الصنف" : "فشل في إضافة الصنف",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_en: category.name_en || '',
      description: category.description || '',
      description_en: category.description_en || '',
      display_order: category.display_order.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف نهائياً؟ سيتم حذف جميع المنتجات المرتبطة به أيضاً.')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف الصنف بنجاح",
        });
        fetchCategories();
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف الصنف",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الصنف",
        variant: "destructive",
      });
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
              <FolderOpen className="h-5 w-5" />
              الأصناف
            </CardTitle>
            <CardDescription>إدارة أصناف المنتجات في القائمة.</CardDescription>
          </div>
          
          {/* زر إضافة صنف مع Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="gap-1"
                onClick={handleOpenDialog}
              >
                <PlusCircle className="h-4 w-4" />
                إضافة صنف
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'تعديل الصنف' : 'إضافة صنف جديد'}</DialogTitle>
                <DialogDescription>
                  {editingCategory ? 'قم بتعديل تفاصيل الصنف.' : 'أدخل تفاصيل الصنف الجديد.'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  {/* اسم الصنف */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">اسم الصنف (عربي) *</Label>
                    <Input
                      id="name"
                      placeholder="مثال: مشروبات ساخنة"
                      className="col-span-3"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  {/* اسم الصنف بالإنجليزية */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name_en" className="text-right">اسم الصنف (إنجليزي)</Label>
                    <Input
                      id="name_en"
                      placeholder="Example: Hot Beverages"
                      className="col-span-3"
                      value={formData.name_en}
                      onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                    />
                  </div>

                  {/* وصف الصنف */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">الوصف (عربي)</Label>
                    <Textarea
                      id="description"
                      placeholder="وصف مختصر للصنف"
                      className="col-span-3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  {/* وصف الصنف بالإنجليزية */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description_en" className="text-right">الوصف (إنجليزي)</Label>
                    <Textarea
                      id="description_en"
                      placeholder="Brief category description"
                      className="col-span-3"
                      value={formData.description_en}
                      onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                      rows={3}
                    />
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
                      editingCategory ? 'تحديث' : 'إضافة'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {/* جدول الأصناف */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">اسم الصنف</TableHead>
              <TableHead className="text-right">الوصف</TableHead>
              <TableHead className="text-right">ترتيب العرض</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {category.description || 'لا يوجد وصف'}
                </TableCell>
                <TableCell>{category.display_order}</TableCell>
                <TableCell>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? 'نشط' : 'غير نشط'}
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
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="ml-2 h-4 w-4" />تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(category.id)}
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

        {/* رسالة عدم وجود أصناف */}
        {categories.length === 0 && (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">لا توجد أصناف حالياً</p>
            <Button onClick={handleOpenDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة أول صنف
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
