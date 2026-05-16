'use client';

import { Search, Bell } from 'lucide-react';
import { useAdminSearchStore } from '@/store/useAdminSearchStore';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminHeader() {
  const pathname = usePathname();
  const { adminSearchTerm, setAdminSearchTerm } = useAdminSearchStore();

  const getPlaceholder = () => {
    if (pathname.includes('/products')) return 'Search products...';
    if (pathname.includes('/categories')) return 'Search categories...';
    if (pathname.includes('/orders')) return 'Search orders...';
    if (pathname.includes('/users')) return 'Search customers...';
    if (pathname.includes('/header')) return 'Customize header...';
    if (pathname.includes('/promo')) return 'Customize promo banner...';
    return 'Search dashboard...';
  };

  return (
    <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-40">
       <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 rounded">ELVA EDIT</span>
            <span className="text-accent underline decoration-2 underline-offset-4">ADMIN</span>
          </Link>

          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder={getPlaceholder()}
              value={adminSearchTerm}
              onChange={(e) => setAdminSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full text-sm outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
       </div>

       <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Cloud Sync Active</span>
          </div>
          <button className="relative p-2 hover:bg-zinc-100 rounded-full transition-colors">
             <Bell className="w-5 h-5" />
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
          </button>
          <div className="flex items-center gap-3 border-l pl-6 border-zinc-200">
              <div className="text-right hidden md:block">
                  <p className="text-xs font-black uppercase tracking-tight">Admin User</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Store Manager</p>
              </div>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black text-xs">
                  AD
              </div>
          </div>
       </div>
    </header>
  );
}
