'use client';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminHeader from "@/components/layout/AdminHeader";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {isAdmin ? <AdminHeader /> : <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
