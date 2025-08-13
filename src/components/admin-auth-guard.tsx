"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.valid) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // سيتم إعادة التوجيه إلى صفحة تسجيل الدخول
  }

  return (
    <div className="min-h-screen bg-background">
      {/* شريط علوي للمدير */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <h1 className="font-semibold">لوحة التحكم</h1>
                <p className="text-sm text-muted-foreground">
                  مرحباً، {user?.username}
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* محتوى لوحة التحكم */}
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
