import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';
import { Toaster } from 'sonner';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950" dir="rtl">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:mr-72">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Breadcrumb />
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster 
        position="top-center" 
        richColors 
        dir="rtl"
        toastOptions={{
          className: 'rtl',
        }}
      />
    </div>
  );
}

