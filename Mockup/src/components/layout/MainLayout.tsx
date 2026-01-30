import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function MainLayout({ children, currentPage, onPageChange }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={onPageChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Header */}
      <Header sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main 
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          sidebarCollapsed ? "pl-16" : "pl-64"
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
