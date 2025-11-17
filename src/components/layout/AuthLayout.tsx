import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
type AuthLayoutProps = {
  children: React.ReactNode;
};
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 relative">
      <ThemeToggle className="absolute top-4 right-4" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/illustrations/bg-pattern.svg')] bg-repeat opacity-5"></div>
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
            <div className="p-2 bg-emerald-500 rounded-full">
              <Leaf className="text-white" />
            </div>
            VirtueVerse
          </Link>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}