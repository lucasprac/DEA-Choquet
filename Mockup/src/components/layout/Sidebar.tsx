import { 
  LayoutDashboard, 
  Users, 
  RotateCcw, 
  Layers, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'cycles', label: 'Cycles', icon: RotateCcw },
  { id: 'dimensions', label: 'Dimensions', icon: Layers },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-cream border-r border-[#e5e5e5] flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#e5e5e5]">
        <div className="w-8 h-8 bg-charcoal rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">PE</span>
        </div>
        {!collapsed && (
          <span className="ml-3 font-semibold text-charcoal text-sm truncate">
            PerfEval
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-yellow-accent text-charcoal font-medium" 
                  : "text-slate hover:bg-yellow-accent/50 hover:text-charcoal",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-[#e5e5e5]">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-md text-slate hover:bg-yellow-accent/50 hover:text-charcoal transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
