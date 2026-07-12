import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Megaphone,
  Calendar,
  Handshake,
  User,
  MessageSquare,
  Mail,
  Bell,
  LogOut,
  ChevronLeft,
  Menu,
  X } from
'lucide-react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { NotificationDropdown } from './NotificationDropdown/NotificationDropdown';
import { useApp } from '../context/AppContext';
const mainNavItems = [
{
  to: '/dashboard',
  label: 'Dashboard',
  icon: LayoutDashboard
},
{
  to: '/applications',
  label: 'Applications',
  icon: FileText
},
{
  to: '/board-members',
  label: 'Board Members',
  icon: Users
},
{
  to: '/users',
  label: 'Users',
  icon: Users
},
{
  to: '/announcements',
  label: 'Announcements',
  icon: Megaphone
},
{
  to: '/events',
  label: 'Events',
  icon: Calendar
},
{
  to: '/collaborations',
  label: 'Collaborations',
  icon: Handshake
},
{
  to: '/profile',
  label: 'Profile',
  icon: User
}];

const commsNavItems = [
{
  to: '/messages',
  label: 'Messages',
  icon: MessageSquare
},
{
  to: '/email',
  label: 'Email',
  icon: Mail
},
{
  to: '/notifications',
  label: 'Notifications',
  icon: Bell
}];

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { currentUser, logout } = useApp();
  const location = useLocation();
  if (!currentUser) return null;
  const fullNameSafe = currentUser.fullName ?? currentUser.username ?? '';
  const initials = (fullNameSafe || '')
    .split(' ')
    .map((n) => (n ? n[0] : ''))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/applications')) return 'Applications';
    if (path.startsWith('/board-members')) return 'Board Members';
    if (path.startsWith('/announcements')) return 'Announcements';
    if (path.startsWith('/events')) return 'Events';
    if (path.startsWith('/collaborations')) return 'Collaborations';
    if (path.startsWith('/profile')) return 'Profile';
    if (path.startsWith('/messages')) return 'Messages';
    if (path.startsWith('/email')) return 'Email';
    if (path.startsWith('/users')) return 'Users';
    return 'Dashboard';
  };
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!isSidebarCollapsed &&
          <Link
            to="/dashboard"
            className="text-lg font-bold text-purple-600 truncate">
            
              FOROZ Admin
            </Link>
          }
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
            
            <ChevronLeft
              className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6">
          <nav className="px-3 space-y-1">
            {mainNavItems.map((item) =>
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
              }
              title={isSidebarCollapsed ? item.label : undefined}>
              
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            )}
          </nav>

          <div className="px-3">
            {!isSidebarCollapsed &&
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Communications
              </h3>
            }
            <nav className="space-y-1">
              {commsNavItems.map((item) =>
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive && item.to !== '#' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                }
                title={isSidebarCollapsed ? item.label : undefined}>
                
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              )}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
                  {currentUser.avatar ?
              <img
                src={currentUser.avatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0" /> :


              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {initials}
                </div>
              }
              {!isSidebarCollapsed &&
              <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fullNameSafe || currentUser.role || currentUser.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate capitalize">
                    {currentUser.role}
                  </p>
                </div>
              }
            </div>
            {!isSidebarCollapsed &&
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              
                <LogOut className="w-5 h-5" />
              </button>
            }
          </div>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/dashboard" className="text-lg font-bold text-purple-600">
            FOROZ Admin
          </Link>
          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              
              {isMobileMenuOpen ?
              <X className="w-6 h-6" /> :

              <Menu className="w-6 h-6" />
              }
            </button>
          </div>
        </div>

        {isMobileMenuOpen &&
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="p-4 space-y-1">
              {mainNavItems.map((item) =>
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium ${isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`
              }>
              
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
            )}
              <div className="pt-4 pb-2">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Communications
                </h3>
              </div>
              {commsNavItems.map((item) =>
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium ${isActive && item.to !== '#' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`
              }>
              
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
            )}
            </nav>
          </div>
        }
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 md:pt-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 hidden md:flex">
          <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="text-sm font-medium text-gray-700">
              Welcome back, {(fullNameSafe.split(' ')[0] || currentUser.username || 'User')}!
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>);

}