import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "./header";
import Sidebar from "./sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [location, navigate] = useLocation();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex pt-20">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          currentPath={location}
          onNavigate={handleNavigate}
        />
        
        <main 
          className={cn(
            "flex-1 transition-all duration-300",
            isSidebarCollapsed ? "ml-0" : "ml-64"
          )}
        >
          {children}
        </main>
      </div>
      
      {/* Mobile overlay */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
