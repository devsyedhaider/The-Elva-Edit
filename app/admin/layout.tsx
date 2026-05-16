'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  LogOut, 
  ChevronRight,
  Layers,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import AdminHeader from '@/components/layout/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, initialized } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (initialized) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        setIsReady(true);
      }
    }
  }, [initialized, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isReady) return null;

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/users', icon: Users },
    { name: 'Header Content', href: '/admin/header', icon: Edit3 },
    { name: 'Promo Banner', href: '/admin/promo', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-white border-r border-zinc-200 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/admin" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 rounded">ELVA EDIT</span>
            <span className="text-accent underline decoration-2 underline-offset-4">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Main Menu</p>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                pathname === item.href 
                  ? "bg-black text-white shadow-lg shadow-black/10" 
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-white" : "text-zinc-400 group-hover:text-black")} />
              {item.name}
              {pathname === item.href && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100">
           <p className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">System</p>

           <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all mt-2"
           >
              <LogOut className="w-5 h-5" />
              Logout from Admin
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow ml-72">
        <AdminHeader />

        {/* Dynamic Page Content */}
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
