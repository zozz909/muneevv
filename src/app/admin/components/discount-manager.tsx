"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Discount {
  id: number;
  code: string;
  percentage: number;
  status: 'active' | 'expired' | 'disabled';
  usage_limit?: number;
  used_count: number;
}

export function DiscountManager() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    percentage: '',
    usage_limit: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('/api/discounts');
      if (response.ok) {
        const data = await response.json();
        setDiscounts(data);
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب الخصومات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingDiscount ? `/api/discounts/${editingDiscount.id}` : '/api/discounts';
      const method = editingDiscount ? 'PUT' : 'POST';

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
          description: editingDiscount ? "تم تحديث الخصم بنجاح" : "تم إضافة الخصم بنجاح",
        });
        handleCloseDialog();
        fetchDiscounts();
      } else {
        const error = await response.json();
        toast({
          title: "خطأ",
          description: error.error || (editingDiscount ? "فشل في تحديث الخصم" : "فشل في إضافة الخصم"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving discount:', error);
      toast({
        title: "خطأ",
        description: editingDiscount ? "فشل في تحديث الخصم" : "فشل في إضافة الخصم",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      percentage: discount.percentage.toString(),
      usage_limit: discount.usage_limit?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDiscount(null);
    setFormData({ code: '', percentage: '', usage_limit: '' });
  };

  const handleDelete = async (discountId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخصم؟')) return;

    try {
      const response = await fetch(`/api/discounts/${discountId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف الخصم بنجاح",
        });
        fetchDiscounts();
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف الخصم",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الخصم",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">نشط</Badge>;
      case 'expired':
        return <Badge variant="secondary">منتهي</Badge>;
      case 'disabled':
        return <Badge variant="destructive">معطل</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">جاري التحميل...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>الخصومات</CardTitle>
            <CardDescription>إدارة أكواد الخصم.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                إضافة خصم
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDiscount ? 'تعديل كود الخصم' : 'إضافة كود خصم جديد'}</DialogTitle>
                <DialogDescription>
                  {editingDiscount ? 'قم بتعديل تفاصيل كود الخصم.' : 'أدخل تفاصيل الكود.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">الكود</Label>
                    <Input
                      id="code"
                      placeholder="WELCOME10"
                      className="col-span-3"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="percentage" className="text-right">النسبة المئوية</Label>
                    <Input
                      id="percentage"
                      type="number"
                      step="0.01"
                      placeholder="10"
                      className="col-span-3"
                      value={formData.percentage}
                      onChange={(e) => setFormData({...formData, percentage: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="usage_limit" className="text-right">حد الاستخدام (اختياري)</Label>
                    <Input
                      id="usage_limit"
                      type="number"
                      placeholder="100"
                      className="col-span-3"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingDiscount ? 'تحديث الخصم' : 'حفظ الخصم'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الكود</TableHead>
              <TableHead>النسبة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="hidden md:table-cell">الاستخدام</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-medium">{discount.code}</TableCell>
                <TableCell>{discount.percentage}%</TableCell>
                <TableCell>{getStatusBadge(discount.status)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {discount.usage_limit ? `${discount.used_count}/${discount.usage_limit}` : 'غير محدود'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(discount)}>
                        <Edit className="ml-2 h-4 w-4" />تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(discount.id)}
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
      </CardContent>
    </Card>
  );
}
