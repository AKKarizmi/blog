import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Megaphone, 
  Handshake,
  MessageSquare,
  Mail,
  Bell,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open');
    if (saved !== null) {
      setSidebarOpen(saved === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebar-open', String(newState));
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Applications', href: '/admin/applications', icon: FileText },
    { name: 'Users', href: '/admin/users', icon: Users, adminOnly: true },
    { name: 'Board Members', href: '/admin/board-members', icon: UserCircle },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Collaborations', href: '/admin/collaborations', icon: Handshake },
  ];

  const communicationNav = [
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Email', href: '/admin/email', icon: Mail },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-600 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="font-semibold text-slate-900">FOROZ Admin</span>
        <div className="w-6" />
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-slate-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
              <span className="text-lg font-bold text-indigo-600">FOROZ Admin</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-slate-900">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              {navigation.map((item) => (
                item.adminOnly && user?.role !== 'admin' ? null : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </a>
                )
              ))}
              <div className="pt-4 mt-4 border-t border-slate-200">
                <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Communications</p>
                {communicationNav.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </a>
                ))}
              </div>
            </nav>
            <div className="p-4 border-t border-slate-200">
              <button
                onClick={logout}
                className="flex items-center w-full px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex fixed inset-y-0 left-0 z-30 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col w-full bg-white border-r border-slate-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
            {sidebarOpen && (
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FOROZ Admin
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) =>
              item.adminOnly && user?.role !== 'admin' ? null : (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all relative"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="ml-3">{item.name}</span>
                      {window.location.pathname === item.href && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-r" />
                      )}
                    </>
                  )}
                </a>
              )
            )}

            {sidebarOpen && (
              <>
                <div className="pt-4 mt-4 border-t border-slate-200">
                  <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Communications</p>
                  {communicationNav.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all relative"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="ml-3">{item.name}</span>
                      {window.location.pathname === item.href && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-r" />
                      )}
                    </a>
                  ))}
                </div>
              </>
            )}
          </nav>

          {/* User profile */}
          <div className="p-3 border-t border-slate-200">
            <div className={`flex items-center ${sidebarOpen ? '' : 'justify-center'}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium">
                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
              </div>
              {sidebarOpen && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
              )}
              {sidebarOpen && (
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="hidden sm:block">
                <p className="text-sm text-slate-600">
                  Welcome back, {user?.first_name || 'User'}!
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
