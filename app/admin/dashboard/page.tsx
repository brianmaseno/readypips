'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from './components/admin-sidebar';
import DashboardOverview from './components/dashboard-overview';
import UserManagement from './components/user-management';
import SubscriptionManagement from './components/subscription-management';
import ToolsManagement from './components/tools-management';
import AdminManagement from './components/admin-management';
import Analytics from './components/analytics';
import SystemSettings from './components/system-settings';

type AdminSection =
  | 'dashboard'
  | 'users'
  | 'subscriptions'
  | 'tools'
  | 'admins'
  | 'analytics'
  | 'settings';

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async (token: string) => {
    try {
      const response = await fetch('/api/admin/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setAdmin(data.admin);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchAdminProfile(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-xl font-semibold text-gray-900">Access Denied</p>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        admin={admin}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {getSectionTitle(currentSection)}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {admin.firstName}! (Role: {admin.role.replace('_', ' ').toUpperCase()})
            </p>
          </div>
        </div>

        <div className="p-6">
          {currentSection === 'dashboard' && <DashboardOverview admin={admin} />}
          {currentSection === 'users' && <UserManagement admin={admin} />}
          {currentSection === 'subscriptions' && <SubscriptionManagement admin={admin} />}
          {currentSection === 'tools' && <ToolsManagement admin={admin} />}
          {currentSection === 'admins' && <AdminManagement admin={admin} />}
          {currentSection === 'analytics' && <Analytics admin={admin} />}
          {currentSection === 'settings' && <SystemSettings admin={admin} />}
        </div>
      </main>
    </div>
  );
}

function getSectionTitle(section: AdminSection): string {
  const titles: { [key in AdminSection]: string } = {
    dashboard: 'Dashboard Overview',
    users: 'User Management',
    subscriptions: 'Subscription Management',
    tools: 'Tools Management',
    admins: 'Admin Management',
    analytics: 'Analytics & Insights',
    settings: 'System Settings',
  };
  return titles[section];
}
