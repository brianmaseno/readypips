'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminSidebarProps {
  currentSection: string;
  onSectionChange: (section: any) => void;
  admin: any;
  onLogout: () => void;
}

export default function AdminSidebar({
  currentSection,
  onSectionChange,
  admin,
  onLogout,
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'D',
      permission: true,
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'U',
      permission: admin?.permissions?.includes('view_users'),
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: 'S',
      permission: admin?.permissions?.includes('view_subscriptions'),
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: 'T',
      permission: admin?.permissions?.includes('view_tools'),
    },
    {
      id: 'admins',
      label: 'Admins',
      icon: 'A',
      permission: admin?.permissions?.includes('view_admins'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'L',
      permission: admin?.permissions?.includes('view_analytics'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'C',
      permission: admin?.permissions?.includes('manage_settings'),
    },
  ];

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gray-900 text-white transition-all duration-300 flex flex-col shadow-lg`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-blue-400">ReadyPips</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Admin Info */}
      {!collapsed && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
              {admin?.firstName?.charAt(0)}
            </div>
            <div className="text-sm">
              <p className="font-semibold">{admin?.firstName}</p>
              <p className="text-xs text-gray-400">
                {admin?.role?.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems
            .filter((item) => item.permission)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {!collapsed && (
          <Link
            href="/admin/profile"
            className="block w-full text-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-sm"
          >
            Profile
          </Link>
        )}
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm"
        >
          {collapsed ? '↓' : 'Logout'}
        </button>
      </div>
    </div>
  );
}
