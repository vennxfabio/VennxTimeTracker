import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, Calendar } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAuth();
  const [currentDate] = useState(new Date().toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  }));

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-gray-600 hover:text-blue-600"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-lg">VX</div>
            <h1 className="text-xl font-semibold text-gray-900">Vennx Time Management</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{currentDate}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-gray-600">
                {user?.position || (user?.role === 'advanced' ? 'Gerente' : 'Profissional')}
              </div>
            </div>
            
            <img 
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
              alt="Profile photo" 
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
