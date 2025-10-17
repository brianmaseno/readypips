'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Tool {
  _id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  accessLevel: string;
  createdAt: string;
}

export default function ToolsManagement({ admin }: { admin: any }) {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    fetchTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTools = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const response = await fetch('/api/admin/tools', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const toolsList = data.tools || [];
        setTools(toolsList);
        
        // Calculate stats
        const total = toolsList.length;
        const active = toolsList.filter((t: Tool) => t.isActive).length;
        
        setStats({ total, active });
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tools',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox title="Total Tools" value={stats.total.toString()} />
        <StatBox title="Active Tools" value={stats.active.toString()} />
        <StatBox title="Categories" value={new Set(tools.map(t => t.category)).size.toString()} />
      </div>

      {/* Tool Library */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Tool Library</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            Add Tool
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Tool Name</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Category</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Access Level</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tools.length > 0 ? (
                tools.map((tool) => (
                  <tr key={tool._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{tool.name}</td>
                    <td className="px-4 py-3 text-gray-600">{tool.category}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {tool.accessLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tool.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tool.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                    No tools found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
