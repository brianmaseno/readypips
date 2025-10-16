"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update profile');
      }

      toast.success('Profile updated');
      // Re-check auth to refresh local user
      await checkAuth();
      router.refresh();
    } catch (error: any) {
      console.error('Profile update error', error);
      toast.error(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">First Name</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Last Name</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">Email (read-only)</label>
                <Input value={email} readOnly />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="ghost" onClick={() => router.push('/')}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
