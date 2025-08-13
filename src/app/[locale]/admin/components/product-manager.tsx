"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { RiyalLogo } from "@/components/ui/riyal-logo";
import { SafeImage } from "@/components/ui/safe-image";
import { ImageUploadFolder } from "@/components/ui/image-upload-folder";
import { getSafeImageUrl as getImageUrl } from "@/lib/image-utils";

// أنواع البيانات
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  calories?: number;
  calories_unit?: string;
  image_url?: string;
  category_id: number;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  display_order: number;
}

interface Category {
  id: number;
  name: string;
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    description: '',
    description_en: '',
    price: '',
    original_price: '',
    calories: '',
    category_id: '',
    image_url: '',
    is_bestseller: false,
    is_new: false,
    new_until_date: ''
  });
  const { toast } = useToast();

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast({
          title: "خطأ",
          description: "فشل في جلب المنتجات",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب المنتجات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_en: '',
      description: '',
      description_en: '',
      price: '',
      original_price: '',
      calories: '',
      category_id: '',
      image_url: '',
      is_bestseller: false,
      is_new: false,
      new_until_date: ''
    });
    setEditingProduct(null);
  };

  const handleOpenDialog = () => {
    console.log('Opening dialog...');
    resetForm();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log('Closing dialog...');
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

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
          description: editingProduct ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح",
        });
        handleCloseDialog();
        fetchProducts();
      } else {
        const error = await response.json();
        toast({
          title: "خطأ",
          description: error.error || (editingProduct ? "فشل في تحديث المنتج" : "فشل في إضافة المنتج"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "خطأ",
        description: editingProduct ? "فشل في تحديث المنتج" : "فشل في إضافة المنتج",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      name_en: product.name_en || '',
      description: product.description || '',
      description_en: product.description_en || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      calories: product.calories?.toString() || '',
      category_id: product.category_id.toString(),
      image_url: product.image_url || '',
      is_bestseller: product.is_bestseller || false,
      is_new: product.is_new || false,
      new_until_date: product.new_until_date || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف المنتج بنجاح",
        });
        fetchProducts();
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف المنتج",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المنتج",
        variant: "destructive",
      });
    }
  };

  const getSafeImageUrl = (url?: string, fallback: string = 'https://placehold.co/64x64.png') => {
    return getImageUrl(url || '', fallback);
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
            <CardTitle>المنتجات</CardTitle>
            <CardDescription>إدارة منتجات القائمة الخاصة بك.</CardDescription>
          </div>

          {/* زر إضافة منتج مع Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="gap-1"
                onClick={handleOpenDialog}
              >
                <PlusCircle className="h-4 w-4" />
                إضافة منتج
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'قم بتعديل تفاصيل المنتج.' : 'أدخل تفاصيل المنتج الجديد.'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  {/* اسم المنتج */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">الاسم (عربي) *</Label>
                    <Input
                      id="name"
                      placeholder="مثال: بيتزا مارجريتا"
                      className="col-span-3"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  {/* اسم المنتج بالإنجليزية */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name_en" className="text-right">الاسم (إنجليزي)</Label>
                    <Input
                      id="name_en"
                      placeholder="Example: Margherita Pizza"
                      className="col-span-3"
                      value={formData.name_en}
                      onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                    />
                  </div>

                  {/* وصف المنتج */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">الوصف (عربي)</Label>
                    <Textarea
                      id="description"
                      placeholder="وصف قصير للمنتج"
                      className="col-span-3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  {/* وصف المنتج بالإنجليزية */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description_en" className="text-right">الوصف (إنجليزي)</Label>
                    <Textarea
                      id="description_en"
                      placeholder="Short product description"
                      className="col-span-3"
                      value={formData.description_en}
                      onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                    />
                  </div>

                  {/* السعر */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">السعر *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="col-span-3"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  {/* السعر الأصلي */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="original_price" className="text-right">السعر الأصلي</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="col-span-3"
                      value={formData.original_price}
                      onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                    />
                  </div>

                  {/* السعرات الحرارية */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="calories" className="text-right">السعرات الحرارية</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="مثال: 250"
                      className="col-span-3"
                      value={formData.calories}
                      onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    />
                  </div>

                  {/* الصنف */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category_id" className="text-right">الصنف *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({...formData, category_id: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر الصنف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* صورة المنتج */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">صورة المنتج</Label>
                    <div className="col-span-3">
                      <ImageUploadFolder
                        value={formData.image_url}
                        onChange={(imageUrl) => setFormData({...formData, image_url: imageUrl})}
                        type="products"
                        label=""
                      />
                    </div>
                  </div>

                  {/* الأكثر مبيعاً */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">الأكثر مبيعاً</Label>
                    <div className="col-span-3 flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox
                        id="is_bestseller"
                        checked={formData.is_bestseller}
                        onCheckedChange={(checked) => setFormData({...formData, is_bestseller: !!checked})}
                      />
                      <Label htmlFor="is_bestseller" className="text-sm">تحديد كمنتج من الأكثر مبيعاً</Label>
                    </div>
                  </div>

                  {/* منتج جديد */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">منتج جديد</Label>
                    <div className="col-span-3 flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox
                        id="is_new"
                        checked={formData.is_new}
                        onCheckedChange={(checked) => setFormData({...formData, is_new: !!checked})}
                      />
                      <Label htmlFor="is_new" className="text-sm">تحديد كمنتج جديد</Label>
                    </div>
                  </div>

                  {/* تاريخ انتهاء المنتج الجديد */}
                  {formData.is_new && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new_until_date" className="text-right">ينتهي في</Label>
                      <div className="col-span-3 space-y-2">
                        <Input
                          id="new_until_date"
                          type="date"
                          value={formData.new_until_date}
                          onChange={(e) => setFormData({...formData, new_until_date: e.target.value})}
                          placeholder="اختياري - اتركه فارغاً ليبقى جديداً"
                        />
                        <p className="text-xs text-muted-foreground">
                          اتركه فارغاً ليبقى المنتج جديداً حتى تقوم بإلغاء الخيار يدوياً
                        </p>
                      </div>
                    </div>
                  )}
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
                      editingProduct ? 'تحديث' : 'إضافة'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {/* جدول المنتجات */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">الصورة</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الصنف</TableHead>
              <TableHead className="hidden lg:table-cell text-right">الحالة</TableHead>
              <TableHead className="hidden md:table-cell text-right">السعر</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const category = categories.find(c => c.id === product.category_id);
              return (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <SafeImage
                      src={getSafeImageUrl(product.image_url)}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      fallbackText={product.name}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{category?.name || 'غير محدد'}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-col space-y-1">
                      {product.is_new && (
                        <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">جديد</Badge>
                      )}
                      {product.is_bestseller && (
                        <Badge variant="secondary" className="text-xs">الأكثر مبيعاً</Badge>
                      )}
                      {product.is_featured && (
                        <Badge variant="outline" className="text-xs">مميز</Badge>
                      )}
                      {!product.is_available && (
                        <Badge variant="destructive" className="text-xs">غير متاح</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 justify-start">
                      {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      <RiyalLogo size={14} className="text-primary" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="ml-2 h-4 w-4" />تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="ml-2 h-4 w-4" />حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* رسالة عدم وجود منتجات */}
        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">لا توجد منتجات حالياً</p>
            <Button onClick={handleOpenDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة أول منتج
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}