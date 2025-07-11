import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  FolderKanban, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Sidebar({ isCollapsed, currentPath, onNavigate }: SidebarProps) {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const menuItems = user?.role === 'advanced' ? [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/time-entry", label: "Lançamento de Horas", icon: Clock },
    { path: "/resource-planning", label: "Programação de Recursos", icon: Calendar },
    { path: "/project-management", label: "Cadastro de Projetos", icon: FolderKanban },
    { path: "/team-management", label: "Cadastro de Profissionais", icon: Users },
    { path: "/administration", label: "Administração", icon: Settings },
  ] : [
    { path: "/time-entry", label: "Lançamento de Horas", icon: Clock },
  ];

  return (
    <aside 
      className={cn(
        "bg-white shadow-lg border-r border-gray-200 w-64 fixed left-0 top-20 bottom-0 z-40 transition-transform duration-300",
        isCollapsed && "-translate-x-full"
      )}
    >
      <nav className="p-4 space-y-2 h-full flex flex-col">
        <div className="flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || 
              (item.path === "/dashboard" && currentPath === "/");
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start space-x-3 mb-1",
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                )}
                onClick={() => onNavigate(item.path)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 text-gray-600 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </Button>
        </div>
      </nav>
    </aside>
  );
}
