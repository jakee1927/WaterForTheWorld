'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import dynamic from 'next/dynamic';

// Dynamically import the Toaster component to avoid SSR issues
const Toaster = dynamic(
  () => import('react-hot-toast').then((c) => c.Toaster),
  {
    ssr: false,
  }
);

// Dynamically import Navbar to avoid hydration issues
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-8">
          {children}
        </main>
        <Toaster position="top-center" />
      </div>
    </AuthProvider>
  );
}
