import { useState } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  HelpCircle,
  ChevronDown,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockUser, mockNotifications } from '@/data/mockData';
import type { Notification } from '@/types';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 rounded-full bg-teal" />;
      case 'warning':
        return <div className="w-2 h-2 rounded-full bg-orange" />;
      case 'error':
        return <div className="w-2 h-2 rounded-full bg-red" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-info" />;
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 h-16 bg-white border-b border-[#e5e5e5] flex items-center justify-between px-6 z-40 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
          <input
            type="text"
            placeholder="Search employees, cycles, frameworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-[#e5e5e5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10 focus:border-charcoal transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 text-slate hover:text-charcoal hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-card border border-[#e5e5e5] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5]">
                <span className="font-medium text-charcoal">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-info hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "px-4 py-3 border-b border-[#e5e5e5] last:border-b-0 hover:bg-gray-50 transition-colors",
                        !notification.read && "bg-yellow-accent/20"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal">{notification.title}</p>
                          <p className="text-xs text-slate mt-0.5">{notification.message}</p>
                          <p className="text-[10px] text-slate/70 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-slate hover:text-charcoal"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button className="p-2 text-slate hover:text-charcoal hover:bg-gray-50 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-charcoal rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-charcoal">{mockUser.name}</p>
              <p className="text-xs text-slate capitalize">{mockUser.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-card border border-[#e5e5e5] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#e5e5e5]">
                <p className="text-sm font-medium text-charcoal">{mockUser.name}</p>
                <p className="text-xs text-slate">{mockUser.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-charcoal hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-charcoal hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-[#e5e5e5] py-1">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red hover:bg-red/5 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
}
